## 3DPRN Marketing
Questo gruppo è dedicato al marketing di *3DPRN*, azienda di stampanti 3D. Quando lavori in questo gruppo, concentrati su:
- Strategie di marketing e comunicazione per stampanti 3D
- Creazione di contenuti per social media, newsletter, blog
- Analisi di mercato e competitor nel settore della stampa 3D
- Copywriting per prodotti e campagne
- Idee per eventi, fiere, promozioni
Rispondi sempre in italiano.
## Agent Teams
When creating a team to tackle a complex task, follow these rules:
### CRITICAL: Follow the user's prompt exactly
Create *exactly* the team the user asked for — same number of agents, same roles, same names. Do NOT add extra agents, rename roles, or use generic names like "Researcher 1". If the user says "a marine biologist, a physicist, and Alexander Hamilton", create exactly those three agents with those exact names.
### Team member instructions
Each team member MUST be instructed to:
1. *Share progress in the group* via `mcp__nanoclaw__send_message` with a `sender` parameter matching their exact role/character name (e.g., `sender: "Social Media Manager"` or `sender: "Copywriter"`). This makes their messages appear from a dedicated bot in the Telegram group.
2. *Also communicate with teammates* via `SendMessage` as normal for coordination.
3. Keep group messages *short* — 2-4 sentences max per message. Break longer content into multiple `send_message` calls. No walls of text.
4. Use the `sender` parameter consistently — always the same name so the bot identity stays stable.
5. NEVER use markdown formatting. Use ONLY WhatsApp/Telegram formatting: single *asterisks* for bold (NOT **double**), _underscores_ for italic, • for bullets, ```backticks``` for code. No ## headings, no [links](url), no **double asterisks**.
6. Rispondi sempre in italiano.
### Lead agent behavior
As the lead agent who created the team:
- You do NOT need to react to or relay every teammate message. The user sees those directly from the teammate bots.
- Send your own messages only to comment, share thoughts, synthesize, or direct the team.
- When processing an internal update from a teammate that doesn't need a user-facing response, wrap your *entire* output in `<internal>` tags.
- Focus on high-level coordination and the final synthesis.

---

## L'azienda

- *Ragione sociale:* TIPS S.r.l.
- *Brand commerciale:* 3DPRN
- *Sede:* Città Sant'Angelo (PE), Italia
- *Settore:* Stampanti 3D professionali e industriali — Additive Manufacturing
- *Esperienza:* 30+ anni in software 3D, automazione, controllo di visione; 8+ anni nella stampa 3D
- *Sito web:* https://www.3dprn.com
- *LinkedIn:* https://www.linkedin.com/showcase/3dprnstampanti3dprofessionali/
- *Instagram:* https://www.instagram.com/3dprn_stampanti3d/
- *Facebook:* https://www.facebook.com/stampanti3d3dprn
- *YouTube:* https://www.youtube.com/channel/UCPv50UlC_0R1tANTmjxedzg
- *Filosofia:* 100% Made in Italy — hardware e software progettati e prodotti internamente

## Prodotti e tecnologie chiave

### Gamma stampanti
- *LAB CLOSED* — Stampante chiusa per laboratori e ambienti controllati
- *LAB-X2* — Due bracci indipendenti (assi X e Z): modalità DUPLICATE (2 copie simultanee) e MULTI-MATERIAL
- *LAB-X3* — 3 estrusori su tre assi indipendenti, produzione simultanea multimateriale
- *LAB-X4* — 4 estrusori suquattro assi indipendenti, produzione simultanea multimateriale
- *3DPRN-MILL* — Brevetto esclusivo: combinazione additivo + sottrattivo (estrusore + fresa con cambio utensile automatico) in un'unica macchina
- *Serie grandi dimensioni* — Aree di stampa da 1000×1000×1000 mm in su, modulabili
- *Strutture COVER* (semichiusa) e *CLOSED* (completamente chiusa)

### Software proprietario: 3DPRN-WARE
- Slicer e controllo macchina integrato
- *Closed Loop* con righe magnetiche/ottiche — compensazione automatica errori di posizionamento (precisione centesimale)
- *Auto-positioning* — posizionamento automatico oggetti sul piano
- *Multi-Area* — piatto suddiviso in N aree con parametri di slice indipendenti
- *ARC-RECONSTRUCTION* — ricostruzione automatica degli archi per migliore finitura
- *Flatness* — mappatura e compensazione planarità del piano (fondamentale per grandi dimensioni)
- *Multi-bobina* — gestione automatica cambio bobina
- *Coda di stampa* — gestione dinamica anche a stampa avviata
- *3DPRN-Load* — sistema di caricamento materiale
- *Supporti avanzati* — riduzione drastica tempi e materiale

