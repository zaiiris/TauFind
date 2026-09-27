import { motion } from "framer-motion";

function getRiskMeta(score) {
  if (score >= 75) return { label: "Critical risk", color: "#e63946" };
  if (score >= 55) return { label: "High risk", color: "#d55a3a" };
  if (score >= 30) return { label: "Medium risk", color: "#d9a441" };
  return { label: "Low risk", color: "#2e8b57" };
}

export default function RiskScore({ className = "", score = 0, size = 168 }) {
  const normalizedScore = Math.min(100, Math.max(0, Math.round(score)));
  const radius = (size - 18) / 2;
  const circumference = 2 * Math.PI * radius;
  const meta = getRiskMeta(normalizedScore);

  return (
    <div
      aria-label={`${normalizedScore}% — ${meta.label}`}
      className={`relative grid place-items-center ${className}`}
      role="img"
      style={{ height: size, width: size }}
    >
      <svg aria-hidden="true" className="-rotate-90" height={size} width={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          stroke="rgba(15, 61, 46, 0.1)"
          strokeWidth="9"
        />
        <motion.circle
          animate={{ strokeDashoffset: circumference * (1 - normalizedScore / 100) }}
          cx={size / 2}
          cy={size / 2}
          fill="none"
          initial={{ strokeDashoffset: circumference }}
          r={radius}
          stroke={meta.color}
          strokeDasharray={circumference}
          strokeLinecap="round"
          strokeWidth="9"
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-4xl font-semibold tracking-tight text-forest-900">
          {normalizedScore}%
        </span>
        <span className="mt-1 text-[0.65rem] font-bold uppercase tracking-[0.16em]" style={{ color: meta.color }}>
          {meta.label}
        </span>
      </div>
    </div>
  );
}
