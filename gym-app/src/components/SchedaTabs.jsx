import { Plus } from "lucide-react";

export default function SchedaTabs({ schede, activeId, onSelect, onCreate }) {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
      {schede.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => onSelect(s.id)}
          className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
            s.id === activeId
              ? "border-accent bg-accent text-white"
              : "border-border bg-transparent text-text-dim"
          }`}
        >
          {s.name}
          {s.items.length > 0 && (
            <span className={s.id === activeId ? "opacity-80" : "opacity-60"}> · {s.items.length}</span>
          )}
        </button>
      ))}
      <button
        type="button"
        onClick={onCreate}
        aria-label="Nuova scheda"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-text-dim"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
