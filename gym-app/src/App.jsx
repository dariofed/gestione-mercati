import { useEffect, useMemo, useState } from "react";
import ExerciseLibrary from "./components/ExerciseLibrary.jsx";
import SchedaView from "./components/SchedaView.jsx";
import SchedaTabs from "./components/SchedaTabs.jsx";
import BottomNav from "./components/BottomNav.jsx";
import { createScheda, loadState, saveState } from "./lib/storage.js";
import { exportSchedePdf } from "./lib/pdf.js";

const DEFAULT_ITEM = { sets: 3, reps: 10, weight: 0, note: "" };
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default function App() {
  const [tab, setTab] = useState("esercizi");
  const [state, setState] = useState(() => loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  const activeScheda = state.schede.find((s) => s.id === state.activeId) ?? state.schede[0];

  const schedaIds = useMemo(
    () => new Set(activeScheda.items.map((i) => i.exerciseId)),
    [activeScheda]
  );

  const updateActive = (fn) => {
    setState((prev) => ({
      ...prev,
      schede: prev.schede.map((s) => (s.id === activeScheda.id ? fn(s) : s)),
    }));
  };

  const handleToggle = (exerciseId) => {
    updateActive((s) => ({
      ...s,
      items: s.items.some((i) => i.exerciseId === exerciseId)
        ? s.items.filter((i) => i.exerciseId !== exerciseId)
        : [...s.items, { exerciseId, ...DEFAULT_ITEM }],
    }));
  };

  const handleUpdateItem = (exerciseId, patch) => {
    updateActive((s) => ({
      ...s,
      items: s.items.map((i) => (i.exerciseId === exerciseId ? { ...i, ...patch } : i)),
    }));
  };

  const handleRemoveItem = (exerciseId) => {
    updateActive((s) => ({ ...s, items: s.items.filter((i) => i.exerciseId !== exerciseId) }));
  };

  const handleCreateScheda = () => {
    const used = new Set(state.schede.map((s) => s.name));
    const letter = [...LETTERS].find((l) => !used.has(l)) ?? `${state.schede.length + 1}`;
    const scheda = createScheda(letter);
    setState((prev) => ({ schede: [...prev.schede, scheda], activeId: scheda.id }));
    setTab("scheda");
  };

  const handleRenameScheda = (id, name) => {
    setState((prev) => ({
      ...prev,
      schede: prev.schede.map((s) => (s.id === id ? { ...s, name } : s)),
    }));
  };

  const handleDeleteScheda = (id) => {
    const scheda = state.schede.find((s) => s.id === id);
    if (!confirm(`Eliminare la scheda ${scheda?.name}?`)) return;
    setState((prev) => {
      const schede = prev.schede.filter((s) => s.id !== id);
      return { schede, activeId: prev.activeId === id ? schede[0].id : prev.activeId };
    });
  };

  return (
    <div className="mx-auto min-h-full max-w-md bg-bg">
      <header className="sticky top-0 z-10 border-b border-border bg-bg/95 px-4 pb-4 pt-[calc(1rem+env(safe-area-inset-top))] backdrop-blur">
        <h1 className="text-lg font-bold text-text">
          {tab === "esercizi" ? "Libreria esercizi" : "Le mie schede"}
        </h1>
      </header>

      <main className="px-4 py-4">
        {tab === "esercizi" ? (
          <>
            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-text-dim">
              Aggiungi a
            </p>
            <div className="mb-3">
              <SchedaTabs
                schede={state.schede}
                activeId={activeScheda.id}
                onSelect={(id) => setState((prev) => ({ ...prev, activeId: id }))}
                onCreate={handleCreateScheda}
              />
            </div>
            <ExerciseLibrary schedaIds={schedaIds} onToggle={handleToggle} />
          </>
        ) : (
          <SchedaView
            schede={state.schede}
            activeId={activeScheda.id}
            onSelectScheda={(id) => setState((prev) => ({ ...prev, activeId: id }))}
            onCreateScheda={handleCreateScheda}
            onRenameScheda={handleRenameScheda}
            onDeleteScheda={handleDeleteScheda}
            onUpdateItem={handleUpdateItem}
            onRemoveItem={handleRemoveItem}
            onExport={() => exportSchedePdf(state.schede)}
          />
        )}
      </main>

      <div className="h-[calc(4rem+env(safe-area-inset-bottom))]" />
      <BottomNav
        tab={tab}
        onChange={setTab}
        schedaCount={state.schede.reduce((n, s) => n + s.items.length, 0)}
      />
    </div>
  );
}
