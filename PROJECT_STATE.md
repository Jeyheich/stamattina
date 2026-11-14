# Stamattina — stato operativo

## Salvataggio concorrente su main
- Il workflow Pages riprova il salvataggio fino a tre volte se main cambia solo in PROJECT_STATE.md o README.md. Se cambiano dati, codice o workflow, ferma l’operazione e indica i file nel log.
- Collaudo locale con due writer Git: checkpoint e documentazione conservati, aggiornamento editoriale concorrente protetto.

## Consegna privata — collaudo del 14 novembre
- Repository privato stamattina-collaudo-privato. Run manuale 43582240232: DNS Everyeye simulato e pagine originali IGN scaricate dal runner. Archivio privato di un giorno 14108043487.
- La stessa attività Rassegna stampa quotidiana ha aperto l’archivio con lettura diretta simulata indisponibile e ha scritto due schede di collaudo, rilette da esiti/tecnologia-2026-11-14.json. Nessun testo delle fonti nel repository pubblico.
- Raccolta manuale collegata al dossier reale: run 43584609741, artifact privato 14109613767. Le redazioni sono state rilanciate. Tecnologia ha aggiunto una bozza Everyeye nel checkpoint canonico. Corretto lo status in-progress con cinque principali in 42d1214. Economia ha salvato quattro principali, con verifiche precedenti ancora scadute.
- La revisione automatica ha respinto il nuovo cron del repository privato. Raccolta privata a comando e procedura nel brief attive. Il 14 resta incompleto, senza foto validate.

## Recupero editoriale assistito — 14 novembre
- Tutte le otto categorie hanno cinque principali nei rami assegnati. Assemblaggio delle 11:34 con 40 principali valide. Rilette fonte per fonte le schede scadute nei blocchi recuperati.
- Economia e Cultura hanno cinque riserve definitive ciascuna. Sul ramo di redazione Roma ha quattro riserve in bozza e Cronaca tre. Sport e Tecnologia conservano altre bozze. Salvate immagini di repertorio pertinenti; ultimo stato con due foto già conteggiate.
- Il ciclo resta incompleto. Prima di dichiararlo pubblicato, verificare l’ultima importazione, completare 40+40 e cinque foto, e controllare il JSON pubblico.
 
## Recupero mattutino — 14 novembre
- Commit 3d2b0e6: il brief prova la lettura diretta delle fonti originali nell’ambiente di elaborazione, quando dispone di rete, e passa alle alternative ammesse in caso di blocco.
- Entrambe le attività rilanciate a mano. La redazione quotidiana ha aperto l’archivio 14104307771, ma Python ha riportato un errore DNS su Everyeye. Nessun nuovo checkpoint in quel rilancio. Lo stato delle 09:42 ha rilevato quattro checkpoint scaduti, Roma mancante, nessuna riserva definitiva e nessuna foto.
- Prova manuale mirata sulla stessa attività cloud: simulato guasto DNS Everyeye, entrambe le alternative IGN effettivamente tentate. Il lettore web non ha aperto IGN e il tentativo Python ha restituito DNS. Nessun salvataggio automatico. Rimosse le istruzioni temporanee; resta il passaggio esplicito alle alternative e il salvataggio del verificato.
- Recupero assistito: rilette direttamente tre pagine Punto Informatico e due IGN, salvate le cinque principali di Tecnologia sul ramo assegnato. Il primo assemblaggio ha respinto il blocco per completedAt mancante. Corretto in fed2952 con l’ora effettiva della rilettura.
- Guasti distinti: accesso al testo dall’attività cloud e scadenza dopo tre ore dei checkpoint in altre categorie. La soluzione automatica deve consegnare testo accessibile alla redazione e superare una prova con salvataggio effettivo.

## Fonti Esteri — 13 novembre
- Fabio ha autorizzato Open e HuffPost Italia per Esteri insieme a RaiNews. Il raccoglitore filtra Open per categoria RSS e usa il feed Esteri dedicato di HuffPost Italia. La selezione preserva la copertura RaiNews se le altre fonti scarseggiano.
- Prova di raccolta con controllo accessibilità: 12 candidati Esteri, 9 RaiNews, 2 Open, 1 HuffPost Italia. Verificare il primo dossier automatico con queste tre fonti.

## Consegna cloud delle fonti — 13 novembre
- Su main, la raccolta esistente carica un archivio giornaliero con un JSON per categoria e registra ID e run nel dossier. Il brief delle due attività usa il riferimento se coincide con il dossier corrente, con ripiego sulla lettura abituale.
- Il test cloud su cinque fonti di Tecnologia con riscontri preparati e ID esplicito ha salvato cinque schede sul ramo di prova (37bdec7). La prova locale del nuovo workflow ha verificato otto file, 96 candidati e riferimenti coerenti.
- L’archivio quotidiano contiene metadati e brevi estratti. La lettura integrale delle fonti rimane necessaria. Verificare alla prima raccolta il nuovo ID, l’uso effettivo da parte delle redazioni e la pubblicazione del ciclo.

