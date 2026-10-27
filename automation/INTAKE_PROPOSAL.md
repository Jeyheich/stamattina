# Raccolta strutturata — autorizzata e attivata

## Problema osservato
I feed RSS pubblici rispondono al normale client HTTP, ma lo strumento di ricerca web rifiuta diversi URL XML con `Unsupported content-type: application/xml`. Inoltre la precedente lista non copriva con feed dedicati Economia, Tecnologia e Sport. La task ChatGPT ha interrotto ripetutamente il lavoro prima di 40 verifiche; cambiare il solo prompt non ha risolto.

## Preparato e provato localmente
`scripts/collect_candidates.py`, sola libreria standard, legge fonti pubbliche, conserva date e URL, elimina URL duplicati e titoli molto simili, esclude date mancanti/future e titoli pubblicitari, limita le richieste concorrenti per editore e tenta fonti alternative. Verifica HTTP e indicatori espliciti di accesso non gratuito. I testi delle anticipazioni sono limitati insieme al titolo a 25 parole; nessuna foto o articolo integrale è copiato.

Il risultato è SEMPRE `research-candidates-not-an-edition`, `editorialReviewRequired: true`, mai `verified`. La deduplicazione semantica e la verifica editoriale restano necessarie. La finestra di ricerca è 72 ore e l'età è esplicita: non significa che tutti i candidati siano ammessi nell'edizione del giorno. In caso di categorie con meno di cinque candidati, termina con errore e non sostituisce un dossier buono remoto.

Prova reale del 27 ottobre 2026, generazione 10:47:58 UTC: 82 candidati con pagina HTML raggiungibile; Politica 12, Esteri 12, Economia 12, Cronaca 12, Roma 5, Cultura 12, Tecnologia 5, Sport 12. Cinque errori HTTP su singole fonti registrati, senza considerarli accessi riusciti. Non equivale a 82 notizie editorialmente verificate, né a un'edizione pubblicata. Test locali: date errate/mancanti respinte; URL con id diversi preservati; tracking rimosso; titoli equivalenti individuati.

## Modifica cloud proposta
Il file `automation/proposed-prepare-candidates.yml` è una BOZZA FUORI da `.github/workflows`, dunque non crea alcuna attività. Proposta: raccolta GitHub alle 06:00 Europe/Rome; scrittura esclusivamente del dossier pubblico `automation/candidates/latest.json`. Nessuna scrittura della rassegna corrente o della UI da questo job. Non introduce dipendenze, chiavi o servizi a pagamento.

La task ChatGPT delle 06:45 leggerebbe il dossier del giorno, scegliendo e verificando almeno cinque fatti per categoria, preparando sintesi originali e cinque foto pertinenti, quindi scrivendo solo incoming/edition.json. Il controllo dell'edizione resta separato e obbligatorio. Se il dossier è vecchio, incompleto o non disponibile, non va presentato come aggiornamento del giorno.

## Limite e autorizzazione
Un precedente controllo automatico ha respinto una seconda routine GitHub con scrittura persistente, perché l'autorizzazione precedente non copriva specificamente questa aggiunta. NON è stata riprovata o attivata sotto un altro nome. Questa bozza richiede autorizzazione esplicita per il nuovo job e il suo file di destinazione; `contents:write` è un permesso GitHub a livello di repository, mentre i comandi previsti aggiungono il solo dossier.

Dopo autorizzazione: pubblicare il raccoglitore e il workflow, eseguire manualmente la raccolta sul runner cloud, verificare dossier e limiti, aggiornare la task a leggerlo, completare il collaudo editoriale di 40 notizie, verificare controlli e id pubblico. Soltanto allora il flusso 40 notizie può essere dichiarato collaudato. Restano possibili ritardi del servizio e indisponibilità delle fonti.

## Stato successivo al consenso
Fabio ha risposto «si autorizzo». Il workflow è stato pubblicato in .github/workflows/prepare-candidates.yml ed è active. Run 40493232491 e 40494977265 success: dossier cloud effettivamente scritto, minimo cinque candidati per ciascuna categoria. Corrette le indisponibilità specifiche del runner aggiungendo alternative e riempiendo la selezione dopo le prove di accesso, senza ridurre soglie. La precedente bozza rimane come riferimento storico fuori dalla cartella attiva.
Il processo editoriale ChatGPT non ha completato le 40 notizie neppure dopo il dossier e le alternative leggibili. Questa proposta risolve la raccolta RSS, non costituisce un collaudo riuscito dell’intera rassegna. Non sono state installate dipendenze né usate API a pagamento.
