import { useEffect, useRef, useState } from "react";
import { Check, ChevronRight, Download, Pencil, Trash2 } from "lucide-react";
import MuscleIcon from "./MuscleIcon.jsx";
import SchedaTabs from "./SchedaTabs.jsx";
import ExerciseEditor from "./ExerciseEditor.jsx";
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
  const [editingId, setEditingId] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (renaming) inputRef.current?.select();
  }, [renaming]);

  useEffect(() => {
    setEditingId(null);
  }, [activeId]);

  if (!scheda) return null;

  const editingItem = scheda.items.find((i) => i.exerciseId === editingId);

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
            <button
              key={item.exerciseId}
              type="button"
              onClick={() => setEditingId(item.exerciseId)}
              className="flex w-full items-center gap-3 rounded-2xl border border-border bg-surface p-3 text-left active:bg-surface-2"
            >
              <div className="h-11 w-11 shrink-0 rounded-lg bg-surface-2 p-1">
                <MuscleIcon group={ex.muscleGroup} color={group?.color} className="h-full w-full" />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-text">{ex.name}</h3>
                <p className="mt-0.5 text-xs text-text-dim">
                  <span className="font-medium text-text">
                    {item.sets} × {item.reps}
                  </span>
                  {item.weight > 0 && ` · ${item.weight} kg`}
                </p>
                {item.note?.trim() && (
                  <p className="mt-1 truncate text-xs italic text-text-dim">{item.note}</p>
                )}
              </div>

              <ChevronRight size={18} className="shrink-0 text-text-dim" />
            </button>
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

      {editingItem && (
        <ExerciseEditor
          item={editingItem}
          onUpdate={(patch) => onUpdateItem(editingItem.exerciseId, patch)}
          onRemove={() => {
            onRemoveItem(editingItem.exerciseId);
            setEditingId(null);
          }}
          onClose={() => setEditingId(null)}
        />
      )}
    </div>
  );
}
