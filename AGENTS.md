# Regole del progetto
- Modello C: 5 essenziali che rimandano alle 5 principali, poi almeno 35 compatte: minimo 5 fatti distinti per ciascuna delle 8 categorie, Sport incluso. Il vecchio limite 12–15 notizie è superato.
- Direzione richiesta: moderna e vicina alle app Apple. Scartata la grafica serif/cartacea v1. Usare font di sistema e navigazione mobile essenziale.
- Notizie JSON separate dalla UI. Mai inventare fatti, date, fotografie o dichiarazioni di accesso gratuito.
- Foto autentiche con fonte, attribuzione, licenza e didascalia; repertorio sempre dichiarato. Conservare originali e crediti.
- Animazioni brevi, interrompibili; fallback senza View Transitions e rispetto di prefers-reduced-motion. Focus e scroll devono restare coerenti.
- La vecchia consegna ChatGPT solo testuale è superata. Fabio richiede una rassegna cloud pronta alle 07:30 anche con il Mac spento e ha autorizzato le scritture GitHub necessarie. Nuove integrazioni, servizi a pagamento o credenziali richiedono consenso.
- Nessuna dipendenza. Test: node scripts/validate.mjs dist/data/current.json --production; node --check dist/app.js; node --check dist/sw.js.
- Server locale: python3 -m http.server 8765 --directory dist. Prima di pubblicare verificare formato iPhone, filtri, apertura/chiusura e offline.
- Distribuzione: Pubblica Stamattina gestisce push dei dati/UI e avvio manuale. Il task cloud prepara incoming/edition.json; il workflow verifica, promuove e pubblica. Il vecchio daily.yml resta disattivato. Non riattivare il cron una tantum del 27 ottobre.

- Raccolta cloud aggiuntiva autorizzata esplicitamente da Fabio: prepare-candidates.yml alle 06:00 Europe/Rome scrive solo automation/candidates/latest.json; il dossier è candidato, mai una verifica editoriale. Task 06:45 legge il dossier prima di fare ricerche.
