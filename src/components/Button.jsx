import { LoaderCircle } from "lucide-react";

const variants = {
  primary: "bg-forest-800 text-white shadow-lg shadow-forest-900/10 hover:bg-forest-700",
  secondary: "border border-forest-800/15 bg-white/70 text-forest-900 hover:bg-white",
  ai: "bg-ai-500 text-white shadow-lg shadow-ai-500/15 hover:bg-[#376b8b]",
  emergency: "bg-emergency-500 text-white shadow-lg shadow-emergency-500/15 hover:bg-[#cc2d39]",
  ghost: "text-forest-800 hover:bg-forest-800/7",
};

const sizes = {
  sm: "min-h-9 px-3.5 text-sm",
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-13 px-6 text-base",
};

export default function Button({
  as: Component = "button",
  children,
  className = "",
  loading = false,
  size = "md",
  variant = "primary",
  ...props
}) {
  const buttonProps = Component === "button" ? { type: "button", disabled: loading, ...props } : props;

  return (
    <Component
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200 ease-out hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`}
      {...buttonProps}
    >
      {loading && <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />}
      {children}
    </Component>
  );
}
