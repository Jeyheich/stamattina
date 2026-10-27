# stamattina.
PWA personale mobile-first, font di sistema, navigazione inferiore, temi chiaro/scuro, cinque essenziali, cinque principali e otto compatte. Nessuna dipendenza o licenza Apple.

## Sito e prova iPhone
https://jeyheich.github.io/stamattina/
Safari → Condividi → Aggiungi alla schermata Home. L’installazione su Safari fisico deve ancora essere provata da Fabio.
Repository pubblico: https://github.com/Jeyheich/stamattina

## Stato del rilascio
Rassegna reale del 27 ottobre 2026. Workflow inizialmente programmato per le 10:10 Europe/Rome. Avvio esplicito alle 10:10:22 per evitare il ritardo del cron. Esecuzione 40478763078 completata con successo. La schedulazione una tantum viene rimossa dopo la prova per evitare ripetizioni annuali.
Fonti: RaiNews, Istat, Roma Mobilità, Teatro.it, Open, Rai Televideo, Borsa Italiana/Teleborsa, INDIRE, Culture Roma, Agenzia statale cinema Ucraina, Telenuovo. I testi sono sintesi originali brevi. Foto autentiche di repertorio da Commons, mai presentate come scatti di oggi: autore, licenza e provenienza visibili; nessun asset generativo. Le immagini sono servite da Wikimedia, non dal repository.

## Dati e aggiornamento
L’interfaccia legge solo `dist/data/current.json`. Mantiene data di pubblicazione, data evento se disponibile, momento del controllo, evidenza della data, fonte diretta gratuita e metadati fotografici. Le pagine evento senza data di pubblicazione sono dichiarate come tali. I contenuti di archivio/demo della v1 sono nel checkpoint locale, non nell’edizione pubblicata.
Il validatore controlla struttura e campi, non prova da solo verità, gratuità o diritti. Nuove edizioni vanno raccolte e revisionate separatamente; nessuna API key è presente nella PWA.

## Flusso quotidiano ancora da collegare
L’automazione ChatGPT preesistente è intatta: non alimenta la PWA. Nessuna nuova rassegna verrà inventata o ripubblicata con la data cambiata. La UI segnala un’edizione precedente.
`daily.yml` è manuale, con schedulazione commentata: serve un produttore indipendente che raccolga fonti consentite prima delle 09:33 Europe/Rome e prepari `incoming/edition.json`. Obbligatori: controlli editoriali, date, accesso senza paywall, immagini pertinenti con licenza e attribuzione. `promote.mjs` valida l’edizione di oggi, archivia e sostituisce current solo dopo il successo. In errore resta online la versione precedente.
Per attivare: collegare il produttore, provare un giorno intero e un caso di fallimento, poi abilitare la schedulazione. GitHub Actions non garantisce puntualità esatta e può ritardare; prevedere recupero e allarme. Nessuna promessa di notifiche push.

## Avvio e test
`python3 -m http.server 8765 --directory dist`
`node scripts/validate.mjs dist/data/current.json --production`
`node --check dist/app.js`
`node --check dist/sw.js`

Test browser: viewport 390×844 senza overflow; 5 principali, 8 compatte, 5 fotografie caricate; approfondimenti e filtri. Tema e salvati nel dispositivo. Service worker prepara contenuti e immagini dopo la prima apertura online; attendere la preparazione prima di provare offline. Nessuna analisi statistica o tracciamento aggiunto. Link esterni richiedono connessione.
