# Regole del progetto
- Modello C: 5 essenziali che rimandano alle 5 principali, poi 7–10 compatte.
- Direzione richiesta: moderna e vicina alle app Apple. Scartata la grafica serif/cartacea v1. Usare font di sistema e navigazione mobile essenziale.
- Notizie JSON separate dalla UI. Mai inventare fatti, date, fotografie o dichiarazioni di accesso gratuito.
- Foto autentiche con fonte, attribuzione, licenza e didascalia; repertorio sempre dichiarato. Conservare originali e crediti.
- Animazioni brevi, interrompibili; fallback senza View Transitions e rispetto di prefers-reduced-motion. Focus e scroll devono restare coerenti.
- Non modificare l’automazione ChatGPT esistente. La pubblicazione GitHub è autorizzata per questo progetto; nuove integrazioni o spese richiedono consenso.
- Nessuna dipendenza. Test: node scripts/validate.mjs dist/data/current.json --production; node --check dist/app.js; node --check dist/sw.js.
- Server locale: python3 -m http.server 8765 --directory dist. Prima di pubblicare verificare formato iPhone, filtri, apertura/chiusura e offline.
- Distribuzione: Pages via workflow manuale Pubblica Stamattina. Non riattivare il cron una tantum del 27 ottobre né quello quotidiano senza produttore/revisione funzionanti.
