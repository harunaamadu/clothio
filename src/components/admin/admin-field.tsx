export function AdminField({ label, name, type = "text", required }: {
  label: string; name: string; type?: string; required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[9px] tracking-[0.4em] uppercase text-stone-500">{label}</label>
      <input
        type={type}
        name={name}
        required={required}
        step={type === "number" ? "0.01" : undefined}
        className="bg-stone-100 border border-stone-300 text-stone-700 px-3 py-2.5 text-sm focus:outline-none focus:border-stone-500 placeholder:text-stone-600"
      />
    </div>
  );
}