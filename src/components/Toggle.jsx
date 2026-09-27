import { motion } from "framer-motion";

export default function Toggle({ checked, description, icon: Icon, label, onChange }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-forest-800/9 bg-white/58 p-4">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-forest-100 text-forest-800">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-forest-900">{label}</p>
        <p className="mt-0.5 text-xs leading-5 text-forest-800/50">{description}</p>
      </div>
      <button
        aria-checked={checked}
        aria-label={`${label}: ${checked ? "enabled" : "disabled"}`}
        className={`relative h-7 w-12 shrink-0 rounded-full p-1 transition ${checked ? "bg-safe-500" : "bg-forest-800/18"}`}
        onClick={() => onChange(!checked)}
        role="switch"
        type="button"
      >
        <motion.span
          animate={{ x: checked ? 20 : 0 }}
          className="block size-5 rounded-full bg-white shadow-sm"
          transition={{ duration: 0.18, ease: "easeOut" }}
        />
      </button>
    </div>
  );
}
