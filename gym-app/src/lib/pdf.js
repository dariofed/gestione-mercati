import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { EXERCISES, MUSCLE_GROUPS } from "../data/exercises.js";

export async function exportSchedaPdf(items) {
  const doc = new jsPDF();
  const today = new Date().toLocaleDateString("it-IT");

  doc.setFontSize(18);
  doc.text("La mia scheda", 14, 18);
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(`Generata il ${today}`, 14, 24);

  const rows = items.map((item) => {
    const ex = EXERCISES.find((e) => e.id === item.exerciseId);
    const group = MUSCLE_GROUPS.find((g) => g.id === ex?.muscleGroup);
    return [
      ex?.name ?? "-",
      group?.label ?? "-",
      String(item.sets ?? ""),
      String(item.reps ?? ""),
      item.weight ? `${item.weight} kg` : "-",
    ];
  });

  autoTable(doc, {
    startY: 30,
    head: [["Esercizio", "Gruppo", "Serie", "Rip.", "Peso"]],
    body: rows,
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [255, 90, 31] },
  });

  const filename = `scheda-${new Date().toISOString().slice(0, 10)}.pdf`;

  // Su iOS in modalita' standalone il download diretto non apre nulla:
  // il foglio di condivisione nativo e' l'unico modo per salvare o stampare.
  const file = new File([doc.output("blob")], filename, { type: "application/pdf" });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: "La mia scheda" });
      return;
    } catch (err) {
      if (err.name === "AbortError") return;
    }
  }

  doc.save(filename);
}
