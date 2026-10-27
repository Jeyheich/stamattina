# Rassegna quotidiana cloud — obiettivo 07:30 Europe/Rome

La richiesta di Fabio è una rassegna nuova ogni mattina, disponibile nella PWA anche con il Mac spento. L'orario precedente 09:33 è superato. La raccolta deve iniziare alle 06:45 Europe/Rome per lasciare tempo ai controlli e alla pubblicazione; le 07:30 sono l'obiettivo di disponibilità, non la sola ora di avvio. Non usare dipendenze da file o processi del Mac.

## Destinazione e autorizzazione
Repository pubblico `Jeyheich/stamattina`, branch `main`. Il lavoro richiesto da Fabio autorizza la pubblicazione quotidiana delle sole notizie della rassegna e del relativo archivio. Non modificare UI, impostazioni globali, altri repository, altre automazioni, autorizzazioni o credenziali. Usa solo gli strumenti GitHub cloud già collegati e la ricerca web. Se mancano strumenti o permessi, dichiarare il fallimento; non sostituire la pubblicazione con una risposta testuale presentata come app aggiornata.

## Prima verifica
Leggere questo file, AGENTS.md, PROJECT_STATE.md, `dist/data/current.json`, `scripts/validate.mjs` e `scripts/promote.mjs` dal repository corrente. Verificare la data effettiva in Europe/Rome. Non trattare le notizie precedenti come fatti ancora attuali. Non installare nulla e non attivare pagamenti o servizi API aggiuntivi.

## Edizione
- 5 essenziali, che rimandano agli stessi 5 approfondimenti principali con foto autentiche; 7–10 schede compatte distinte. Totale 12–15 notizie deduplicate.
- Tutte le categorie ammesse: Politica, Esteri, Economia, Cronaca, Roma, Cultura · Teatro · Cinema, Tecnologia · AI. Distribuzione equilibrata secondo le notizie reali, senza riempitivi inventati.
- Preferire fonti delle ultime 24 ore; fino a 72 ore per approfondimenti/cultura quando la data è esplicita e il contenuto è ancora rilevante. Eventi e statistiche devono indicare il periodo di riferimento. Nessuna falsa data di pubblicazione per far sembrare nuovo un contenuto vecchio.
- Aprire e verificare ogni fonte direttamente, verificare titolo, data, contenuto e accesso gratuito integrale senza registrazione. Usare fonti istituzionali o testate autorevoli; evitare ANSA/paywall come unico approfondimento. Escludere un articolo se non si riesce a verificarne contenuto o data.
- Titoli e sintesi originali in italiano; testo principale 2–3 paragrafi brevi con fatto, contesto e significato, senza aggiungere opinioni non fondate. Distinguere fatti, annunci, ipotesi e sviluppi in corso. Le schede compatte hanno sintesi brevi e un approfondimento apribile.
- Foto: usare Commons o archivi istituzionali solo con licenza e autore verificati nella pagina originale. Foto pertinenti al soggetto, mai generate; se repertorio, dirlo chiaramente. Non usare la foto di un'altra elezione, guerra, persona o luogo come se ritraesse l'evento del giorno. Non attribuire gratuitamente una licenza non verificata. URL HTTPS diretto, `sourceUrl` originale, `credit`, `rights`, `licenseUrl`, `caption`, `reuseApproved: true`. Preferire formati ragionevoli per iPhone. Non riutilizzare automaticamente tutte le foto di ieri.
- Se non è possibile verificare una selezione sufficiente, non pubblicare un'edizione incompleta o finta: lasciare l'ultima edizione valida e segnalare il motivo concreto.

## Formato JSON
Conservare schemaVersion 1 e tutti i campi richiesti dal validatore. `id` univoco per l'edizione; `mode: live`; `editionDate` ISO YYYY-MM-DD di oggi a Roma; `generatedAt` con ora reale e fuso; `timezone: Europe/Rome`; `scheduledFor` di oggi alle 07:30 con offset corretto (ora solare/legale).
`essentialIds` e `leadIds` contengono 5 id validi; `compactIds` contiene 7–10 id diversi dalle principali. Ogni articolo ha id stabile, categoria ammessa, status verified, title, summary, body (array di paragrafi), publishedAt reale, eventuale eventDate, verifiedAt reale, source con name, url HTTPS diretto, access free, accessCheckedAt, dateEvidence ed evidenza della verifica. `reviewedBy` deve dire "Verifica automatizzata cloud" e non simulare revisione umana. Se una fonte è una pagina evento senza data editoriale, dichiarare dateKind event e rappresentare esplicitamente il limite.

## Pubblicazione concreta
Preparare il JSON e verificare conteggi, riferimenti, date e crediti. Creare o aggiornare SOLO `incoming/edition.json` sul branch main con un commit "Prepare briefing YYYY-MM-DD". GitHub Actions valida il file, promuove in dist/data/current.json, conserva l'archivio e pubblica Pages solo in caso di successo. Il token Actions effettua le scritture interne, nessuna credenziale è inserita nella PWA.
Non dichiarare il sito aggiornato al solo commit. Controllare l'esecuzione di Pubblica Stamattina e verificare che `https://jeyheich.github.io/stamattina/data/current.json` esponga l'id dell'edizione appena pubblicata (richiesta senza cache). Se la verifica fallisce, segnalarlo con il link al run/commit e il motivo disponibile. Non aggirare permessi o controlli.

## Risultato
Confermare concisamente data/ora effettive, numero di notizie e link della PWA solo dopo verifica. Se resta un blocco o si supera l'obiettivo delle 07:30, dirlo apertamente senza cambiare la data della vecchia edizione. Conservare istruzioni e controlli nel repository per la ripresa del giorno successivo.
