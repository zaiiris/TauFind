import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, Mountain, Play, RadioTower, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router";
import Button from "../components/Button";
import Card from "../components/Card";
import { useTauFind } from "../context/TauFindContext";
import { demoScenario } from "../data/demoScenario";

const chapters = [
  [Mountain, "Safe hiking", "Bracelet connected and sensors normal"],
  [BrainCircuit, "AI detection", "Risk rises before a manual SOS"],
  [RadioTower, "Offline relay", "Emergency context travels through LoRa"],
  [ShieldCheck, "Rescue response", "Operators receive an actionable incident"],
];

export default function Demo() {
  const navigate = useNavigate();
  const { loadDemoScenario, updateDemoPresentation } = useTauFind();

  const runGuidedDemo = () => {
    loadDemoScenario();
    updateDemoPresentation({ active: true, playing: true, stageIndex: 0, completed: false });
    navigate("/hiking");
  };

  const runPreparationDemo = () => {
    loadDemoScenario();
    navigate("/prepare");
  };

  return (
    <section className="tau-container py-14 md:py-20">
      <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-ai-500">Two-minute product story</p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl font-semibold tracking-[-0.05em] text-forest-900 md:text-7xl">Watch TauFind act before SOS.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-forest-800/62">Follow one mountain incident from safe hiking to explainable AI verification, offline rescue transmission, and operator response.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={runGuidedDemo} size="lg" variant="ai"><Play className="size-4 fill-current" />Start guided demo</Button>
            <Button onClick={runPreparationDemo} size="lg" variant="secondary">Explore preparation flow<ArrowRight className="size-4" /></Button>
          </div>
          <p className="mt-5 text-xs text-forest-800/42">Simulation only. No real hardware, network, or rescue service is connected.</p>
        </div>

        <Card className="overflow-hidden" padding="p-4 sm:p-5">
          <div className="rounded-[1rem] bg-forest-900 p-6 text-white sm:p-7">
            <div className="flex items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.17em] text-emerald-200/55">Scenario</p><h2 className="mt-2 font-display text-2xl font-semibold">{demoScenario.name}</h2></div><span className="rounded-full bg-emergency-500 px-3 py-1.5 text-xs font-bold">7 stages</span></div>
            <div className="mt-7 space-y-3">
              {chapters.map(([Icon, title, description], index) => (
                <motion.div animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4 rounded-2xl border border-white/8 bg-white/[0.055] p-3.5" initial={{ opacity: 0, x: 10 }} key={title} transition={{ delay: index * 0.08 }}>
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/8 text-emerald-200"><Icon className="size-4" /></span>
                  <div><p className="text-sm font-semibold">{title}</p><p className="mt-0.5 text-xs text-emerald-100/42">{description}</p></div>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
