# Stato operativo — 27 ottobre 2026

## Approvato
- PWA pubblica su Jeyheich/stamattina, modello C: 5 essenziali/principali con foto + 7–10 compatte, 7 categorie. Fonti gratuite e date reali; mai notizie/foto inventate.
- UI moderna vicina alle app Apple, font di sistema, temi e bottom bar; scartata grafica serif/cartacea v1. Swipe categorie e animazioni con Riduci movimento.
- Nuova richiesta: ogni mattina rassegna pronta entro 07:30 Europe/Rome ANCHE A MAC SPENTO. Le 09:33 sono superate. Il produttore deve partire prima (06:45), non alle 07:30.
- Fabio ha autorizzato le scritture GitHub necessarie alla rassegna cloud. Non introdurre altri servizi a pagamento o chiavi API senza consenso.

## Osservato
- PWA pubblica con edizione reale precedente del 27 ottobre, 13 articoli. Swipe e animazioni pubblicati e testati.
- Cloud GitHub lettura/scrittura provata; autorizzazione persistente concessa da Fabio. Il task legge DAILY_BRIEF e scrive incoming/edition.json, senza Mac.
- Pipeline incoming e UI v8 pubblicate: confronto edizione, esito visibile nuovo/immutato/offline/errore; controllo apertura e ritorno dopo 5 minuti.
- Task ChatGPT ancora in pausa, prompt definitivo salvato; avvio previsto 06:45 Europe/Rome per obiettivo 07:30. Verificare nuovamente frequenza/orario prima della ripresa.
- Primo tentativo completo non terminato. Secondo commit b110253d6816b9c060a4d71098f699564b20bd1e con 13 notizie, ma run 40486694776 fallito: Teatro.it HTTP403, INDIRE timeout. Foto tutte superate. Il produttore ha ammesso verifiche editoriali incomplete: NON promuovere questo file manualmente.
- Diagnostica migliorata con id articolo. Procedura chiarisce che fetch_commit_workflow_runs filtra PR e non trova push; usare elenco Actions pubblico. Terzo collaudo cloud avviato con sostituzione fonti e verifica completa richiesta.
- daily.yml GitHub resta disabled_manually. Nessuna seconda routine GitHub di raccolta: proposta respinta da revisione automatica e abbandonata.

## Prossimi passi necessari
1. Verificare il terzo collaudo cloud: controlli effettivi, workflow riuscito e id pubblico uguale al candidato.
2. Solo dopo successo: riprendere task ogni giorno alle 06:45 Europe/Rome; rileggere stato e orario. Nessuna garanzia di puntualità assoluta del cloud.
3. Non dichiarare attivo il flusso prima del collaudo. In errore resta l'ultima edizione con data originale.

## Controlli
- node scripts/validate.mjs dist/data/current.json --production; node --check dist/app.js; node --check dist/sw.js.
- scripts/verify_sources.py controlla data odierna, freschezza verifica, fonti pubbliche raggiungibili, indicatori di paywall e metadati/licenza Commons. Non sostituisce la verifica editoriale del task.
- Il pulsante Verifica nuova edizione deve distinguere nuova/immutata/offline e non deve dichiarare una ricerca di notizie mai avvenuta.
