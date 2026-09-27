export default function FormField({
  autoComplete,
  help,
  id,
  label,
  max,
  min,
  onChange,
  options,
  placeholder,
  required = false,
  type = "text",
  value,
}) {
  const controlClassName =
    "mt-2 min-h-12 w-full rounded-xl border border-forest-800/12 bg-white/78 px-4 text-sm text-forest-900 shadow-sm outline-none transition placeholder:text-forest-800/32 hover:border-forest-800/22 focus:border-ai-500 focus:ring-4 focus:ring-ai-500/10";

  return (
    <label className="block" htmlFor={id}>
      <span className="flex items-center justify-between gap-3 text-sm font-semibold text-forest-900">
        {label}
        {required && <span className="text-[0.65rem] uppercase tracking-wider text-forest-800/38">Required</span>}
      </span>
      {options ? (
        <select className={controlClassName} id={id} onChange={onChange} required={required} value={value}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          autoComplete={autoComplete}
          className={controlClassName}
          id={id}
          max={max}
          min={min}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          type={type}
          value={value}
        />
      )}
      {help && <span className="mt-2 block text-xs leading-5 text-forest-800/48">{help}</span>}
    </label>
  );
}
