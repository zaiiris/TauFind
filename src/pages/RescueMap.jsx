import { Crosshair, MapPin, RadioTower, Truck } from "lucide-react";
import RescueFrame from "../components/RescueFrame";
import RescueMapCanvas from "../components/RescueMapCanvas";
import RescuePanel from "../components/RescuePanel";
import { useTauFind } from "../context/TauFindContext";
import { getRescueIncident } from "../data/rescueIncident";

const Legend = ({ icon: Icon, label, value }) => <div className="flex items-center gap-3 rounded-xl border border-white/8 p-3"><span className="grid size-9 place-items-center rounded-lg bg-white/5 text-ai-500"><Icon className="size-4" /></span><div><p className="text-xs text-ops-100/40">{label}</p><p className="text-sm font-semibold">{value}</p></div></div>;

export default function RescueMap() {
  const { state } = useTauFind();
  const incident = getRescueIncident(state);
  return (
    <RescueFrame description="A simulated operational map for visualizing the last known signal and coordinating the search area without external map services." title="Rescue map">
      <div className="grid gap-6 xl:grid-cols-[1fr_20rem]">
        <RescueMapCanvas />
        <RescuePanel className="h-fit p-5"><p className="text-xs font-bold uppercase tracking-wider text-ai-500">Operational layers</p><div className="mt-5 space-y-3"><Legend icon={MapPin} label="Tourist position" value={incident.active ? incident.route : "No active target"} /><Legend icon={Crosshair} label="Last signal point" value="43.0632° N, 78.9851° E" /><Legend icon={RadioTower} label="Mountain station" value="Relay KZ-04" /><Legend icon={Truck} label="Rescue team" value="Station Alpha" /></div><div className="mt-5 rounded-xl bg-emergency-500/8 p-4"><p className="text-xs text-red-300">Search radius</p><p className="mt-1 font-display text-2xl font-semibold">450 m</p><p className="mt-1 text-xs leading-5 text-ops-100/45">Calculated from the last confirmed LoRa packet.</p></div></RescuePanel>
      </div>
    </RescueFrame>
  );
}
