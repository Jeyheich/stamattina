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

## Verifiche e prossimo passo
- Codice candidato su fix/editorial-cycles, ultimo commit tecnico 327045a049f63c24d58f157fde246ebc638683a5. Test cloud run 41879092133 queued: runner non ancora assegnato, nessun test eseguito. Run intermedi 41878581673 e 41878871059 anch'essi queued. Non integrare su main prima dell'esito dei test.
- La lettura pubblica dal web non è riuscita; confronto JSON senza cache e archivio previsti nel test cloud, non ancora eseguiti.
- Dopo esito positivo: integrare su main senza sovrascrivere modifiche concorrenti; osservare Pubblica Stamattina e JSON pubblico senza cache.
- Le verifiche editoriali scadute richiedono reale rilettura, non è compito della migrazione. Nessuna garanzia che i dodici avvii bastino per 80 fatti verificati.
