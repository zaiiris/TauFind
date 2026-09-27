import { Battery, Clock, ContactRound, HeartPulse, MapPin, Mountain, RadioTower, Thermometer, UserRound } from "lucide-react";
import { Navigate, useParams } from "react-router";
import RescueFrame from "../components/RescueFrame";
import RescueOperationTracker from "../components/RescueOperationTracker";
import RescuePanel from "../components/RescuePanel";
import RescueRecommendation from "../components/RescueRecommendation";
import { useTauFind } from "../context/TauFindContext";
import { getRescueIncident } from "../data/rescueIncident";

const Datum = ({ icon: Icon, label, value }) => <div className="rounded-xl border border-white/8 bg-white/[0.025] p-4"><Icon className="size-5 text-ai-500" /><p className="mt-4 text-xs text-ops-100/42">{label}</p><p className="mt-1 text-sm font-semibold text-white">{value}</p></div>;

export default function RescueIncidentDetails() {
  const { id } = useParams();
  const { state } = useTauFind();
  const incident = getRescueIncident(state);
  if (!incident.active || id !== incident.id) return <Navigate replace to="/rescue/incidents" />;

  return (
    <RescueFrame description="Sensor evidence, location intelligence, and response guidance for the active case." eyebrow={`Incident #${incident.id}`} title="Emergency case view">
      <div className="grid gap-6 xl:grid-cols-[1fr_0.7fr]">
        <div className="space-y-6">
          <RescuePanel className="p-5 md:p-6"><div className="flex flex-wrap justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-wider text-red-300">{incident.status}</p><h2 className="mt-2 font-display text-2xl font-semibold">{incident.cause}</h2></div><div className="text-right"><p className="text-xs text-ops-100/42">Emergency confidence</p><p className="font-display text-3xl font-semibold text-red-300">{incident.confidence}%</p></div></div><div className="mt-6 grid gap-3 sm:grid-cols-3"><Datum icon={ShieldIcon} label="Incident ID" value={incident.incidentId} /><Datum icon={Clock} label="Received" value={incident.receivedAt} /><Datum icon={RadioTower} label="Priority" value={incident.priority} /></div></RescuePanel>

          <RescuePanel className="p-5 md:p-6"><h2 className="font-display text-xl font-semibold">Tourist information</h2><div className="mt-5 grid gap-3 sm:grid-cols-3"><Datum icon={UserRound} label="Name" value={incident.tourist.name} /><Datum icon={Mountain} label="Experience" value={incident.tourist.experience} /><Datum icon={ContactRound} label="Emergency contact" value={incident.tourist.emergencyContactAvailable ? "Available" : "Not provided"} /></div></RescuePanel>

          <RescuePanel className="p-5 md:p-6"><h2 className="font-display text-xl font-semibold">Location & condition</h2><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Datum icon={MapPin} label="Last signal" value={incident.route} /><Datum icon={Mountain} label="Altitude" value={`${incident.condition.altitude} m`} /><Datum icon={HeartPulse} label="Heart rate" value={`${incident.condition.heartRate} bpm`} /><Datum icon={Thermometer} label="Temperature" value={`${incident.condition.temperature}°C`} /><Datum icon={UserRound} label="Movement" value={incident.condition.movementStatus} /><Datum icon={Battery} label="Bracelet battery" value={`${incident.condition.battery}%`} /><Datum icon={RadioTower} label="LoRa connection" value={incident.condition.lora} /><Datum icon={Mountain} label="Route" value={incident.route} /></div></RescuePanel>
        </div>
        <RescueRecommendation incident={incident} />
      </div>
      <div className="mt-6"><RescueOperationTracker incidentId={incident.incidentId} /></div>
    </RescueFrame>
  );
}

function ShieldIcon(props) {
  return <RadioTower {...props} />;
}
