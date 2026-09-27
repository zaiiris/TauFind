import { motion } from "framer-motion";
import { Crosshair, MapPin, RadioTower, Truck } from "lucide-react";

const markers = [
  { key: "tourist", label: "Tourist", icon: MapPin, color: "bg-emergency-500", position: "left-[68%] top-[30%]" },
  { key: "last", label: "Last signal", icon: Crosshair, color: "bg-ai-500", position: "left-[57%] top-[45%]" },
  { key: "station", label: "Mountain station", icon: RadioTower, color: "bg-white", position: "left-[25%] top-[63%]", dark: true },
  { key: "rescue", label: "Rescue team", icon: Truck, color: "bg-safe-500", position: "left-[14%] top-[76%]" },
];

export default function RescueMapCanvas({ compact = false }) {
  return (
    <div aria-label="Simulated mountain rescue map" className={`relative overflow-hidden rounded-2xl border border-white/8 bg-[#091b29] ${compact ? "min-h-80" : "min-h-[32rem]"}`} role="img">
      <svg aria-hidden="true" className="absolute inset-0 size-full opacity-55" preserveAspectRatio="none" viewBox="0 0 800 520">
        <defs><pattern height="36" id="ops-grid" patternUnits="userSpaceOnUse" width="36"><path d="M36 0H0V36" fill="none" stroke="#315069" strokeWidth="1" /></pattern></defs>
        <rect fill="url(#ops-grid)" height="520" width="800" />
        <path d="M-20 420 C130 310 210 380 320 235 S510 170 620 72 S760 88 840 20" fill="none" stroke="#26465d" strokeWidth="55" />
        <path d="M-20 420 C130 310 210 380 320 235 S510 170 620 72 S760 88 840 20" fill="none" stroke="#426984" strokeDasharray="7 11" strokeWidth="2" />
        <path d="M45 165 C155 74 243 113 338 52" fill="none" stroke="#203d52" strokeWidth="30" />
      </svg>
      <motion.div animate={{ opacity: [0.18, 0.42, 0.18], scale: [0.92, 1.08, 0.92] }} className="absolute left-[68%] top-[30%] size-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emergency-500/55 bg-emergency-500/10" transition={{ duration: 3, repeat: Infinity }} />
      <svg aria-hidden="true" className="absolute inset-0 size-full" preserveAspectRatio="none" viewBox="0 0 100 100"><motion.path animate={{ pathLength: 1, opacity: 1 }} d="M18 82 L25 68 L61 49 L68 34" fill="none" initial={{ pathLength: 0, opacity: 0 }} stroke="#457b9d" strokeDasharray="2 2" strokeWidth="0.6" transition={{ duration: 1.5 }} /></svg>
      {markers.map(({ color, dark, icon: Icon, key, label, position }, index) => (
        <motion.div animate={{ opacity: 1, y: 0 }} className={`absolute ${position} -translate-x-1/2 -translate-y-1/2`} initial={{ opacity: 0, y: 10 }} key={key} transition={{ delay: index * 0.12 }}>
          <div className="group relative flex flex-col items-center"><span className={`grid size-10 place-items-center rounded-full ${color} ${dark ? "text-ops-950" : "text-white"} shadow-xl ring-4 ring-ops-950/70`}><Icon className="size-5" /></span><span className="mt-2 whitespace-nowrap rounded-md bg-ops-950/90 px-2 py-1 text-[0.62rem] font-bold uppercase tracking-wider text-white">{label}</span></div>
        </motion.div>
      ))}
      <div className="absolute bottom-4 left-4 rounded-xl border border-white/10 bg-ops-950/88 px-4 py-3 backdrop-blur"><p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-ai-500">Simulation map</p><p className="mt-1 text-xs text-ops-100/55">Last signal · 43.0632° N, 78.9851° E</p></div>
    </div>
  );
}
