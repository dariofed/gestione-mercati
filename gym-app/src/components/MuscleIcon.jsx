// Sagoma corpo costruita da forme semplici (non un unico path a mano libera)
// cosi' ogni parte e' posizionata con precisione. La stessa sagoma viene
// riusata per tutti i gruppi muscolari, evidenziando in colore solo la
// zona coinvolta dall'esercizio.
const BASE = "#4a4a52";

const PARTS = {
  head: { tag: "circle", cx: 32, cy: 9, r: 7 },
  torsoUpper: { tag: "rect", x: 21, y: 19, width: 22, height: 15, rx: 6 },
  torsoLower: { tag: "rect", x: 23, y: 32, width: 18, height: 12, rx: 5 },
  shoulderL: { tag: "circle", cx: 15, cy: 22, r: 5 },
  shoulderR: { tag: "circle", cx: 49, cy: 22, r: 5 },
  upperArmL: { tag: "rect", x: 10, y: 24, width: 8, height: 17, rx: 4 },
  upperArmR: { tag: "rect", x: 46, y: 24, width: 8, height: 17, rx: 4 },
  forearmL: { tag: "rect", x: 9, y: 41, width: 7, height: 15, rx: 3.5 },
  forearmR: { tag: "rect", x: 48, y: 41, width: 7, height: 15, rx: 3.5 },
  thighL: { tag: "rect", x: 22, y: 45, width: 9, height: 24, rx: 4 },
  thighR: { tag: "rect", x: 33, y: 45, width: 9, height: 24, rx: 4 },
  calfL: { tag: "rect", x: 22.5, y: 70, width: 8, height: 21, rx: 3.5 },
  calfR: { tag: "rect", x: 33.5, y: 70, width: 8, height: 21, rx: 3.5 },
};

const ALL_PARTS = Object.keys(PARTS);

const HIGHLIGHTS = {
  petto: ["torsoUpper"],
  schiena: ["torsoUpper", "torsoLower"],
  gambe: ["thighL", "thighR", "calfL", "calfR"],
  spalle: ["shoulderL", "shoulderR"],
  bicipiti: ["upperArmL", "upperArmR"],
  tricipiti: ["upperArmL", "upperArmR"],
  addominali: ["torsoLower"],
};

function Shape({ part, fill }) {
  const p = PARTS[part];
  if (p.tag === "circle") return <circle cx={p.cx} cy={p.cy} r={p.r} fill={fill} />;
  return <rect x={p.x} y={p.y} width={p.width} height={p.height} rx={p.rx} fill={fill} />;
}

export default function MuscleIcon({ group, color = "#ff5a1f", className = "" }) {
  if (group === "cardio") {
    return (
      <svg viewBox="0 0 64 96" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {ALL_PARTS.map((part) => (
          <Shape key={part} part={part} fill={BASE} />
        ))}
        <path
          d="M32 30c-5-7-16-5-16 3 0 7 10 12 16 18 6-6 16-11 16-18 0-8-11-10-16-3Z"
          fill={color}
          opacity="0.95"
        />
      </svg>
    );
  }

  const highlighted = new Set(HIGHLIGHTS[group] ?? []);

  return (
    <svg viewBox="0 0 64 96" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {ALL_PARTS.map((part) => (
        <Shape key={part} part={part} fill={highlighted.has(part) ? color : BASE} />
      ))}
    </svg>
  );
}
