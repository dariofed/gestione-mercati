import { useEffect, useMemo, useState } from "react";
import ExerciseLibrary from "./components/ExerciseLibrary.jsx";
import SchedaView from "./components/SchedaView.jsx";
import BottomNav from "./components/BottomNav.jsx";
import { loadScheda, saveScheda } from "./lib/storage.js";
import { exportSchedaPdf } from "./lib/pdf.js";

const DEFAULT_ITEM = { sets: 3, reps: 10, weight: 0 };

export default function App() {
  const [tab, setTab] = useState("esercizi");
  const [scheda, setScheda] = useState(() => loadScheda());

  useEffect(() => {
    saveScheda(scheda);
  }, [scheda]);

  const schedaIds = useMemo(() => new Set(scheda.map((i) => i.exerciseId)), [scheda]);

  const handleToggle = (exerciseId) => {
    setScheda((prev) =>
      prev.some((i) => i.exerciseId === exerciseId)
        ? prev.filter((i) => i.exerciseId !== exerciseId)
        : [...prev, { exerciseId, ...DEFAULT_ITEM }]
    );
  };

  const handleUpdate = (exerciseId, patch) => {
    setScheda((prev) => prev.map((i) => (i.exerciseId === exerciseId ? { ...i, ...patch } : i)));
  };

  const handleRemove = (exerciseId) => {
    setScheda((prev) => prev.filter((i) => i.exerciseId !== exerciseId));
  };

  const handleClear = () => {
    if (confirm("Svuotare tutta la scheda?")) setScheda([]);
  };

  return (
    <div className="mx-auto min-h-full max-w-md bg-bg">
      <header className="sticky top-0 z-10 border-b border-border bg-bg/95 px-4 py-4 backdrop-blur">
        <h1 className="text-lg font-bold text-text">
          {tab === "esercizi" ? "Libreria esercizi" : "La mia scheda"}
        </h1>
      </header>

      <main className="px-4 py-4">
        {tab === "esercizi" ? (
          <ExerciseLibrary schedaIds={schedaIds} onToggle={handleToggle} />
        ) : (
          <SchedaView
            items={scheda}
            onUpdate={handleUpdate}
            onRemove={handleRemove}
            onClear={handleClear}
            onExport={() => exportSchedaPdf(scheda)}
          />
        )}
      </main>

      <div className="h-16" />
      <BottomNav tab={tab} onChange={setTab} schedaCount={scheda.length} />
    </div>
  );
}
