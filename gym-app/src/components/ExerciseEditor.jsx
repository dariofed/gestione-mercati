import { Minus, Plus, Trash2, X } from "lucide-react";
import MuscleIcon from "./MuscleIcon.jsx";
import { EQUIPMENT, EXERCISES, MUSCLE_GROUPS } from "../data/exercises.js";

export default function ExerciseEditor({ item, onUpdate, onRemove, onClose }) {
  const ex = EXERCISES.find((e) => e.id === item.exerciseId);
  if (!ex) return null;
  const group = MUSCLE_GROUPS.find((g) => g.id === ex.muscleGroup);

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center">
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
        role="presentation"
      />

      <div className="relative mx-auto w-full max-w-md rounded-t-3xl border-t border-border bg-surface pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-3">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-surface-2" />

        <div className="max-h-[75vh] overflow-y-auto px-4">
          <div className="flex items-start gap-3">
            <div className="h-12 w-12 shrink-0 rounded-lg bg-surface-2 p-1">
              <MuscleIcon group={ex.muscleGroup} color={group?.color} className="h-full w-full" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-semibold leading-tight text-text">{ex.name}</h2>
              <div className="mt-1 flex flex-wrap gap-1.5">
                <span
                  className="rounded-full px-2 py-0.5 text-[11px] font-medium"
                  style={{ backgroundColor: `${group?.color}26`, color: group?.color }}
                >
                  {group?.label}
                </span>
                <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-text-dim">
                  {EQUIPMENT[ex.equipment]}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Chiudi"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-text-dim active:bg-surface-2"
            >
              <X size={18} />
            </button>
          </div>

          <p className="mt-3 text-xs leading-snug text-text-dim">{ex.description}</p>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <Stepper label="Serie" value={item.sets} step={1} onChange={(v) => onUpdate({ sets: v })} />
            <Stepper label="Rip." value={item.reps} step={1} onChange={(v) => onUpdate({ reps: v })} />
            <Stepper label="Peso (kg)" value={item.weight} step={2.5} onChange={(v) => onUpdate({ weight: v })} />
          </div>

          <input
            value={item.note ?? ""}
            onChange={(e) => onUpdate({ note: e.target.value })}
            placeholder="Aggiungi una nota..."
            maxLength={140}
            className="mt-3 w-full rounded-xl bg-surface-2 px-3 py-3 text-sm text-text placeholder:text-text-dim focus:outline-none focus:ring-1 focus:ring-accent"
          />

          <button
            type="button"
            onClick={onRemove}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium text-text-dim active:bg-surface-2"
          >
            <Trash2 size={16} />
            Rimuovi dalla scheda
          </button>

          <button
            type="button"
            onClick={onClose}
            className="mt-1 w-full rounded-2xl bg-accent py-3.5 text-sm font-semibold text-white"
          >
            Fatto
          </button>
        </div>
      </div>
    </div>
  );
}

function Stepper({ label, value, step, onChange }) {
  const clamp = (v) => Math.max(0, Math.round(v * 10) / 10);

  return (
    <div className="flex flex-col items-center gap-1.5 rounded-xl bg-surface-2 p-2">
      <span className="text-[10px] font-medium uppercase tracking-wide text-text-dim">{label}</span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onChange(clamp(value - step))}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-bg text-text active:bg-accent-dim"
          aria-label={`Diminuisci ${label}`}
        >
          <Minus size={15} />
        </button>
        <span className="w-10 text-center text-base font-semibold text-text">{value}</span>
        <button
          type="button"
          onClick={() => onChange(clamp(value + step))}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-bg text-text active:bg-accent-dim"
          aria-label={`Aumenta ${label}`}
        >
          <Plus size={15} />
        </button>
      </div>
    </div>
  );
}
