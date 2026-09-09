import { Plus, Check } from "lucide-react";
import MuscleIcon from "./MuscleIcon.jsx";
import { EQUIPMENT, MUSCLE_GROUPS } from "../data/exercises.js";

export default function ExerciseCard({ exercise, inScheda, onToggle }) {
  const group = MUSCLE_GROUPS.find((g) => g.id === exercise.muscleGroup);

  return (
    <div className="flex gap-3 rounded-2xl border border-border bg-surface p-3">
      <div className="h-16 w-16 shrink-0 rounded-xl bg-surface-2 p-1">
        <MuscleIcon group={exercise.muscleGroup} color={group?.color} className="h-full w-full" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold leading-tight text-text">{exercise.name}</h3>
          <button
            type="button"
            onClick={() => onToggle(exercise.id)}
            aria-label={inScheda ? "Rimuovi dalla scheda" : "Aggiungi alla scheda"}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${
              inScheda ? "bg-accent text-white" : "bg-surface-2 text-text-dim active:bg-accent-dim"
            }`}
          >
            {inScheda ? <Check size={18} /> : <Plus size={18} />}
          </button>
        </div>
        <div className="mt-1 flex flex-wrap gap-1.5">
          <span
            className="rounded-full px-2 py-0.5 text-[11px] font-medium"
            style={{ backgroundColor: `${group?.color}26`, color: group?.color }}
          >
            {group?.label}
          </span>
          <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-text-dim">
            {EQUIPMENT[exercise.equipment]}
          </span>
        </div>
        <p className="mt-1.5 text-xs leading-snug text-text-dim">{exercise.description}</p>
      </div>
    </div>
  );
}
