import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { EXERCISES, MUSCLE_GROUPS } from "../data/exercises.js";
import ExerciseCard from "./ExerciseCard.jsx";

export default function ExerciseLibrary({ schedaIds, onToggle }) {
  const [query, setQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState("tutti");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EXERCISES.filter((ex) => {
      const matchesGroup = activeGroup === "tutti" || ex.muscleGroup === activeGroup;
      const matchesQuery = !q || ex.name.toLowerCase().includes(q);
      return matchesGroup && matchesQuery;
    });
  }, [query, activeGroup]);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cerca esercizio..."
          className="w-full rounded-xl border border-border bg-surface py-2.5 pl-9 pr-3 text-sm text-text placeholder:text-text-dim focus:border-accent focus:outline-none"
        />
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        <FilterChip label="Tutti" active={activeGroup === "tutti"} onClick={() => setActiveGroup("tutti")} />
        {MUSCLE_GROUPS.map((g) => (
          <FilterChip
            key={g.id}
            label={g.label}
            active={activeGroup === g.id}
            color={g.color}
            onClick={() => setActiveGroup(g.id)}
          />
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-text-dim">Nessun esercizio trovato.</p>
        )}
        {filtered.map((ex) => (
          <ExerciseCard key={ex.id} exercise={ex} inScheda={schedaIds.has(ex.id)} onToggle={onToggle} />
        ))}
      </div>
    </div>
  );
}

function FilterChip({ label, active, color, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
      style={
        active
          ? { backgroundColor: color ?? "#ff5a1f", borderColor: color ?? "#ff5a1f", color: "#fff" }
          : { backgroundColor: "transparent", borderColor: "var(--color-border)", color: "var(--color-text-dim)" }
      }
    >
      {label}
    </button>
  );
}
