import { Download, Minus, Plus, Trash2 } from "lucide-react";
import MuscleIcon from "./MuscleIcon.jsx";
import { EXERCISES, MUSCLE_GROUPS } from "../data/exercises.js";

export default function SchedaView({ items, onUpdate, onRemove, onClear, onExport }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center">
        <p className="text-sm text-text-dim">
          La tua scheda e' vuota.
          <br />
          Aggiungi esercizi dalla libreria per iniziare.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 pb-24">
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-dim">{items.length} esercizi selezionati</span>
        <button type="button" onClick={onClear} className="text-xs font-medium text-text-dim underline">
          Svuota scheda
        </button>
      </div>

      {items.map((item) => {
        const ex = EXERCISES.find((e) => e.id === item.exerciseId);
        if (!ex) return null;
        const group = MUSCLE_GROUPS.find((g) => g.id === ex.muscleGroup);

        return (
          <div key={item.exerciseId} className="rounded-2xl border border-border bg-surface p-3">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 shrink-0 rounded-lg bg-surface-2 p-1">
                <MuscleIcon group={ex.muscleGroup} color={group?.color} className="h-full w-full" />
              </div>
              <h3 className="min-w-0 flex-1 truncate text-sm font-semibold text-text">{ex.name}</h3>
              <button
                type="button"
                onClick={() => onRemove(ex.id)}
                aria-label="Rimuovi esercizio"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-text-dim active:bg-surface-2"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <Stepper
                label="Serie"
                value={item.sets}
                step={1}
                min={0}
                onChange={(v) => onUpdate(ex.id, { sets: v })}
              />
              <Stepper
                label="Rip."
                value={item.reps}
                step={1}
                min={0}
                onChange={(v) => onUpdate(ex.id, { reps: v })}
              />
              <Stepper
                label="Peso (kg)"
                value={item.weight}
                step={2.5}
                min={0}
                onChange={(v) => onUpdate(ex.id, { weight: v })}
              />
            </div>
          </div>
        );
      })}

      <button
        type="button"
        onClick={onExport}
        className="fixed inset-x-4 bottom-20 z-10 mx-auto flex max-w-md items-center justify-center gap-2 rounded-2xl bg-accent py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/40"
      >
        <Download size={18} />
        Scarica PDF
      </button>
    </div>
  );
}

function Stepper({ label, value, step, min, onChange }) {
  const clamp = (v) => Math.max(min, Math.round(v * 10) / 10);

  return (
    <div className="flex flex-col items-center gap-1 rounded-xl bg-surface-2 p-2">
      <span className="text-[10px] font-medium uppercase tracking-wide text-text-dim">{label}</span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onChange(clamp(value - step))}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-bg text-text active:bg-accent-dim"
          aria-label={`Diminuisci ${label}`}
        >
          <Minus size={14} />
        </button>
        <span className="w-10 text-center text-sm font-semibold text-text">{value}</span>
        <button
          type="button"
          onClick={() => onChange(clamp(value + step))}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-bg text-text active:bg-accent-dim"
          aria-label={`Aumenta ${label}`}
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}
