# Regole del progetto
- Modello C: 5 essenziali che rimandano alle 5 principali, poi almeno 35 compatte: minimo 5 fatti distinti per ciascuna delle 8 categorie, Sport incluso. Il vecchio limite 12–15 notizie è superato.
- Direzione richiesta: moderna e vicina alle app Apple. Scartata la grafica serif/cartacea v1. Usare font di sistema e navigazione mobile essenziale.
- Notizie JSON separate dalla UI. Mai inventare fatti, date, fotografie o dichiarazioni di accesso gratuito.
- Foto autentiche con fonte, attribuzione, licenza e didascalia; repertorio sempre dichiarato. Conservare originali e crediti.
- Animazioni brevi, interrompibili; fallback senza View Transitions e rispetto di prefers-reduced-motion. Focus e scroll devono restare coerenti.
- La vecchia consegna ChatGPT solo testuale è superata. Fabio richiede una rassegna cloud pronta alle 07:30 anche con il Mac spento e ha autorizzato le scritture GitHub necessarie. Nuove integrazioni, servizi a pagamento o credenziali richiedono consenso.
- Nessuna dipendenza. Test: node scripts/validate.mjs dist/data/current.json --production; node --check dist/app.js; node --check dist/sw.js.
- Server locale: python3 -m http.server 8765 --directory dist. Prima di pubblicare verificare formato iPhone, filtri, apertura/chiusura e offline.
- Distribuzione: Pubblica Stamattina gestisce push dei dati/UI e avvio manuale. Le attività cloud salvano blocchi per categoria; il server assembla incoming/edition.json; il workflow verifica, promuove e pubblica. Il vecchio daily.yml resta disattivato. Non riattivare il cron una tantum del 27 ottobre.

- Raccolta cloud aggiuntiva autorizzata esplicitamente da Fabio: prepare-candidates.yml alle 06:00 Europe/Rome scrive solo automation/candidates/latest.json; il dossier è candidato, mai una verifica editoriale. Le tre attività leggono il dossier prima di fare ricerche.

- Ultima approvazione: solo Plus già pagato + GitHub, zero costi aggiuntivi; Fabio autorizza quota condivisa e rivaluterà il carico. Scartata la proposta di API AI esterne. Produzione per blocchi di 5, salvati in automation/editorial/YYYY-MM-DD/slug.json; nessuna sostituzione dei blocchi validi. Procedura BATCH_BRIEF.md.

- Configurazione finale compatibile con il piano: 3 attività ChatGPT già esistenti, 6 avvii totali (06:03/07:03, 06:10/07:10, 06:17/07:17 Europe/Rome), fino a due blocchi da 5 per run con commit separati. Le altre 2 attività personali restano intatte. Il piano ha rifiutato >1 avvio/ora per singola task e >5 task attive: non riproporre nove avvii ravvicinati nella stessa task né otto task.

- Fonti approvate 27 ottobre: Politica/Cronaca nazionali italiane, niente TGR; Sky TG24, ANSA, Open e alternative gratuite come da BATCH_BRIEF. Roma include Leggo e fatti oltre mobilità. Sport soprattutto calcio italiano, poi F1/tennis e rilievo nazionale; niente riempitivi NFL/cricket. Google News solo scoperta con fonte originale.

- Tecnologia: esattamente 3 Lega Nerd e 2 MegaNerd, anche prova pomeridiana; rimosse HDblog/BBC/Guardian. Ricerca diretta se RSS non leggibile, nessun controllo editoriale/HTTP saltato. MegaNerd cultura nerd va descritta correttamente, senza forzarla come AI.
