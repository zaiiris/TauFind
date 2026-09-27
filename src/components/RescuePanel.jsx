export default function RescuePanel({ as: Component = "section", children, className = "" }) {
  return <Component className={`rounded-2xl border border-white/8 bg-ops-900/90 shadow-2xl shadow-black/10 ${className}`}>{children}</Component>;
}
