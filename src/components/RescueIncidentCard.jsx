import { ArrowRight, Clock, MapPin, ShieldAlert } from "lucide-react";
import { Link } from "react-router";
import Button from "./Button";
import RescuePanel from "./RescuePanel";

export default function RescueIncidentCard({ incident }) {
  return (
    <RescuePanel className="overflow-hidden">
      <div className="flex flex-col justify-between gap-5 border-b border-white/8 bg-emergency-500/8 p-5 md:flex-row md:items-center md:p-6">
        <div className="flex items-center gap-4"><span className="grid size-12 place-items-center rounded-2xl bg-emergency-500 text-white shadow-lg shadow-emergency-500/20"><ShieldAlert /></span><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-red-300">Incident #{incident.id}</p><h2 className="mt-1 font-display text-2xl font-semibold">{incident.status}</h2></div></div>
        <span className="w-fit rounded-full border border-emergency-500/30 bg-emergency-500/12 px-3 py-1.5 text-xs font-bold text-red-300">{incident.priority} PRIORITY</span>
      </div>
      <div className="grid gap-6 p-5 md:grid-cols-[1fr_auto] md:items-end md:p-6">
        <div className="grid gap-5 sm:grid-cols-3"><div><p className="text-xs text-ops-100/42">Location</p><p className="mt-1 flex items-center gap-1.5 text-sm font-semibold"><MapPin className="size-4 text-ai-500" />{incident.route}</p></div><div><p className="text-xs text-ops-100/42">Possible cause</p><p className="mt-1 text-sm font-semibold">{incident.cause}</p></div><div><p className="text-xs text-ops-100/42">Received</p><p className="mt-1 flex items-center gap-1.5 text-sm font-semibold"><Clock className="size-4 text-ai-500" />{incident.receivedAt}</p></div></div>
        <Button as={Link} to={`/rescue/incidents/${incident.id}`}>Open incident<ArrowRight className="size-4" /></Button>
      </div>
    </RescuePanel>
  );
}
