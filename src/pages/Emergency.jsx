import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  Check,
  Clock3,
  HeartPulse,
  MapPin,
  Radio,
  ShieldCheck,
  Siren,
  Snowflake,
  TriangleAlert,
  UserRoundCheck,
  WifiOff,
} from "lucide-react";
import { Link } from "react-router";
import { detectEmergency } from "../ai/emergencyEngine";
import Button from "../components/Button";
import Card from "../components/Card";
import LoRaNetwork from "../components/LoRaNetwork";
import { useTauFind } from "../context/TauFindContext";
import { emergencyScenarios, getEmergencyScenario } from "../data/emergencySimulation";
import { getRouteById } from "../data/routes";

const scenarioOrder = ["minorWarning", "fallDetected", "criticalOffline"];

const stageLabels = {
  detecting: "Bracelet detected abnormal signals",
  verifying: "AI verification in progress",
  countdown: "Waiting for hiker response",
  transmitting: "Offline rescue packet transmitting",
  received: "Rescue team received the incident",
  cancelled: "Monitoring continues",
};

const detectionSteps = [
  { key: "fall", label: "Fall detected", icon: Activity },
  { key: "movement", label: "No movement", icon: UserRoundCheck },
  { key: "heart", label: "Heart rate analysis", icon: HeartPulse },
  { key: "temperature", label: "Temperature analysis", icon: Snowflake },
];