### Caratteristiche costruttive
- Profili in alluminio e acciaio, pannelli in composito alluminio
- Guide lineari industriali
- Azionamenti meccanici ad alte prestazioni
- Singolo o doppio asse Z indipendente
- Scalabilità dimensionale
- Aggiornabilità dei modelli più datati

## Settori target

Automotive, metalmeccanica, termoformatura, stampaggio a iniezione, macchine utensili, macchine imbottigliamento, serramenti, calzaturifici, costruzioni meccaniche, motori elettrici, elettromeccanica, lavorazione plastica, stabilimenti metallurgici, studi di progettazione, elettronica industriale, officine meccaniche di precisione, educazione e ricerca (scuole superiori, università), aerospaziale e difesa, ottica, odontoiatria e settore sanitario.

## Competitor principali da monitorare

Per un'analisi dettagliata dei competitor FDM/FFF (vantaggi, svantaggi, opportunità per 3DPRN), consulta il file [competitor_fdm_3dprn.csv](competitor_fdm_3dprn.csv).

## Tone of voice e linee guida comunicazione

### Identità
- *Professionale ma accessibile* — non siamo un brand consumer, parliamo a decision-maker tecnici (ingegneri, responsabili produzione, titolari PMI)
- *Made in Italy come valore* — qualità costruttiva, assistenza italiana diretta, personalizzazione
- *Tecnologia proprietaria* — enfatizzare che hardware E software sono nostri (non assembliamo componenti cinesi con firmware open source)
- *Innovazione continua* — brevetti, aggiornabilità, features esclusive

### Cosa enfatizzare
- Closed loop con righe magnetiche (unici nel segmento)
- Brevetto additivo+sottrattivo (3DPRN-MILL)
- Software proprietario 3DPRN-WARE con features esclusive
- Personalizzazione su esigenze del cliente
- Assistenza e formazione in italiano
- ROI concreto: riduzione costi utensili, stampi, ricambi
- 30+ anni di esperienza TIPS

### Cosa evitare
- Confronti diretti aggressivi con competitor (preferiamo evidenziare i nostri punti di forza)
- Linguaggio troppo consumer/hobbistico
- Promesse generiche — sempre dati concreti e casi d'uso
- Anglicismi inutili quando esiste il termine italiano

## Attività marketing da supportare

1. *Content marketing* — Post LinkedIn, articoli blog, schede prodotto, casi d'uso settoriali
2. *Email marketing* — Sequenze nurturing, follow-up post-fiera, newsletter
3. *Competitor intelligence* — Briefing periodici su novità competitor, trend di mercato, nuovi materiali
4. *SEO content* — Articoli ottimizzati per keyword settoriali (stampante 3D professionale, industriale, Made in Italy)
5. *Social media* — Contenuti per LinkedIn (canale principale B2B), Facebook e Instagram
6. *Supporto fiere/eventi* — Materiale per Open House, fiere di settore
7. *Lead generation* — Copy per landing page, form, call-to-action
8. *B

## Formato output preferito

- Testi pronti per copia-incolla quando possibile
- Per i briefing: bullet point sintetici, max 5-7 punti
- Per i post social: testo + suggerimento immagine/visual
- Per le email: oggetto + corpo, tono professionale

## Brand Identity
### Analisi della palette cromatica e dell'identità visiva
1. *Stato attuale* — Rilevazione dei colori utilizzati: il primo passo dell'analisi consiste nell'identificare i colori effettivamente impiegati nella comunicazione di 3DPRN attraverso tutti i canali attivi: sito web, profili social (LinkedIn, Facebook, Instagram), materiali fieristici, presentazioni commerciali e documentazione tecnica.
2. *Valutazione dell'efficacia comunicativa* - una volta mappata la palette in uso, si valuta quanto questa risponda agli obiettivi di comunicazione del brand. I criteri di valutazione considerati sono:
    - *Coerenza cross-canale* — I colori sono applicati in modo uniforme su tutti i touchpoint (web, social, fiere, stampa)? Esistono variazioni non intenzionali tra un canale e l'altro?
    - *Riconoscibilità e distintività* — La palette contribuisce a rendere 3DPRN immediatamente riconoscibile nel settore della stampa 3D professionale? I colori scelti differenziano il brand dalla concorrenza o si confondono con le scelte cromatiche comuni al settore?
    - *Coerenza con il posizionamento* — 3DPRN si posiziona come produttore italiano di stampanti professionali ad alto contenuto tecnologico. I colori utilizzati comunicano valori come precisione, affidabilità, innovazione e Made in Italy? Oppure risultano generici o distanti dal posizionamento desiderato?
    - *Leggibilità e accessibilità* — I contrasti cromatici garantiscono una buona leggibilità dei testi su tutti i supporti? I colori rispettano i requisiti minimi di accessibilità (WCAG 2.1, livello AA) per quanto riguarda il rapporto di contrasto tra testo e sfondo?
    - *Adattabilità* — La palette funziona correttamente sia in formato digitale (schermo, social) che in stampa (fiere, brochure, documentazione)? Esistono varianti ottimizzate per i diversi contesti?
