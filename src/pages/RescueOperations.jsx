import { ShieldCheck } from "lucide-react";
import RescueFrame from "../components/RescueFrame";
import RescueOperationTracker from "../components/RescueOperationTracker";
import RescuePanel from "../components/RescuePanel";
import { useTauFind } from "../context/TauFindContext";
import { getRescueIncident } from "../data/rescueIncident";

export default function RescueOperations() {
  const { state } = useTauFind();
  const incident = getRescueIncident(state);
  return (
    <RescueFrame description="Update the simulated field response so judges can follow the incident from dispatch through completion." title="Rescue operations">
      {incident.active ? <RescueOperationTracker incidentId={incident.incidentId} /> : <RescuePanel className="p-10 text-center"><ShieldCheck className="mx-auto size-9 text-green-300" /><h2 className="mt-4 font-display text-xl font-semibold">No operation in progress</h2><p className="mt-2 text-sm text-ops-100/50">A response tracker will open when an emergency packet is received.</p></RescuePanel>}
    </RescueFrame>
  );
}
