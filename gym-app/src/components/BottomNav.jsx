import { Dumbbell, ClipboardList } from "lucide-react";

export default function BottomNav({ tab, onChange, schedaCount }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-md">
        <NavButton
          icon={<Dumbbell size={20} />}
          label="Esercizi"
          active={tab === "esercizi"}
          onClick={() => onChange("esercizi")}
        />
        <NavButton
          icon={<ClipboardList size={20} />}
          label="Scheda"
          active={tab === "scheda"}
          onClick={() => onChange("scheda")}
          badge={schedaCount > 0 ? schedaCount : null}
        />
      </div>
    </nav>
  );
}

function NavButton({ icon, label, active, onClick, badge }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium ${
        active ? "text-accent" : "text-text-dim"
      }`}
    >
      <span className="relative">
        {icon}
        {badge && (
          <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
            {badge}
          </span>
        )}
      </span>
      <span>{label}</span>
    </button>
  );
}
