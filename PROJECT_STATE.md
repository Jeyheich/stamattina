# Stato operativo — 27 ottobre 2026

## Approvato
- PWA pubblica su Jeyheich/stamattina, modello C: 5 essenziali/principali con foto + 7–10 compatte, 7 categorie. Fonti gratuite e date reali; mai notizie/foto inventate.
- UI moderna vicina alle app Apple, font di sistema, temi e bottom bar; scartata grafica serif/cartacea v1. Swipe categorie e animazioni con Riduci movimento.
- Nuova richiesta: ogni mattina rassegna pronta entro 07:30 Europe/Rome ANCHE A MAC SPENTO. Le 09:33 sono superate. Il produttore deve partire prima (06:45), non alle 07:30.
- Fabio ha autorizzato le scritture GitHub necessarie alla rassegna cloud. Non introdurre altri servizi a pagamento o chiavi API senza consenso.

## Osservato
- Sito https://jeyheich.github.io/stamattina/ con edizione reale statica del 27 ottobre, 13 articoli.
- Swipe v6 verificato pubblico, commit 27e5adc42e7d085aed5fd2d63836fd231b915ff8, run 40481270291 success. Offline con 5 foto testato.
- Vecchia Rassegna stampa quotidiana di ChatGPT sospesa; GitHub daily.yml disabled_manually. Pages senza cron.
- Prova cloud effettuata dalla task ChatGPT: automation/cloud-probe.json scritto davvero su GitHub, result github-write-ok, controllo 09:56:27 UTC. Questa prova dimostra scrittura cloud, non ancora una rassegna quotidiana completa pubblicata.
- La task è ancora in pausa, con istruzioni temporanee della prova. Backup istruzioni originali nel work locale; istruzioni nuove durevoli in automation/DAILY_BRIEF.md.
- UI v7 e pipeline incoming con controlli HTTP/Commons pronte localmente, da pubblicare e collaudare.

## Prossimi passi necessari
1. Pubblicare correzione del pulsante e pipeline: push incoming/edition.json → controlli → archivio/current → Pages, senza dipendenze locali.
2. Sostituire prompt di prova con la procedura DAILY_BRIEF; eseguire una rassegna vera dal cloud e verificare la nuova edizione pubblica.
3. Solo dopo successo: riattivare task giornaliera alle 06:45 Europe/Rome con obiettivo consegna entro 07:30; rileggere orario e stato.
4. Non dichiarare garantito/attivo il flusso finché il collaudo completo non passa. In errore resta la vecchia edizione e va indicata la causa.

## Controlli
- node scripts/validate.mjs dist/data/current.json --production; node --check dist/app.js; node --check dist/sw.js.
- scripts/verify_sources.py controlla data odierna, freschezza verifica, fonti pubbliche raggiungibili, indicatori di paywall e metadati/licenza Commons. Non sostituisce la verifica editoriale del task.
- Il pulsante Verifica nuova edizione deve distinguere nuova/immutata/offline e non deve dichiarare una ricerca di notizie mai avvenuta.
