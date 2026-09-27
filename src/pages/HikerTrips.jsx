import { useState } from "react";
import { ArrowRight, CalendarDays, CheckCircle2, Clock3, Compass, MapPinned, Sparkles, UsersRound } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { getEquipmentReadiness, getHikerRisk } from "../ai/hikerRisk";
import Button from "../components/Button";
import Card from "../components/Card";
import FormField from "../components/FormField";
import { useTauFind } from "../context/TauFindContext";
import { getRouteById, routes } from "../data/routes";

function formatDate(value) {
  if (!value) return "Date pending";
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${value}T12:00:00`));
}

export default function HikerTrips() {
  const navigate = useNavigate();
  const { state, updateHiking, updateSafety, updateTrip, updateUser } = useTauFind();
  const [analyzed, setAnalyzed] = useState(false);
  const route = getRouteById(state.trip.selectedRoute);
  const risk = getHikerRisk(state);
  const readiness = getEquipmentReadiness(route, state.trip.equipment);
  const prepared = Boolean(route && state.trip.date && state.trip.duration && readiness >= 80);

  const analyzeTrip = (event) => {
    event.preventDefault();
    const result = getHikerRisk(state);
    if (!result) return;
    updateSafety({ riskScore: result.score, riskAnalysis: result, currentStatus: result.riskLevel.toLowerCase() });
    setAnalyzed(true);
  };

  const startHiking = () => {
    updateHiking({ active: true, scenario: "normal", progress: 0, elapsedSeconds: 0 });
    navigate("/hiker/live");
  };

  return (
    <div className="tau-container py-10 md:py-14">
      <header><p className="text-xs font-bold uppercase tracking-[0.2em] text-ai-500">Mountain trip planning</p><h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em] text-forest-900 md:text-6xl">Plan with risk in view.</h1><p className="mt-4 max-w-2xl text-base leading-7 text-forest-800/55">Create the trip once. TauFind combines it with profile experience, equipment, and mountain conditions.</p></header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <Card className="h-fit" padding="p-6 md:p-7">
          <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-ai-100 text-ai-500"><MapPinned className="size-5" /></span><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-ai-500">New trip</p><h2 className="mt-1 font-display text-2xl font-semibold text-forest-900">Adventure details</h2></div></div>
          <form className="mt-7 space-y-5" onSubmit={analyzeTrip}>
            <FormField id="hiker-route" label="Route" onChange={(event) => { updateTrip({ selectedRoute: event.target.value }); setAnalyzed(false); }} options={[{ value: "", label: "Choose a mountain route" }, ...routes.map((item) => ({ value: item.id, label: `${item.name} · ${item.difficulty}` }))]} required value={state.trip.selectedRoute} />
            <div className="grid gap-5 sm:grid-cols-2"><FormField id="hiker-trip-date" label="Date" onChange={(event) => { updateTrip({ date: event.target.value }); setAnalyzed(false); }} required type="date" value={state.trip.date} /><FormField id="hiker-duration" label="Duration (hours)" min="1" onChange={(event) => { updateTrip({ duration: event.target.value }); setAnalyzed(false); }} required type="number" value={state.trip.duration} /></div>
            <div className="grid gap-5 sm:grid-cols-2"><FormField id="hiker-group-size" label="Group size" min="1" onChange={(event) => updateTrip({ groupSize: event.target.value })} required type="number" value={state.trip.groupSize} /><FormField id="hiker-experience" label="Experience level" onChange={(event) => { updateUser({ experience: event.target.value }); setAnalyzed(false); }} options={[{ value: "beginner", label: "Beginner" }, { value: "intermediate", label: "Intermediate" }, { value: "advanced", label: "Advanced" }]} required value={state.user.experience} /></div>
            <Button className="w-full" disabled={!route || !state.trip.date || !state.trip.duration} size="lg" type="submit" variant="ai"><Sparkles className="size-4" />Analyze Safety</Button>
          </form>
          {analyzed && <div className="mt-4 flex items-center gap-2 rounded-2xl bg-emerald-50 p-3 text-sm font-semibold text-safe-500"><CheckCircle2 className="size-4" />Trip saved and risk analysis updated.</div>}
        </Card>

        <section>
          <div className="flex items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-forest-800/38">Upcoming trips</p><h2 className="mt-1 font-display text-2xl font-semibold text-forest-900">Your next adventure</h2></div>{route && <span className="rounded-full bg-forest-100 px-3 py-1.5 text-xs font-semibold text-forest-800">1 planned</span>}</div>
          {route ? (
            <Card className="relative mt-5 overflow-hidden" padding="p-0">
              <div className="bg-forest-900 p-6 text-white md:p-7"><div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-200/50">{route.region}</p><h3 className="mt-2 font-display text-3xl font-semibold">{route.name}</h3><p className="mt-2 text-sm text-emerald-100/48">{route.altitude.toLocaleString()} m · {route.distance} km · {route.difficulty}</p></div>{risk && <div className="rounded-2xl border border-white/10 bg-white/7 px-5 py-3 text-center"><p className="text-[0.6rem] uppercase tracking-wider text-emerald-100/45">Risk</p><p className="mt-1 font-display text-2xl font-semibold">{risk.riskLevel} {risk.score}%</p></div>}</div></div>
              <div className="grid gap-4 p-6 sm:grid-cols-2 md:p-7 lg:grid-cols-4"><div><p className="text-[0.6rem] font-bold uppercase tracking-wider text-forest-800/38">Date</p><p className="mt-1 flex items-center gap-2 text-sm font-semibold text-forest-900"><CalendarDays className="size-4 text-ai-500" />{formatDate(state.trip.date)}</p></div><div><p className="text-[0.6rem] font-bold uppercase tracking-wider text-forest-800/38">Duration</p><p className="mt-1 flex items-center gap-2 text-sm font-semibold text-forest-900"><Clock3 className="size-4 text-ai-500" />{state.trip.duration || "—"} hours</p></div><div><p className="text-[0.6rem] font-bold uppercase tracking-wider text-forest-800/38">Group</p><p className="mt-1 flex items-center gap-2 text-sm font-semibold text-forest-900"><UsersRound className="size-4 text-ai-500" />{state.trip.groupSize || 1} hikers</p></div><div><p className="text-[0.6rem] font-bold uppercase tracking-wider text-forest-800/38">Status</p><p className={`mt-1 flex items-center gap-2 text-sm font-semibold ${prepared ? "text-safe-500" : "text-warning-500"}`}><CheckCircle2 className="size-4" />{prepared ? "Prepared" : "Needs equipment"}</p></div></div>
              <div className="flex flex-col gap-3 border-t border-forest-800/8 px-6 py-4 sm:flex-row sm:items-center sm:justify-between md:px-7"><p className="text-xs text-forest-800/45">Equipment readiness: {readiness}%</p><div className="flex flex-wrap gap-2"><Button as={Link} size="sm" to="/hiker/risk-analysis" variant="ghost">View analysis<ArrowRight className="size-4" /></Button>{prepared && <Button onClick={startHiking} size="sm">Start Hiking<Compass className="size-4" /></Button>}</div></div>
            </Card>
          ) : (
            <Card className="mt-5 text-center" padding="p-10"><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-forest-100 text-forest-800"><Compass className="size-6" /></span><h3 className="mt-5 font-display text-2xl font-semibold text-forest-900">No upcoming trip yet</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-forest-800/50">Choose a route and departure details to create your first safety-aware trip.</p></Card>
          )}
        </section>
      </div>
    </div>
  );
}
