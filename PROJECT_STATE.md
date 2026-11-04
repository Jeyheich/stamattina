# Stamattina — stato operativo
## Stato approvato
- Mandato Fabio 4 novembre 2026: isolare mattina/pomeriggio, conservare dati e PWA, correggere e distribuire via GitHub senza API AI, dipendenze, credenziali o costi aggiuntivi.
- Due automazioni ChatGPT e dodici avvii invariati. 5 principali + 5 aggiuntive per ognuna delle otto categorie; Tecnologia 3 Punto Informatico + 2 Everyeye, IGN solo fallback ammesso. Nessuna deroga a verifiche, fonti, date o foto.
- AFTERNOON_TRIAL.md è storico superato. Le vecchie configurazioni/fonti nelle versioni precedenti di questo documento non sono baseline.

## Stato osservato prima della correzione
- main 01096f4310cc99a3c5e46d6da20722c5d785ddd3: percorsi giornalieri condivisi, quattro checkpoint pomeridiani hanno sostituito i blocchi mattutini. status globale: cicli differenti, ready=false.
- Mattutina storicamente pubblicata da run 41822121355 SUCCESS: 2026-11-04-batches-e17b5b4d5531, collectionId 2026-11-04-mattina, 40 base + 40 riserve, cinque foto. dist/data/current.json e archivio presenti; verifica pubblica corrente demandata ai test cloud.
- Pomeriggio incompleto: non creare notizie o rinnovare timestamp per sbloccare il sistema.
- Run 41865944252 SUCCESS tecnico: assemblaggio misto respinto, controlli fonti/promozione/deploy correttamente saltati. Il successo del run non è una nuova pubblicazione.

## Correzione in validazione
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

## Prossimo passo
- Integrare il commit validato su main con controllo dello SHA atteso, osservare Pubblica Stamattina, verificare migrazione persistita e nuova lettura del JSON pubblico.
- Pomeriggio non pronto: nessuna pubblicazione forzata. Le verifiche scadute richiedono reale rilettura delle fonti; la migrazione non le rinnova.
- La disponibilità di 80 fatti verificati dipende dalla produzione editoriale e dalle fonti accessibili: nessuna garanzia che bastino i dodici avvii; requisiti invariati.