export default function Emergency() {
  const { state, updateEmergency, updateSafety } = useTauFind();
  const emergencyState = state.safety.emergencyState;
  const scenario = getEmergencyScenario(emergencyState.currentScenario);
  const route = getRouteById(state.trip.selectedRoute);
  const decision = useMemo(() => detectEmergency(scenario.input), [scenario]);

  useEffect(() => {
    if (emergencyState.stage === "detecting") {
      const timer = window.setTimeout(() => {
        updateEmergency({ stage: "verifying", analysisProgress: 0 });
      }, 650);
      return () => window.clearTimeout(timer);
    }

    if (emergencyState.stage === "verifying") {
      const timer = window.setInterval(() => {
        updateEmergency((current) => {
          const nextProgress = Math.min(100, current.analysisProgress + 10);
          if (nextProgress >= 100) {
            return {
              analysisProgress: 100,
              stage: decision.emergency ? "countdown" : "cancelled",
              active: decision.emergency,
            };
          }
          return { analysisProgress: nextProgress };
        });
      }, 130);
      return () => window.clearInterval(timer);
    }

    if (emergencyState.stage === "countdown") {
      const timer = window.setTimeout(() => {
        updateEmergency((current) => {
          if (current.countdown <= 1) {
            return {
              countdown: 0,
              active: true,
              stage: "transmitting",
              rescueSignal: { status: "transmitting", progress: 4, received: false },
            };
          }
          return { countdown: current.countdown - 1 };
        });
      }, 1000);
      return () => window.clearTimeout(timer);
    }

    if (emergencyState.stage === "transmitting") {
      const timer = window.setInterval(() => {
        updateEmergency((current) => {
          const nextProgress = Math.min(100, current.rescueSignal.progress + 8);
          if (nextProgress >= 100) {
            return {
              stage: "received",
              acknowledged: true,
              rescueSignal: { status: "received", progress: 100, received: true },
            };
          }
          return { rescueSignal: { status: "transmitting", progress: nextProgress } };
        });
      }, 220);
      return () => window.clearInterval(timer);
    }

    return undefined;
  }, [decision.emergency, emergencyState.stage, updateEmergency]);

  const selectScenario = (scenarioId) => {
    const nextScenario = getEmergencyScenario(scenarioId);
    const nextDecision = detectEmergency(nextScenario.input);
    updateSafety({ riskScore: nextScenario.input.riskScore, currentStatus: nextDecision.emergency ? "emergency" : "warning" });
    updateEmergency({
      active: nextDecision.emergency,
      type: nextScenario.input.fallDetected ? "fall-detected" : "sensor-warning",
      acknowledged: false,
      currentScenario: scenarioId,
      stage: "detecting",
      analysisProgress: 0,
      countdown: 10,
      rescueSignal: {
        status: "idle",
        progress: 0,
        offlineMode: nextScenario.lora.offlineMode,
        received: false,
      },
    });
  };

  const confirmSafe = () => {
    updateSafety({ riskScore: 28, currentStatus: "safe" });
    updateEmergency({
      active: false,
      acknowledged: true,
      stage: "cancelled",
      countdown: 10,
      rescueSignal: { status: "cancelled", progress: 0, received: false },
    });
  };

  const sendEmergency = () => {
    updateEmergency({
      active: true,
      acknowledged: false,
      stage: "transmitting",
      countdown: 0,
      rescueSignal: { status: "transmitting", progress: 4, received: false },
    });
  };

  const verifying = emergencyState.stage === "detecting" || emergencyState.stage === "verifying";
  const currentDetectionStep = emergencyState.stage === "detecting" ? 1 : verifying ? Math.max(1, Math.ceil(emergencyState.analysisProgress / 25)) : 4;

  return (
    <div className="tau-container py-8 md:py-12">
      <header className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-emergency-500"><Siren className="size-4" />Emergency intelligence</div>
          <h1 className="mt-3 max-w-4xl font-display text-4xl font-semibold tracking-[-0.035em] text-forest-900 md:text-5xl">Detect early. Relay offline. Rescue faster.</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-forest-800/58">TauFind verifies danger from multiple bracelet signals before transmitting an emergency packet through the mountain LoRa network.</p>
        </div>
        <div className="rounded-2xl border border-ai-500/15 bg-ai-100/65 px-4 py-3 text-xs leading-5 text-forest-800/60"><strong className="block text-forest-900">Hackathon simulation</strong>No real hardware or rescue service is connected.</div>
      </header>

      <Card className="mt-7" padding="p-4 md:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-forest-800/42">Emergency demo scenario</p><p className="mt-1 text-sm text-forest-800/55">Choose a case to replay the full detection workflow.</p></div>
          <div className="grid gap-2 sm:grid-cols-3">
            {scenarioOrder.map((scenarioId) => {
              const option = emergencyScenarios[scenarioId];
              const active = scenario.id === scenarioId;
              return <button aria-pressed={active} className={`min-h-11 rounded-full border px-4 text-xs font-bold transition ${active ? "border-emergency-500/25 bg-emergency-100 text-emergency-500" : "border-forest-800/9 bg-white/55 text-forest-800/52 hover:border-forest-800/20"}`} key={scenarioId} onClick={() => selectScenario(scenarioId)} type="button">{option.shortLabel}</button>;
            })}
          </div>
        </div>
      </Card>

      <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-forest-800/9 bg-white/62 p-4 sm:flex-row sm:items-center">
        <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${emergencyState.stage === "received" ? "bg-safe-500 text-white" : emergencyState.stage === "cancelled" ? "bg-ai-100 text-ai-500" : "bg-emergency-100 text-emergency-500"}`}>{emergencyState.stage === "received" ? <Check className="size-5" /> : <Activity className="size-5" />}</span>
        <div><p className="text-sm font-semibold text-forest-900">{stageLabels[emergencyState.stage]}</p><p className="mt-0.5 text-xs text-forest-800/45">{scenario.name} · {route?.name || "Mountain route"}</p></div>
        <div className="ml-auto flex items-center gap-2 text-xs font-semibold text-forest-800/48">{scenario.mobileNetwork === "Unavailable" ? <><WifiOff className="size-4 text-emergency-500" />No mobile coverage</> : <><Radio className="size-4 text-ai-500" />Mobile signal {scenario.mobileNetwork.toLowerCase()}</>}</div>
      </div>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="space-y-6">
          <Card>
            <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-emergency-500">Step 1 · Bracelet detection</p><h2 className="mt-2 font-display text-2xl font-semibold text-forest-900">Signals build the evidence</h2></div><span className="rounded-full bg-forest-100 px-3 py-1.5 text-xs font-bold text-forest-800">{scenario.braceletStatus}</span></div>
            <div className="mt-6 space-y-3">
              {detectionSteps.map((step, index) => {
                const Icon = step.icon;
                const complete = index < currentDetectionStep;
                const values = [scenario.input.fallDetected ? "Impact confirmed" : "No impact", scenario.input.movementStatus, `${scenario.input.heartRate} bpm`, `${scenario.input.temperature}°C`];
                return (
                  <motion.div animate={{ opacity: complete ? 1 : 0.42, x: 0 }} className={`flex items-center gap-3 rounded-2xl border p-3.5 ${complete ? "border-emergency-500/14 bg-emergency-100/45" : "border-forest-800/8 bg-white/45"}`} initial={false} key={step.key} transition={{ delay: index * 0.08 }}>
                    <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${complete ? "bg-emergency-500 text-white" : "bg-forest-800/7 text-forest-800/35"}`}>{complete ? <Check className="size-4" /> : <Icon className="size-4" />}</span>
                    <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-forest-900">{step.label}</p><p className="mt-0.5 truncate text-xs text-forest-800/48">{values[index]}</p></div>
                    {index < detectionSteps.length - 1 && <ArrowRight className="hidden size-4 text-forest-800/22 sm:block" />}
                  </motion.div>
                );
              })}
            </div>
          </Card>

          <Card>
            <div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-ai-100 text-ai-500"><BrainCircuit className="size-5" /></span><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-ai-500">Step 2 · Explainable verification</p><h2 className="mt-1 font-display text-xl font-semibold text-forest-900">TauFind AI emergency decision</h2></div></div>
            {verifying ? (
              <div className="mt-6">
                <div className="flex items-end justify-between gap-4"><div><p className="text-sm font-semibold text-forest-900">TauFind AI is analyzing emergency probability…</p><p className="mt-1 text-xs text-forest-800/45">Cross-checking independent bracelet signals</p></div><span className="font-display text-3xl font-semibold text-ai-500">{emergencyState.analysisProgress}%</span></div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-ai-100"><motion.div animate={{ width: `${emergencyState.analysisProgress}%` }} className="h-full rounded-full bg-ai-500" /></div>
              </div>
            ) : (
              <motion.div animate={{ opacity: 1, y: 0 }} className="mt-6" initial={false}>
                <div className="flex flex-col gap-4 rounded-2xl border border-forest-800/8 bg-sand-50/75 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div><p className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-forest-800/40">AI decision</p><p className="mt-1 font-display text-xl font-semibold text-forest-900">{decision.cause}</p><p className="mt-1 text-xs leading-5 text-forest-800/48">{decision.explanation}</p></div>
                  <div className="shrink-0 text-left sm:text-right"><p className={`font-display text-4xl font-semibold ${decision.emergency ? "text-emergency-500" : "text-warning-500"}`}>{decision.confidence}%</p><p className="text-xs font-bold uppercase tracking-wider text-forest-800/42">{decision.severity}</p></div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">{decision.factors.map((factor) => <span className="rounded-full bg-forest-100 px-3 py-1.5 text-xs font-semibold text-forest-800" key={factor}>{factor}</span>)}</div>
              </motion.div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="min-h-[360px]" padding="p-6 md:p-8">
            {emergencyState.stage === "countdown" && (
              <motion.div animate={{ opacity: 1, scale: 1 }} className="flex h-full flex-col items-center text-center" initial={false}>
                <p className="text-xs font-bold uppercase tracking-[0.17em] text-emergency-500">Step 3 · Hiker confirmation</p>
                <h2 className="mt-3 font-display text-3xl font-semibold text-forest-900">Are you safe?</h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-forest-800/52">If there is no response, TauFind automatically activates rescue mode.</p>
                <div className="relative mt-6 grid size-36 place-items-center rounded-full border-8 border-emergency-100 bg-white shadow-[0_18px_50px_-25px_rgba(230,57,70,.5)]"><motion.span animate={{ opacity: [0.18, 0.5, 0.18], scale: [1, 1.12, 1] }} className="absolute inset-0 rounded-full bg-emergency-500/10" transition={{ duration: 1, repeat: Infinity }} /><div><p className="font-display text-5xl font-semibold text-emergency-500">{emergencyState.countdown}</p><p className="text-[0.6rem] font-bold uppercase tracking-widest text-forest-800/38">seconds</p></div></div>
                <div className="mt-7 grid w-full gap-3 sm:grid-cols-2"><Button onClick={confirmSafe} size="lg" variant="secondary"><ShieldCheck className="size-4" />I'm OK</Button><Button onClick={sendEmergency} size="lg" variant="emergency"><Siren className="size-4" />Send Emergency Alert</Button></div>
              </motion.div>
            )}

            {verifying && (
              <div className="flex min-h-[310px] flex-col items-center justify-center text-center"><motion.span animate={{ scale: [1, 1.08, 1] }} className="grid size-20 place-items-center rounded-3xl bg-ai-100 text-ai-500" transition={{ duration: 1.2, repeat: Infinity }}><BrainCircuit className="size-9" /></motion.span><h2 className="mt-5 font-display text-2xl font-semibold text-forest-900">Verifying before escalation</h2><p className="mt-2 max-w-sm text-sm leading-6 text-forest-800/50">TauFind avoids relying on a single sensor or a manual SOS button.</p></div>
            )}

            {emergencyState.stage === "transmitting" && (
              <div className="flex min-h-[310px] flex-col items-center justify-center text-center"><motion.span animate={{ scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }} className="grid size-20 place-items-center rounded-3xl bg-emergency-100 text-emergency-500" transition={{ duration: 0.8, repeat: Infinity }}><Radio className="size-9" /></motion.span><p className="mt-5 text-xs font-bold uppercase tracking-[0.17em] text-emergency-500">Step 4 · Offline transmission</p><h2 className="mt-2 font-display text-2xl font-semibold text-forest-900">Relaying the rescue packet</h2><p className="mt-2 max-w-sm text-sm leading-6 text-forest-800/50">Location, medical signals, and incident confidence are moving across LoRa nodes.</p><p className="mt-5 font-display text-4xl font-semibold text-ai-500">{emergencyState.rescueSignal.progress}%</p></div>
            )}

            {emergencyState.stage === "received" && (
              <div className="flex min-h-[310px] flex-col items-center justify-center text-center"><span className="grid size-20 place-items-center rounded-3xl bg-emerald-100 text-safe-500"><Check className="size-10" /></span><p className="mt-5 text-xs font-bold uppercase tracking-[0.17em] text-safe-500">Rescue packet received</p><h2 className="mt-2 font-display text-3xl font-semibold text-forest-900">Help is being coordinated.</h2><p className="mt-2 max-w-sm text-sm leading-6 text-forest-800/52">The rescue center has the hiker's route, position, sensor readings, and likely incident cause.</p><div className="mt-6 flex gap-5 text-sm"><div><p className="text-xs text-forest-800/40">Response status</p><p className="mt-1 font-semibold text-forest-900">Team notified</p></div><div><p className="text-xs text-forest-800/40">Estimated arrival</p><p className="mt-1 font-semibold text-forest-900">{scenario.rescue.eta || "Assessing"}</p></div></div></div>
            )}

            {emergencyState.stage === "cancelled" && (
              <div className="flex min-h-[310px] flex-col items-center justify-center text-center"><span className="grid size-20 place-items-center rounded-3xl bg-emerald-100 text-safe-500"><ShieldCheck className="size-10" /></span><p className="mt-5 text-xs font-bold uppercase tracking-[0.17em] text-safe-500">Escalation closed</p><h2 className="mt-2 font-display text-3xl font-semibold text-forest-900">No rescue alert sent.</h2><p className="mt-2 max-w-sm text-sm leading-6 text-forest-800/52">TauFind keeps the bracelet and route under active monitoring.</p><Button as={Link} className="mt-6" to="/hiking" variant="secondary">Return to live hike</Button></div>
            )}
          </Card>

          <Card>
            <div className="flex items-center gap-2"><Clock3 className="size-4 text-ai-500" /><p className="text-xs font-bold uppercase tracking-[0.15em] text-ai-500">Emergency packet</p></div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-sand-50 p-3"><p className="text-[0.6rem] uppercase tracking-wider text-forest-800/38">Hiker</p><p className="mt-1 text-sm font-semibold text-forest-900">{state.user.name || "Unknown hiker"}</p></div>
              <div className="rounded-2xl bg-sand-50 p-3"><p className="text-[0.6rem] uppercase tracking-wider text-forest-800/38">Route</p><p className="mt-1 text-sm font-semibold text-forest-900">{route?.name || "Route unavailable"}</p></div>
              <div className="rounded-2xl bg-sand-50 p-3"><p className="text-[0.6rem] uppercase tracking-wider text-forest-800/38">Altitude</p><p className="mt-1 text-sm font-semibold text-forest-900">{scenario.input.altitude.toLocaleString()} m</p></div>
              <div className="rounded-2xl bg-sand-50 p-3"><p className="text-[0.6rem] uppercase tracking-wider text-forest-800/38">Medical signal</p><p className="mt-1 text-sm font-semibold text-forest-900">{scenario.input.heartRate} bpm · {scenario.input.temperature}°C</p></div>
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-6">
        <LoRaNetwork offlineMode={emergencyState.rescueSignal.offlineMode} progress={emergencyState.rescueSignal.progress} received={emergencyState.rescueSignal.received} status={emergencyState.rescueSignal.status} />
      </div>

      {emergencyState.stage === "received" && (
        <motion.div animate={{ opacity: 1, y: 0 }} className="mt-6 flex flex-col items-center justify-between gap-4 rounded-3xl border border-safe-500/20 bg-emerald-50 p-5 sm:flex-row" initial={{ opacity: 0, y: 8 }}>
          <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-safe-500 text-white"><MapPin className="size-5" /></span><div><p className="text-sm font-semibold text-forest-900">Rescue response activated</p><p className="mt-1 text-xs text-forest-800/48">The next view follows the incident at the rescue station.</p></div></div>
          <Button as={Link} to="/dashboard">Open rescue dashboard<ArrowRight className="size-4" /></Button>
        </motion.div>
      )}
    </div>
  );
}
