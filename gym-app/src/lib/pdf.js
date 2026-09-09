import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { EXERCISES, MUSCLE_GROUPS } from "../data/exercises.js";

export async function exportSchedePdf(schede) {
  const doc = new jsPDF();
  const today = new Date().toLocaleDateString("it-IT");

  doc.setFontSize(18);
  doc.text("Le mie schede", 14, 18);
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(`Generate il ${today}`, 14, 24);

  let y = 32;

  for (const scheda of schede) {
    if (scheda.items.length === 0) continue;

    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(13);
    doc.setTextColor(30);
    doc.text(scheda.name, 14, y);

    const rows = scheda.items.map((item) => {
      const ex = EXERCISES.find((e) => e.id === item.exerciseId);
      const group = MUSCLE_GROUPS.find((g) => g.id === ex?.muscleGroup);
      const note = item.note?.trim();
      return [
        note ? `${ex?.name ?? "-"}\n${note}` : (ex?.name ?? "-"),
        group?.label ?? "-",
        String(item.sets ?? ""),
        String(item.reps ?? ""),
        item.weight ? `${item.weight} kg` : "-",
      ];
    });

    autoTable(doc, {
      startY: y + 4,
      head: [["Esercizio", "Gruppo", "Serie", "Rip.", "Peso"]],
      body: rows,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [255, 90, 31] },
      columnStyles: { 0: { cellWidth: 74 } },
    });

    y = doc.lastAutoTable.finalY + 12;
  }

  const filename = `schede-${new Date().toISOString().slice(0, 10)}.pdf`;

  // Su iOS in modalita' standalone il download diretto non apre nulla:
  // il foglio di condivisione nativo e' l'unico modo per salvare o stampare.
  const file = new File([doc.output("blob")], filename, { type: "application/pdf" });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: "Le mie schede" });
      return;
    } catch (err) {
      if (err.name === "AbortError") return;
    }
  }

  doc.save(filename);
}
