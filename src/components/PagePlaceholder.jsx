import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router";
import Button from "./Button";
import Card from "./Card";

export default function PagePlaceholder({
  actionLabel = "Return home",
  actionTo = "/",
  description,
  eyebrow,
  icon: Icon,
  title,
}) {
  return (
    <section className="tau-container flex min-h-[calc(100vh-4.5rem)] items-center py-14 md:py-20">
      <Card className="relative w-full overflow-hidden" padding="p-7 md:p-12">
        <div aria-hidden="true" className="absolute -right-20 -top-24 size-64 rounded-full bg-ai-500/9 blur-3xl" />
        <div className="relative max-w-2xl">
          <div className="mb-8 flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-forest-800 text-white shadow-lg shadow-forest-900/15">
              <Icon aria-hidden="true" className="size-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-ai-500">{eyebrow}</span>
          </div>
          <h1 className="font-display text-4xl font-semibold tracking-[-0.035em] text-forest-900 md:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-forest-800/64 md:text-lg">{description}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button as={Link} to={actionTo}>
              {actionLabel}
              <ArrowRight aria-hidden="true" className="size-4" />
            </Button>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-safe-500">
              <CheckCircle2 aria-hidden="true" className="size-4" />
              Foundation ready
            </span>
          </div>
        </div>
      </Card>
    </section>
  );
}
