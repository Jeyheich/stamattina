# Stamattina — stato operativo

## Recupero 6 novembre pomeriggio — 7 novembre
- Ciclo 2026-11-06-pomeriggio. Salvate 40 principali, cinque per categoria, e cinque foto Commons con licenze e crediti verificati. Ultimo checkpoint foto 7328dac7254ea364766669af4dd6791365cf5be7. Assemblaggio locale bilanciato e controllo HTTP indipendente delle 40 fonti e delle cinque foto superati.
- Restano 40 aggiuntive e verifica finale. Rileggere le fonti se scadono le tre ore. Non datare nuovamente gli articoli. Escludere fonti pubblicate dopo le 19:00 del 6 novembre nel recupero storico.
- Sul Mac, work/recover-nov6/repo contiene la proposta per l’avvio manuale arretrato, con ciclo esplicito, completezza 40+40, verifiche correnti e guardia contro la regressione. Modifica ancora locale. Il sito mantiene la mattutina del 4 novembre.

## Stato approvato
- Mandato Fabio 4 novembre 2026: isolare mattina/pomeriggio, conservare dati e PWA, correggere e distribuire via GitHub senza API AI, dipendenze, credenziali o costi aggiuntivi.
- Due automazioni ChatGPT e dodici avvii invariati. 5 principali + 5 aggiuntive per ognuna delle otto categorie; Tecnologia 3 Punto Informatico + 2 Everyeye, IGN solo fallback ammesso. Nessuna deroga a verifiche, fonti, date o foto.
- AFTERNOON_TRIAL.md è storico superato. Le vecchie configurazioni/fonti nelle versioni precedenti di questo documento non sono baseline.

## Stato osservato prima della correzione
- main 01096f4310cc99a3c5e46d6da20722c5d785ddd3: percorsi giornalieri condivisi, quattro checkpoint pomeridiani hanno sostituito i blocchi mattutini. status globale: cicli differenti, ready=false.
- Mattutina storicamente pubblicata da run 41822121355 SUCCESS: 2026-11-04-batches-e17b5b4d5531, collectionId 2026-11-04-mattina, 40 base + 40 riserve, cinque foto. dist/data/current.json e archivio presenti; verifica pubblica corrente demandata ai test cloud.
- Pomeriggio incompleto: non creare notizie o rinnovare timestamp per sbloccare il sistema.
- Run 41865944252 SUCCESS tecnico: assemblaggio misto respinto, controlli fonti/promozione/deploy correttamente saltati. Il successo del run non è una nuova pubblicazione.

## Correzione integrata e distribuita
- Percorsi canonici automation/editorial/YYYY-MM-DD/{mattina,pomeriggio}/SLUG.json e status.json separati.
- Import legacy compatibile con prompt invariati; originali, checkpoint hash e recupero storico non distruttivo. Nessuna sostituzione del canonico dal recupero storico.
- Selezione ciclo dal contenuto del push (anche in coda), input manuale esplicito; Europe/Rome e DST. Blocco dei cicli errati e di regressioni del pubblico.
- Pubblicazione solo da assemblaggio pronto e controlli fonti riusciti; incoming obsoleto non basta. Stati parziale/pubblicabile/completo distinti. Archivi per id e ciclo.
- Concorrenza: niente rebase dei dati dopo i controlli, push fast-forward e controllo revisione prima del deploy.

## Verifiche eseguite nel cloud
- Commit tecnico validato: 25bcbd6b57dc23656d7a53225a4019f2bbf057fb, run 41880467644. Log: test_batches PASS; 17 scenari test_editorial_cycles PASS; 3 test slot e 4 test pubblicazione OK; validatore production/balanced, sintassi app.js/sw.js e compilazione Python superati.
- Migrazione sulla cronologia reale ripetuta due volte: nessun conflitto; recuperati otto blocchi mattutini 5+5 e quattro checkpoint pomeridiani (Economia, Cronaca, Roma, Cultura: uno ciascuno, zero riserve). ID mattutino riprodotto identico usando l'istante storico, senza rinnovare alcuna verifica.
- JSON pubblico letto senza cache alle 18:47:17 Europe/Rome: identico a dist/data/current.json; collectionId 2026-11-04-mattina, 80 articoli totali, 40 reserveIds, archivio per id identico.
- Il primo test candidato aveva un errore di sintassi nel nuovo lettore; corretto e tutta la suite rieseguita con successo prima dell'integrazione.
- Alcune risposte di stato GitHub hanno continuato a indicare queued dopo il completamento; verificare anche i log dei job, senza inferire l'esito da una singola lettura.

## Distribuzione conclusa
- Integrazione fast-forward con SHA atteso, nessun reset o sovrascrittura concorrente. Commit principale 2a69a4ffcba611636c6ac1a077b14181905fb0a1; ulteriore guardia concorrenza/brief be2117a6710df812e4fba85aa18252e6070bfd73.
- Ultima conferma su main: test 41881688200 SUCCESS e pubblicazione 41881688103 SUCCESS, inclusa la guardia be2117a. JSON pubblico ricontrollato senza cache alle 18:56:53 Europe/Rome, ancora mattutina 40+40.
- Test su main run 41881156530 SUCCESS. Pubblica Stamattina run 41881156925 SUCCESS: migrazione persistita, deploy Pages riuscito, confronto integrale del JSON pubblico senza cache superato alle 18:54:46 Europe/Rome.
- Migrazione salvata in bdd1db09d299ed202fac6dcbbc7bc1955e117585; prova pubblica in e1f6a16fac36ea7944d3d04107992f3a3ba541dd e automation/editorial/publication.json.
- Online: collectionId 2026-11-04-mattina, id 2026-11-04-batches-e17b5b4d5531, 40 principali + 40 aggiuntive, 40 reserveIds, cinque foto. Archivio per id identico. Il confronto Git non modifica UI, PWA, dati pubblici o archivio preesistente.
- Stato mattutino recuperato dal checkpoint storico e prova di raggiungibilità pubblica aggiornata: NON è una nuova rilettura editoriale delle 80 fonti. Le date restano autentiche e invariate.
- Pomeriggio: ready=false, editorialComplete=false, quattro checkpoint da un articolo in Economia/Cronaca/Roma/Cultura, zero aggiuntive; mancano Politica/Esteri/Tecnologia/Sport. invalid=[]: risolto l'errore di cicli mescolati. Nessuna promozione pomeridiana eseguita.
- Automazioni ChatGPT, prompt, calendari e dodici avvii intatti. Nessuna nuova dipendenza, credenziale, API AI o costo.

## Prossimo passo editoriale
- Le attività esistenti proseguono solo i checkpoint del proprio ciclo. Completare il pomeriggio con fonti realmente lette; oltre tre ore rileggere le verifiche scadute. La migrazione non le rinnova.
- La disponibilità di 80 fatti verificati dipende dalla produzione editoriale e dalle fonti accessibili: nessuna garanzia che bastino i dodici avvii; requisiti invariati. Non forzare una pubblicazione.