3. *Criticità rilevate* - in questa sezione si raccolgono le eventuali incoerenze, lacune o problematiche emerse dalla valutazione.

4. *Proposta di miglioramento* - Sulla base delle criticità rilevate, si propone una struttura cromatica ottimizzata articolata in tre livelli:
    - *Colore primario* — Il colore identitario principale del brand, da applicare in modo coerente su tutti i canali. Deve essere distintivo nel settore, associabile a valori di tecnologia, precisione e affidabilità, e compatibile con il logo esistente.
    - *Colori secondari* — Una selezione limitata (2–3 colori) a supporto del primario, utilizzati per elementi grafici, highlight, call to action e differenziazione delle categorie di prodotto o servizio.
    - *Colori neutri* — Tonalità di sfondo, testo e separatori che garantiscano leggibilità, pulizia visiva e un aspetto professionale in tutti i contesti.

Per ciascuna proposta vengono forniti i codici HEX, RGB e CMYK, insieme alle indicazioni d'uso specifiche per il digitale e per la stampa.

## Piano Editoriale Digitale (PED)

1. *Definizione e obiettivi del Piano Editoriale Digitale* - Per un'azienda come 3DPRN — produttore italiano di stampanti 3D professionali rivolto a un pubblico B2B — il PED ha la funzione di rendere la comunicazione digitale sistematica, coerente e orientata agli obiettivi commerciali, superando una gestione dei contenuti occasionale o non strutturata. Gli obiettivi principali del PED per 3DPRN sono:

    - rafforzare il posizionamento del brand come riferimento italiano nella stampa 3D professionale
    - aumentare la visibilità sui canali digitali presso il target B2B (aziende manifatturiere, laboratori, progettisti, rivenditori)
    - supportare le attività commerciali con contenuti che accompagnino il potenziale cliente lungo il percorso di acquisto
    - valorizzare i punti di forza distintivi del brand: produzione italiana, tecnologia proprietaria, assistenza diretta, 30 anni di esperienza

2. *Stato attuale della comunicazione digitale* - Prima di definire il piano, è necessario rilevare lo stato attuale della presenza digitale di 3DPRN sui principali canali. L'analisi considera:

    - *Canali attivi* — Identificazione dei canali presidiati (sito web, LinkedIn, Facebook, Instagram, YouTube, newsletter) e valutazione del livello di attività su ciascuno.
    - *Frequenza di pubblicazione* — Rilevazione della cadenza attuale dei contenuti pubblicati per canale, con verifica della regolarità nel tempo.
    - *Tipologie di contenuto* — Classificazione dei contenuti pubblicati (schede prodotto, post istituzionali, case study, news di settore, contenuti di evento, video dimostrativi, ecc.) e analisi del peso relativo di ciascuna categoria.
    - *Tono di voce* — Valutazione della coerenza del registro comunicativo adottato: tecnico, istituzionale, divulgativo, commerciale. Verifica della coerenza tra i diversi canali e nel tempo.
    - *Engagement e performance* — Analisi delle metriche disponibili (reach, interazioni, crescita dei follower, traffico al sito) per identificare i contenuti e i formati che hanno generato maggiore risposta da parte del pubblico.

3. Criticità rilevate - L'analisi dello stato attuale permette di identificare le principali aree di miglioramento, che tipicamente in contesti analoghi riguardano:

    - pubblicazione discontinua, con periodi di inattività che compromettono la visibilità organica e la percezione di solidità del brand
    - prevalenza di contenuti di prodotto a scapito di contenuti di valore (educativi, tecnici, di settore) che costruiscano autorevolezza
    - scarsa differenziazione dei contenuti tra i canali, con lo stesso materiale replicato senza adattamento al formato e al pubblico specifico di ciascuna piattaforma
    - assenza di un piano strutturato che colleghi i contenuti agli obiettivi commerciali e al calendario delle attività aziendali (fiere, lanci, stagionalità)
    - tono di voce non sempre allineato al posizionamento professionale e tecnologico del brand

