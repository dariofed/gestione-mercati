export const MUSCLE_GROUPS = [
  { id: "petto", label: "Petto", color: "#ff5a1f" },
  { id: "schiena", label: "Schiena", color: "#3fa9f5" },
  { id: "gambe", label: "Gambe", color: "#4caf50" },
  { id: "spalle", label: "Spalle", color: "#ffc107" },
  { id: "bicipiti", label: "Bicipiti", color: "#c084fc" },
  { id: "tricipiti", label: "Tricipiti", color: "#f472b6" },
  { id: "addominali", label: "Addominali", color: "#22d3ee" },
  { id: "cardio", label: "Cardio", color: "#ef4444" },
];

export const EQUIPMENT = {
  bilanciere: "Bilanciere",
  manubri: "Manubri",
  macchina: "Macchina",
  cavi: "Cavi",
  "corpo-libero": "Corpo libero",
};

export const EXERCISES = [
  // PETTO
  { id: "panca-piana", name: "Panca piana", muscleGroup: "petto", equipment: "bilanciere", description: "Disteso su panca, spingi il bilanciere dal petto verso l'alto a braccia tese." },
  { id: "panca-inclinata", name: "Panca inclinata", muscleGroup: "petto", equipment: "bilanciere", description: "Come la panca piana ma su panca inclinata, per la parte alta del petto." },
  { id: "spinte-manubri", name: "Spinte con manubri", muscleGroup: "petto", equipment: "manubri", description: "Disteso su panca, spingi due manubri verso l'alto partendo dal petto." },
  { id: "croci-manubri", name: "Croci con manubri", muscleGroup: "petto", equipment: "manubri", description: "Disteso su panca, apri le braccia leggermente piegate e richiudile sopra il petto." },
  { id: "chest-press", name: "Chest press", muscleGroup: "petto", equipment: "macchina", description: "Seduto alla macchina, spingi le maniglie in avanti fino a distendere le braccia." },
  { id: "croci-cavi", name: "Croci ai cavi", muscleGroup: "petto", equipment: "cavi", description: "In piedi tra due cavi, porta le maniglie davanti al petto con movimento ad arco." },
  { id: "piegamenti", name: "Piegamenti sulle braccia", muscleGroup: "petto", equipment: "corpo-libero", description: "In posizione plank, piega le braccia abbassando il petto verso il pavimento e risali." },
  { id: "dip-petto", name: "Dip alle parallele", muscleGroup: "petto", equipment: "corpo-libero", description: "Sospeso alle parallele, piega le braccia inclinando il busto in avanti e spingi verso l'alto." },

  // SCHIENA
  { id: "trazioni", name: "Trazioni alla sbarra", muscleGroup: "schiena", equipment: "corpo-libero", description: "Appeso alla sbarra, tira il corpo verso l'alto fino a portare il mento sopra la sbarra." },
  { id: "lat-machine", name: "Lat machine", muscleGroup: "schiena", equipment: "macchina", description: "Seduto, tira la barra dall'alto verso il petto mantenendo il busto fermo." },
  { id: "rematore-bilanciere", name: "Rematore con bilanciere", muscleGroup: "schiena", equipment: "bilanciere", description: "Busto inclinato in avanti, tira il bilanciere verso l'addome mantenendo la schiena dritta." },
  { id: "rematore-manubrio", name: "Rematore con manubrio", muscleGroup: "schiena", equipment: "manubri", description: "Un ginocchio e una mano appoggiati alla panca, tira il manubrio verso il fianco." },
  { id: "pulley", name: "Pulley basso", muscleGroup: "schiena", equipment: "cavi", description: "Seduto, tira la maniglia verso l'addome mantenendo il busto eretto." },
  { id: "stacco-terra", name: "Stacco da terra", muscleGroup: "schiena", equipment: "bilanciere", description: "Solleva il bilanciere da terra estendendo anche e ginocchia, schiena sempre dritta." },
  { id: "iperestensioni", name: "Iperestensioni", muscleGroup: "schiena", equipment: "corpo-libero", description: "Sul banco per lombari, solleva il busto fino ad allinearlo con le gambe." },

  // GAMBE
  { id: "squat", name: "Squat con bilanciere", muscleGroup: "gambe", equipment: "bilanciere", description: "Bilanciere sulle spalle, piega le ginocchia scendendo con i fianchi indietro e risali." },
  { id: "leg-press", name: "Leg press", muscleGroup: "gambe", equipment: "macchina", description: "Seduto alla macchina, spingi la pedana in avanti distendendo le gambe." },
  { id: "affondi", name: "Affondi con manubri", muscleGroup: "gambe", equipment: "manubri", description: "Fai un passo avanti e piega entrambe le ginocchia a 90 gradi, poi torna su." },
  { id: "leg-extension", name: "Leg extension", muscleGroup: "gambe", equipment: "macchina", description: "Seduto alla macchina, estendi le gambe sollevando il rullo con i quadricipiti." },
  { id: "leg-curl", name: "Leg curl", muscleGroup: "gambe", equipment: "macchina", description: "Sdraiato o seduto, piega le ginocchia portando il rullo verso i glutei." },
  { id: "stacco-rumeno", name: "Stacco rumeno", muscleGroup: "gambe", equipment: "bilanciere", description: "Gambe quasi tese, fai scendere il bilanciere lungo le cosce mantenendo la schiena dritta." },
  { id: "polpacci-macchina", name: "Calf raise (polpacci)", muscleGroup: "gambe", equipment: "macchina", description: "In piedi alla macchina, solleva i talloni spingendo sulle punte dei piedi." },
  { id: "squat-corpo-libero", name: "Squat a corpo libero", muscleGroup: "gambe", equipment: "corpo-libero", description: "Senza pesi, piega le ginocchia scendendo con i fianchi indietro e risali." },

  // SPALLE
  { id: "military-press", name: "Military press", muscleGroup: "spalle", equipment: "bilanciere", description: "In piedi o seduto, spingi il bilanciere sopra la testa partendo dalle spalle." },
  { id: "spinte-manubri-spalle", name: "Spinte con manubri sopra la testa", muscleGroup: "spalle", equipment: "manubri", description: "Seduto, spingi due manubri verso l'alto partendo dall'altezza delle spalle." },
  { id: "alzate-laterali", name: "Alzate laterali", muscleGroup: "spalle", equipment: "manubri", description: "In piedi, solleva i manubri lateralmente fino all'altezza delle spalle." },
  { id: "alzate-frontali", name: "Alzate frontali", muscleGroup: "spalle", equipment: "manubri", description: "In piedi, solleva i manubri davanti a te fino all'altezza delle spalle." },
  { id: "shoulder-press-macchina", name: "Shoulder press", muscleGroup: "spalle", equipment: "macchina", description: "Seduto alla macchina, spingi le maniglie verso l'alto sopra la testa." },
  { id: "alzate-cavi", name: "Alzate laterali ai cavi", muscleGroup: "spalle", equipment: "cavi", description: "In piedi di fianco al cavo, solleva il braccio lateralmente fino alla spalla." },

  // BICIPITI
  { id: "curl-bilanciere", name: "Curl con bilanciere", muscleGroup: "bicipiti", equipment: "bilanciere", description: "In piedi, piega i gomiti sollevando il bilanciere verso il petto." },
  { id: "curl-manubri", name: "Curl con manubri", muscleGroup: "bicipiti", equipment: "manubri", description: "In piedi, piega i gomiti sollevando i manubri alternando o insieme." },
  { id: "curl-martello", name: "Curl a martello", muscleGroup: "bicipiti", equipment: "manubri", description: "Come il curl classico ma con i palmi rivolti verso il corpo." },
  { id: "curl-cavi", name: "Curl ai cavi", muscleGroup: "bicipiti", equipment: "cavi", description: "In piedi davanti al cavo basso, piega i gomiti tirando la barra verso il petto." },
  { id: "curl-panca-scott", name: "Curl alla panca Scott", muscleGroup: "bicipiti", equipment: "bilanciere", description: "Braccia appoggiate alla panca inclinata, piega i gomiti sollevando il bilanciere." },

  // TRICIPITI
  { id: "push-down", name: "Push down ai cavi", muscleGroup: "tricipiti", equipment: "cavi", description: "In piedi davanti al cavo alto, spingi la barra verso il basso distendendo i gomiti." },
  { id: "french-press", name: "French press", muscleGroup: "tricipiti", equipment: "bilanciere", description: "Sdraiato, abbassa il bilanciere dietro la testa piegando i gomiti e risali." },
  { id: "dip-tricipiti", name: "Dip su panca", muscleGroup: "tricipiti", equipment: "corpo-libero", description: "Mani sul bordo della panca, piega i gomiti abbassando il bacino e risali." },
  { id: "estensioni-manubrio", name: "Estensioni con manubrio", muscleGroup: "tricipiti", equipment: "manubri", description: "Manubrio sopra la testa a due mani, piega i gomiti abbassandolo dietro la nuca." },
  { id: "kickback", name: "Kickback con manubrio", muscleGroup: "tricipiti", equipment: "manubri", description: "Busto inclinato in avanti, estendi il braccio indietro con il manubrio in mano." },

  // ADDOMINALI
  { id: "plank", name: "Plank", muscleGroup: "addominali", equipment: "corpo-libero", description: "Mantieni la posizione a ponte su avambracci e punte dei piedi, corpo dritto." },
  { id: "crunch", name: "Crunch", muscleGroup: "addominali", equipment: "corpo-libero", description: "Sdraiato, solleva le spalle da terra contraendo gli addominali." },
  { id: "sollevamento-gambe", name: "Sollevamento gambe", muscleGroup: "addominali", equipment: "corpo-libero", description: "Sdraiato o appeso alla sbarra, solleva le gambe tese verso l'alto." },
  { id: "russian-twist", name: "Russian twist", muscleGroup: "addominali", equipment: "corpo-libero", description: "Seduto con busto inclinato indietro, ruota il busto da un lato all'altro." },
  { id: "crunch-cavi", name: "Crunch ai cavi", muscleGroup: "addominali", equipment: "cavi", description: "In ginocchio davanti al cavo alto, piega il busto in avanti contraendo l'addome." },

  // CARDIO
  { id: "tapis-roulant", name: "Tapis roulant", muscleGroup: "cardio", equipment: "macchina", description: "Corsa o camminata a ritmo costante sul tappeto per il lavoro cardiovascolare." },
  { id: "cyclette", name: "Cyclette", muscleGroup: "cardio", equipment: "macchina", description: "Pedalata a ritmo costante o a intervalli per il lavoro cardiovascolare." },
  { id: "vogatore", name: "Vogatore", muscleGroup: "cardio", equipment: "macchina", description: "Movimento di remata a ritmo costante, coinvolge tutto il corpo." },
  { id: "jumping-jack", name: "Jumping jack", muscleGroup: "cardio", equipment: "corpo-libero", description: "Salti a corpo libero aprendo e chiudendo gambe e braccia." },
  { id: "burpees", name: "Burpees", muscleGroup: "cardio", equipment: "corpo-libero", description: "Piegamento, salto indietro in plank, piegamento e salto verticale in sequenza." },
];
