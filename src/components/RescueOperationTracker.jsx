import { Check, ChevronRight, RotateCcw } from "lucide-react";
import Button from "./Button";
import RescuePanel from "./RescuePanel";
import { useTauFind } from "../context/TauFindContext";

const stages = ["Preparing team", "Moving to location", "Searching area", "Victim found", "Completed"];

export default function RescueOperationTracker({ incidentId }) {
  const { state, updateRescueOperation } = useTauFind();
  const currentStage = state.rescueOperation.stage;
  const advance = () => updateRescueOperation({ incidentId, stage: Math.min(currentStage + 1, stages.length - 1) });
  const reset = () => updateRescueOperation({ incidentId, stage: 0 });

  return (
    <RescuePanel className="p-5 md:p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-ai-500">Live operation</p><h2 className="mt-1 font-display text-xl font-semibold">Response status</h2></div><span className="rounded-full border border-white/10 px-3 py-1 text-xs text-ops-100/60">Incident {incidentId}</span></div>
      <div className="grid gap-2 md:grid-cols-5">
        {stages.map((stage, index) => {
          const complete = index < currentStage;
          const active = index === currentStage;
          return <div className="flex items-center gap-2 md:block" key={stage}><div className={`grid size-8 shrink-0 place-items-center rounded-full border text-xs font-bold ${complete ? "border-safe-500 bg-safe-500 text-white" : active ? "border-ai-500 bg-ai-500/15 text-blue-200" : "border-white/10 text-ops-100/35"}`}>{complete ? <Check className="size-4" /> : index + 1}</div><p className={`mt-2 text-xs font-semibold ${active ? "text-white" : "text-ops-100/45"}`}>{stage}</p>{index < stages.length - 1 && <ChevronRight className="hidden size-4 text-white/15 md:absolute" />}</div>;
        })}
      </div>
      <div className="mt-7 flex flex-wrap gap-3"><Button disabled={currentStage === stages.length - 1} onClick={advance}>Advance operation</Button><Button onClick={reset} variant="secondary"><RotateCcw className="size-4" />Reset demo</Button></div>
    </RescuePanel>
  );
}
