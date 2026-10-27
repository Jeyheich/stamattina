# Stato — 27 ottobre 2026

## Approvato
- GitHub Pages pubblico Jeyheich/stamattina; prova reale oggi alle 10:10 Europe/Rome.
- Direzione Apple, font di sistema, schede e navigazione inferiore; scartata la grafica serif/cartacea v1.
- Nuova richiesta: filtri e apertura notizie più fluidi, senza ridurre leggibilità/accessibilità.

## Osservato
- URL pubblico https://jeyheich.github.io/stamattina/ verificato: 13 schede reali, 5 principali e 8 compatte; 5 fotografie Commons di repertorio, licenze e crediti visibili.
- Primo rilascio effettivo avviato alle 10:10:22 con workflow_dispatch: run 40478763078 success. Il cron non era ancora partito; nessuna puntualità del cron dimostrata.
- Checkpoint remoto prima delle animazioni: deb060b8cbd153179d0bc8d0a0835ab84db3dae4.
- Animazioni testate localmente: filtri View Transitions con fallback, apertura 300 ms, chiusura 180 ms, focus ripristinato, nessuna animazione con Riduci movimento. Navigazione da Salvati a Oggi corretta.
- Offline locale dopo preparazione: edizione e 5 immagini caricate senza rete. Viewport 390×844 senza overflow. Safari su iPhone fisico resta da provare con Fabio.

## Vincoli e prossimo passo
- Pubblicare e verificare l’ultima rifinitura di animazione su Pages. Conservare il sito sullo stesso indirizzo.
- Rassegna attuale statica del 27 ottobre. Il produttore quotidiano non è collegato: daily.yml è manuale, schedule commentata.
- Automazione ChatGPT intatta. Mai far credere che il cron generi notizie o che l’ora indicata sia un controllo reale.
- Foto servite da Wikimedia, memorizzate offline dal service worker dopo preparazione. Originali scaricati conservati localmente e ignorati da Git.
- Fonti consultate via web; check HTTP 12/13 riuscito, Teatro.it restituisce 403 al controllo diretto ma testo completo consultabile tramite strumento web. Non è un paywall accertato.
