# Regole del progetto
- Conservare il modello C: 5 essenziali, 5 principali, 7–10 compatte.
- Separare contenuti JSON e UI; nessuna notizia inventata o fotografia generativa.
- Demo e archivio devono essere espliciti. Non promuovere demo a edizione corrente.
- Non modificare l’automazione ChatGPT. Nessun push o deploy senza richiesta.
- Nessuna dipendenza necessaria. Test: `node scripts/validate.mjs dist/data/current.json`; server: `python3 -m http.server 8765 --directory dist`.
