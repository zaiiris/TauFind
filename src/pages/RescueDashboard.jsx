import { Activity, RadioTower, ShieldCheck } from "lucide-react";
import { Link } from "react-router";
import Button from "../components/Button";
import RescueFrame from "../components/RescueFrame";
import RescueIncidentCard from "../components/RescueIncidentCard";
import RescueMapCanvas from "../components/RescueMapCanvas";
import RescuePanel from "../components/RescuePanel";
import RescueRecommendation from "../components/RescueRecommendation";
import { useTauFind } from "../context/TauFindContext";
import { getRescueIncident } from "../data/rescueIncident";

const StatusCard = ({ icon: Icon, label, value, detail, tone = "text-ai-500" }) => <RescuePanel className="p-5"><Icon className={`size-5 ${tone}`} /><p className="mt-5 text-xs text-ops-100/42">{label}</p><p className="mt-1 font-display text-2xl font-semibold">{value}</p><p className="mt-1 text-xs text-ops-100/45">{detail}</p></RescuePanel>;

export default function RescueDashboard() {
  const { state } = useTauFind();
  const incident = getRescueIncident(state);

  return (
    <RescueFrame description="Receive offline emergency packets, assess evidence, and coordinate a human-led response from one operational view." title="Rescue command center">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatusCard detail={incident.active ? "Immediate operator review" : "No confirmed emergencies"} icon={Activity} label="Active incidents" tone={incident.active ? "text-red-300" : "text-green-300"} value={incident.active ? "1" : "0"} />
        <StatusCard detail="Mountain relay network" icon={RadioTower} label="LoRa status" value={incident.signal.received ? "Received" : "Monitoring"} />
        <StatusCard detail="Team and station available" icon={ShieldCheck} label="Response readiness" tone="text-green-300" value="Ready" />
      </div>

      <div className="mt-6">
        {incident.active ? <RescueIncidentCard incident={incident} /> : <RescuePanel className="p-8 text-center md:p-12"><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-safe-500/12 text-green-300"><ShieldCheck /></span><h2 className="mt-5 font-display text-2xl font-semibold">All monitored hikers are stable</h2><p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-ops-100/55">The command center will create an incident automatically when the existing TauFind emergency workflow confirms danger.</p><Button as={Link} className="mt-6" to="/demo">Watch emergency demo</Button></RescuePanel>}
      </div>

      {incident.active && <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]"><RescueMapCanvas compact /><RescueRecommendation incident={incident} /></div>}
    </RescueFrame>
  );
}
