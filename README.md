# stamattina.

Rassegna personale PWA: https://jeyheich.github.io/stamattina/

Su iPhone: Safari → Condividi → Aggiungi alla schermata Home. Non servono certificati o account sviluppatore Apple.

40 articoli, cinque per categoria, Sport incluso. Cinque essenziali rimandano alle cinque principali con fotografie autentiche attribuite; 35 schede compatte aprono approfondimenti e fonti gratuite. JSON separato dalla UI, repertorio dichiarato, temi, salvati locali, swipe e movimento ridotto.

## Aggiornamento cloud
Raccolta candidati GitHub alle 06:00 Europe/Rome. Tre attività ChatGPT Plus, sei avvii: 06:03/07:03, 06:10/07:10, 06:17/07:17. Ogni esecuzione lavora su massimo due categorie con checkpoint separati; recuperi saltano blocchi validi. GitHub assembla solo otto blocchi completi, verifica fonti/date/foto, pubblica e confronta il JSON pubblico. In errore conserva l'ultima edizione.

Obiettivo 07:30 anche a Mac spento. Solo quota condivisa Plus e GitHub, nessuna API AI o spesa aggiuntiva. Puntualità non garantita; primo ciclo ricorrente completo da osservare il 28 ottobre 2026. Nove avvii ravvicinati e otto attività sono stati rifiutati dai limiti nativi; tre attività e sei avvii sono la configurazione salvata.

Verifica nuova edizione controlla pubblicazioni disponibili, non avvia ricerche. Controlla anche all'apertura e al ritorno dopo cinque minuti. Offline conserva notizie e cinque foto già caricate; le fonti esterne richiedono connessione.

## Collaudo
Edizione 27 ottobre: 40 notizie, cinque per categoria; controlli fonti/foto superati, pubblicazione verificata (40506210061). PWA v10 (40507960046): Sport cinque notizie, apertura/chiusura, formato 390px senza overflow, reload offline con 40 articoli e cinque foto. Prima edizione con interventi di collaudo: non prova ancora un intero ciclo mattutino autonomo.

Procedura: automation/BATCH_BRIEF.md. Stato e programmazione dettagliata: PROJECT_STATE.md. Vecchio daily.yml disattivato.

## Sviluppo senza dipendenze
Server: python3 -m http.server 8765 --directory dist.
Controlli: node scripts/test_batches.mjs; node scripts/validate.mjs dist/data/current.json --production --balanced; node --check dist/app.js; node --check dist/sw.js. Fixture solo in memoria. Verifiche HTTP complete nel workflow prima della pubblicazione.
