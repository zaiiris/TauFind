import { ArrowRight, Clock3 } from "lucide-react";
import { Link } from "react-router";
import Button from "../components/Button";
import Card from "../components/Card";

export default function RolePlaceholder({ icon: Icon, purpose, role, title }) {
  const isRescue = role === "Rescue Team";

  return (
    <section className="tau-container flex min-h-[calc(100vh-4.5rem)] items-center py-14 md:py-20">
      <Card className="relative w-full overflow-hidden" padding="p-7 md:p-12">
        <div aria-hidden="true" className={`absolute -right-20 -top-24 size-72 rounded-full blur-3xl ${isRescue ? "bg-emergency-500/8" : "bg-ai-500/9"}`} />
        <div className="relative grid gap-10 lg:grid-cols-[1fr_0.55fr] lg:items-end">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`grid size-12 place-items-center rounded-2xl text-white shadow-lg ${isRescue ? "bg-emergency-500 shadow-emergency-500/15" : "bg-forest-800 shadow-forest-900/15"}`}><Icon className="size-5" /></span>
              <span className="rounded-full bg-forest-100 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-forest-800">{role} workspace</span>
            </div>
            <h1 className="mt-8 font-display text-4xl font-semibold tracking-[-0.04em] text-forest-900 md:text-6xl">{title}</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-forest-800/60 md:text-lg">{purpose}</p>
          </div>
          <div className="rounded-3xl border border-forest-800/8 bg-sand-50/72 p-5">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-ai-500"><Clock3 className="size-4" />Coming soon</span>
            <p className="mt-3 text-sm leading-6 text-forest-800/52">This route is prepared for the next platform phase. Existing TauFind MVP features remain available through the current demo.</p>
            <Button as={Link} className="mt-5" size="sm" to="/demo" variant="secondary">Watch working demo<ArrowRight className="size-4" /></Button>
          </div>
        </div>
      </Card>
    </section>
  );
}
