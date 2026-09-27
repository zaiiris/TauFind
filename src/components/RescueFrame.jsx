import { RadioTower } from "lucide-react";

export default function RescueFrame({ children, description, eyebrow = "Rescue operations", title }) {
  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-ops-950 text-white">
      <div className="tau-container py-8 md:py-12">
        <header className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ai-500"><RadioTower className="size-4" />{eyebrow}</p>
            <h1 className="font-display text-3xl font-semibold tracking-tight md:text-5xl">{title}</h1>
            {description && <p className="mt-3 max-w-2xl text-sm leading-6 text-ops-100/65 md:text-base">{description}</p>}
          </div>
          <div className="flex items-center gap-2 rounded-full border border-safe-500/25 bg-safe-500/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-green-300"><span className="size-2 rounded-full bg-green-400 shadow-[0_0_12px_#4ade80]" />Command system online</div>
        </header>
        {children}
      </div>
    </div>
  );
}
