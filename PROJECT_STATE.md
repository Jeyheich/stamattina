# Stamattina — checkpoint 27 ottobre 2026

## Decisioni approvate
- PWA personale su https://jeyheich.github.io/stamattina/, solo Plus già pagato e GitHub: zero costi aggiuntivi, niente API AI esterne. Fabio autorizza quota condivisa e scritture automatiche e rivaluterà il consumo.
- Cinque fatti distinti per ciascuna delle otto categorie, Sport incluso: 40 articoli, cinque principali con foto autentiche, cinque essenziali sugli stessi articoli e 35 compatte. Date/fonti gratuite/attribuzioni verificabili, repertorio dichiarato.
- UI moderna, font di sistema, temi, salvati, swipe e movimento ridotto. Scartati grafica serif/cartacea, limite 12–15, produzione monolitica da 40 e API a pagamento.
- Obiettivo entro 09:00 Europe/Rome anche a Mac spento; nessuna garanzia assoluta di puntualità.

## Stato osservato
- Pubblica: 2026-10-27-batches-a6dd98072384, preparata 13:45 Rome; 40 articoli, cinque per categoria, cinque foto. Run 40506210061 SUCCESS; status publication=verified, publicEditionId identico. Il server confronta l'intero JSON pubblico con quello promosso.
- Prima edizione completata tramite blocchi cloud Plus con interventi di collaudo su due foto/testi: non presentarla come ciclo mattutino interamente autonomo già osservato.
- PWA v10 pubblicata (40507960046 SUCCESS). Browser a 390px: Sport cinque articoli, apertura/chiusura funziona, nessun overflow. Reload offline: 40 articoli e cinque foto disponibili, messaggio aggiornamento corretto; connessione ripristinata. Verifica visuale mobile eseguita.
- Test assemblatore superati: blocchi mancanti/parziali non pubblicano, otto validi generano 40/35/5; duplicati, date scadute e foto insufficienti bloccano. Cronaca ripresa da due a cinque; due blocchi completati nella stessa esecuzione.
- Fonti/foto fallite salvano stato per recupero e impediscono pubblicazione. Foto Commons controllate per autore/licenza/accesso dal server; pertinenza responsabilità editoriale. Libreria sette foto reali, nessuna generata.

## Programmazione salvata e riletta
Tutto Europe/Rome: tre attività rassegna, sei avvii giornalieri.
- Rassegna stampa quotidiana (6ae05f1b65048191ab49a6b1efa795ee): 06:03 Politica/Esteri; 07:03 Tecnologia/Sport.
- Rassegna · Economia e Cronaca (6ae0984223088191b89da89ca650b81c): 06:10 Economia/Cronaca; 07:10 recupero massimo due blocchi.
- Rassegna · Roma e Cultura (6ae098447b7481919b203e1a5610dfee): 06:17 Roma/Cultura; 07:17 recupero massimo due blocchi/foto e verifica pubblicazione.
- Raccolta GitHub 06:00: prepare-candidates.yml scrive solo dossier candidati; ultima prova 40504175773 SUCCESS. Vecchio daily.yml resta disabled_manually.
- Limiti nativi osservati: minimo un'ora tra avvii della stessa attività, massimo cinque attività attive nell'account. Nove avvii ravvicinati/otto attività rifiutati e scartati. Altre due attività personali intatte.
- Blocchi validi saltati, checkpoint parziali conservati. Procedura corrente: automation/BATCH_BRIEF.md.

## Ripresa e problemi aperti
- Primo ciclo ricorrente completo il 28 ottobre, ancora da osservare. Non promettere esito futuro dal solo test manuale. Se incompleto resta l'ultima edizione con stato recuperabile.
- Quota condivisa non attribuibile precisamente al progetto: niente conteggi inventati, monitoraggio quote o acquisti crediti. Massimo sei avvii, lavoro completato saltato.
- Verifica nuova edizione scarica una pubblicazione disponibile, non avvia ricerche. Controlla anche all'apertura/ritorno dopo cinque minuti.
- Git locale main/HEAD v6 27e5adc conserva modifiche intenzionali e differisce dal remoto: verificare remoto prima di modificare; niente reset/push del vecchio checkout.
- Test: node scripts/test_batches.mjs; node scripts/validate.mjs dist/data/current.json --production --balanced; node --check dist/app.js e dist/sw.js. Verifiche HTTP nel workflow prima della promozione.

