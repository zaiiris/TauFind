const variants = {
  default: "border-forest-800/10 bg-white/82",
  muted: "border-forest-800/8 bg-sand-50/82",
  dark: "border-white/10 bg-forest-900 text-white",
  emergency: "border-emergency-500/20 bg-emergency-100",
};

export default function Card({
  as: Component = "div",
  children,
  className = "",
  padding = "p-5 md:p-6",
  variant = "default",
  ...props
}) {
  return (
    <Component
      className={`rounded-card border shadow-card backdrop-blur-xl ${variants[variant]} ${padding} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
