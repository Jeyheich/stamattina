# Il mondo, stamattina
Demo locale PWA, senza dipendenze, licenza Apple o account a pagamento. Nessuna pubblicazione o automazione è stata eseguita.

## Avvio
Dalla cartella del progetto: `python3 -m http.server 8765 --directory dist`. Aprire http://localhost:8765. Su iPhone localhost indica l’iPhone: per l’installazione usare la futura URL HTTPS GitHub Pages.

## Contenuti
`dist/data/current.json` è l’unica edizione letta dalla UI. Cinque essenziali rimandano agli stessi cinque approfondimenti; seguono otto schede compatte. Demo: documenti fotografici NASA di archivio e schede esplicitamente esemplificative. Non sono attualità del 27 ottobre. Date e provenienza arrivano dal catalogo pubblico NASA, controllato durante la costruzione; le descrizioni sono intenzionalmente limitate. `photos.json` conserva i metadati acquisiti. Nessuna foto generata.

## Pubblicazione GitHub Pages
1. Scegliere/creare repository e autorizzare caricamento. Per evitare costi usare un repository pubblico, consapevoli che codice e contenuti saranno pubblici.
2. Caricare il contenuto di questa cartella nella radice del repository.
3. In Settings → Pages selezionare GitHub Actions; avviare manualmente `Demo Pages`.
4. Verificare la URL HTTPS risultante su Safari iPhone, offline e Aggiungi alla schermata Home. I percorsi sono relativi e compatibili con /nome-repository/.
Le Actions sono predisposte, non provate su un repository remoto. Verificare condizioni correnti e disponibilità del piano GitHub prima di attivarle.

## Flusso quotidiano delle 09:33 Europe/Rome
La PWA non esegue cron sul telefono, né legge l’automazione ChatGPT. Occorre un produttore indipendente, avviato PRIMA delle 09:33, che raccolga fonti gratuite consentite e prepari `incoming/edition.json` con fotografie locali già in `dist/assets/`.

Fasi obbligatorie: selezione 12–15 fatti reali, deduplicazione, verifica del testo completo senza login/paywall, data originale ed evento separati nella prosa, verifica contenuto e pertinenza foto, diritti/attribuzione, revisione editoriale e validazione. Per `mode: live`, ogni articolo deve avere `status: verified`, `publishedAt`, `verifiedAt`, fonte HTTPS con `access: free`, `accessCheckedAt`, `dateEvidence`, `reviewedBy`. Ogni foto richiede `reuseApproved: true` oltre a fonte, crediti e diritti. I campi sono evidenze da compilare dopo controlli reali; il validatore non prova da solo la verità o la gratuità.

`scripts/promote.mjs` rifiuta demo, edizioni con data diversa da oggi a Roma o immagini mancanti; scrive archivio e sostituisce current solo dopo validazione. Se il lavoro fallisce, la pubblicazione precedente resta online. Il workflow giornaliero fallisce se manca l’edizione revisionata: nessuna notizia sostitutiva inventata.

Il workflow daily è predisposto ma la schedulazione è COMMENTATA. Due orari UTC 07:33 e 08:33 con gate dell’ora locale gestiscono CET/CEST. GitHub può ritardare o saltare esecuzioni: NON è una garanzia esatta alle 09:33. Per puntualità servono un servizio di scheduling con Europe/Rome e monitoraggio di successo, retry e allarme. Il gate scarta esecuzioni fuori dalle 09, quindi un ritardo ampio richiede recupero manuale. La preparazione del JSON non è ancora collegata. Nessuna chiave nella UI: eventuali API solo nei repository secrets e in un processo server.

Prima di attivare: scegliere fonti e diritti immagini; decidere revisione umana o controlli editoriali assistiti; collegare il produttore al repository; testare dry-run e fallimenti, doppia esecuzione, cambio ora, rollback. Non sostituire l’automazione ChatGPT senza ispezionarla e decisione esplicita.

## Test e limiti
`node scripts/validate.mjs dist/data/current.json`; `node --check dist/app.js`; `node --check dist/sw.js`.
Tema e salvati persistono sul dispositivo. Cache same-origin dopo prima visita, nessun push; offline conserva ciò che è stato caricato. Nessun analytics. Font di sistema. Fotografie di archivio NASA: prima di pubblicarle confermare termini e crediti specifici, comprese immagini composite con contributi terzi. La demo non verifica una nuova rassegna ogni giorno.

Documentazione GitHub consultata: https://docs.github.com/en/pages/getting-started-with-github-pages e https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax. Il doppio orario UTC è una scelta esplicita di compatibilità; la documentazione attuale descrive anche `timezone` IANA. Nessuna dipendenza dalla disponibilità di tale estensione.