## Aggiornamento fonti approvato 27 ottobre
- Politica/Cronaca: esclusi TGR regionali, priorità testate nazionali italiane (Sky TG24, ANSA, Open, Adnkronos/RaiNews nazionale e alternative gratuite).
- Roma: Leggo oltre RomaToday/fonti ufficiali; preferire anche fatti diversi dai trasporti. Leggo feed Roma provato non affidabile come feed dedicato: raccolta home filtrata per riferimenti romani espliciti, revisione editoriale indispensabile.
- Sport: calcio soprattutto italiano, F1, tennis e altri sport nazionali; rimossi feed BBC/Guardian Sport, esclusi riempitivi NFL/cricket. Aggiunti Sky Sport e Leggo Sport. Google News solo scoperta, link finale all'editore.
- Sky TG24 feed usa guid al posto di link e date italiane, ora riconosciuti senza alterare evidenza originale. Il Post feed ha risposto 403: nessun aggiramento, disponibile solo se leggibile tramite ricerca diretta.
- Preferenze applicate alla produzione futura; l'edizione pubblicata non viene riscritta attribuendo vecchi fatti a nuove fonti. Nessuna modifica UI o orari.
- Collaudo raccolta mirato: Sky TG24 38 candidati Politica/90 Cronaca, Open 3 Politica, Sky Sport 66, Leggo Sport 18; prima pagina di ciascuno raggiungibile con gate HTTP. Feed Sky corretto agli URL finali HTTPS flipboard dopo redirect rifiutato, sicurezza invariata. Leggo Roma filtrato: zero candidati pertinenti in questa prova, quindi ricerca diretta editoriale necessaria, non dichiarare copertura RSS garantita. Date italiane, esclusione TGR e NFL e filtro Roma verificati con assert mirati.

## Refresh odierno autorizzato esplicitamente
- Fabio ha chiesto di applicare subito le nuove preferenze all'edizione già pubblicata. Sostituiti articolo TGR Liguria con Sky TG24 e TGR Piemonte con ANSA, dopo rilettura e riscrittura fedele; due notizie Leggo cittadine al posto di due trasporti; Sport tre calcio (Serie A, Pulisic, Pallone d'Oro), una F1 Antonelli, una tennis Paolini. Nessuna semplice rietichettatura di vecchi testi.
- Conservate altre quattro categorie e le notizie pertinenti nelle categorie toccate. Backup originali locale work/refresh/blocks; nessun reset Git o variazione UI/orari.
- Quattro blocchi aggiornati in commit unico 628f367861d37622482bdb497ef362b1144720f0. Assemblaggio locale: 40, cinque/categoria, cinque foto, invalid vuoto. Verifiche HTTP/fonti/foto dei venti articoli dei quattro blocchi superate. Run pubblicazione 40513077417 SUCCESS; edizione pubblica 2026-10-27-batches-b9bee48dc05a verificata con 40 notizie, cinque foto, zero TGR in Politica/Cronaca, due Leggo in Roma e tre calcio/F1/tennis. Stato server publication=verified e publicEditionId identico.

## Prova due slot — pomeriggio 27 ottobre, autorizzata
- Fabio approva prova pomeridiana prima di consolidare la riduzione a due slot; accetta obiettivo mattutino fino alle 09:00. Durante la prova nessuna modifica definitiva agli orari mattutini o alle attività personali.
- Richiesti avvii datati SOLO oggi sulle due attività esistenti: principale 16:05 Politica/Esteri e 17:05 Tecnologia/Sport; Economia/Cronaca 16:15 le due categorie e 17:15 Roma/Cultura. Nessun nuovo slot, nessun pomeriggio ricorrente. Gestore: entrambe aggiornate e rilette; eccezioni RDATE solo 27 ottobre confermate, orari mattutini dal 28 conservati. UI lista mostra prossimi avvii tra un’ora e prompt delle due attività contiene la precedenza pomeridiana. Terza task invariata.
- Procedura automation/AFTERNOON_TRIAL.md pubblicata. CollectionId 2026-10-27-pomeriggio su tutti i blocchi, incluse bozze: il gate pubblica solo otto blocchi dello stesso ciclo, senza mescolare vecchia e nuova edizione. Giorno successivo usa nuovo percorso giornaliero senza ereditare il ciclo pomeridiano.
- Test mirati passati: un blocco nuovo + sette vecchi NON pubblica, otto del nuovo ciclo pubblicano, cicli discordanti bloccano; test precedenti ancora passati. Commit gate 5774ce2, test 60bba81, procedura d7da5e1.
- Esito ancora futuro: quattro avvii, otto blocchi e pubblicazione vanno osservati; non dichiarare liberato uno slot o prova riuscita sulla sola pianificazione. Backup prompt principale in work/afternoon/main-task-before.json. Non ripetere la prova ogni giorno automaticamente.
- Procedura GitHub confermata presente dopo il salvataggio dei calendari (il primo controllo nativo l’aveva letta prima della creazione). Prompt finali conservati in work/afternoon/. Nessuna ricerca avviata manualmente: si attende il test realmente programmato.

