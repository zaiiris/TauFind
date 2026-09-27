import { CloudSun, Mountain, Route, Signal } from "lucide-react";
import { motion } from "framer-motion";

const difficultyTone = {
  Moderate: "bg-warning-500/12 text-[#9a6b14]",
  Challenging: "bg-emergency-100 text-emergency-500",
};

export default function RouteCard({ onSelect, route, selected }) {
  return (
    <motion.button
      aria-pressed={selected}
      className={`w-full rounded-card border p-5 text-left shadow-card backdrop-blur-xl transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ai-500/20 ${
        selected
          ? "border-forest-700 bg-white ring-2 ring-forest-700/8"
          : "border-forest-800/9 bg-white/68 hover:-translate-y-1 hover:border-forest-800/20 hover:bg-white"
      }`}
      onClick={() => onSelect(route.id)}
      transition={{ duration: 0.2 }}
      type="button"
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-ai-500">{route.region}</p>
          <h2 className="mt-2 font-display text-xl font-semibold tracking-tight text-forest-900">{route.name}</h2>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[0.68rem] font-bold ${difficultyTone[route.difficulty]}`}>
          {route.difficulty}
        </span>
      </div>
      <p className="mt-3 min-h-10 text-sm leading-5 text-forest-800/54">{route.description}</p>
      <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-forest-800/8 pt-4 text-xs">
        <span className="flex items-center gap-2 text-forest-800/58"><Mountain className="size-4 text-forest-700" />{route.altitude.toLocaleString()} m</span>
        <span className="flex items-center gap-2 text-forest-800/58"><Route className="size-4 text-forest-700" />{route.distance} km</span>
        <span className="flex items-center gap-2 text-forest-800/58"><CloudSun className="size-4 text-ai-500" />{route.weather}</span>
        <span className="flex items-center gap-2 text-forest-800/58"><Signal className="size-4 text-ai-500" />{route.mobileCoverage}% coverage</span>
      </div>
    </motion.button>
  );
}
