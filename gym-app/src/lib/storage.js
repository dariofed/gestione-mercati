const KEY = "gym-scheda-v1";

export function loadScheda() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveScheda(items) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // storage non disponibile (es. modalita' privata): la sessione continua solo in memoria
  }
}
