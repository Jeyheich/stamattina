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
