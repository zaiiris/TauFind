import { Archive, ShieldAlert } from "lucide-react";
import RescueFrame from "../components/RescueFrame";
import RescueIncidentCard from "../components/RescueIncidentCard";
import RescuePanel from "../components/RescuePanel";
import { useTauFind } from "../context/TauFindContext";
import { getRescueIncident } from "../data/rescueIncident";

export default function RescueIncidents() {
  const { state } = useTauFind();
  const incident = getRescueIncident(state);
  return (
    <RescueFrame description="A focused queue of verified emergency packets received by the rescue workspace." title="Incident queue">
      <div className="mb-5 flex items-center justify-between"><p className="text-sm text-ops-100/55">{incident.active ? "1 active incident" : "No active incidents"}</p><span className="rounded-full border border-white/10 px-3 py-1 text-xs text-ops-100/50">Live queue</span></div>
      {incident.active ? <RescueIncidentCard incident={incident} /> : <RescuePanel className="p-10 text-center"><Archive className="mx-auto size-8 text-ops-100/30" /><h2 className="mt-4 font-display text-xl font-semibold">Queue clear</h2><p className="mt-2 text-sm text-ops-100/50">Verified incidents will appear here automatically.</p></RescuePanel>}
      <RescuePanel className="mt-6 p-5"><div className="flex items-start gap-3"><ShieldAlert className="mt-0.5 size-5 text-ai-500" /><div><p className="text-sm font-semibold">Verification before dispatch</p><p className="mt-1 text-xs leading-5 text-ops-100/48">Every entry is backed by the existing deterministic emergency engine and sensor evidence—not a random alert.</p></div></div></RescuePanel>
    </RescueFrame>
  );
}
