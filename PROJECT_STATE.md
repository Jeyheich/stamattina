# Stamattina — checkpoint 27 ottobre 2026

## Ultime decisioni approvate
- Pubblicazione su Jeyheich/stamattina e https://jeyheich.github.io/stamattina/ autorizzata; PWA iPhone, UI Apple con temi, salvati, swipe e movimento ridotto. Scartata grafica serif/cartacea v1.
- Almeno 5 fatti DISTINTI per ciascuna delle 8 categorie: Politica, Esteri, Economia, Cronaca, Roma, Cultura · Teatro · Cinema, Tecnologia · AI, Sport. Minimo 40 articoli: 5 essenziali che rimandano alle stesse 5 principali con foto, almeno 35 compatte apribili. Superato il tetto 12–15. Non duplicare BES o altri fatti per riempire conteggi.
- Disponibilità obiettivo entro 07:30 Europe/Rome anche con Mac spento. Fabio ha autorizzato scritture GitHub per la rassegna e, con successivo consenso specifico, nuova raccolta GitHub alle 06:00 che scrive soltanto automation/candidates/latest.json. Il precedente rifiuto automatico è superato da questa autorizzazione esplicita, non aggirato.
- Nessuna dipendenza installata, API key o nuovo servizio a pagamento.

## Stato osservato
- UI v9 pubblicata e testata: Sport nel menu/swipe; cinque foto caricate, nessun overflow; bottone Verifica nuova edizione distingue nuova/immutata/offline/errore. Verifica anche all'apertura e ritorno dopo 5 minuti, non genera notizie.
- Ultima edizione pubblica verificata: 2026-10-27-cloud-retry-101929, 13 articoli. Pubblicazione run 40487572337 success. Sport ancora vuoto; non dichiarare presenti 40 notizie.
- Task ChatGPT esistente Rassegna stampa quotidiana attiva ogni giorno alle 06:45 Europe/Rome, id 6ae05f1b65048191ab49a6b1efa795ee. Prompt aggiornato e salvato: legge prima il dossier cloud e DAILY_BRIEF. Scrittura diretta limitata a incoming/edition.json.
- Nuovo workflow prepare-candidates.yml attivo: doppio slot UTC con controllo 06:00 Rome per ora solare/legale; scrive solo dossier. Run cloud 40493232491 SUCCESS, dossier effettivamente scritto nel repository.
- Prime due prove cloud raccolta fallite per pagine AGI insufficienti e rate limit HDblog; corretto usando fonti alternative Economia/Tecnologia, controllo accesso prima del taglio finale e arresto richieste all'editore dopo 429 ripetuti. Soglie non indebolite. Fonti: RaiNews, AGI, RomaToday, Teatro e Critica, HDblog, BBC Business/Technology/Sport, Guardian Technology. Tutti candidati, NON articoli già verificati editorialmente.
- daily.yml vecchio resta disabled_manually. Pages valida nuove proposte con minimo 5 per categoria, selezione visibile, essenziali=principali, URL non duplicati, fonti/foto/date. In errore conserva l'ultima edizione.

## Da completare prima di dichiarare il flusso 40 notizie collaudato
1. Eseguire task editoriale usando dossier cloud: aprire fonti, verificare fatti/date/accesso gratuito, deduplicare semanticamente, sintetizzare in italiano, verificare cinque foto e licenze Commons.
2. Scrivere proposta completa incoming/edition.json; ottenere run Pages success e verificare id identico sulla URL pubblica senza cache.
3. Prima esecuzione ricorrente futura e puntualità non ancora osservate: obiettivo 07:30, nessuna garanzia assoluta. Un dossier di candidati NON è una rassegna pubblicata.

## Test e vincoli di ripresa
- node scripts/validate.mjs dist/data/current.json --production; nuove proposte aggiungono --balanced; node --check dist/app.js e dist/sw.js.
- Raccolta: python3 scripts/collect_candidates.py --verify-pages --output <percorso>; solo libreria standard. Errori su categorie con meno di 5 candidati; date mancanti/future escluse, parametri identificativi URL preservati, tracking eliminato. Deduplica titoli è iniziale; stessa notizia con titoli differenti richiede revisione editoriale.
- Test mirato superato: cinque candidati recenti bloccati non nascondono cinque alternative accessibili più vecchie. Nessuna fixture nel sito.
- Non riattivare cron una tantum del 27 ottobre; non ripristinare vecchi limiti o layout. Leggere stato remoto prima di modificare: checkout locale conserva intenzionali modifiche e HEAD locale v6, non è automaticamente la baseline remota.

## Ultimo esito verificato
- Ulteriore raccolta cloud run 40494977265 SUCCESS con fonti Guardian Business/Sport aggiuntive; dossier nuovo effettivamente scritto. Workflow preparazione active, Pages active, vecchio daily disabled_manually.
- Due prove editoriali dopo il dossier non hanno prodotto la rassegna da 40. Prima: blocchi web su RaiNews/RomaToday/BBC nonostante HTTP valido. Seconda: alternative Adnkronos/Guardian/fonti ufficiali lette, ma la task ha comunque concluso prima di verificare tutte le categorie e foto. Nessun nuovo incoming o edizione pubblica; restano 13 articoli.
- La sola task ChatGPT NON è dimostrata affidabile come produttore 40 notizie. Evitare ulteriori ripetizioni dello stesso prompt presentate come soluzione. La raccolta 06:00 è collaudata; la task 06:45 resta attiva ma non va promessa una consegna completa alle 07:30.
- Chiesto a Fabio se il progetto deve restare totalmente gratuito o se valuta un preventivo per elaborazione AI via API sul server. Nessuna API/credenziale/servizio a pagamento introdotto o chiamato. Attendere questa scelta prima di introdurre nuove integrazioni o spese.

## Nuova decisione approvata — blocchi e quota Plus
- Fabio conferma: uso personale, zero costi aggiuntivi; autorizza una parte della quota Plus già pagata e rivaluterà se il carico è eccessivo. Scartati altri modelli/API a pagamento.
- Autorizzato procedere: blocchi indipendenti da 5 notizie, checkpoint per categoria, riuso dei blocchi completati; assemblaggio GitHub solo dopo tutte 8 categorie e 5 foto. BATCH_BRIEF.md è la procedura attuale.
- Pronti localmente assemblatore, workflow Pages con attesa dei blocchi e finestre di lettura del dossier per categoria. Test puri superati: 7 blocchi non pubblicano, 8 validi formano 40 notizie/35 compatte/5 principali; duplicati, date/foto mancanti bloccano. Fixture solo in memoria.
- Da fare: pubblicare codice, provare un blocco reale da Plus, poi completare e verificare 40; configurare la scansione delle categorie senza mantenere il vecchio compito monolitico. Non dichiarare collaudato il nuovo flusso prima dell’esito pubblico.
