import { motion } from "framer-motion";
import { ArrowRight, BatteryMedium, Bluetooth, CalendarDays, CheckCircle2, Compass, MapPinned, Mountain, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router";
import { getHikerRisk, getPreparationScore } from "../ai/hikerRisk";
import Button from "../components/Button";
import Card from "../components/Card";
import { useTauFind } from "../context/TauFindContext";
import { getRouteById } from "../data/routes";
import { sensorScenarios } from "../data/sensorSimulation";
import { useI18n } from "../i18n/I18nContext";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function formatTripDate(value, locale = "en") {
  if (!value) return "Date not selected";
  return new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en", { day: "numeric", month: "long" }).format(new Date(`${value}T12:00:00`));
}

const riskTone = {
  Low: "bg-emerald-50 text-safe-500",
  Medium: "bg-amber-50 text-warning-500",
  High: "bg-orange-50 text-[#c75d35]",
  Critical: "bg-emergency-100 text-emergency-500",
};

export default function HikerDashboard() {
  const { state } = useTauFind();
  const { language } = useI18n();
  const route = getRouteById(state.trip.selectedRoute);
  const risk = getHikerRisk(state);
  const preparationScore = getPreparationScore(state);
  const bracelet = sensorScenarios.normal.sensors;
  const protectedStatus = Boolean(route && state.trip.date && preparationScore >= 80 && (risk?.score ?? 100) < 55);

  return (
    <div className="tau-container py-10 md:py-14">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-ai-500">Personal safety center</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em] text-forest-900 md:text-6xl">{greeting()}, {state.user.name?.split(" ")[0] || "Hiker"}.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-forest-800/55">Preparation, wearable readiness, and explainable risk—together before the trail begins.</p>
        </div>
        <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${protectedStatus ? "border-safe-500/18 bg-emerald-50/75" : "border-warning-500/20 bg-amber-50/75"}`}>
          <span className={`grid size-10 place-items-center rounded-xl text-white ${protectedStatus ? "bg-safe-500" : "bg-warning-500"}`}><ShieldCheck className="size-5" /></span>
          <div><p className="text-[0.6rem] font-bold uppercase tracking-[0.15em] text-forest-800/40">Safety status</p><p className="mt-0.5 text-sm font-semibold text-forest-900">{protectedStatus ? "Protected" : "Needs preparation"}</p></div>
        </div>
      </header>

      <Card className="relative mt-8 overflow-hidden bg-forest-900 text-white" padding="p-6 md:p-8" variant="dark">
        <div aria-hidden="true" className="absolute -right-16 -top-24 size-72 rounded-full bg-ai-500/18 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-200/55"><Mountain className="size-4" />Upcoming adventure</p>
            <h2 className="mt-4 font-display text-3xl font-semibold md:text-4xl">{route?.name || "Plan your next mountain"}</h2>
            <div className="mt-5 flex flex-wrap gap-x-7 gap-y-3 text-sm text-emerald-100/58">
              <span className="flex items-center gap-2"><CalendarDays className="size-4 text-emerald-300" />{formatTripDate(state.trip.date, language)}</span>
              <span className="flex items-center gap-2"><Compass className="size-4 text-emerald-300" />{route?.difficulty || "Difficulty pending"}</span>
              {risk && <span className="flex items-center gap-2"><Sparkles className="size-4 text-sky-300" />{risk.riskLevel} risk · {risk.score}%</span>}
            </div>
          </div>
          <Button as={Link} size="lg" to={route ? "/hiker/risk-analysis" : "/hiker/trips"} variant="ai">{route ? "Review safety" : "Plan trip"}<ArrowRight className="size-4" /></Button>
        </div>
      </Card>

      <section aria-label="Quick actions" className="mt-6 grid gap-3 sm:grid-cols-3">
        <Button as={Link} className="justify-between rounded-2xl" size="lg" to="/hiker/trips" variant="secondary">Plan Trip<MapPinned className="size-4 text-ai-500" /></Button>
        <Button as={Link} className="justify-between rounded-2xl" size="lg" to="/hiker/risk-analysis" variant="secondary">Check Risk<Sparkles className="size-4 text-ai-500" /></Button>
        <Button as={Link} className="justify-between rounded-2xl" size="lg" to="/hiking" variant="secondary">Start Hiking<Compass className="size-4 text-safe-500" /></Button>
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-3">
        <Card className="h-full">
          <div className="flex items-start justify-between gap-4"><span className="grid size-11 place-items-center rounded-2xl bg-ai-100 text-ai-500"><MapPinned className="size-5" /></span>{risk && <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${riskTone[risk.riskLevel]}`}>{risk.riskLevel} · {risk.score}%</span>}</div>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-forest-800/38">Upcoming trip</p>
          <h3 className="mt-2 font-display text-2xl font-semibold text-forest-900">{route?.name || "No trip planned"}</h3>
          <p className="mt-2 text-sm text-forest-800/50">{route ? `${formatTripDate(state.trip.date, language)} · ${route.difficulty}` : "Create a trip to start your safety plan."}</p>
          <div className="mt-5 flex items-center gap-2 border-t border-forest-800/8 pt-4 text-sm font-semibold text-forest-900"><CheckCircle2 className={`size-4 ${preparationScore >= 80 ? "text-safe-500" : "text-warning-500"}`} />{preparationScore >= 80 ? "Prepared" : "Preparation incomplete"}</div>
        </Card>

        <Card className="h-full">
          <div className="flex items-start justify-between gap-4"><span className="grid size-11 place-items-center rounded-2xl bg-forest-100 text-forest-800"><Bluetooth className="size-5" /></span><span className="flex items-center gap-2 text-xs font-semibold text-safe-500"><span className="size-2 rounded-full bg-safe-500" />Connected</span></div>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-forest-800/38">Bracelet status</p>
          <h3 className="mt-2 font-display text-2xl font-semibold text-forest-900">Sensors ready</h3>
          <div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-sand-50 p-3"><p className="text-[0.6rem] font-bold uppercase tracking-wider text-forest-800/38">Battery</p><p className="mt-1 flex items-center gap-2 text-lg font-semibold text-forest-900"><BatteryMedium className="size-4 text-safe-500" />{bracelet.batteryLevel}%</p></div><div className="rounded-2xl bg-sand-50 p-3"><p className="text-[0.6rem] font-bold uppercase tracking-wider text-forest-800/38">GPS</p><p className="mt-1 text-sm font-semibold text-forest-900">Locked</p></div></div>
        </Card>

        <Card className="h-full">
          <div className="flex items-start justify-between gap-4"><span className="grid size-11 place-items-center rounded-2xl bg-emerald-50 text-safe-500"><ShieldCheck className="size-5" /></span><span className="font-display text-4xl font-semibold text-forest-900">{preparationScore}%</span></div>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-forest-800/38">Preparation score</p>
          <h3 className="mt-2 font-display text-2xl font-semibold text-forest-900">{preparationScore >= 80 ? "Ready for hiking" : "Finish your safety plan"}</h3>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-forest-100"><motion.div animate={{ width: `${preparationScore}%` }} className={`h-full rounded-full ${preparationScore >= 80 ? "bg-safe-500" : "bg-warning-500"}`} initial={false} /></div>
          <Button as={Link} className="mt-5 px-0" size="sm" to="/hiker/profile" variant="ghost">Review profile<ArrowRight className="size-4" /></Button>
        </Card>
      </section>
    </div>
  );
}
