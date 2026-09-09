const KEY = "gym-schede-v2";
const LEGACY_KEY = "gym-scheda-v1";

function newId() {
  return `s${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

export function createScheda(name) {
  return { id: newId(), name, items: [] };
}

function emptyState() {
  const scheda = createScheda("A");
  return { schede: [scheda], activeId: scheda.id };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.schede?.length) return parsed;
    }

    // Prima versione dell'app: una scheda sola, salvata come semplice elenco.
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const items = JSON.parse(legacy);
      if (Array.isArray(items) && items.length) {
        const scheda = { ...createScheda("A"), items };
        return { schede: [scheda], activeId: scheda.id };
      }
    }
  } catch {
    // dati illeggibili: si riparte da una scheda vuota
  }

  return emptyState();
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // storage non disponibile (es. modalita' privata): la sessione continua solo in memoria
  }
}
