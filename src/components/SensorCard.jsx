import Card from "./Card";

const tones = {
  default: "bg-forest-100 text-forest-800",
  ai: "bg-ai-100 text-ai-500",
  emergency: "bg-emergency-100 text-emergency-500",
  safe: "bg-emerald-100 text-safe-500",
  warning: "bg-amber-100 text-warning-500",
};

export default function SensorCard({
  icon: Icon,
  label,
  value,
  unit,
  trend,
  tone = "default",
  className = "",
}) {
  return (
    <Card className={`min-w-0 ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-forest-800/50">{label}</p>
          <p className="mt-3 truncate font-display text-3xl font-semibold tracking-tight text-forest-900">
            {value}
            {unit && <span className="ml-1 text-sm font-medium text-forest-800/55">{unit}</span>}
          </p>
          {trend && <p className="mt-2 text-xs text-forest-800/55">{trend}</p>}
        </div>
        {Icon && (
          <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${tones[tone]}`}>
            <Icon aria-hidden="true" className="size-5" />
          </span>
        )}
      </div>
    </Card>
  );
}
