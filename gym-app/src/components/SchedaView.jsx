import { useEffect, useRef, useState } from "react";
import { Check, Download, Minus, Pencil, Plus, Trash2 } from "lucide-react";
import MuscleIcon from "./MuscleIcon.jsx";
import SchedaTabs from "./SchedaTabs.jsx";
import { EXERCISES, MUSCLE_GROUPS } from "../data/exercises.js";

export default function SchedaView({
  schede,
  activeId,
  onSelectScheda,
  onCreateScheda,
  onRenameScheda,
  onDeleteScheda,
  onUpdateItem,
  onRemoveItem,
  onExport,
}) {
  const scheda = schede.find((s) => s.id === activeId);
  const [renaming, setRenaming] = useState(false);
  const [draftName, setDraftName] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (renaming) inputRef.current?.select();
  }, [renaming]);

  if (!scheda) return null;

  const startRename = () => {
    setDraftName(scheda.name);
    setRenaming(true);
  };

  const confirmRename = () => {
    const name = draftName.trim();
    if (name) onRenameScheda(scheda.id, name);
    setRenaming(false);
  };

  return (
    <div className="flex flex-col gap-3 pb-28">
      <SchedaTabs
        schede={schede}
        activeId={activeId}
        onSelect={onSelectScheda}
        onCreate={onCreateScheda}
      />

      <div className="flex items-center gap-2">
        {renaming ? (
          <>
            <input
              ref={inputRef}
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && confirmRename()}
              maxLength={24}
              className="min-w-0 flex-1 rounded-lg border border-accent bg-surface px-2 py-1 text-sm font-semibold text-text focus:outline-none"
            />
            <button
              type="button"
              onClick={confirmRename}
              aria-label="Conferma nome"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-white"
            >
              <Check size={16} />
            </button>
          </>
        ) : (
          <>
            <h2 className="min-w-0 flex-1 truncate text-sm font-semibold text-text">
              {scheda.name}
              <span className="ml-2 font-normal text-text-dim">
                {scheda.items.length === 1 ? "1 esercizio" : `${scheda.items.length} esercizi`}
              </span>
            </h2>
            <button
              type="button"
              onClick={startRename}
              aria-label="Rinomina scheda"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-text-dim active:bg-surface-2"
            >
              <Pencil size={15} />
            </button>
            {schede.length > 1 && (
              <button
                type="button"
                onClick={() => onDeleteScheda(scheda.id)}
                aria-label="Elimina scheda"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-text-dim active:bg-surface-2"
              >
                <Trash2 size={15} />
              </button>
            )}
          </>
        )}
      </div>

      {scheda.items.length === 0 ? (
        <p className="py-16 text-center text-sm text-text-dim">
          Questa scheda è vuota.
          <br />
          Aggiungi esercizi dalla libreria per iniziare.
        </p>
      ) : (
        scheda.items.map((item) => {
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
                  onClick={() => onRemoveItem(ex.id)}
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
                  onChange={(v) => onUpdateItem(ex.id, { sets: v })}
                />
                <Stepper
                  label="Rip."
                  value={item.reps}
                  step={1}
                  min={0}
                  onChange={(v) => onUpdateItem(ex.id, { reps: v })}
                />
                <Stepper
                  label="Peso (kg)"
                  value={item.weight}
                  step={2.5}
                  min={0}
                  onChange={(v) => onUpdateItem(ex.id, { weight: v })}
                />
              </div>

              <input
                value={item.note ?? ""}
                onChange={(e) => onUpdateItem(ex.id, { note: e.target.value })}
                placeholder="Aggiungi una nota..."
                maxLength={140}
                className="mt-2 w-full rounded-xl bg-surface-2 px-3 py-2 text-xs text-text placeholder:text-text-dim focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          );
        })
      )}

      <button
        type="button"
        onClick={onExport}
        className="fixed inset-x-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-10 mx-auto flex max-w-md items-center justify-center gap-2 rounded-2xl bg-accent py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/40"
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
