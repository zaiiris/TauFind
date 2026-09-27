import { BrainCircuit, Check, ShieldCheck } from "lucide-react";
import RescuePanel from "./RescuePanel";

export default function RescueRecommendation({ incident }) {
  return (
    <RescuePanel className="overflow-hidden">
      <div className="border-b border-white/8 bg-ai-500/10 p-5 md:p-6">
        <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-ai-500 text-white"><BrainCircuit className="size-5" /></span><div><p className="text-xs font-bold uppercase tracking-wider text-ai-500">AI decision support</p><h2 className="font-display text-xl font-semibold">Rescue recommendation</h2></div></div>
      </div>
      <div className="space-y-5 p-5 md:p-6">
        <div className="flex items-center justify-between"><span className="text-sm text-ops-100/55">Priority</span><span className="rounded-full bg-emergency-500/15 px-3 py-1 text-xs font-bold text-red-300">{incident.priority}</span></div>
        <div className="space-y-2">
          {incident.factors.slice(0, 4).map((factor) => <div className="flex gap-2 text-sm text-ops-100/78" key={factor}><Check className="mt-0.5 size-4 shrink-0 text-ai-500" /><span>{factor}</span></div>)}
        </div>
        <div className="rounded-xl border border-emergency-500/20 bg-emergency-500/8 p-4"><p className="text-xs font-bold uppercase tracking-wider text-red-300">Suggested action</p><p className="mt-1 font-display text-lg font-semibold">{incident.recommendation}</p></div>
        <p className="flex gap-2 text-xs leading-5 text-ops-100/45"><ShieldCheck className="mt-0.5 size-4 shrink-0" />TauFind provides explainable decision support. Dispatch decisions remain under trained rescue operator control.</p>
      </div>
    </RescuePanel>
  );
}
