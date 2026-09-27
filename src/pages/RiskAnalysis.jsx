import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BatteryCharging,
  BrainCircuit,
  Check,
  ChevronRight,
  CloudSun,
  Footprints,
  HeartPulse,
  Info,
  MapPinned,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Thermometer,
  TriangleAlert,
} from "lucide-react";
import { Link } from "react-router";
import Button from "../components/Button";
import Card from "../components/Card";
import JourneyProgress from "../components/JourneyProgress";
import RiskScore from "../components/RiskScore";
import { useTauFind } from "../context/TauFindContext";
import { calculateRisk } from "../ai/riskEngine";
import { getRouteById } from "../data/routes";
import { simulationScenarios } from "../data/simulationData";
import { useI18n } from "../i18n/I18nContext";

const analysisStages = [
  { label: "Reading safety profile", detail: "Experience and personal readiness" },
  { label: "Evaluating the mountain", detail: "Terrain, altitude, weather, and temperature" },
  { label: "Checking preparedness", detail: "Equipment and route requirements" },
  { label: "Establishing sensor baseline", detail: "Heart, movement, and bracelet battery" },
];

const factorIcons = {
  environment: CloudSun,
  healthSensors: HeartPulse,
  routeDifficulty: MapPinned,
  experience: Footprints,
  equipment: ShieldCheck,
};

const factorColors = {
  Low: "bg-safe-500",
  Medium: "bg-warning-500",
  High: "bg-[#d55a3a]",
  Critical: "bg-emergency-500",
};

function parseRouteWeather(weather = "") {
  const temperatureMatch = weather.match(/-?\d+/);
  const condition = weather.split("·")[1]?.trim() || "Unknown conditions";

  return {
    condition,
    temperature: temperatureMatch ? Number(temperatureMatch[0]) : 10,
  };
}