## Tecnologia — fonti tre/due
- Nuova richiesta: esattamente tre notizie Lega Nerd e due MegaNerd, superate le vecchie fonti, anche al prossimo avvio pomeridiano 17:05. Categoria UI conservata; MegaNerd cultura nerd dichiarata senza inventare AI.
- Feed Lega Nerd generale/tecnologia e MegaNerd provati: HTTP 403. Home Lega Nerd leggibile con web, home MegaNerd bloccata al tentativo diretto; ricerca editoriale articolo per articolo necessaria. Non dichiarare collaudata la disponibilità di cinque notizie.
- Raccolta ora usa soltanto i due editori per Tecnologia e conserva spazio per entrambi; se manca solo il pool RSS Tecnologia, consegna comunque il dossier degli altri sette e indica ricerca diretta richiesta. Nessuna deroga al gate finale: servono ancora otto blocchi/40 notizie/fonti realmente verificabili.
- Rapporto 3/2 richiesto nei due brief letti dalle attività; nessun nuovo avvio o slot. Edizione attuale invariata fino alla produzione verificata successiva.

## Tecnologia — decisione sostitutiva PromptOps/Everyeye
- Fabio approva tre PromptOps e due Everyeye videogiochi; superata la precedente coppia Lega Nerd/MegaNerd. Wired Italia scartata: editoriale di chiusura 30 giugno 2026 e feed fermo a luglio.
- Everyeye pagina, feed ufficiale feed_news_rss.asp e due articoli provati rispondono 200; contiene anche pubblicità/offerte da escludere. PromptOps feed news/rss.xml leggibile, ultimi elementi osservati 24 ottobre: non garantite tre notizie entro 72 ore, obbligatoria verifica della freschezza e fonte originale.
- Configurazione aggiornata nei due brief letti dalle task e nel raccoglitore. Nessun nuovo slot/orario; UI ed edizione pubblica invariate fino a produzione valida. Non dichiarare completo il nuovo blocco prima del suo salvataggio e dei controlli.

- Fabio autorizza IGN Italia come fallback delle due notizie gaming se Everyeye non funziona. Feed https://it.ign.com/feed.xml e home verificati HTTP 200; Everyeye resta fonte primaria (già verificata 200). Aggiunto pool IGN di riserva, precedenza nei brief esplicita; nessuna sostituzione delle tre PromptOps e nessuna nuova attività.

## Carica altre cinque — implementazione autorizzata
- UI v11: una categoria mostra cinque notizie iniziali e, quando presenti, cinque riserve al clic. Stato separato per categoria e azzerato quando cambia edizione. Pulsante nascosto senza riserva, dopo apertura e nella vista salvati; salvati delle riserve restano leggibili. Focus sulla prima nuova scheda, annuncio accessibile, movimento ridotto rispettato.
- Formato compatibile: articles dei blocchi resta cinque; reserveArticles facoltativo esattamente cinque senza foto, reserveDraft non pubblicato. Edizione: reserveIds separati; 40 base + fino a 40 riserve, cinque foto totali. Validazione, deduplica e controlli fonti includono tutte le riserve presenti.
- Procedura quotidiana aggiornata: prima entrambi i blocchi principali, poi riserve. Niente nuovi slot o orari. Tecnologia mantiene il rapporto 3 PromptOps/2 gaming anche nella riserva. Disponibilità di ottanta notizie NON garantita se fonti o run insufficienti.
- Test dati passati: 80 totali/40 iniziali, compatibilità edizione precedente, riserva parziale/duplicata/scaduta bloccata. Fixture UI soltanto in work/load-more, nessuna fixture destinata al sito pubblico.
- Modifiche sviluppate in work/load-more/project da snapshot remoto verificato; checkout storico outputs/rassegna preservato. Test mobile 390px passati su tutte otto categorie: 5→10, pulsante esaurito nascosto, focus sulla prima aggiuntiva, salvati riserva, reload iniziale a 5, nessun overflow; verifica visuale eseguita. Pubblicazione confermata: commit 9a04549971ae94f3c7ed15e4539d3ad6c1f66643, run 40535813706 SUCCESS; pagina pubblica app.js?v=11 e controllo presente, nascosto con zero riserve. Apertura cinque aggiuntive già scaricate provata offline, connessione ripristinata.

