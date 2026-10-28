# Regole del progetto
- Modello C: 5 essenziali che rimandano alle 5 principali, poi almeno 35 compatte: minimo 5 fatti distinti per ciascuna delle 8 categorie, Sport incluso. Il vecchio limite 12–15 notizie è superato.
- Direzione richiesta: moderna e vicina alle app Apple. Scartata la grafica serif/cartacea v1. Usare font di sistema e navigazione mobile essenziale.
- Notizie JSON separate dalla UI. Mai inventare fatti, date, fotografie o dichiarazioni di accesso gratuito.
- Foto autentiche con fonte, attribuzione, licenza e didascalia; repertorio sempre dichiarato. Conservare originali e crediti.
- Animazioni brevi, interrompibili; fallback senza View Transitions e rispetto di prefers-reduced-motion. Focus e scroll devono restare coerenti.
- La vecchia consegna ChatGPT solo testuale è superata. Fabio richiede una rassegna cloud pronta entro le 09:00 anche con il Mac spento e ha autorizzato le scritture GitHub necessarie. Nuove integrazioni, servizi a pagamento o credenziali richiedono consenso.
- Nessuna dipendenza. Test: node scripts/validate.mjs dist/data/current.json --production; node --check dist/app.js; node --check dist/sw.js.
- Server locale: python3 -m http.server 8765 --directory dist. Prima di pubblicare verificare formato iPhone, filtri, apertura/chiusura e offline.
- Distribuzione: Pubblica Stamattina gestisce push dei dati/UI e avvio manuale. Le attività cloud salvano blocchi per categoria; il server assembla incoming/edition.json; il workflow verifica, promuove e pubblica. Il vecchio daily.yml resta disattivato. Non riattivare il cron una tantum del 27 ottobre.

- Raccolta cloud aggiuntiva autorizzata esplicitamente da Fabio: prepare-candidates.yml alle 06:00 Europe/Rome scrive solo automation/candidates/latest.json; il dossier è candidato, mai una verifica editoriale. Le tre attività leggono il dossier prima di fare ricerche.

- Ultima approvazione: solo Plus già pagato + GitHub, zero costi aggiuntivi; Fabio autorizza quota condivisa e rivaluterà il carico. Scartata la proposta di API AI esterne. Produzione per blocchi di 5, salvati in automation/editorial/YYYY-MM-DD/slug.json; nessuna sostituzione dei blocchi validi. Procedura BATCH_BRIEF.md.

- Configurazione consolidata: due attività rassegna attive, sei avvii totali 06:05/07:05/08:05 e 06:15/07:15/08:15 Europe/Rome, obiettivo entro 09:00. Terza Rassegna · Roma e Cultura in pausa: non riattivare. Almeno un’ora per singola attività; nessuna modifica alle attività personali.

- Fonti approvate 27 ottobre: Politica/Cronaca nazionali italiane, niente TGR; Sky TG24, ANSA, Open e alternative gratuite come da BATCH_BRIEF. Roma include Leggo e fatti oltre mobilità. Sport soprattutto calcio italiano, poi F1/tennis e rilievo nazionale; niente riempitivi NFL/cricket. Google News solo scoperta con fonte originale.

- Tecnologia: esattamente 3 Punto Informatico e 2 Everyeye videogiochi, anche prova pomeridiana. Superate Lega Nerd/MegaNerd e Wired Italia. Escludere offerte; verificare data e fonte originaria delle sintesi Punto Informatico. Nessuna deroga alle 72 ore per riempire conteggi.

## Alternativa gaming autorizzata
Everyeye resta la prima scelta per le DUE notizie videogiochi. SOLO se non leggibile o non offre due fatti recenti verificabili, completa i posti gaming mancanti con IGN Italia (https://it.ign.com/, feed https://it.ign.com/feed.xml). Questa eccezione supera il vincolo esclusivo Everyeye, non la quota TRE Punto Informatico. Mantieni cinque fatti distinti, date vere, articoli gratuiti e fonte originale; indica esplicitamente IGN Italia nelle schede usate. Non mescolare notizie duplicate (ad esempio trailer e annuncio dello stesso gioco). Non sostituire automaticamente Everyeye quando funziona.

- Riserva: cinque base in articles, cinque aggiuntive richieste e verificate in reserveArticles, bozze in reserveDraft non pubblicate. Priorità ai blocchi base, duplicati globali vietati. Categoria completa solo con 5+5; editorialComplete e reserveMissing distinguono completezza dalla sola pubblicazione tecnica. UI Carica altre 5 solo per riserva reale, niente AI al clic. Nessuna nuova task/orario.

## Fonte Tecnologia sostitutiva definitiva
Punto Informatico (https://www.punto-informatico.it/, feed https://www.punto-informatico.it/feed/) SOSTITUISCE PromptOps per le TRE notizie tecnologiche/AI, sia nelle principali sia nelle riserve. Restano DUE videogiochi Everyeye, IGN Italia solo fallback autorizzato. Il rapporto 3/2 e le regole più recenti superano eventuali nomi vecchi nei prompt. Fonte e tre articoli del 27 ottobre verificati accessibili; scartare offerte, pubblicità e contenuti promozionali. Distinguere indiscrezioni da annunci ufficiali e verificare sempre le date. Nessun cambio di calendario o slot.
