import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  Play,
  RadioTower,
  ShieldPlus,
  UserRound,
  Watch,
} from "lucide-react";
import { Link } from "react-router";
import Button from "../components/Button";
import Card from "../components/Card";

const networkSteps = [
  { icon: UserRound, label: "Hiker", detail: "On the trail" },
  { icon: Watch, label: "Bracelet", detail: "Detects change" },
  { icon: RadioTower, label: "LoRa", detail: "Relays offline" },
  { icon: ShieldPlus, label: "Rescue", detail: "Acts with context" },
];

const predictionSignals = [
  ["Movement", "Fall and inactivity"],
  ["Health", "Heart-rate patterns"],
  ["Environment", "Altitude and weather"],
  ["Route", "Difficulty and coverage"],
];

export default function Landing() {
  return (
    <div className="tau-container py-14 md:py-20 lg:py-24">
      <section className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
        <div>
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-forest-800/10 bg-white/58 px-3 py-1.5 text-xs font-semibold text-forest-800/65 backdrop-blur"
            initial={{ opacity: 0, y: 8 }}
            transition={{ delay: 0.08 }}
          >
            <span className="size-1.5 rounded-full bg-safe-500 shadow-[0_0_0_4px_rgba(46,139,87,0.12)]" />
            AI-powered safety beyond mobile coverage
          </motion.div>

          <motion.h1
            animate={{ opacity: 1, y: 0 }}
            className="mt-7 max-w-3xl font-display text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-forest-900 sm:text-6xl md:text-7xl"
            initial={{ opacity: 0, y: 16 }}
            transition={{ delay: 0.14, duration: 0.55 }}
          >
            Safety before <span className="text-ai-500">SOS.</span>
          </motion.h1>

          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="mt-7 max-w-xl text-lg leading-8 text-forest-800/65"
            initial={{ opacity: 0, y: 14 }}
            transition={{ delay: 0.22, duration: 0.5 }}
          >
            TauFind predicts mountain risk before departure, monitors the hiker through a smart bracelet, and relays critical context to rescue teams when cellular signal disappears.
          </motion.p>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mt-9 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 12 }}
            transition={{ delay: 0.3 }}
          >
            <Button as={Link} size="lg" to="/register">
              Get Started
              <ArrowRight aria-hidden="true" className="size-4" />
            </Button>
            <Button as={Link} size="lg" to="/demo" variant="ai">
              <Play aria-hidden="true" className="size-4 fill-current" />
              Watch Demo
            </Button>
            <Button as={Link} size="lg" to="/profile" variant="secondary">
              Existing safety setup
            </Button>
          </motion.div>

          <motion.div
            animate={{ opacity: 1 }}
            className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-forest-800/48"
            initial={{ opacity: 0 }}
            transition={{ delay: 0.42 }}
          >
            <span className="inline-flex items-center gap-2"><Activity className="size-4 text-safe-500" />Prevention first</span>
            <span className="inline-flex items-center gap-2"><RadioTower className="size-4 text-ai-500" />Offline-ready relay</span>
            <span className="inline-flex items-center gap-2"><ShieldPlus className="size-4 text-emergency-500" />Faster rescue context</span>
          </motion.div>
        </div>

        <Card className="relative overflow-hidden" padding="p-4 sm:p-6">
          <div className="relative overflow-hidden rounded-[1rem] bg-forest-900 p-6 text-white sm:p-8">
            <div aria-hidden="true" className="absolute -right-16 -top-20 size-56 rounded-full bg-ai-500/18 blur-3xl" />
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-emerald-200/65">Emergency path</p>
                <p className="mt-2 font-display text-2xl font-semibold">Connected without coverage</p>
              </div>
              <span className="rounded-full border border-white/10 bg-white/7 px-3 py-1.5 text-xs text-emerald-100">LoRa ready</span>
            </div>

            <div className="relative mt-10 grid grid-cols-4 gap-2">
              <motion.div
                animate={{ scaleX: 1 }}
                aria-hidden="true"
                className="absolute left-[11%] right-[11%] top-6 h-px origin-left bg-gradient-to-r from-safe-500 via-ai-500 to-emergency-500"
                initial={{ scaleX: 0 }}
                transition={{ delay: 0.45, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              />
              {networkSteps.map(({ detail, icon: Icon, label }, index) => (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="relative z-10 flex flex-col items-center text-center"
                  initial={{ opacity: 0, y: 10 }}
                  key={label}
                  transition={{ delay: 0.3 + index * 0.16 }}
                >
                  <span className={`grid size-12 place-items-center rounded-2xl border border-white/12 shadow-lg ${index === 3 ? "bg-emergency-500" : "bg-forest-800"}`}>
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <span className="mt-3 text-xs font-semibold">{label}</span>
                  <span className="mt-1 hidden text-[0.62rem] leading-4 text-emerald-100/48 sm:block">{detail}</span>
                </motion.div>
              ))}
              <motion.span
                animate={{ left: ["11%", "89%"], opacity: [0, 1, 1, 0] }}
                aria-hidden="true"
                className="absolute top-[1.28rem] z-20 size-2 rounded-full bg-white shadow-[0_0_14px_4px_rgba(255,255,255,0.45)]"
                transition={{ delay: 1.5, duration: 2.2, repeat: Infinity, repeatDelay: 1.4 }}
              />
            </div>

            <div className="relative mt-9 rounded-2xl border border-white/9 bg-white/[0.055] p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-emerald-100/52">Signal delivered</p>
                  <p className="mt-1 font-display text-lg font-semibold">Location + condition + cause</p>
                </div>
                <span className="grid size-10 place-items-center rounded-full bg-safe-500/18 text-emerald-300">
                  <ShieldPlus className="size-5" />
                </span>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="mt-16 scroll-mt-28" id="how-it-works">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-ai-500">How it works</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-forest-900 md:text-5xl">One safety path, before and after signal disappears.</h2>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {["Preparation", "AI Risk Analysis", "Bracelet", "Offline Rescue"].map((step, index) => (
            <Card className="relative h-full overflow-hidden" key={step}>
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-ai-500">0{index + 1}</span>
              <h3 className="mt-4 font-display text-xl font-semibold text-forest-900">{step}</h3>
              <p className="mt-2 text-sm leading-6 text-forest-800/52">{[
                "Build a safety profile and prepare the route.",
                "Understand deterministic risk before departure.",
                "Monitor movement, health, and environment live.",
                "Relay verified incidents to rescue through LoRa.",
              ][index]}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
        <Card className="bg-forest-900 text-white" variant="dark">
          <BrainCircuit aria-hidden="true" className="size-6 text-sky-300" />
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-sky-200/65">AI prediction</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">Risk you can understand.</h2>
          <p className="mt-4 text-sm leading-6 text-emerald-100/58">
            TauFind combines preparation, route, health, movement, and environment signals into one explainable score—not a black-box alert.
          </p>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          {predictionSignals.map(([label, description], index) => (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              key={label}
              transition={{ delay: index * 0.06 }}
              viewport={{ once: true, amount: 0.5 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <Card className="h-full">
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-ai-500">0{index + 1}</span>
                <h3 className="mt-3 font-display text-lg font-semibold text-forest-900">{label}</h3>
                <p className="mt-1 text-sm text-forest-800/52">{description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