- Stato dati alla pubblicazione della funzione: nessuna riserva reale ancora salvata. Il collaudo completo 5→10 usa fixture locali esplicitamente marcate; non dichiarare 80 notizie reali online. Procedura produttiva attiva nei brief, senza nuovi slot né esecuzioni aggiuntive.

## Raggruppamento definitivo autorizzato e verificato
## Pianificazione effettiva — due slot, dal 28 ottobre 2026
Tutti gli orari Europe/Rome, obiettivo disponibilità entro le 09:00 (non garanzia). Nessuna nuova attività.
- Rassegna stampa quotidiana, id 6ae05f1b65048191ab49a6b1efa795ee: 06:05 Politica poi Esteri; 07:05 Tecnologia poi Sport; 08:05 recupero massimo due blocchi incompleti/invalidi, foto, riserve facoltative e verifica pubblicazione.
- Rassegna · Economia, Cronaca, Roma e Cultura, id 6ae0984223088191b89da89ca650b81c: 06:15 Economia poi Cronaca; 07:15 Roma poi Cultura; 08:15 recupero massimo due blocchi, foto, riserve e verifica finale.
- Rassegna · Roma e Cultura, id 6ae098447b7481919b203e1a5610dfee: IN PAUSA, non eliminata, non va riattivata automaticamente. Le sue categorie sono assegnate al secondo slot.
Due categorie per avvio, file e commit separati. I recuperi danno priorità alle quaranta principali; il lavoro validamente completato non si rifà. Raccolta GitHub alle 06:00 invariata. Almeno un'ora fra avvii della stessa attività, sei avvii complessivi su due slot. Le altre attività personali restano intatte.
Solo per il 27 ottobre si conservano gli avvii pomeridiani già autorizzati (17:05 prima attività Tecnologia/Sport, 17:15 seconda Roma/Cultura), anche se una run è in corso. Non riavviare gli orari già passati e non creare una ricorrenza pomeridiana dal 28. Seguire AFTERNOON_TRIAL.md e collectionId della prova. Raggruppamento salvato non equivale a prova editoriale riuscita.

- Gestore cloud: configurazioni aggiornate e rilette, terza sospesa dopo verifica di tutte le otto categorie. Verifica indipendente elenco Attivo: due rassegne. Uno slot liberato; attività personali intatte. Prova odierna conservata, suo esito editoriale non ancora dimostrato.

## Avviso finale senza nuove integrazioni
- Fabio autorizza un avviso finale tramite l'attività esistente. Preferenze ChatGPT Attività osservate: Notifiche push già abilitate; nessuna preferenza globale modificata.
- Prompt della seconda attività verificato dal gestore: istruzione iniziale presente, stato attivo, 06:15/07:15/08:15 e prova 27 ottobre17:15 conservati. Ultimo passaggio produce risposta visibile con link solo dopo pubblicazione verificata/id del ciclo; altrimenti esito incompleta/errore/in attesa e causa concreta. Attesa workflow limitata a cinque minuti, niente nuovo slot.
- BATCH_BRIEF e AFTERNOON_TRIAL aggiornati. Nessun webhook, email, servizio o push PWA aggiunto. Non garantire recapito iPhone: permessi iOS e consegna effettiva non verificati; prova di notifica finale ancora da osservare.

## Pulsante verifica edizione in alto
Richiesta Fabio: spostato nella toolbar sticky delle categorie, rimosso il duplicato dal fondo. Su mobile icona di aggiornamento con target 44px, nome accessibile e stato occupato; su desktop testo completo. Logica di verifica notizie invariata, nessuna nuova ricerca al clic. UI/SW v12. Test mobile 390px superato: un solo pulsante, area44px, nella barra sticky a10px dall’alto anche dopo scorrimento; nessun overflow, verifica edizione e feedback funzionanti. Verifica visiva eseguita; pubblicazione confermata (8fade9654249a8c1abc83f5fa97cb7ef3ec54e6b, run40539557894 SUCCESS). Verificato sul pubblico: app.js?v=12, unico pulsante nella toolbar, nessun overflow a390px.
