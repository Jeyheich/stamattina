# Stato operativo — 27 ottobre 2026

## Approvato
- PWA pubblica su Jeyheich/stamattina, modello C: 5 essenziali/principali con foto + 7–10 compatte, 7 categorie. Fonti gratuite e date reali; mai notizie/foto inventate.
- UI moderna vicina alle app Apple, font di sistema, temi e bottom bar; scartata grafica serif/cartacea v1. Swipe categorie e animazioni con Riduci movimento.
- Nuova richiesta: ogni mattina rassegna pronta entro 07:30 Europe/Rome ANCHE A MAC SPENTO. Le 09:33 sono superate. Il produttore deve partire prima (06:45), non alle 07:30.
- Fabio ha autorizzato le scritture GitHub necessarie alla rassegna cloud. Non introdurre altri servizi a pagamento o chiavi API senza consenso.

## Osservato e verificato
- PWA pubblica con edizione cloud 2026-10-27-cloud-retry-101929, 13 notizie, generata 10:19:29 UTC (11:19 Roma). Run 40487572337 SUCCESS; id pubblico letto senza cache e identico al candidato promosso.
- Cloud GitHub lettura/scrittura provata, autorizzazione persistente concessa. Task legge DAILY_BRIEF e scrive solo incoming/edition.json; pipeline valida, promuove, archivia e pubblica senza Mac.
- Attività esistente Rassegna stampa quotidiana RIATTIVATA via ChatGPT: ogni giorno 06:45 Europe/Rome, obiettivo pronta entro 07:30; prossimo avvio pianificato 28 ottobre. UI riletta Ricorrente/Pausa, prompt cloud conservato. UI mostra frequenza Personalizzato senza dettaglio dell'ora; conferma della pianificazione esatta ricevuta dal gestore task, non verificata prima esecuzione futura.
- UI v8 pubblicata, run 40487275349 success. Pulsante testato su sito: Nuova edizione caricata e poi Nessuna nuova edizione; errori/offline distinti nei test locali. Controllo anche all'apertura e al ritorno dopo 5 minuti. Tutte 5 foto caricate; nessun overflow osservato.
- Primo tentativo incompleto; secondo run 40486694776 fallito per Teatro.it403/INDIRE timeout. Controlli NON indeboliti; terzo tentativo cloud ha sostituito le due fonti con RaiNews/Open e superato la pipeline. La verifica pubblica finale è stata completata da Lola: il web tool della task non ha potuto leggerla, quindi quel sottopasso cloud resta un limite operativo.
- daily.yml GitHub resta disabled_manually. Nessuna seconda routine GitHub di raccolta: proposta respinta da revisione automatica e abbandonata.

## Prossimo passo
- Prima consegna ricorrente da verificare dopo il 28 ottobre alle 07:30; nessuna garanzia di puntualità assoluta. In errore conservare l'edizione precedente con data originale, senza fingere un aggiornamento.
- Il pulsante verifica pubblicazioni: non genera da solo nuove notizie. Nessuna nuova API a pagamento o dipendenza installata.

## Controlli
- node scripts/validate.mjs dist/data/current.json --production; node --check dist/app.js; node --check dist/sw.js.
- scripts/verify_sources.py controlla data odierna, freschezza verifica, fonti pubbliche raggiungibili, indicatori di paywall e metadati/licenza Commons. Non sostituisce la verifica editoriale del task.
- Il pulsante Verifica nuova edizione deve distinguere nuova/immutata/offline e non deve dichiarare una ricerca di notizie mai avvenuta.
