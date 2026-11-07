# Stamattina — stato operativo

## Prevenzione dei blocchi editoriali — 7 novembre
- Il 7 novembre il dossier delle 06:00 era ancora quello della sera precedente. Le run pianificate del 4–6 erano partite diverse ore dopo l'orario atteso. I resoconti editoriali registrano anche errori di apertura di singole pagine, tra cui RomaToday e RaiNews, mentre il recupero ha letto fonti originali e pubblicato 40+40. Il ritardo preciso della coda GitHub e il motivo del singolo errore di lettura non sono desumibili dai resoconti.
- Il checkpoint Sport 7391fa1 è stato salvato alle 08:07 Europe/Rome con completedAt e quattro verifiche alle 08:20. Il validatore ha respinto il blocco prima del deploy. Ora distingue campo, istante futuro e scadenza. Verificato sul checkpoint storico senza alterarlo.
- BATCH_BRIEF.md esplicita controllo dello slot, ricerca immediata su fonti approvate se il dossier è vecchio, cambio di fonte o di fatto se una pagina è illeggibile, orario effettivo e regola 40+40. Orari pianificati invariati. I prossimi cicli dovranno confermare l'efficacia del recupero editoriale automatico.

## Mattutina del 7 novembre — pubblicazione verificata
- Ciclo 2026-11-07-mattina pubblicato alle 10:32 Europe/Rome. Edizione 2026-11-07-batches-ee0d5e30749c, 40 principali e 40 aggiuntive, cinque foto Commons e dieci schede per categoria. JSON pubblico senza cache identico a dist/data/current.json. Stato editorialComplete=true, publication=verified, reserveMissing=[].
- Blocchi completi in 7caed2bad668abd834647aedd2e6ace617ba25a8. Run 42360145989 riuscita con verifica delle fonti, foto e deploy. Controlli locali delle 80 fonti e cinque licenze superati. Uniformato il formato dei fusi orari nei dati mantenendo gli istanti originali.
- Il ritardo iniziale coincide con dossier RSS rimasto alla sera prima, blocchi mancanti e parziali, e orari di verifica futuri per Sport. Alla ripresa erano scadute anche le verifiche di altri blocchi. Rilette le fonti e completato il 40+40, senza derogare ai controlli. Questo recupero sostituisce il checkpoint parziale sottostante.

## Mattutina del 7 novembre — recupero parziale
- Il workflow delle 08:07 Europe/Rome ha saltato promozione e deploy: 13 principali registrate, Sport respinto per orari di verifica futuri, Roma assente e zero aggiuntive. Il dossier automatico era ancora del 6 novembre sera.
- Rilette e riconvalidate cinque principali Sport (9645d71), salvato Roma 5+5 (a3b4b73). Dossier aggiornato alle 10:19, 96 candidati, zero errori di raccolta (9457b07). Il dossier non equivale a verifica editoriale.
- Restano gli altri blocchi e la rilettura delle fonti scadute dopo tre ore. Il criterio 40+40 rimane attivo dal 7 novembre. Ultima edizione pubblica riscontrata: pomeridiana del 6.

## Decisione di pubblicazione — 7 novembre
- Fabio autorizza la sola base del ciclo 2026-11-06-pomeriggio: 40 principali e cinque foto. La pubblicazione è richiesta tramite il commit dedicato «Pubblica la base verificata del 6 novembre 2026». Le verifiche di fonti e foto e il blocco contro la regressione del ciclo pubblico restano obbligatori.
- Dal 7 novembre la promozione attende 40 principali e 40 aggiuntive verificate. Il recupero manuale degli altri arretrati conserva il requisito 40+40. Il ciclo del 6 rimane editorialmente incompleto.
- Pubblicazione verificata il 7 novembre alle 01:49 Europe/Rome: run 42320482146, edizione 2026-11-06-batches-a68dc822f0c0, 40 principali, zero aggiuntive, cinque foto. Stato del ciclo publication=verified; JSON pubblico riletto senza cache.

## Recupero 6 novembre pomeriggio — 7 novembre
- Ciclo 2026-11-06-pomeriggio. Salvate 40 principali, cinque per categoria, e cinque foto Commons con licenze e crediti verificati. Ultimo checkpoint foto 7328dac7254ea364766669af4dd6791365cf5be7. Assemblaggio locale bilanciato e controllo HTTP indipendente delle 40 fonti e delle cinque foto superati.
- Il piano precedente prevedeva 40 aggiuntive e verifica finale. Rileggere le fonti se scadono le tre ore. Non datare nuovamente gli articoli. Escludere fonti pubblicate dopo le 19:00 del 6 novembre nel recupero storico.
- Recupero arretrato: in Pubblica Stamattina, avvio manuale su main con collectionId esplicito e recoverOlderEdition attivo. Mantiene la data originale e richiede 40+40, cinque foto, verifiche recenti e un ciclo almeno pari a quello pubblico. Le pubblicazioni automatiche dei cicli arretrati restano escluse. La base del 6 novembre è online.

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
