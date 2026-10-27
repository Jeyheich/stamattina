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

## Flusso quotidiano cloud in collaudo
La vecchia consegna testuale delle 09:33 è superata. La richiesta è una rassegna disponibile entro le 07:30 Europe/Rome anche con il Mac spento, con avvio cloud anticipato alle 06:45. L'autorizzazione persistente GitHub è concessa e la scrittura è provata; il collaudo editoriale completo non è ancora passato, quindi la task resta in pausa.
La task legge automation/DAILY_BRIEF.md e scrive incoming/edition.json. Pages parte su push, verifica fonti/foto/date, valida, promuove, archivia e pubblica. Il secondo collaudo è stato bloccato da HTTP403 e timeout, lasciando intatta l'edizione pubblica. Il vecchio daily.yml è disattivato. Nessuna API key nella PWA né nuovo servizio a pagamento.
Il pulsante Verifica nuova edizione confronta la pubblicazione e carica eventuali nuovi dati; non avvia ricerca web. Anche apertura e ritorno dopo cinque minuti controllano il file. Gli esiti nuova/immutata/offline/errore sono distinti. Nessuna promessa di notifiche push o puntualità assoluta.

## Avvio e test
`python3 -m http.server 8765 --directory dist`
`node scripts/validate.mjs dist/data/current.json --production`
`node --check dist/app.js`
`node --check dist/sw.js`

Test browser: viewport 390×844 senza overflow; 5 principali, 8 compatte, 5 fotografie caricate; approfondimenti e filtri. Tema e salvati nel dispositivo. Service worker prepara contenuti e immagini dopo la prima apertura online; attendere la preparazione prima di provare offline. Nessuna analisi statistica o tracciamento aggiunto. Link esterni richiedono connessione.

## Movimento
Filtri: View Transitions con identità stabile delle schede e transizioni di circa 260 ms; fallback breve per browser meno recenti. Lettura: apertura di 300 ms e uscita di 180 ms, focus restituito alla scheda, scorrimento pagina bloccato durante la lettura. Riduci movimento disabilita questi movimenti.

## Swipe sul telefono
Scorri orizzontalmente sulle notizie: a sinistra vai alla categoria successiva, a destra torni alla precedente. Funziona anche sui titoli e mentre sei più in basso nella pagina. I bordi dello schermo restano a Safari; lo scorrimento verticale e il pinch zoom sono nativi. I movimenti troppo brevi ritornano alla posizione iniziale. Il menu resta disponibile come alternativa. A cambio sezione si torna all’inizio dei risultati e il filtro attivo viene portato in vista.

## Nuovo flusso richiesto (07:30 anche a Mac spento)
La vecchia consegna testuale è stata sospesa. Si collauda una task ChatGPT cloud con il GitHub già collegato: avvio anticipato 06:45 Europe/Rome, obiettivo di pubblicazione entro le 07:30. La prova di scrittura cloud è riuscita; la schedulazione finale va attivata solo dopo il collaudo dell’intera rassegna. Nessun nuovo servizio API a pagamento.
La task legge automation/DAILY_BRIEF.md e scrive incoming/edition.json. Il workflow Pages parte automaticamente, controlla fonti e foto, valida il formato, promuove e archivia, pubblica. Una verifica fallita interrompe la pubblicazione. Il bottone Verifica nuova edizione confronta quanto è pubblicato; all’apertura e al ritorno nell’app dopo cinque minuti viene effettuato un controllo. Non è un comando di raccolta delle notizie.