function formatDate(value, language) {
  if (!value) return "Date not set";
  return new Intl.DateTimeFormat(language === "ru" ? "ru-RU" : "en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

export default function RiskAnalysis() {
  const { state, updateSafety } = useTauFind();
  const { language } = useI18n();
  const { trip, user } = state;
  const selectedRoute = getRouteById(trip.selectedRoute);
  const [analysisRun, setAnalysisRun] = useState(0);
  const [activeStage, setActiveStage] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const weather = useMemo(
    () => parseRouteWeather(selectedRoute?.weather),
    [selectedRoute?.weather],
  );
  const requiredEquipment = selectedRoute?.requiredEquipment ?? [];
  const equipmentReadiness = requiredEquipment.length
    ? (requiredEquipment.filter((item) => trip.equipment.includes(item)).length /
        requiredEquipment.length) *
      100
    : 0;
  const baselineSensors = simulationScenarios.safeHike.sensors;

  const result = useMemo(() => {
    if (!selectedRoute) return null;

    return calculateRisk({
      experienceLevel: user.experience,
      routeName: selectedRoute.name,
      routeDifficulty: selectedRoute.difficulty,
      altitude: selectedRoute.altitude,
      weatherCondition: weather.condition,
      temperature: weather.temperature,
      equipmentReadiness,
      heartRate: baselineSensors.heartRate,
      movementStatus: baselineSensors.movementStatus,
      batteryLevel: baselineSensors.batteryLevel,
    });
  }, [
    baselineSensors.batteryLevel,
    baselineSensors.heartRate,
    baselineSensors.movementStatus,
    equipmentReadiness,
    selectedRoute,
    user.experience,
    weather.condition,
    weather.temperature,
  ]);

  useEffect(() => {
    if (!result) return undefined;

    const timers = analysisStages.map((_, index) =>
      window.setTimeout(() => setActiveStage(index), index * 260),
    );
    const completionTimer = window.setTimeout(
      () => setAnalysisComplete(true),
      analysisStages.length * 260 + 120,
    );

    return () => {
      timers.forEach(window.clearTimeout);
      window.clearTimeout(completionTimer);
    };
  }, [analysisRun, result]);

  useEffect(() => {
    if (!analysisComplete || !result) return;

    updateSafety({
      riskScore: result.score,
      riskAnalysis: result,
      currentStatus: result.riskLevel.toLowerCase(),
    });
  }, [analysisComplete, result, updateSafety]);

  if (!selectedRoute) {
    return (
      <div className="tau-container py-14 md:py-20">
        <Card className="mx-auto max-w-xl text-center" padding="p-8 md:p-10">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-ai-100 text-ai-500">
            <MapPinned className="size-7" />
          </span>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-ai-500">AI risk analysis</p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-forest-900">Choose a route first</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-forest-800/55">
            TauFind needs a mountain, trip window, and equipment checklist before it can explain your risk.
          </p>
          <Button as={Link} className="mt-7" to="/prepare">
            Prepare a route
            <ChevronRight className="size-4" />
          </Button>
        </Card>
      </div>
    );
  }

  const progress = analysisComplete
    ? 100
    : Math.round(((activeStage + 0.7) / analysisStages.length) * 100);

  return (
    <div className="tau-container py-10 md:py-14">
      <div className="mx-auto max-w-2xl">
        <JourneyProgress current={2} />
      </div>

      <header className="mx-auto mt-12 max-w-3xl text-center">
        <motion.div animate={{ opacity: 1, y: 0 }} className="mx-auto flex w-fit items-center gap-2 rounded-full border border-ai-500/16 bg-ai-100/70 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-ai-500" initial={{ opacity: 0, y: 6 }}>
          <BrainCircuit className="size-4" />Explainable AI review
        </motion.div>
        <h1 className="mt-5 font-display text-4xl font-semibold tracking-[-0.035em] text-forest-900 md:text-5xl">Know the risk before the mountain.</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-forest-800/58">TauFind weighs the hiker, route, conditions, equipment, and bracelet baseline—then shows exactly what influenced the result.</p>
      </header>

      <Card className="mx-auto mt-8 max-w-4xl" padding="p-4 md:p-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-3 rounded-2xl bg-sand-50/80 p-3"><MapPinned className="size-4 shrink-0 text-ai-500" /><div><p className="text-[0.6rem] uppercase tracking-wider text-forest-800/38">Route</p><p className="mt-0.5 text-sm font-semibold text-forest-900">{selectedRoute.name}</p></div></div>
          <div className="flex items-center gap-3 rounded-2xl bg-sand-50/80 p-3"><Thermometer className="size-4 shrink-0 text-ai-500" /><div><p className="text-[0.6rem] uppercase tracking-wider text-forest-800/38">Conditions</p><p className="mt-0.5 text-sm font-semibold text-forest-900">{selectedRoute.weather}</p></div></div>
          <div className="flex items-center gap-3 rounded-2xl bg-sand-50/80 p-3"><Footprints className="size-4 shrink-0 text-ai-500" /><div><p className="text-[0.6rem] uppercase tracking-wider text-forest-800/38">Hiker</p><p className="mt-0.5 text-sm font-semibold capitalize text-forest-900">{user.experience}</p></div></div>
          <div className="flex items-center gap-3 rounded-2xl bg-sand-50/80 p-3"><BatteryCharging className="size-4 shrink-0 text-ai-500" /><div><p className="text-[0.6rem] uppercase tracking-wider text-forest-800/38">Bracelet baseline</p><p className="mt-0.5 text-sm font-semibold text-forest-900">Ready · {baselineSensors.batteryLevel}%</p></div></div>
        </div>
      </Card>

      <>
        {!analysisComplete ? (
          <motion.section animate={{ opacity: 1, y: 0 }} className="mx-auto mt-6 max-w-4xl" initial={{ opacity: 0, y: 8 }} key="analysis-progress">
            <Card className="overflow-hidden" padding="p-6 md:p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-ai-500"><Sparkles className="size-4" />Analysis in progress</p><h2 className="mt-3 font-display text-2xl font-semibold text-forest-900">Building an explainable safety score</h2><p className="mt-2 text-sm text-forest-800/48">Every input follows the same transparent weighted model.</p></div>
                <div className="text-left md:text-right"><span className="font-display text-4xl font-semibold text-ai-500">{progress}%</span><p className="text-xs text-forest-800/40">model confidence check</p></div>
              </div>
              <div className="mt-6 h-2 overflow-hidden rounded-full bg-ai-100"><motion.div animate={{ width: `${progress}%` }} className="h-full rounded-full bg-ai-500" transition={{ duration: 0.35 }} /></div>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {analysisStages.map((stage, index) => {
                  const complete = index < activeStage;
                  const active = index === activeStage;
                  return (
                    <div className={`flex items-start gap-3 rounded-2xl border p-4 transition ${active ? "border-ai-500/28 bg-ai-100/55" : complete ? "border-safe-500/20 bg-emerald-50/65" : "border-forest-800/8 bg-white/45 opacity-50"}`} key={stage.label}>
                      <span className={`grid size-8 shrink-0 place-items-center rounded-xl ${complete ? "bg-safe-500 text-white" : active ? "bg-ai-500 text-white" : "bg-forest-800/7 text-forest-800/35"}`}>{complete ? <Check className="size-4" /> : <BrainCircuit className={`size-4 ${active ? "animate-pulse" : ""}`} />}</span>
                      <div><p className="text-sm font-semibold text-forest-900">{stage.label}</p><p className="mt-1 text-xs leading-5 text-forest-800/44">{stage.detail}</p></div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.section>
        ) : (
          <motion.div animate={{ opacity: 1, y: 0 }} className="mt-6" initial={false} key="analysis-result">
            <div className="grid items-stretch gap-6 lg:grid-cols-[0.78fr_1.22fr]">
              <Card className="flex flex-col items-center justify-center text-center" padding="p-7 md:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-ai-500">Pre-hike risk score</p>
                <RiskScore className="mt-5" score={result.score} size={190} />
                <div className="mt-5 flex items-center gap-2 rounded-full bg-forest-100 px-3.5 py-2 text-xs font-semibold text-forest-800"><ShieldCheck className="size-4 text-safe-500" />Deterministic result · no randomness</div>
                <p className="mt-5 max-w-xs text-sm leading-6 text-forest-800/52">The AI analyzed your preparation before you entered the mountain.</p>
              </Card>

              <Card padding="p-6 md:p-7">
                <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-forest-800/42">Why this score</p><h2 className="mt-2 font-display text-2xl font-semibold text-forest-900">Five weighted safety signals</h2></div><span className="rounded-full bg-ai-100 px-3 py-1.5 text-xs font-bold text-ai-500">100% explained</span></div>
                <div className="mt-6 space-y-5">
                  {result.factors.map((factor, index) => {
                    const Icon = factorIcons[factor.id] || Info;
                    return (
                      <motion.div animate={{ opacity: 1, x: 0 }} initial={false} key={factor.id} transition={{ delay: index * 0.08 }}>
                        <div className="flex items-center gap-3"><span className="grid size-8 shrink-0 place-items-center rounded-xl bg-sand-100 text-forest-800"><Icon className="size-4" /></span><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><p className="truncate text-sm font-semibold text-forest-900">{factor.label}</p><p className="shrink-0 text-xs font-bold text-forest-800/55">{factor.contribution} / {factor.weight} pts</p></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-forest-800/7"><motion.div animate={{ width: `${factor.categoryScore}%` }} className={`h-full rounded-full ${factorColors[factor.severity]}`} initial={false} transition={{ delay: 0.25 + index * 0.08, duration: 0.55 }} /></div></div></div>
                        <p className="ml-11 mt-2 text-xs leading-5 text-forest-800/48">{factor.explanation}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </Card>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <Card>
                <div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-ai-100 text-ai-500"><BrainCircuit className="size-5" /></span><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-ai-500">AI recommendations</p><h2 className="mt-1 font-display text-xl font-semibold text-forest-900">Actions before departure</h2></div></div>
                <div className="mt-5 space-y-3">{result.recommendations.map((recommendation, index) => <div className="flex gap-3 rounded-2xl border border-forest-800/8 bg-white/55 p-4" key={recommendation}><span className="grid size-6 shrink-0 place-items-center rounded-full bg-forest-800 text-[0.65rem] font-bold text-white">{index + 1}</span><p className="text-sm leading-6 text-forest-800/65">{recommendation}</p></div>)}</div>
              </Card>

              <Card variant="muted">
                <div className="flex items-center gap-2"><Info className="size-4 text-ai-500" /><p className="text-xs font-bold uppercase tracking-[0.15em] text-ai-500">How the model works</p></div>
                <h2 className="mt-3 font-display text-xl font-semibold text-forest-900">A transparent weighted decision</h2>
                <div className="mt-5 space-y-2.5 text-sm text-forest-800/60"><p className="flex justify-between"><span>Environment</span><strong className="text-forest-900">25%</strong></p><p className="flex justify-between"><span>Health sensors</span><strong className="text-forest-900">25%</strong></p><p className="flex justify-between"><span>Route difficulty</span><strong className="text-forest-900">20%</strong></p><p className="flex justify-between"><span>Experience</span><strong className="text-forest-900">20%</strong></p><p className="flex justify-between"><span>Equipment</span><strong className="text-forest-900">10%</strong></p></div>
                <div className="mt-5 rounded-2xl border border-ai-500/12 bg-ai-100/55 p-4 text-xs leading-5 text-forest-800/56"><p className="font-semibold text-forest-900">Pre-hike sensor baseline</p><p className="mt-1">{baselineSensors.heartRate} bpm · {baselineSensors.movementStatus} · {baselineSensors.batteryLevel}% battery</p></div>
              </Card>
            </div>

            <div className="mt-7 flex flex-col items-center justify-between gap-4 rounded-3xl border border-forest-800/9 bg-white/55 p-4 sm:flex-row">
              <Button as={Link} className="w-full sm:w-auto" to="/prepare" variant="ghost"><ArrowLeft className="size-4" />Adjust preparation</Button>
              <div className="text-center sm:text-right"><p className="text-sm font-semibold text-forest-900">{selectedRoute.name} · {formatDate(trip.date, language)}</p><p className="mt-0.5 text-xs text-forest-800/42">Analysis saved to your safety plan</p></div>
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                <Button className="w-full sm:w-auto" onClick={() => { setActiveStage(0); setAnalysisComplete(false); setAnalysisRun((run) => run + 1); }} variant="secondary"><RefreshCw className="size-4" />Run again</Button>
                <Button as={Link} className="w-full sm:w-auto" to="/hiking">Enter live mode<ChevronRight className="size-4" /></Button>
              </div>
            </div>
          </motion.div>
        )}
      </>

      {analysisComplete && result.riskLevel === "Critical" && <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emergency-500/20 bg-emergency-100 p-4 text-sm text-forest-900"><TriangleAlert className="mt-0.5 size-5 shrink-0 text-emergency-500" /><p><strong>Departure not recommended.</strong> Resolve the critical factors and run the analysis again.</p></div>}
    </div>
  );
}