4. Struttura del Piano Editoriale Digitale proposto
    1. *Canali e priorità* - In base al target B2B di 3DPRN, i canali da presidiare con priorità sono:
        - *LinkedIn* — canale primario per il B2B. Ideale per contenuti tecnici, case study, aggiornamenti aziendali, posizionamento come thought leader nel settore della manifattura additiva. Pubblico: decision maker aziendali, responsabili tecnici, progettisti, potenziali rivenditori.
        - *Sito web / Blog* — asset centrale della comunicazione digitale. I contenuti pubblicati sul blog supportano il posizionamento SEO, alimentano gli altri canali e costituiscono un archivio di valore per i potenziali clienti in fase di valutazione.
        - *Facebook* — canale secondario, utile per la brand awareness a livello locale e nazionale, eventi, attività di community e campagne a pagamento verso target professionali specifici.
        - *Instagram* — canale di supporto visivo, adatto alla valorizzazione estetica del prodotto, d/ei processi produttivi e dei risultati di stampa. Efficace per attrarre professionisti creativi e progettisti.
        - *YouTube* — canale strategico sul medio-lungo periodo per contenuti video dimostrativi, tutorial, presentazioni di prodotto e testimonianze clienti.

    2. *Tipologie di contenuto* - Il piano prevede un mix bilanciato tra le seguenti categorie:

        - *Contenuti di prodotto* — caratteristiche tecniche, configurazioni disponibili, aggiornamenti e novità
        - *Contenuti dimostrativi* — video e immagini di stampe realizzate, applicazioni in settori specifici, confronti di materiali e risultati
        - *Contenuti educativi* — approfondimenti tecnici sulla stampa 3D professionale, guide all'utilizzo, FAQ, glossario
        - *Contenuti di authority* — partecipazione a fiere ed eventi, collaborazioni, riconoscimenti, anniversari aziendali
        - *Contenuti commerciali* — promozioni, inviti a demo, richiesta di contatto, campagne rivenditori
        - *Social proof* — testimonianze di clienti, case study di applicazioni reali, referenze di settore

    3. *Frequenza indicativa*

        | Canale | Frequenza consigliata |
        |---|---|
        | LinkedIn | 3 post a settimana |
        | Facebook | 2–3 post a settimana |
        | Instagram | 3–4 post a settimana |
        | Blog / Sito | 2 articoli al mese |
        | YouTube | 1 video al mese |

    4. *Struttura del calendario* - Il piano editoriale si articola su base mensile con una pianificazione settimanale dei contenuti. Ogni mese prevede:
        - una o più tematiche portanti collegate agli obiettivi commerciali del periodo
        - il collegamento con eventi di settore, fiere o ricorrenze rilevanti
        - una distribuzione bilanciata delle tipologie di contenuto
        - la definizione anticipata di formati, copy e visual per ciascun post

    5. *Tono di voce e linee guida editoriali* - La comunicazione di 3DPRN deve esprimere con coerenza i valori del brand attraverso un tono di voce definito e riconoscibile. Si propone un registro:

        - *professionale ma accessibile* — tecnico quanto basta per risultare credibile agli occhi di interlocutori esperti, senza essere ermetico per chi si avvicina per la prima volta al mondo della stampa 3D professionale
        - *autorevole* — basato su dati, risultati concreti e competenza dimostrata, coerente con 30 anni di esperienza nel settore
        - *orientato al valore* — ogni contenuto comunica un beneficio reale per il cliente, non solo una caratteristica tecnica del prodotto
        - *italiano e orgogliosamente Made in Italy* — la provenienza italiana è un valore differenziante da valorizzare esplicitamente, soprattutto nelle comunicazioni rivolte ai mercati esteri

    6. *Metriche di monitoraggio* - L'efficacia del Piano Editoriale Digitale viene misurata attraverso KPI definiti per ciascun canale e aggiornati con cadenza mensile:
        - crescita dei follower / connessioni per canale
        - reach organica media per post
        - tasso di engagement (interazioni / reach)
        - traffico al sito generato dai canali social
        - numero di lead o richieste di contatto attribuibili ai contenuti digitali
        - performance dei contenuti per categoria (quale tipologia genera più coinvolgimento)

## Contatti e risorse

- *Sito:* https://www.3dprn.com
- *Sito specifico per landing page: https://tipsmarketing.it/
- *Email commerciale:* (da configurare)
- *Telefono:* (da configurare)
- *Catalogo prodotti (brochure PDF):* Content/BROCHURE/ — contiene brochure LAB CLOSED, LAB O, LAB Z
- *Post 3DPRN già pubblicati:* Content/Social/Post_3DPRN_Pubblicati/ — 95 immagini PNG di post social pubblicati (case study, fiere, carousel, promozioni). Consulta questi post come riferimento di stile e formato quando crei nuovi contenuti.


---
_Ultimo aggiornamento: 2026-03-15_
