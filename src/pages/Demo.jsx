import { motion } from "framer-motion";
import { Activity, ArrowRight, BrainCircuit, Play, RadioTower, ShieldAlert, ShieldCheck, Watch } from "lucide-react";
import { useNavigate } from "react-router";
import Button from "../components/Button";
import Card from "../components/Card";
import { useTauFind } from "../context/TauFindContext";
import { useI18n } from "../i18n/I18nContext";

export default function Demo() {
  const navigate = useNavigate();
  const { loadDemoScenario, updateDemoPresentation } = useTauFind();
  const { t } = useI18n();
  const chapters = [
    [Activity, t("demo.problem"), t("demo.problemDetail")],
    [BrainCircuit, t("demo.risk"), t("demo.riskDetail")],
    [Watch, t("demo.bracelet"), t("demo.braceletDetail")],
    [ShieldAlert, t("demo.emergency"), t("demo.emergencyDetail")],
    [RadioTower, t("demo.lora"), t("demo.loraDetail")],
    [ShieldCheck, t("demo.rescue"), t("demo.rescueDetail")],
  ];

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
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-ai-500">{t("demo.eyebrow")}</p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl font-semibold tracking-[-0.05em] text-forest-900 md:text-7xl">{t("demo.title")}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-forest-800/62">{t("demo.description")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={runGuidedDemo} size="lg" variant="ai"><Play className="size-4 fill-current" />{t("demo.start")}</Button>
            <Button onClick={runPreparationDemo} size="lg" variant="secondary">{t("demo.preparation")}<ArrowRight className="size-4" /></Button>
          </div>
          <p className="mt-5 text-xs text-forest-800/42">{t("demo.disclaimer")}</p>
        </div>

        <Card className="overflow-hidden" padding="p-4 sm:p-5">
          <div className="rounded-[1rem] bg-forest-900 p-6 text-white sm:p-7">
            <div className="flex items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.17em] text-emerald-200/55">{t("demo.scenario")}</p><h2 className="mt-2 font-display text-2xl font-semibold">{t("demo.scenarioName")}</h2></div><span className="rounded-full bg-emergency-500 px-3 py-1.5 text-xs font-bold">{t("demo.stages")}</span></div>
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
