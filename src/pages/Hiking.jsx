import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Clock3,
  Gauge,
  HeartPulse,
  MapPinned,
  Navigation,
  Radio,
  ShieldCheck,
  Siren,
  Snowflake,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { Link } from "react-router";
import Bracelet from "../components/Bracelet";
import Button from "../components/Button";
import Card from "../components/Card";
import RiskScore from "../components/RiskScore";
import SafetyTimeline from "../components/SafetyTimeline";
import SensorCard from "../components/SensorCard";
import { getHikerRisk } from "../ai/hikerRisk";
import { useTauFind } from "../context/TauFindContext";
import { getRouteById } from "../data/routes";
import { getSensorScenario } from "../data/sensorSimulation";

const modeOptions = [
  { id: "normal", label: "Normal", scenario: "normal", icon: ShieldCheck },
  { id: "warning", label: "Warning", scenario: "highHeartRate", icon: TriangleAlert },
  { id: "emergency", label: "Emergency", scenario: "fall", icon: Siren },
];

const modeStyles = {
  normal: "border-safe-500/25 bg-emerald-50 text-safe-500",
  warning: "border-warning-500/30 bg-amber-50 text-[#8b6216]",
  emergency: "border-emergency-500/25 bg-emergency-100 text-emergency-500",
};

function formatDuration(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}

