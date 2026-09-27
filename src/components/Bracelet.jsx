import { motion } from "framer-motion";
import {
  BatteryMedium,
  Bluetooth,
  HeartPulse,
  MapPin,
  Radio,
  Thermometer,
  Wifi,
} from "lucide-react";
import Card from "./Card";

const statusStyles = {
  safe: {
    dot: "bg-safe-500",
    badge: "bg-emerald-100 text-safe-500",
    glow: "shadow-[0_0_32px_rgba(46,139,87,0.2)]",
  },
  warning: {
    dot: "bg-warning-500",
    badge: "bg-amber-100 text-[#8b6216]",
    glow: "shadow-[0_0_32px_rgba(217,164,65,0.22)]",
  },
  emergency: {
    dot: "bg-emergency-500",
    badge: "bg-emergency-100 text-emergency-500",
    glow: "shadow-[0_0_38px_rgba(230,57,70,0.22)]",
  },
};

function Reading({ icon: Icon, label, value, alert = false }) {
  return (
    <div className={`flex items-center gap-3 rounded-2xl border p-3 ${alert ? "border-emergency-500/18 bg-emergency-100/65" : "border-forest-800/8 bg-white/55"}`}>
      <span className={`grid size-8 shrink-0 place-items-center rounded-xl ${alert ? "bg-emergency-500 text-white" : "bg-ai-100 text-ai-500"}`}>
        <Icon aria-hidden="true" className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-[0.58rem] font-bold uppercase tracking-[0.13em] text-forest-800/38">{label}</p>
        <p className={`mt-0.5 truncate text-sm font-semibold ${alert ? "text-emergency-500" : "text-forest-900"}`}>{value}</p>
      </div>
    </div>
  );
}

export default function Bracelet({ sensors, status = "safe" }) {
  const styles = statusStyles[status] ?? statusStyles.safe;
  const emergency = status === "emergency";

  return (
    <Card className="overflow-hidden" padding="p-0">
      <div className="border-b border-forest-800/8 p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.17em] text-ai-500">TauFind bracelet</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-forest-900">Live telemetry</h2>
          </div>
          <span className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${styles.badge}`}>
            <motion.span animate={{ opacity: [1, 0.35, 1] }} className={`size-2 rounded-full ${styles.dot}`} transition={{ duration: emergency ? 0.7 : 1.8, repeat: Infinity }} />
            {sensors.connection}
          </span>
        </div>

        <div className="relative mx-auto mt-7 flex h-44 max-w-xs items-center justify-center">
          <div className="absolute inset-y-0 left-1/2 w-24 -translate-x-1/2 rounded-[2.5rem] bg-forest-800/9" />
          <motion.div animate={emergency ? { scale: [1, 1.025, 1] } : { y: [0, -3, 0] }} className={`relative grid h-32 w-44 place-items-center rounded-[2.2rem] border-4 border-forest-900 bg-forest-950 p-3 text-white ${styles.glow}`} transition={{ duration: emergency ? 0.8 : 3, repeat: Infinity }}>
            <div className="absolute right-2 top-2 flex items-center gap-1 text-[0.55rem] text-emerald-100/70"><Bluetooth className="size-2.5" />TF-01</div>
            <div className="text-center">
              <HeartPulse className={`mx-auto size-7 ${emergency ? "text-emergency-500" : "text-emerald-300"}`} />
              <p className="mt-1 font-display text-2xl font-semibold">{sensors.heartRate}</p>
              <p className="text-[0.58rem] uppercase tracking-[0.15em] text-emerald-100/55">BPM</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="grid gap-3 p-5 sm:grid-cols-2 md:p-6">
        <Reading icon={BatteryMedium} label="Battery" value={`${sensors.batteryLevel}%`} />
        <Reading icon={MapPin} label="GPS" value={sensors.gps} />
        <Reading alert={sensors.heartRate >= 150 || sensors.heartRate < 50} icon={HeartPulse} label="Heart sensor" value={`${sensors.heartRate} bpm`} />
        <Reading alert={sensors.temperature <= -5} icon={Thermometer} label="Temperature" value={`${sensors.temperature}°C`} />
        <Reading alert={emergency} icon={Radio} label="LoRa network" value={sensors.lora} />
        <Reading icon={Wifi} label="Radio signal" value={sensors.signal} />
      </div>
    </Card>
  );
}
