import { motion } from "framer-motion";
import { Check, Clock3 } from "lucide-react";
import Card from "./Card";

const timelineEvents = [
  { time: "09:00", title: "Trip started", detail: "Bracelet and route monitoring activated" },
  { time: "09:35", title: "Altitude increased", detail: "Elevation profile remains inside the plan" },
  { time: "10:20", title: "Temperature changed", detail: "Environmental conditions recalculated" },
  { time: "10:45", title: "Risk recalculated", detail: "Profile, route, equipment, and sensors checked" },
  { time: "11:00", title: "Monitoring active", detail: "GPS and offline LoRa protection available" },
];

export default function SafetyTimeline() {
  return (
    <Card>
      <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-ai-100 text-ai-500"><Clock3 className="size-5" /></span><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-ai-500">Safety timeline</p><h2 className="mt-1 font-display text-2xl font-semibold text-forest-900">Protection throughout the trip</h2></div></div>
      <div className="mt-7 space-y-0">
        {timelineEvents.map((event, index) => {
          const current = index === timelineEvents.length - 1;
          return (
            <motion.div animate={{ opacity: 1, x: 0 }} className="relative grid grid-cols-[3.5rem_1.75rem_1fr] gap-3" initial={{ opacity: 0, x: -6 }} key={event.time} transition={{ delay: index * 0.06 }}>
              <time className="pt-1 text-xs font-bold text-forest-800/42">{event.time}</time>
              <div className="relative flex justify-center"><span className={`relative z-10 grid size-7 place-items-center rounded-full border-4 border-white text-white ${current ? "bg-ai-500" : "bg-safe-500"}`}>{current ? <motion.span animate={{ opacity: [1, 0.35, 1] }} className="size-2 rounded-full bg-white" transition={{ duration: 1.5, repeat: Infinity }} /> : <Check className="size-3" />}</span>{index < timelineEvents.length - 1 && <span className="absolute bottom-0 top-7 w-px bg-forest-800/12" />}</div>
              <div className="pb-6"><p className="text-sm font-semibold text-forest-900">{event.title}</p><p className="mt-1 text-xs leading-5 text-forest-800/46">{event.detail}</p></div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
