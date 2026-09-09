# Scheda Palestra

App scura e semplice per creare la propria scheda di allenamento al posto del foglio cartaceo.

- Sfoglia la libreria di esercizi (con illustrazione, gruppo muscolare, attrezzo e breve descrizione) filtrando per gruppo muscolare o cercando per nome.
- Seleziona gli esercizi per aggiungerli alla tua scheda.
- Per ogni esercizio imposta serie, ripetizioni e peso: i valori restano salvati nel telefono/browser, cosi' la volta dopo li ritrovi gia' pronti.
- Esporta la scheda in PDF per averla sempre con te.

Tutto funziona interamente nel browser (nessun account, nessun server): i dati sono salvati in locale con `localStorage`.

## Sviluppo

```bash
npm install
npm run dev
```

## Build di produzione

```bash
npm run build
npm run preview
```

## Pubblicazione su Vercel

L'app va pubblicata come progetto Vercel **separato** da quello gia' collegato a questo
repository, cosi' l'app di gestione mercati resta intatta. Dal dashboard Vercel:

1. **Add New → Project** e scegli il repository `gestione-mercati`.
2. Imposta **Root Directory** su `gym-app` (e' l'unica impostazione da cambiare:
   framework, comando di build e cartella di output vengono rilevati da soli).
3. **Deploy**.

Ogni push sul branch aggiorna automaticamente il deploy.

## Installazione su iPhone

L'app e' una PWA: si installa dalla home senza passare dall'App Store.

1. Apri l'URL del deploy con **Safari** (non funziona da Chrome su iOS).
2. Tocca il pulsante **Condividi** e scegli **Aggiungi alla schermata Home**.
3. Avvia l'app dall'icona: parte a schermo intero, senza barre del browser.

Dopo la prima apertura l'app viene memorizzata sul telefono e funziona anche senza
connessione. L'esportazione PDF apre il foglio di condivisione di iOS, da cui puoi
salvare il file in **File**, stamparlo o inviarlo.
