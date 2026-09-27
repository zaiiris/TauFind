import { motion } from "framer-motion";
import {
  Activity,
  BatteryMedium,
  BrainCircuit,
  Check,
  Clock3,
  HeartPulse,
  MapPin,
  Mountain,
  Navigation,
  Radio,
  Search,
  ShieldAlert,
  ShieldCheck,
  Snowflake,
  UserRound,
  WifiOff,
} from "lucide-react";
import { Link } from "react-router";
import { detectEmergency } from "../ai/emergencyEngine";
import Button from "../components/Button";
import Card from "../components/Card";
import { useTauFind } from "../context/TauFindContext";
import { getEmergencyScenario } from "../data/emergencySimulation";
import { getRouteById } from "../data/routes";

const priorityMeta = {
  LOW: { color: "text-safe-500", badge: "bg-emerald-100 text-safe-500", bar: "bg-safe-500" },
  MEDIUM: { color: "text-warning-500", badge: "bg-amber-100 text-[#8b6216]", bar: "bg-warning-500" },
  HIGH: { color: "text-[#d55a3a]", badge: "bg-orange-100 text-[#b64930]", bar: "bg-[#d55a3a]" },
  CRITICAL: { color: "text-emergency-500", badge: "bg-emergency-100 text-emergency-500", bar: "bg-emergency-500" },
};

function getPriority(severity) {
  if (severity === "Critical") return "CRITICAL";
  if (severity === "High") return "HIGH";
  if (severity === "Elevated") return "MEDIUM";
  return "LOW";
}

