import { BatteryMedium, Bluetooth, HeartPulse, MapPin, Radio, ShieldCheck, Thermometer, WifiOff, Zap } from "lucide-react";
import Bracelet from "../components/Bracelet";
import Card from "../components/Card";
import { useTauFind } from "../context/TauFindContext";
import { getSensorScenario } from "../data/sensorSimulation";

function StatusRow({ icon: Icon, label, value, warning = false }) {
  return <div className="flex items-center gap-3 rounded-2xl border border-forest-800/8 bg-white/55 p-3"><span className={`grid size-9 place-items-center rounded-xl ${warning ? "bg-amber-100 text-warning-500" : "bg-emerald-50 text-safe-500"}`}><Icon className="size-4" /></span><div className="min-w-0 flex-1"><p className="text-[0.6rem] font-bold uppercase tracking-[0.13em] text-forest-800/38">{label}</p><p className="mt-0.5 truncate text-sm font-semibold text-forest-900">{value}</p></div><span className={`size-2 rounded-full ${warning ? "bg-warning-500" : "bg-safe-500"}`} /></div>;
}

export default function HikerBracelet() {
  const { state } = useTauFind();
  const scenario = getSensorScenario(state.hiking.scenario);
  const warning = scenario.status !== "safe";
  const deviceStatus = scenario.status === "safe" ? "Connected" : scenario.status === "warning" ? "Warning" : "Warning";

  return (
    <div className="tau-container py-10 md:py-14">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-ai-500">Personal device management</p><h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em] text-forest-900 md:text-6xl">Your protection, on your wrist.</h1><p className="mt-4 max-w-2xl text-base leading-7 text-forest-800/55">Confirm wearable readiness before every trip and keep offline protection available beyond mobile coverage.</p></div>
        <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${warning ? "border-warning-500/20 bg-amber-50" : "border-safe-500/20 bg-emerald-50"}`}><span className={`grid size-10 place-items-center rounded-xl text-white ${warning ? "bg-warning-500" : "bg-safe-500"}`}><Bluetooth className="size-5" /></span><div><p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-forest-800/40">Device status</p><p className="text-sm font-semibold text-forest-900">{deviceStatus}</p></div></div>
      </header>

      <div className="mt-8 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <Card className="overflow-hidden" padding="p-0">
            <div className="bg-forest-900 p-6 text-white md:p-7"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.17em] text-emerald-200/55">Registered device</p><h2 className="mt-2 font-display text-3xl font-semibold">TauFind TF-01</h2><p className="mt-2 text-sm text-emerald-100/48">Device ID · TF-KZ-2401</p></div><span className="grid size-12 place-items-center rounded-2xl bg-white/8 text-emerald-200"><Zap className="size-5" /></span></div></div>
            <div className="grid gap-3 p-5 sm:grid-cols-2 md:p-6"><StatusRow icon={BatteryMedium} label="Battery level" value={`${scenario.sensors.batteryLevel}%`} warning={scenario.sensors.batteryLevel < 30} /><StatusRow icon={MapPin} label="GPS" value={scenario.sensors.gps} /><StatusRow icon={HeartPulse} label="Heart rate" value={`${scenario.sensors.heartRate} bpm`} warning={scenario.sensors.heartRate >= 150 || scenario.sensors.heartRate < 50} /><StatusRow icon={Thermometer} label="Temperature" value={`${scenario.sensors.temperature}°C`} warning={scenario.sensors.temperature <= -5} /><StatusRow icon={ShieldCheck} label="Motion" value={scenario.sensors.movement} warning={scenario.status === "emergency"} /><StatusRow icon={Radio} label="LoRa" value={scenario.sensors.lora} warning={scenario.status === "emergency"} /></div>
          </Card>

          <Card className="border-ai-500/16 bg-ai-100/65">
            <div className="flex items-start gap-4"><span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-forest-900 text-emerald-200"><WifiOff className="size-5" /></span><div><div className="flex flex-wrap items-center gap-2"><p className="text-xs font-bold uppercase tracking-[0.16em] text-ai-500">Offline protection</p><span className="rounded-full bg-safe-500 px-2.5 py-1 text-[0.58rem] font-bold text-white">ACTIVE</span></div><h2 className="mt-2 font-display text-xl font-semibold text-forest-900">Protection beyond mobile coverage</h2><p className="mt-2 text-sm leading-6 text-forest-800/58">Mobile network unavailable. TauFind continues protection through offline communication.</p></div></div>
          </Card>
        </div>

        <Bracelet sensors={scenario.sensors} status={scenario.status} />
      </div>
    </div>
  );
}
