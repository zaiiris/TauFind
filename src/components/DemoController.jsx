import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Pause, Play, RotateCcw, SkipForward, X } from "lucide-react";
import { useNavigate } from "react-router";
import { useTauFind } from "../context/TauFindContext";
import { demoScenario, getDemoStage } from "../data/demoScenario";
import Button from "./Button";

export default function DemoController() {
  const navigate = useNavigate();
  const { endDemoPresentation, state, updateDemoPresentation, updateEmergency, updateHiking, updateSafety } = useTauFind();
  const demo = state.demoPresentation;
  const stage = getDemoStage(demo.stageIndex);
  const lastStage = demo.stageIndex === demoScenario.stages.length - 1;

  useEffect(() => {
    if (!demo.active) return;
    updateHiking({ active: true, ...stage.hiking });
    updateSafety(stage.safety);
    updateEmergency(stage.emergency);
    navigate(stage.route);
  }, [demo.active, demo.stageIndex, navigate, stage, updateEmergency, updateHiking, updateSafety]);

  useEffect(() => {
    if (!demo.active || !demo.playing) return undefined;
    if (lastStage) {
      const timer = window.setTimeout(() => updateDemoPresentation({ playing: false, completed: true }), stage.duration);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setTimeout(() => updateDemoPresentation((current) => ({ stageIndex: current.stageIndex + 1 })), stage.duration);
    return () => window.clearTimeout(timer);
  }, [demo.active, demo.playing, lastStage, stage.duration, updateDemoPresentation]);

  if (!demo.active) return null;

  const restart = () => updateDemoPresentation({ active: true, playing: true, stageIndex: 0, completed: false });
  const togglePlayback = () => demo.completed ? restart() : updateDemoPresentation({ playing: !demo.playing, completed: false });
  const next = () => updateDemoPresentation({ stageIndex: Math.min(demo.stageIndex + 1, demoScenario.stages.length - 1), playing: false, completed: lastStage });

  return (
    <AnimatePresence>
      <motion.aside animate={{ opacity: 1, y: 0 }} aria-label="TauFind guided demo controls" className="fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/12 bg-forest-950/95 text-white shadow-[0_24px_80px_-24px_rgba(7,31,23,.75)] backdrop-blur-xl md:bottom-5" initial={{ opacity: 0, y: 18 }}>
        <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:gap-5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.17em] text-emerald-200/55"><span className="size-1.5 rounded-full bg-emerald-300" />Guided hackathon demo</div>
            <p className="mt-1 truncate font-display text-base font-semibold md:text-lg">Stage {demo.stageIndex + 1}/{demoScenario.stages.length}: {stage.title}</p>
            <p className="mt-0.5 hidden truncate text-xs text-emerald-100/45 sm:block">{stage.description}</p>
          </div>

          <div className="flex items-center gap-2">
            <Button aria-label={demo.playing ? "Pause demo" : "Start demo"} onClick={togglePlayback} size="sm" variant="ai">{demo.playing ? <Pause className="size-4" /> : <Play className="size-4" />}{demo.playing ? "Pause" : demo.completed ? "Replay" : "Start Demo"}</Button>
            <Button aria-label="Next demo stage" disabled={lastStage} onClick={next} size="sm" variant="secondary"><SkipForward className="size-4" /><span className="hidden sm:inline">Next</span></Button>
            <button aria-label="Restart demo" className="grid size-9 place-items-center rounded-full bg-white/8 text-white/70 transition hover:bg-white/14 hover:text-white" onClick={restart} type="button"><RotateCcw className="size-4" /></button>
            <button aria-label="Close demo" className="grid size-9 place-items-center rounded-full bg-white/8 text-white/70 transition hover:bg-white/14 hover:text-white" onClick={endDemoPresentation} type="button"><X className="size-4" /></button>
          </div>
        </div>

        <div className="border-t border-white/8 px-4 py-3">
          <div className="flex items-center gap-1.5">
            {demoScenario.stages.map((item, index) => {
              const complete = index < demo.stageIndex;
              const current = index === demo.stageIndex;
              return (
                <button aria-label={`Go to stage ${index + 1}: ${item.title}`} className="group min-w-0 flex-1 text-left" key={item.id} onClick={() => updateDemoPresentation({ stageIndex: index, playing: false, completed: false })} type="button">
                  <span className={`grid h-1.5 w-full place-items-center rounded-full transition ${complete ? "bg-emerald-300" : current ? "bg-ai-500" : "bg-white/12"}`}>{complete && <Check className="hidden size-2 text-forest-950" />}</span>
                  <span className={`mt-1.5 hidden truncate text-[0.55rem] font-semibold md:block ${current ? "text-white" : "text-emerald-100/35"}`}>{item.shortTitle}</span>
                </button>
              );
            })}
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