function ConditionMetric({ icon: Icon, label, value, alert = false }) {
  return (
    <div className={`rounded-2xl border p-4 ${alert ? "border-emergency-500/18 bg-emergency-100/55" : "border-forest-800/8 bg-sand-50/72"}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-forest-800/42">{label}</p>
        <Icon className={`size-4 ${alert ? "text-emergency-500" : "text-ai-500"}`} />
      </div>
      <p className={`mt-3 font-display text-xl font-semibold ${alert ? "text-emergency-500" : "text-forest-900"}`}>{value}</p>
    </div>
  );
}

function LocationMap({ priority, progress, routeName }) {
  const markerX = 150 + progress * 3.4;
  const markerY = 250 - progress * 1.25;
  const urgent = priority === "CRITICAL" || priority === "HIGH";

  return (
    <div className="relative overflow-hidden rounded-[1.1rem] bg-forest-950 text-white">
      <svg aria-label={`Simulated rescue map showing the tourist on ${routeName}`} className="h-[390px] w-full" role="img" viewBox="0 0 760 390">
        <defs>
          <linearGradient id="map-glow" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#17543f" /><stop offset="1" stopColor="#071f17" /></linearGradient>
          <pattern height="34" id="map-grid" patternUnits="userSpaceOnUse" width="34"><path d="M 34 0 L 0 0 0 34" fill="none" stroke="rgba(167,227,193,.08)" strokeWidth="1" /></pattern>
        </defs>
        <rect fill="url(#map-glow)" height="390" width="760" />
        <rect fill="url(#map-grid)" height="390" width="760" />
        <g fill="none" stroke="rgba(167,227,193,.16)" strokeWidth="1.5">
          <path d="M-20 98 C95 20 174 150 286 75 S500 30 790 120" />
          <path d="M-30 135 C92 58 188 192 302 112 S510 70 790 156" />
          <path d="M-40 175 C74 102 205 225 327 151 S555 116 800 197" />
          <path d="M-45 225 C90 150 222 280 350 207 S575 172 805 252" />
          <path d="M-50 280 C115 200 238 330 391 262 S610 232 810 312" />
        </g>
        <path d="M84 324 C174 286 226 251 305 239 S444 188 506 162 S603 199 675 94" fill="none" stroke="rgba(255,255,255,.28)" strokeDasharray="5 8" strokeLinecap="round" strokeWidth="4" />

        <motion.circle animate={{ r: [42, 64, 42], opacity: [0.22, 0.06, 0.22] }} cx={markerX} cy={markerY} fill={urgent ? "#e63946" : "#d9a441"} transition={{ duration: 2.2, repeat: Infinity }} />
        <circle cx={markerX} cy={markerY} fill="none" r="72" stroke={urgent ? "rgba(230,57,70,.52)" : "rgba(217,164,65,.5)"} strokeDasharray="7 7" strokeWidth="2" />
        <circle cx={markerX} cy={markerY} fill={urgent ? "#e63946" : "#d9a441"} r="9" stroke="white" strokeWidth="4" />
        <circle cx={markerX - 38} cy={markerY + 24} fill="#457b9d" r="6" stroke="white" strokeWidth="3" />

        <g transform="translate(615 274)">
          <circle fill="#70c293" r="17" stroke="white" strokeWidth="3" />
          <path d="M-7 4 0-6 7 4M-5 4h10v7H-5Z" fill="none" stroke="#071f17" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>

      <div className="pointer-events-none absolute inset-x-4 top-4 flex items-start justify-between gap-3">
        <div className="rounded-xl border border-white/10 bg-forest-950/72 px-3 py-2 backdrop-blur-md"><p className="text-[0.58rem] uppercase tracking-[0.16em] text-emerald-200/50">Operational map</p><p className="mt-1 text-sm font-semibold">{routeName}</p></div>
        <div className="rounded-xl border border-white/10 bg-forest-950/72 px-3 py-2 text-right backdrop-blur-md"><p className="text-[0.58rem] uppercase tracking-[0.16em] text-emerald-200/50">Search radius</p><p className="mt-1 text-sm font-semibold">180 m</p></div>
      </div>

      <div className="absolute inset-x-4 bottom-4 grid gap-2 text-[0.65rem] sm:grid-cols-3">
        <span className="flex items-center gap-2 rounded-lg bg-forest-950/72 px-3 py-2 backdrop-blur-md"><span className="size-2 rounded-full bg-emergency-500" />Tourist position</span>
        <span className="flex items-center gap-2 rounded-lg bg-forest-950/72 px-3 py-2 backdrop-blur-md"><span className="size-2 rounded-full bg-ai-500" />Last signal point</span>
        <span className="flex items-center gap-2 rounded-lg bg-forest-950/72 px-3 py-2 backdrop-blur-md"><span className="size-2 rounded-full bg-emerald-300" />Rescue station</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { state } = useTauFind();
  const emergencyState = state.safety.emergencyState;
  const scenario = getEmergencyScenario(emergencyState.currentScenario);
  const decision = detectEmergency(scenario.input);
  const route = getRouteById(state.trip.selectedRoute);
  const priority = getPriority(decision.severity);
  const priorityStyle = priorityMeta[priority];
  const activeIncident = emergencyState.active || ["countdown", "transmitting", "received"].includes(emergencyState.stage);
  const signalReceived = emergencyState.rescueSignal.received || emergencyState.stage === "received";
  const incidentId = `TF-${(route?.id || "MNT").slice(0, 3).toUpperCase()}-${scenario.id === "criticalOffline" ? "001" : "042"}`;
  const routeProgress = state.hiking.progress || 72;

  const recommendations = [
    {
      title: decision.emergency ? "Dispatch the nearest mountain rescue unit" : "Maintain remote monitoring",
      detail: decision.emergency ? `Treat this as ${priority.toLowerCase()} priority; estimated response ${scenario.rescue.eta || "is being calculated"}.` : "The evidence remains below the emergency threshold.",
      icon: ShieldAlert,
    },
    {
      title: scenario.input.temperature <= 2 ? "Prepare cold-exposure medical support" : "Prepare standard trauma assessment",
      detail: scenario.input.temperature <= 2 ? `${scenario.input.temperature}°C exposure increases hypothermia risk while the hiker is immobile.` : "Check the hiker for injury when contact is established.",
      icon: Snowflake,
    },
    {
      title: "Navigate to the latest LoRa position",
      detail: `Begin the search within the 180 m uncertainty radius at ${scenario.input.altitude.toLocaleString()} m altitude.`,
      icon: Navigation,
    },
  ];

  return (
    <div className="tau-container py-8 md:py-12">
      <header className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-ai-500"><ShieldCheck className="size-4" />Rescue operations center</div>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.035em] text-forest-900 md:text-5xl">Context before deployment.</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-forest-800/58">One operational view of the incident, hiker condition, last known position, and AI-guided response priority.</p>
        </div>
        <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${activeIncident ? "border-emergency-500/18 bg-emergency-100" : "border-safe-500/18 bg-emerald-50"}`}>
          <motion.span animate={activeIncident ? { opacity: [1, 0.35, 1] } : { opacity: 1 }} className={`size-2.5 rounded-full ${activeIncident ? "bg-emergency-500" : "bg-safe-500"}`} transition={{ duration: 0.8, repeat: activeIncident ? Infinity : 0 }} />
          <div><p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-forest-800/40">Operations status</p><p className="mt-0.5 text-sm font-semibold text-forest-900">{activeIncident ? "Active incident" : "Monitoring standby"}</p></div>
        </div>
      </header>

      {!activeIncident && (
        <Card className="mt-7 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center" variant="muted">
          <div><p className="text-sm font-semibold text-forest-900">No emergency is currently active</p><p className="mt-1 text-xs text-forest-800/48">The dashboard will populate automatically when TauFind confirms and transmits an incident.</p></div>
          <Button as={Link} to="/emergency" variant="secondary">Run emergency simulation</Button>
        </Card>
      )}

      <Card className="mt-7 overflow-hidden" padding="p-0">
        <div className={`h-1.5 ${priorityStyle.bar}`} />
        <div className="grid gap-6 p-5 md:p-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2"><span className={`rounded-full px-3 py-1.5 text-xs font-bold ${priorityStyle.badge}`}>{priority} PRIORITY</span><span className="rounded-full bg-forest-100 px-3 py-1.5 text-xs font-semibold text-forest-800">{signalReceived ? "Rescue signal received" : scenario.rescue.status}</span></div>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-forest-800/42">Active incident · {incidentId}</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-forest-900">{decision.cause}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-forest-800/54">{decision.explanation}</p>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-xs text-forest-800/50"><span className="flex items-center gap-2"><Clock3 className="size-4 text-ai-500" />Received via LoRa · now</span><span className="flex items-center gap-2"><Radio className="size-4 text-ai-500" />Packet integrity verified</span>{scenario.mobileNetwork === "Unavailable" && <span className="flex items-center gap-2"><WifiOff className="size-4 text-emergency-500" />Mobile network unavailable</span>}</div>
          </div>
          <div className="rounded-3xl border border-forest-800/8 bg-sand-50/72 p-5 text-center">
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.15em] text-forest-800/40">Emergency confidence</p>
            <p className={`mt-2 font-display text-6xl font-semibold tracking-tight ${priorityStyle.color}`}>{decision.confidence}%</p>
            <p className="mt-2 text-sm font-semibold text-forest-900">{decision.severity} severity</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-forest-800/8"><motion.div animate={{ width: `${decision.confidence}%` }} className={`h-full rounded-full ${priorityStyle.bar}`} initial={false} /></div>
          </div>
        </div>
      </Card>

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-[0.72fr_1.28fr]">
        <Card>
          <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-ai-500">Tourist condition</p><h2 className="mt-2 font-display text-2xl font-semibold text-forest-900">{state.user.name || "Unknown tourist"}</h2><p className="mt-1 text-xs text-forest-800/45">Bracelet telemetry · last packet now</p></div><span className="grid size-11 place-items-center rounded-2xl bg-forest-100 text-forest-800"><UserRound className="size-5" /></span></div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <ConditionMetric alert={scenario.input.heartRate <= 45 || scenario.input.heartRate >= 150} icon={HeartPulse} label="Heart rate" value={`${scenario.input.heartRate} bpm`} />
            <ConditionMetric alert={scenario.input.temperature <= 2} icon={Snowflake} label="Temperature" value={`${scenario.input.temperature}°C`} />
            <ConditionMetric alert={/no movement|unresponsive/i.test(scenario.input.movementStatus)} icon={Activity} label="Movement" value={scenario.input.movementStatus} />
            <ConditionMetric icon={Mountain} label="Altitude" value={`${scenario.input.altitude.toLocaleString()} m`} />
            <ConditionMetric alert={scenario.input.battery <= 20} icon={BatteryMedium} label="Battery" value={`${scenario.input.battery}%`} />
            <ConditionMetric icon={MapPin} label="Route progress" value={`${Math.round(routeProgress)}%`} />
          </div>
        </Card>

        <Card padding="p-3 md:p-4">
          <LocationMap priority={priority} progress={routeProgress} routeName={route?.name || "Mountain route"} />
          <div className="grid gap-3 px-1 pb-1 pt-4 text-xs sm:grid-cols-3">
            <div className="rounded-xl bg-sand-50 p-3"><p className="uppercase tracking-wider text-forest-800/38">Coordinates</p><p className="mt-1 font-semibold text-forest-900">42.2841° N, 70.1568° E</p></div>
            <div className="rounded-xl bg-sand-50 p-3"><p className="uppercase tracking-wider text-forest-800/38">Last signal</p><p className="mt-1 font-semibold text-forest-900">LoRa Node UG-04 · now</p></div>
            <div className="rounded-xl bg-sand-50 p-3"><p className="uppercase tracking-wider text-forest-800/38">Nearest station</p><p className="mt-1 font-semibold text-forest-900">6.8 km southeast</p></div>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <div className="flex items-start gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-ai-100 text-ai-500"><BrainCircuit className="size-5" /></span><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-ai-500">AI rescue recommendation</p><h2 className="mt-1 font-display text-2xl font-semibold text-forest-900">Immediate action plan</h2></div></div>
          <div className="mt-5 rounded-2xl border border-emergency-500/14 bg-emergency-100/45 p-4"><p className="text-sm font-semibold text-forest-900">{decision.emergency ? "Immediate rescue required because:" : "Continue monitoring because:"}</p><ul className="mt-3 space-y-2 text-sm text-forest-800/62">{decision.factors.slice(0, 4).map((factor) => <li className="flex gap-2" key={factor}><Check className="mt-0.5 size-4 shrink-0 text-emergency-500" />{factor}</li>)}</ul></div>
          <div className="mt-5 space-y-3">
            {recommendations.map((recommendation, index) => {
              const Icon = recommendation.icon;
              return <div className="flex gap-3 rounded-2xl border border-forest-800/8 bg-white/55 p-4" key={recommendation.title}><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-forest-800 text-white"><Icon className="size-4" /></span><div><p className="text-sm font-semibold text-forest-900">{index + 1}. {recommendation.title}</p><p className="mt-1 text-xs leading-5 text-forest-800/48">{recommendation.detail}</p></div></div>;
            })}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2"><Search className="size-4 text-ai-500" /><p className="text-xs font-bold uppercase tracking-[0.16em] text-ai-500">Search priority system</p></div>
          <h2 className="mt-3 font-display text-2xl font-semibold text-forest-900">Operational priority</h2>
          <div className="mt-5 space-y-3">
            {Object.keys(priorityMeta).map((level) => {
              const active = level === priority;
              const meta = priorityMeta[level];
              return <div className={`flex items-center gap-3 rounded-2xl border p-3.5 transition ${active ? "border-forest-800/18 bg-sand-50 shadow-sm" : "border-forest-800/6 bg-white/35 opacity-45"}`} key={level}><span className={`size-2.5 rounded-full ${meta.bar}`} /><span className={`text-sm font-bold ${active ? meta.color : "text-forest-800"}`}>{level}</span>{active && <span className="ml-auto rounded-full bg-forest-800 px-2.5 py-1 text-[0.58rem] font-bold uppercase tracking-wider text-white">Selected</span>}</div>;
            })}
          </div>
          <div className="mt-5 rounded-2xl bg-forest-900 p-4 text-white"><p className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-emerald-200/50">Response status</p><p className="mt-2 font-display text-xl font-semibold">{signalReceived ? "Rescue unit notified" : "Awaiting complete packet"}</p><div className="mt-4 flex items-center justify-between text-xs text-emerald-100/50"><span>Estimated arrival</span><strong className="text-emerald-200">{scenario.rescue.eta || "Not dispatched"}</strong></div></div>
        </Card>
      </div>

      <p className="mt-6 text-center text-[0.65rem] text-forest-800/36">Simulated operational interface for the TauFind hackathon MVP. No real rescue service is connected.</p>
    </div>
  );
}