export default function Hiking({ platformMode = false }) {
  const { state, updateHiking, updateSafety } = useTauFind();
  const { hiking, trip, user } = state;
  const selectedRoute = getRouteById(trip.selectedRoute);
  const scenario = getSensorScenario(hiking.scenario);
  const platformRisk = getHikerRisk(state);
  const activeMode = scenario.status === "emergency" ? "emergency" : scenario.status === "warning" ? "warning" : "normal";

  useEffect(() => {
    if (!hiking.active) return undefined;
    const timer = window.setInterval(() => {
      updateHiking((current) => ({ elapsedSeconds: current.elapsedSeconds + 1 }));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [hiking.active, updateHiking]);

  const applyScenario = (scenarioId) => {
    const nextScenario = getSensorScenario(scenarioId);
    updateHiking({
      active: true,
      scenario: scenarioId,
      warningScenario: nextScenario.status === "warning" ? scenarioId : hiking.warningScenario,
      progress: nextScenario.route.progress,
      elapsedSeconds: nextScenario.route.elapsedSeconds,
    });
    updateSafety({
      riskScore: nextScenario.riskScore,
      currentStatus: nextScenario.status,
      emergencyState: {
        active: nextScenario.status === "emergency",
        type: nextScenario.status === "emergency" ? "fall-detected" : null,
        acknowledged: false,
        currentScenario: "fallDetected",
        stage: "detecting",
        analysisProgress: 0,
        countdown: 10,
        rescueSignal: {
          status: "idle",
          progress: 0,
          offlineMode: true,
          received: false,
        },
      },
    });
  };

  if (!selectedRoute) {
    return (
      <div className="tau-container py-14 md:py-20">
        <Card className="mx-auto max-w-xl text-center" padding="p-8 md:p-10">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-ai-100 text-ai-500"><MapPinned className="size-7" /></span>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-ai-500">Live hiking mode</p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-forest-900">Plan a route before going live</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-forest-800/55">TauFind needs a selected trail to place the hiker and begin bracelet monitoring.</p>
          <Button as={Link} className="mt-7" to={platformMode ? "/hiker/trips" : "/prepare"}>Choose a route<ArrowRight className="size-4" /></Button>
        </Card>
      </div>
    );
  }

  const progress = hiking.progress;
  const distanceTraveled = (selectedRoute.distance * progress) / 100;
  const currentAltitude = Math.round(selectedRoute.altitude - (1 - progress / 100) * 620);
  const markerX = 18 + 300 * (progress / 100);
  const markerY = 204 - 166 * (progress / 100);

  return (
    <div className="tau-container py-8 md:py-12">
      <header className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-ai-500"><motion.span animate={{ opacity: [1, 0.35, 1] }} className="size-2 rounded-full bg-safe-500" transition={{ duration: 1.6, repeat: Infinity }} />{platformMode ? "Active protection" : "Live mountain monitoring"}</div>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.035em] text-forest-900 md:text-5xl">{platformMode ? `${selectedRoute.name}, protected live.` : "Your trail, continuously understood."}</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-forest-800/58">Bracelet telemetry, route position, and risk signals stay connected through LoRa—even where mobile coverage disappears.</p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-forest-800/9 bg-white/65 px-4 py-3">
          <span className="grid size-10 place-items-center rounded-xl bg-forest-800 text-white"><Activity className="size-5" /></span>
          <div><p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-forest-800/40">Hiker online</p><p className="mt-0.5 text-sm font-semibold text-forest-900">{user.name || "TauFind hiker"}</p></div>
        </div>
      </header>

      {platformMode && (
        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-2xl border border-safe-500/18 bg-emerald-50/75 p-4"><span className="grid size-10 place-items-center rounded-xl bg-safe-500 text-white"><ShieldCheck className="size-5" /></span><div><p className="text-[0.6rem] font-bold uppercase tracking-wider text-forest-800/38">Protection status</p><p className="text-sm font-semibold text-forest-900">Active Monitoring</p></div></div>
          <div className="flex items-center gap-3 rounded-2xl border border-forest-800/8 bg-white/65 p-4"><span className="grid size-10 place-items-center rounded-xl bg-forest-800 text-white"><Activity className="size-5" /></span><div><p className="text-[0.6rem] font-bold uppercase tracking-wider text-forest-800/38">Bracelet</p><p className="text-sm font-semibold text-forest-900">{scenario.sensors.connection}</p></div></div>
          <div className="flex items-center gap-3 rounded-2xl border border-ai-500/14 bg-ai-100/65 p-4"><span className="grid size-10 place-items-center rounded-xl bg-ai-500 text-white"><Sparkles className="size-5" /></span><div><p className="text-[0.6rem] font-bold uppercase tracking-wider text-forest-800/38">AI monitoring</p><p className="text-sm font-semibold text-forest-900">Running</p></div></div>
        </div>
      )}

      <Card className="mt-7" padding="p-4 md:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-forest-800/42">{platformMode ? "Protection simulation" : "Judge demo controls"}</p>
            <p className="mt-1 text-sm text-forest-800/55">Switch conditions to see TauFind detect and respond in real time.</p>
          </div>
          <div className="grid grid-cols-3 gap-2" role="group" aria-label="Simulation scenario">
            {modeOptions.map((option) => {
              const Icon = option.icon;
              const active = activeMode === option.id;
              const targetScenario = option.id === "warning" ? hiking.warningScenario : option.scenario;
              return (
                <button aria-pressed={active} className={`flex min-h-11 items-center justify-center gap-2 rounded-full border px-3 text-xs font-bold transition sm:px-5 ${active ? modeStyles[option.id] : "border-forest-800/9 bg-white/55 text-forest-800/48 hover:border-forest-800/20"}`} key={option.id} onClick={() => applyScenario(targetScenario)} type="button">
                  <Icon className="size-4" />{option.label}
                </button>
              );
            })}
          </div>
        </div>
        {activeMode === "warning" && (
          <motion.div animate={{ opacity: 1, y: 0 }} className="mt-4 flex flex-wrap items-center gap-2 border-t border-forest-800/8 pt-4" initial={{ opacity: 0, y: -4 }}>
            <span className="mr-1 text-xs font-semibold text-forest-800/45">Warning condition:</span>
            <button className={`rounded-full px-3 py-2 text-xs font-semibold transition ${scenario.id === "cold" ? "bg-ai-500 text-white" : "bg-ai-100 text-ai-500"}`} onClick={() => applyScenario("cold")} type="button"><Snowflake className="mr-1.5 inline size-3.5" />Cold exposure</button>
            <button className={`rounded-full px-3 py-2 text-xs font-semibold transition ${scenario.id === "highHeartRate" ? "bg-warning-500 text-white" : "bg-amber-100 text-[#8b6216]"}`} onClick={() => applyScenario("highHeartRate")} type="button"><HeartPulse className="mr-1.5 inline size-3.5" />High heart rate</button>
          </motion.div>
        )}
      </Card>

      <motion.div animate={{ opacity: 1, y: 0 }} className={`mt-5 flex items-start gap-3 rounded-2xl border p-4 ${modeStyles[activeMode]}`} initial={false} key={scenario.id}>
        {activeMode === "emergency" ? <Siren className="mt-0.5 size-5 shrink-0" /> : activeMode === "warning" ? <TriangleAlert className="mt-0.5 size-5 shrink-0" /> : <ShieldCheck className="mt-0.5 size-5 shrink-0" />}
        <div><p className="text-sm font-bold">{scenario.label}</p><p className="mt-1 text-xs leading-5 opacity-75">{scenario.summary}</p></div>
        <span className="ml-auto hidden rounded-full bg-white/60 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider sm:block">Live scenario</span>
      </motion.div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.28fr_0.72fr]">
        <div className="space-y-6">
          <Card className="overflow-hidden" padding="p-0">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 bg-forest-950 px-5 py-4 text-white md:px-6">
              <div><p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-emerald-200/55">Interactive route</p><h2 className="mt-1 font-display text-xl font-semibold">{selectedRoute.name}</h2></div>
              <div className="text-right"><p className="text-[0.6rem] uppercase tracking-wider text-emerald-200/50">LoRa coverage</p><p className="mt-1 flex items-center justify-end gap-1.5 text-sm font-semibold text-emerald-200"><Radio className="size-4" />Active</p></div>
            </div>

            <div className="relative min-h-[330px] overflow-hidden bg-forest-900 p-5 text-white md:p-7">
              <div aria-hidden="true" className="absolute inset-0 opacity-70"><svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 800 360"><path d="M0 360 0 292 120 182l92 72 142-162 116 147 132-105 198 165v61Z" fill="#17543f" /><path d="m0 360 165-122 115 67 174-124 146 101 91-58 109 78v58Z" fill="#0f3d2e" /></svg></div>
              <div aria-hidden="true" className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:40px_40px]" />

              <svg aria-label={`${Math.round(progress)}% of ${selectedRoute.name} completed`} className="relative z-10 mx-auto mt-5 h-56 w-full max-w-3xl" role="img" viewBox="0 0 336 220">
                <path d={selectedRoute.path} fill="none" stroke="rgba(167,227,193,.26)" strokeLinecap="round" strokeWidth="8" />
                <motion.path animate={{ pathLength: progress / 100 }} d={selectedRoute.path} fill="none" initial={false} stroke={activeMode === "emergency" ? "#e63946" : "#a7e3c1"} strokeDasharray="4 8" strokeLinecap="round" strokeWidth="4" transition={{ duration: 0.8, ease: "easeOut" }} />
                <circle cx="18" cy="204" fill="#70c293" r="6" />
                <circle cx="318" cy="42" fill="rgba(255,255,255,.25)" r="6" />
                <motion.g animate={{ x: markerX - 18, y: markerY - 204 }} initial={false} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
                  <motion.circle animate={{ r: [13, 19, 13], opacity: [0.45, 0.08, 0.45] }} cx="18" cy="204" fill={activeMode === "emergency" ? "#e63946" : "#70c293"} transition={{ duration: activeMode === "emergency" ? 0.8 : 2, repeat: Infinity }} />
                  <circle cx="18" cy="204" fill={activeMode === "emergency" ? "#e63946" : "#ffffff"} r="8" stroke="#0a2b20" strokeWidth="3" />
                </motion.g>
              </svg>

              <div className="relative z-10 mt-2 flex items-center justify-between text-xs text-emerald-100/60"><span>Trailhead</span><span>Current position · {progress}%</span><span>Summit</span></div>
              <div className="relative z-10 mt-4 h-2 overflow-hidden rounded-full bg-white/12"><motion.div animate={{ width: `${progress}%` }} className={activeMode === "emergency" ? "h-full rounded-full bg-emergency-500" : "h-full rounded-full bg-emerald-300"} initial={false} transition={{ duration: 0.8 }} /></div>
            </div>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            <SensorCard icon={Gauge} label="Altitude" tone="ai" trend={`${selectedRoute.altitude - currentAltitude} m to planned high point`} unit="m" value={currentAltitude.toLocaleString()} />
            <SensorCard icon={Navigation} label="Distance" tone="safe" trend={`${(selectedRoute.distance - distanceTraveled).toFixed(1)} km remaining`} unit="km" value={distanceTraveled.toFixed(1)} />
            <SensorCard icon={Clock3} label="Duration" tone="default" trend="Live session time" value={formatDuration(hiking.elapsedSeconds)} />
            <SensorCard icon={MapPinned} label="Route progress" tone={activeMode === "emergency" ? "emergency" : "ai"} trend={selectedRoute.region} unit="%" value={Math.round(progress)} />
          </div>

          {platformMode && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <SensorCard icon={HeartPulse} label="Heart rate" tone={scenario.sensors.heartRate >= 150 || scenario.sensors.heartRate < 50 ? "emergency" : "safe"} trend="Bracelet sensor" unit="bpm" value={scenario.sensors.heartRate} />
              <SensorCard icon={Snowflake} label="Temperature" tone={scenario.sensors.temperature <= -5 ? "warning" : "ai"} trend="Ambient reading" unit="°C" value={scenario.sensors.temperature} />
              <SensorCard icon={Navigation} label="GPS" tone="safe" trend="Current location" value={scenario.sensors.gps} />
              <SensorCard icon={Radio} label="LoRa" tone="ai" trend="Offline protection" value={scenario.sensors.lora} />
            </div>
          )}

          {platformMode && <SafetyTimeline />}
        </div>

        <div className="space-y-6">
          <Bracelet sensors={scenario.sensors} status={scenario.status} />
          <Card>
            <div className="flex flex-col items-center text-center">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-ai-500">Live safety risk</p>
              <RiskScore className="mt-4" score={platformMode ? platformRisk?.score ?? scenario.riskScore : scenario.riskScore} size={158} />
              <p className="mt-4 text-sm leading-6 text-forest-800/55">{platformMode ? "Current trip risk comes from the existing explainable engine; live sensors are monitored separately for emergency conditions." : "Risk changes with sensor and environmental signals—not random demo values."}</p>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-forest-800/8 pt-5 text-center">
              <div><p className="text-[0.6rem] uppercase tracking-wider text-forest-800/40">Movement</p><p className="mt-1 text-xs font-semibold text-forest-900">{scenario.sensors.movement}</p></div>
              <div><p className="text-[0.6rem] uppercase tracking-wider text-forest-800/40">Last packet</p><p className="mt-1 text-xs font-semibold text-forest-900">Now · LoRa</p></div>
            </div>
            {activeMode === "emergency" ? (
              <div className="mt-5 rounded-2xl border border-emergency-500/18 bg-emergency-100 p-4"><p className="text-sm font-bold text-emergency-500">{platformMode ? "Potential emergency detected" : "Emergency condition detected"}</p><Button as={Link} className="mt-3 w-full" size="lg" to={platformMode ? "/hiker/emergency" : "/emergency"} variant="emergency">{platformMode ? "Open Emergency Status" : "Open rescue response"}<Siren className="size-4" /></Button></div>
            ) : (
              <div className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-emerald-50 p-3 text-xs font-semibold text-safe-500"><ShieldCheck className="size-4" />Automatic monitoring is active</div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