## Selezione delle pagine leggibili — 13 novembre
- Commit 189c817: estrazione dalle sezioni editoriali Sky e dai paragrafi Everyeye senza promozioni. Il dossier privilegia candidati con almeno 100 parole estratte e conserva solo estratti brevi. Il conteggio è un segnale di leggibilità, non una verifica editoriale.
- Raccolta completa di prova: 96 candidati, 93 sopra la soglia di testo. Esteri 9/12, le altre categorie 12/12. Da verificare il consumo del dossier da parte del recupero cloud e il numero di schede effettivamente verificate.

## Evidenza delle pagine nel dossier — 13 novembre
- Il raccoglitore include, quando estraibili, data della pagina originale e breve estratto del corpo. Il brief usa questi campi per orientare il recupero e richiede comunque una fonte letta integralmente.
- Collaudo diretto su due articoli Punto Informatico e uno Everyeye. Alla prossima raccolta controllare i campi nel dossier GitHub e confrontare i salvataggi editoriali del 14 novembre.

## Diagnostica del recupero — 12 novembre
- Per il prossimo recupero mattutino, entrambe le attività devono riportare in chat, per categoria, i tentativi sulle aggiuntive, le alternative provate, gli scarti e i salvataggi. Il brief distingue ricerca non avviata da ricerca senza risultati. Vedi commit d575bfa.
- Nel ciclo del 12 novembre Politica ha chiuso cinque principali con almeno una fonte assente dai dossier esaminati. Zero bozze e zero aggiuntive. I resoconti disponibili non documentano tentativi sulle aggiuntive.
- Verificare il 13 novembre che i due resoconti riportino i dati richiesti e confrontarli con i blocchi editoriali salvati.

## Mattutina dell’11 novembre — pubblicata dopo recupero
- Gemini in Antigravity ha dato un secondo parere sulla diagnosi e proposto le selezioni dalle pagine originali. Codex ha rivisto i contenuti, corretto duplicati e formulazioni, verificato 80 URL e cinque foto e inviato i blocchi sui due rami editoriali.
- Run 43036043468 riuscita. Edizione 2026-11-11-batches-612436c4e8c8 verificata nel JSON pubblico alle 15:11 Europe/Rome, con 40 principali, 40 aggiuntive e cinque foto. Recupero editoriale assistito e pubblicazione tramite il workflow esistente. Da verificare la completezza dei prossimi avvii programmati.

## Raccolta Cultura — 11 novembre
- L’importazione mattutina dai rami è riuscita. Il ciclo aveva 13 principali, nessuna aggiuntiva e nessuna foto. Il job RSS ha salvato il dossier e segnalato Cultura con quattro candidati. Il controllo finale delle fonti e la pubblicazione sono stati saltati perché i blocchi erano incompleti.
- Aggiunto il feed Spettacolo di Sky TG24 per candidati di cinema, serie TV e cultura. Il collaudo locale con accesso alle pagine ha raccolto dodici candidati Cultura e coperto tutte le categorie. Il dossier resta una base per la verifica editoriale.

## Recupero automatico delle fonti — 9 novembre
- Le attività possono salvare fino a due notizie già verificate in fallbackArticles per categoria, oltre al 5+5. Se il controllo GitHub respinge una fonte, il workflow prova le scorte della stessa categoria e ripete i controlli sulla proposta completa. Scorte scadute, duplicate o incompatibili vengono scartate. La pubblicazione richiede ancora 40+40 e cinque foto.
- Verificare sui prossimi avvii la disponibilità di scorte realmente preparate dalle attività. In caso di recupero lo stato registra sourceReplacements. Se il controllo finale fallisce, l’edizione pubblica precedente resta disponibile.

## Mattutina del 9 novembre — recupero manuale pubblicato
- Il ciclo 2026-11-09-mattina era rimasto a 28 principali, due aggiuntive in bozza e zero foto dopo gli avvii automatici. Rilette le fonti scadute e completati gli otto blocchi sui due rami editoriali.
- Il runner non riusciva a leggere due pagine AGI di Economia. Sostituite le due notizie con fonti verificate dal runner. Run 42604893792 riuscita e JSON pubblico verificato alle 11:56 Europe/Rome. Edizione 2026-11-09-batches-cdc6e41ec43d con 40 principali, 40 aggiuntive e cinque foto. Primo passaggio completo attraverso i due rami, con recupero editoriale manuale.

