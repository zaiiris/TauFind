import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Backpack,
  CalendarDays,
  Check,
  Clock3,
  CloudSun,
  MapPinned,
  ShieldCheck,
  Signal,
  TriangleAlert,
} from "lucide-react";
import { useNavigate } from "react-router";
import Button from "../components/Button";
import Card from "../components/Card";
import FormField from "../components/FormField";
import JourneyProgress from "../components/JourneyProgress";
import RouteCard from "../components/RouteCard";
import { useTauFind } from "../context/TauFindContext";
import { equipmentOptions, getRouteById, routes } from "../data/routes";

const durationOptions = [
  { value: "", label: "Choose expected duration" },
  { value: "3", label: "Up to 3 hours" },
  { value: "5", label: "3–5 hours" },
  { value: "7", label: "5–7 hours" },
  { value: "9", label: "More than 7 hours" },
];

function formatDate(value) {
  if (!value) return "Date not set";
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${value}T12:00:00`));
}

export default function Prepare() {
  const navigate = useNavigate();
  const { state, updateTrip } = useTauFind();
  const { demoMode, trip, user } = state;
  const selectedRoute = getRouteById(trip.selectedRoute);
  const today = new Date().toISOString().slice(0, 10);

  const requiredEquipment = selectedRoute?.requiredEquipment ?? [];
  const packedRequired = requiredEquipment.filter((item) => trip.equipment.includes(item));
  const missingEquipment = requiredEquipment.filter((item) => !trip.equipment.includes(item));
  const equipmentReady = Boolean(selectedRoute) && missingEquipment.length === 0;
  const tripReady = Boolean(selectedRoute && trip.date && trip.duration && equipmentReady);

  const readinessParts = [
    selectedRoute ? 25 : 0,
    trip.date ? 25 : 0,
    trip.duration ? 25 : 0,
    requiredEquipment.length ? Math.round((packedRequired.length / requiredEquipment.length) * 25) : 0,
  ];
  const readiness = readinessParts.reduce((total, value) => total + value, 0);

  const toggleEquipment = (itemId) => {
    const equipment = trip.equipment.includes(itemId)
      ? trip.equipment.filter((item) => item !== itemId)
      : [...trip.equipment, itemId];
    updateTrip({ equipment });
  };

  return (
    <div className="tau-container py-10 md:py-14">
      <div className="mx-auto max-w-2xl">
        <JourneyProgress current={1} />
      </div>

      <div className="mt-12">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-ai-500">Route preparation</p>
            <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold tracking-[-0.035em] text-forest-900 md:text-5xl">
              Match the mountain to the hiker.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-forest-800/58">
              Route difficulty, weather, coverage, timing, and equipment become the first inputs to TauFind’s risk analysis.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-forest-800/9 bg-white/58 px-4 py-3">
            <span className="grid size-9 place-items-center rounded-xl bg-forest-100 text-forest-800"><ShieldCheck className="size-4" /></span>
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-forest-800/40">Planning for</p>
              <p className="mt-0.5 text-sm font-semibold text-forest-900">{user.name || "Your safety profile"}</p>
            </div>
          </div>
        </div>

        {demoMode && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mt-7 flex items-start gap-3 rounded-2xl border border-ai-500/18 bg-ai-100/70 p-4 text-sm text-forest-900"
            initial={{ opacity: 0, y: -6 }}
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-ai-500 text-white"><Check className="size-4" /></span>
            <div>
              <p className="font-semibold">Judge demo loaded</p>
              <p className="mt-1 text-xs leading-5 text-forest-800/55">Amina’s remote Sairam-Ugam trip is prefilled. One critical equipment item is intentionally missing so TauFind can demonstrate prevention before prediction.</p>
            </div>
          </motion.div>
        )}

        <section className="mt-9" aria-labelledby="route-heading">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-forest-800/42">Step 1</p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-forest-900" id="route-heading">Choose a route</h2>
            </div>
            <p className="hidden text-xs text-forest-800/42 sm:block">Conditions are illustrative MVP estimates</p>
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {routes.map((route) => (
              <RouteCard key={route.id} onSelect={(selectedRouteId) => updateTrip({ selectedRoute: selectedRouteId })} route={route} selected={trip.selectedRoute === route.id} />
            ))}
          </div>
        </section>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-6">
            <Card>
              <div className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-ai-100 text-ai-500"><CalendarDays className="size-5" /></span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-forest-800/42">Step 2</p>
                  <h2 className="mt-1 font-display text-xl font-semibold text-forest-900">Set the trip window</h2>
                </div>
              </div>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <FormField id="trip-date" label="Hike date" min={today} onChange={(event) => updateTrip({ date: event.target.value })} required type="date" value={trip.date} />
                <FormField id="trip-duration" label="Expected duration" onChange={(event) => updateTrip({ duration: event.target.value })} options={durationOptions} required value={trip.duration} />
              </div>
            </Card>

            <Card>
              <div className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-forest-100 text-forest-800"><Backpack className="size-5" /></span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-forest-800/42">Step 3</p>
                  <h2 className="mt-1 font-display text-xl font-semibold text-forest-900">Confirm equipment</h2>
                  <p className="mt-1 text-sm text-forest-800/48">Requirements update for the selected terrain.</p>
                </div>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {equipmentOptions.map((item) => {
                  const checked = trip.equipment.includes(item.id);
                  const required = requiredEquipment.includes(item.id);
                  return (
                    <button
                      aria-pressed={checked}
                      className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${
                        checked ? "border-safe-500/30 bg-emerald-50" : "border-forest-800/9 bg-white/58 hover:border-forest-800/20"
                      }`}
                      key={item.id}
                      onClick={() => toggleEquipment(item.id)}
                      type="button"
                    >
                      <span className={`grid size-7 shrink-0 place-items-center rounded-lg border ${checked ? "border-safe-500 bg-safe-500 text-white" : "border-forest-800/16 bg-white text-transparent"}`}>
                        <Check aria-hidden="true" className="size-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2 text-sm font-semibold text-forest-900">
                          {item.label}
                          {required && <span className="rounded-full bg-warning-500/12 px-1.5 py-0.5 text-[0.55rem] uppercase tracking-wider text-[#8b6216]">Required</span>}
                        </span>
                        <span className="mt-0.5 block text-xs text-forest-800/43">{item.detail}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          <div className="space-y-5 lg:sticky lg:top-24">
            <Card className="overflow-hidden" padding="p-0">
              <div className="relative h-64 overflow-hidden bg-forest-900 p-5 text-white">
                <div aria-hidden="true" className="absolute inset-0 opacity-50">
                  <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 340 240">
                    <path d="M0 240 0 205 75 118l48 47 74-112 62 93 81-82v176Z" fill="#17543f" />
                    <path d="M0 240 92 165l52 38 90-105 106 106v36Z" fill="#0f3d2e" />
                  </svg>
                </div>
                <div className="relative z-10 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-emerald-200/55">Route preview</p>
                    <p className="mt-2 font-display text-xl font-semibold">{selectedRoute?.name ?? "Select a mountain"}</p>
                  </div>
                  <MapPinned className="size-5 text-emerald-200/70" />
                </div>
                <AnimatePresence mode="wait">
                  {selectedRoute ? (
                    <motion.svg className="absolute inset-x-5 bottom-4 h-40 w-[calc(100%-2.5rem)]" key={selectedRoute.id} viewBox="0 0 336 220">
                      <motion.path animate={{ pathLength: 1, opacity: 1 }} d={selectedRoute.path} fill="none" initial={{ pathLength: 0, opacity: 0 }} stroke="#a7e3c1" strokeDasharray="3 7" strokeLinecap="round" strokeWidth="3" transition={{ duration: 1.1 }} />
                      <circle cx="18" cy="204" fill="#70c293" r="6" />
                      <motion.circle animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }} cx="318" cy={selectedRoute.id === "sairam-ugam" ? 38 : selectedRoute.id === "medeu-shymbulak" ? 52 : 44} fill="#e63946" r="6" transition={{ duration: 1.8, repeat: Infinity }} />
                    </motion.svg>
                  ) : (
                    <motion.p animate={{ opacity: 1 }} className="absolute bottom-8 left-5 right-5 text-sm text-emerald-100/50" initial={{ opacity: 0 }}>Choose a route to reveal its terrain profile.</motion.p>
                  )}
                </AnimatePresence>
              </div>
              {selectedRoute && (
                <div className="grid grid-cols-2 gap-px bg-forest-800/8">
                  <div className="bg-white/78 p-4"><p className="text-[0.6rem] uppercase tracking-wider text-forest-800/40">Date</p><p className="mt-1 text-sm font-semibold text-forest-900">{formatDate(trip.date)}</p></div>
                  <div className="bg-white/78 p-4"><p className="text-[0.6rem] uppercase tracking-wider text-forest-800/40">Trail time</p><p className="mt-1 text-sm font-semibold text-forest-900">{selectedRoute.duration}</p></div>
                  <div className="bg-white/78 p-4"><p className="text-[0.6rem] uppercase tracking-wider text-forest-800/40">Weather</p><p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-forest-900"><CloudSun className="size-4 text-ai-500" />{selectedRoute.weather}</p></div>
                  <div className="bg-white/78 p-4"><p className="text-[0.6rem] uppercase tracking-wider text-forest-800/40">Mobile signal</p><p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-forest-900"><Signal className="size-4 text-ai-500" />{selectedRoute.mobileCoverage}% estimate</p></div>
                </div>
              )}
            </Card>

            <Card>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-ai-500">Trip readiness</p>
                  <p className="mt-2 font-display text-2xl font-semibold text-forest-900">{readiness}% ready</p>
                </div>
                {tripReady ? <ShieldCheck className="size-7 text-safe-500" /> : <TriangleAlert className="size-7 text-warning-500" />}
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-forest-800/8">
                <motion.div animate={{ width: `${readiness}%` }} className={`h-full rounded-full ${tripReady ? "bg-safe-500" : "bg-warning-500"}`} initial={false} />
              </div>
              <div className="mt-4 space-y-2 text-xs text-forest-800/52">
                <p className="flex items-center justify-between"><span className="flex items-center gap-2"><MapPinned className="size-3.5" />Route</span><span>{selectedRoute ? "Selected" : "Missing"}</span></p>
                <p className="flex items-center justify-between"><span className="flex items-center gap-2"><Clock3 className="size-3.5" />Timing</span><span>{trip.date && trip.duration ? "Planned" : "Incomplete"}</span></p>
                <p className="flex items-center justify-between"><span className="flex items-center gap-2"><Backpack className="size-3.5" />Required gear</span><span>{packedRequired.length}/{requiredEquipment.length || "—"}</span></p>
              </div>
              {missingEquipment.length > 0 && (
                <div className="mt-4 rounded-xl bg-warning-500/10 p-3 text-xs leading-5 text-[#795615]">
                  Pack {missingEquipment.map((id) => equipmentOptions.find((item) => item.id === id)?.label).join(", ")} before analysis.
                </div>
              )}
              <Button className="mt-5 w-full" disabled={!tripReady} onClick={() => navigate("/risk-analysis")} size="lg">
                Analyze trip risk
                <ArrowRight aria-hidden="true" className="size-4" />
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
