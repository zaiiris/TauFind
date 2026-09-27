import { motion } from "framer-motion";
import { Mountain, Radio, ShieldCheck, Watch, WifiOff } from "lucide-react";
import Card from "./Card";

const nodes = [
  { id: "bracelet", label: "Tourist bracelet", detail: "Emergency packet", icon: Watch },
  { id: "relay", label: "LoRa node", detail: "Mountain relay", icon: Radio },
  { id: "station", label: "Mountain station", detail: "Packet verified", icon: Mountain },
  { id: "rescue", label: "Rescue team", detail: "Incident received", icon: ShieldCheck },
];

function Connector({ active }) {
  return (
    <>
      <div className="relative hidden h-px w-12 overflow-visible bg-white/16 md:block lg:w-16">
        {active && <motion.span animate={{ x: [0, 48], opacity: [0, 1, 0] }} className="absolute -top-1 size-2 rounded-full bg-emerald-300 shadow-[0_0_12px_#6ee7b7]" transition={{ duration: 1, repeat: Infinity }} />}
      </div>
      <div className="relative h-9 w-px bg-white/16 md:hidden">
        {active && <motion.span animate={{ y: [0, 32], opacity: [0, 1, 0] }} className="absolute -left-1 size-2 rounded-full bg-emerald-300 shadow-[0_0_12px_#6ee7b7]" transition={{ duration: 1, repeat: Infinity }} />}
      </div>
    </>
  );
}

export default function LoRaNetwork({ offlineMode = true, progress = 0, received = false, status = "idle" }) {
  const activeHop = received ? nodes.length - 1 : Math.min(nodes.length - 1, Math.floor(progress / 34));
  const transmitting = status === "transmitting";

  return (
    <Card className="overflow-hidden" padding="p-0" variant="dark">
      <div className="flex flex-col justify-between gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-center md:p-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.17em] text-emerald-300/70"><Radio className="size-4" />Offline rescue communication</div>
          <h2 className="mt-2 font-display text-2xl font-semibold">LoRa emergency relay</h2>
          <p className="mt-2 text-sm text-emerald-100/48">Simulated packet route for the hackathon demonstration.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {offlineMode && <span className="flex items-center gap-2 rounded-full bg-emergency-500/14 px-3 py-2 text-xs font-bold text-red-200"><WifiOff className="size-4" />Mobile network unavailable</span>}
          <span className={`rounded-full px-3 py-2 text-xs font-bold ${received ? "bg-emerald-400/15 text-emerald-200" : transmitting ? "bg-ai-500/25 text-sky-200" : "bg-white/8 text-white/55"}`}>{received ? "Signal received" : transmitting ? "Transmitting" : "Relay standby"}</span>
        </div>
      </div>

      <div className="p-5 md:p-6">
        <div className="flex flex-col items-center justify-between md:flex-row">
          {nodes.map((node, index) => {
            const Icon = node.icon;
            const complete = received || index < activeHop;
            const active = index === activeHop;
            return (
              <div className="contents" key={node.id}>
                <motion.div animate={active && transmitting ? { scale: [1, 1.035, 1] } : { scale: 1 }} className={`w-full rounded-2xl border p-4 text-center md:w-36 ${complete ? "border-emerald-300/25 bg-emerald-300/10" : active ? "border-ai-500/40 bg-ai-500/15" : "border-white/8 bg-white/[0.035]"}`} transition={{ duration: 1.1, repeat: active && transmitting ? Infinity : 0 }}>
                  <span className={`mx-auto grid size-10 place-items-center rounded-xl ${complete ? "bg-emerald-300 text-forest-950" : active ? "bg-ai-500 text-white" : "bg-white/8 text-white/40"}`}><Icon className="size-5" /></span>
                  <p className="mt-3 text-sm font-semibold text-white">{node.label}</p>
                  <p className="mt-1 text-[0.65rem] text-emerald-100/40">{complete ? "Delivered" : active && transmitting ? "Sending…" : node.detail}</p>
                </motion.div>
                {index < nodes.length - 1 && <Connector active={transmitting && index === activeHop} />}
              </div>
            );
          })}
        </div>

        <div className="mt-7 flex items-center justify-between text-xs text-emerald-100/45"><span>Encrypted rescue packet</span><span>{Math.round(progress)}%</span></div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10"><motion.div animate={{ width: `${progress}%` }} className={received ? "h-full rounded-full bg-emerald-300" : "h-full rounded-full bg-ai-500"} initial={false} transition={{ duration: 0.35 }} /></div>
      </div>
    </Card>
  );
}