## Rami editoriali separati — 9 novembre
- redazione-quotidiana riceve Politica, Esteri, Tecnologia e Sport. redazione-economia-cronaca riceve Economia, Cronaca, Roma e Cultura. Ciascun aggiornamento richiede l’assemblaggio sul ramo main, in coda con gli altri. Le attività leggono i loro blocchi sul ramo assegnato e lo stato su main.
- L’importazione raccoglie entrambe le redazioni per il ciclo richiesto, conserva le correzioni concorrenti e mantiene i controlli di completezza e le regole di promozione. Il calendario mattutino e il sito pubblico sono invariati.
- Verifica successiva: controllare i primi commit delle attività sui rispettivi rami e confermare importazione, stato del ciclo e pubblicazione effettiva.

## Prova con la sola mattutina — dal 9 novembre
- Fabio ha autorizzato il dimezzamento degli avvii editoriali da dodici a sei al giorno per verificare se il carico complessivo contribuisce ai blocchi. Calendari nativi salvati e riletti l’8 novembre. Rassegna stampa quotidiana alle 06:05, 07:05 e 08:05. Rassegna · Economia, Cronaca, Roma e Cultura alle 06:15, 07:15 e 08:15. Tutti gli orari sono Europe/Rome. Stesse due attività e notifiche.
- Si misurano le mattutine del 9, 10 e 11 novembre. Per ciascuna confrontare i salvataggi delle attività, le principali e le aggiuntive verificate per categoria, le foto, il workflow e il collectionId nel JSON pubblico. Obiettivo: edizione automatica entro le 09:00 con 40 principali, 40 aggiuntive e cinque foto, senza completamento manuale. Annotare il primo passaggio che resta indietro.
- Il test modifica la cadenza delle attività editoriali. La raccolta tecnica RSS e i requisiti di pubblicazione restano quelli esistenti. Il calendario a doppia edizione è la configurazione precedente. Il ripristino del pomeriggio si valuta dopo i tre cicli.

## Recupero automatico — 8 novembre
- Mattutina: dossier aggiornato alle 06:08 Europe/Rome. Al controllo delle 08:01 risultavano 28 principali, sei aggiuntive in bozza e zero foto. GitHub non ha promosso il ciclo incompleto. Roma era assente e il recupero finale della seconda attività aveva prodotto il resoconto senza salvare nuovi blocchi.
- Il brief assegna ai due recuperi finali tutte le categorie incomplete di competenza e la ripresa dei checkpoint prima del resoconto. Gli avvii iniziali restano limitati a due categorie. Lo stato del ciclo conta ora anche le principali parziali validate in categoryProgress.base. Requisiti di promozione e calendario invariati.
- Prossima verifica: osservare una nuova esecuzione pianificata completa e confrontare stato del ciclo, workflow e JSON pubblico.

## Pomeridiana del 7 novembre — pubblicazione verificata
- Pubblicata e verificata alle 19:00 Europe/Rome: ciclo 2026-11-07-pomeriggio, edizione 2026-11-07-batches-e5d1b917852e. 40 principali, 40 riserve, cinque foto. Il JSON pubblico letto senza cache coincide con dist/data/current.json. editorialComplete=true, publication=verified, reserveMissing=[].
- Blocchi 77d3e321b94adb497be8bbf099aba699c0755e8a, run 42399048535. Controlli locali e GitHub sulle 80 fonti e cinque foto superati. Privilegiati gli sviluppi del pomeriggio, con fonti originali rilette per le notizie ancora rilevanti del mattino.
- Il recupero RSS introdotto in 4b0d342 è stato provato sul checkpoint reale Roma nella run 42394409161: dossier pomeridiano con 96 candidati. Il completamento editoriale del 40+40 è stato manuale; il prossimo ciclo serve a verificare il flusso automatico completo.

## Pomeridiana 7 novembre — recupero della raccolta
- Alle 17:16 Europe/Rome erano salvati solo tre articoli parziali, nessuna aggiuntiva o foto. Il dossier era delle 10:19. Le task hanno segnalato accesso limitato a RomaToday/Leggo o verifiche editoriali non concluse. Il deploy è stato saltato prima del controllo delle fonti.
- La run Pages richiama ora il raccoglitore RSS esistente dopo un checkpoint editoriale quando non c'è un'edizione da pubblicare. Il gate dello slot evita raccolte duplicate. Gli orari pianificati e il requisito 40+40 restano invariati.
- Commit 4b0d342bf671311ab036610ccea5691618826f99, run 42394409161: Roma 5+5 da fonti originali RomaToday, recupero RSS riuscito alle 18:04 con 96 candidati e tutte le categorie coperte. Rimangono tre checkpoint parziali e quattro blocchi assenti. Il sito serve ancora la mattutina; la raccolta non certifica né pubblica le notizie.

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
