import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, BrainCircuit, Mountain, Play, RadioTower, ShieldCheck, UserRound, Watch } from "lucide-react";
import { Link } from "react-router";
import Button from "../components/Button";
import Card from "../components/Card";
import { useI18n } from "../i18n/I18nContext";

export default function Landing() {
  const { t } = useI18n();
  const story = [
    { icon: UserRound, label: t("landing.hiker"), detail: t("landing.hikerDetail"), tone: "bg-forest-800" },
    { icon: Watch, label: t("landing.wearable"), detail: t("landing.wearableDetail"), tone: "bg-forest-700" },
    { icon: BrainCircuit, label: t("landing.ai"), detail: t("landing.aiDetail"), tone: "bg-ai-500" },
    { icon: RadioTower, label: t("landing.lora"), detail: t("landing.loraDetail"), tone: "bg-ai-500" },
    { icon: ShieldCheck, label: t("landing.rescue"), detail: t("landing.rescueDetail"), tone: "bg-emergency-500" },
  ];

  return (
    <div>
      <section className="relative overflow-hidden border-b border-forest-800/8">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_75%_18%,rgba(69,123,157,.16),transparent_28%),radial-gradient(circle_at_20%_70%,rgba(23,84,63,.12),transparent_34%)]" />
        <div className="tau-container relative grid min-h-[78vh] items-center gap-12 py-16 lg:grid-cols-[1.05fr_.95fr] lg:py-24">
          <div>
            <motion.div animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full border border-forest-800/10 bg-white/70 px-3.5 py-2 text-xs font-bold text-forest-800/60 shadow-sm backdrop-blur" initial={{ opacity: 0, y: 10 }}><span className="size-2 rounded-full bg-safe-500 shadow-[0_0_0_5px_rgba(46,139,87,.1)]" />{t("landing.eyebrow")}</motion.div>
            <motion.p animate={{ opacity: 1, y: 0 }} className="mt-8 font-display text-lg font-semibold tracking-[0.22em] text-forest-700 uppercase" initial={{ opacity: 0, y: 10 }} transition={{ delay: 0.08 }}>TauFind</motion.p>
            <motion.h1 animate={{ opacity: 1, y: 0 }} className="mt-3 max-w-3xl font-display text-5xl font-semibold leading-[.94] tracking-[-.06em] text-forest-950 sm:text-6xl md:text-8xl" initial={{ opacity: 0, y: 18 }} transition={{ delay: 0.14, duration: 0.6 }}>{t("landing.title")}</motion.h1>
            <motion.p animate={{ opacity: 1, y: 0 }} className="mt-7 max-w-2xl text-lg leading-8 text-forest-800/64" initial={{ opacity: 0, y: 14 }} transition={{ delay: 0.22 }}>{t("landing.description")}</motion.p>
            <motion.div animate={{ opacity: 1, y: 0 }} className="mt-9 flex flex-wrap gap-3" initial={{ opacity: 0, y: 12 }} transition={{ delay: 0.3 }}><Button as={Link} size="lg" to="/register">{t("landing.start")}<ArrowRight className="size-4" /></Button><Button as={Link} size="lg" to="/demo" variant="ai"><Play className="size-4 fill-current" />{t("landing.demo")}</Button></motion.div>
            <div className="mt-9 grid max-w-2xl gap-2 text-sm font-semibold text-forest-800/60 sm:grid-cols-3"><span>01 · {t("landing.detect")}</span><span>02 · {t("landing.communicate")}</span><span>03 · {t("landing.support")}</span></div>
          </div>

          <motion.div animate={{ opacity: 1, scale: 1 }} className="relative" initial={{ opacity: 0, scale: .97 }} transition={{ delay: .18, duration: .65 }}>
            <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-ai-500/14 to-forest-700/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-forest-950 p-6 text-white shadow-[0_35px_90px_-38px_rgba(7,31,23,.8)] sm:p-8">
              <div className="flex items-center justify-between"><div><p className="text-[.62rem] font-bold uppercase tracking-[.2em] text-emerald-200/50">{t("landing.liveLayer")}</p><p className="mt-2 font-display text-2xl font-semibold">{t("landing.kolsai")}</p></div><span className="rounded-full bg-safe-500/15 px-3 py-1.5 text-xs font-bold text-emerald-300">{t("landing.protected")}</span></div>
              <div className="relative mt-8 h-56 overflow-hidden rounded-2xl border border-white/8 bg-white/[.035]">
                <svg aria-hidden="true" className="absolute inset-0 size-full" preserveAspectRatio="none" viewBox="0 0 500 220"><path d="M-20 204 C92 158 130 192 224 112 S352 74 520 18" fill="none" stroke="#244f44" strokeWidth="54" /><path d="M-20 204 C92 158 130 192 224 112 S352 74 520 18" fill="none" stroke="#70a696" strokeDasharray="5 9" strokeWidth="2" /></svg>
                <motion.div animate={{ x: [0, 155, 255], y: [0, -42, -102] }} className="absolute bottom-9 left-12 grid size-11 place-items-center rounded-full bg-ai-500 shadow-[0_0_0_8px_rgba(69,123,157,.15)]" transition={{ duration: 7, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}><Mountain className="size-5" /></motion.div>
                <div className="absolute bottom-4 right-4 rounded-xl border border-white/8 bg-forest-950/80 px-3 py-2 text-right backdrop-blur"><p className="text-[.58rem] uppercase tracking-wider text-emerald-100/40">{t("landing.offlineProtection")}</p><p className="mt-1 text-xs font-bold text-emerald-300">{t("landing.loraActive")}</p></div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">{[[t("landing.risk"), "28%"], [t("landing.bracelet"), t("landing.protected")], [t("landing.battery"), "86%"]].map(([label, value]) => <div className="rounded-xl border border-white/8 bg-white/[.04] p-3" key={label}><p className="text-[.62rem] text-emerald-100/40">{label}</p><p className="mt-1 text-sm font-semibold">{value}</p></div>)}</div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="tau-container scroll-mt-24 py-16 md:py-24" id="how-it-works">
        <div className="mx-auto max-w-3xl text-center"><p className="text-xs font-bold uppercase tracking-[.2em] text-ai-500">{t("landing.storyEyebrow")}</p><h2 className="mt-4 font-display text-3xl font-semibold tracking-tight md:text-5xl">{t("landing.storyTitle")}</h2></div>
        <div className="relative mt-12 grid gap-3 sm:grid-cols-5">
          <div aria-hidden="true" className="absolute left-[8%] right-[8%] top-7 hidden h-px bg-gradient-to-r from-forest-700 via-ai-500 to-emergency-500 sm:block" />
          {story.map(({ detail, icon: Icon, label, tone }, index) => <motion.div initial={{ opacity: 0, y: 14 }} key={label} transition={{ delay: index * .09 }} viewport={{ once: true, amount: .5 }} whileInView={{ opacity: 1, y: 0 }}><div className="relative z-10 flex items-center gap-4 rounded-2xl border border-forest-800/10 bg-white/75 p-4 shadow-card sm:flex-col sm:bg-transparent sm:p-0 sm:text-center sm:shadow-none"><span className={`grid size-14 shrink-0 place-items-center rounded-2xl ${tone} text-white shadow-lg ring-8 ring-sand-100`}><Icon className="size-6" /></span><div className="sm:mt-4"><p className="text-sm font-bold">{label}</p><p className="mt-1 text-xs text-forest-800/48">{detail}</p></div>{index < story.length - 1 && <ArrowDown className="ml-auto size-4 text-forest-800/25 sm:hidden" />}</div></motion.div>)}
        </div>
      </section>

      <section className="border-y border-forest-800/8 bg-white/55" id="technology"><div className="tau-container grid gap-5 py-16 md:grid-cols-[.8fr_1.2fr] md:py-20"><Card className="bg-forest-950 text-white" variant="dark"><BrainCircuit className="size-7 text-sky-300" /><h2 className="mt-8 font-display text-3xl font-semibold">{t("landing.preventionTitle")}</h2><p className="mt-4 text-sm leading-7 text-emerald-100/55">{t("landing.preventionBody")}</p></Card><div className="grid gap-4 sm:grid-cols-3">{[[t("landing.detect"), "AI", t("landing.explainable")], [t("landing.communicate"), "LoRa", t("landing.offline")], [t("landing.support"), t("landing.rescue"), t("landing.context")]].map(([title, label, stat]) => <Card className="h-full" key={title}><p className="text-xs font-bold uppercase tracking-wider text-ai-500">{label}</p><p className="mt-6 font-display text-3xl font-semibold">{stat}</p><p className="mt-3 text-sm leading-6 text-forest-800/52">{title}</p></Card>)}</div></div></section>

      <section className="tau-container py-16 text-center md:py-24" id="faq"><p className="text-xs font-bold uppercase tracking-[.2em] text-ai-500">{t("landing.safetyLabel")}</p><h2 className="mx-auto mt-4 max-w-3xl font-display text-4xl font-semibold tracking-tight md:text-6xl">{t("landing.finalTitle")}</h2><div className="mt-8 flex flex-wrap justify-center gap-3"><Button as={Link} size="lg" to="/register">{t("landing.start")}</Button><Button as={Link} size="lg" to="/profile" variant="secondary">{t("landing.existingSetup")}</Button></div></section>
    </div>
  );
}
