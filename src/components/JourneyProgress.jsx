import { Check } from "lucide-react";

const steps = [
  { label: "Safety profile", shortLabel: "Profile" },
  { label: "Route plan", shortLabel: "Route" },
  { label: "Risk review", shortLabel: "Risk" },
  { label: "Bracelet", shortLabel: "Connect" },
];

export default function JourneyProgress({ current }) {
  return (
    <ol aria-label="TauFind setup progress" className="grid grid-cols-4 gap-2">
      {steps.map((step, index) => {
        const complete = index < current;
        const active = index === current;

        return (
          <li className="relative" key={step.label}>
            {index > 0 && (
              <span
                aria-hidden="true"
                className={`absolute right-1/2 top-4 h-px w-full ${complete || active ? "bg-forest-700/45" : "bg-forest-800/12"}`}
              />
            )}
            <div className="relative flex flex-col items-center text-center">
              <span
                className={`grid size-8 place-items-center rounded-full border text-xs font-bold transition ${
                  complete
                    ? "border-forest-800 bg-forest-800 text-white"
                    : active
                      ? "border-ai-500 bg-ai-100 text-ai-500 ring-4 ring-ai-500/8"
                      : "border-forest-800/12 bg-sand-50 text-forest-800/35"
                }`}
              >
                {complete ? <Check aria-hidden="true" className="size-4" /> : index + 1}
              </span>
              <span className={`mt-2 text-[0.68rem] font-semibold ${active ? "text-forest-900" : "text-forest-800/42"}`}>
                <span className="sm:hidden">{step.shortLabel}</span>
                <span className="hidden sm:inline">{step.label}</span>
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
