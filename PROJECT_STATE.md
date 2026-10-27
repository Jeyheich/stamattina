# Stamattina — checkpoint 27 ottobre 2026

## Decisioni approvate
- PWA personale su https://jeyheich.github.io/stamattina/, solo Plus già pagato e GitHub: zero costi aggiuntivi, niente API AI esterne. Fabio autorizza quota condivisa e scritture automatiche e rivaluterà il consumo.
- Cinque fatti distinti per ciascuna delle otto categorie, Sport incluso: 40 articoli, cinque principali con foto autentiche, cinque essenziali sugli stessi articoli e 35 compatte. Date/fonti gratuite/attribuzioni verificabili, repertorio dichiarato.
- UI moderna, font di sistema, temi, salvati, swipe e movimento ridotto. Scartati grafica serif/cartacea, limite 12–15, produzione monolitica da 40 e API a pagamento.
- Obiettivo 07:30 Europe/Rome anche a Mac spento; nessuna garanzia assoluta di puntualità.

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
