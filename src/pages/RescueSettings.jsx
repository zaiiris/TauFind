import { BellRing, Languages, RadioTower, ShieldCheck } from "lucide-react";
import RescueFrame from "../components/RescueFrame";
import RescuePanel from "../components/RescuePanel";

const Setting = ({ icon: Icon, label, value }) => <div className="flex items-center justify-between gap-4 border-b border-white/8 py-4 last:border-0"><div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-lg bg-white/5 text-ai-500"><Icon className="size-4" /></span><span className="text-sm font-semibold">{label}</span></div><span className="text-xs font-bold uppercase tracking-wider text-green-300">{value}</span></div>;

export default function RescueSettings() {
  return (
    <RescueFrame description="Workspace preferences for the hackathon rescue simulation." title="Command settings">
      <RescuePanel className="max-w-2xl p-5 md:p-6"><Setting icon={BellRing} label="Critical incident alerts" value="Enabled" /><Setting icon={RadioTower} label="LoRa packet monitoring" value="Enabled" /><Setting icon={ShieldCheck} label="Human dispatch confirmation" value="Required" /><Setting icon={Languages} label="Workspace language" value="English" /></RescuePanel>
    </RescueFrame>
  );
}
