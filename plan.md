# Plan: FÖRSVARSVILJA - Klickerspel

## Datum: 2026-02-19

---

## Vision

Ett klickerspel om svensk försvarsvilja. Spelaren börjar som vanlig medborgare och bygger gradvis upp Sveriges totalförsvar - från konservburkar i skafferiet till NATO-samarbete och 3,5% av BNP i försvarsbudget.

**Ton:** Spännande, kul, lite absurt - men också lärande. Spelaren ska skratta, lära sig något, och avsluta med en känsla av "nu jävlar, jag vill faktiskt göra något."

---

## Spelmekaniker

### Core loop
1. Klicka på sköld → tjäna Försvarspoäng (FP)
2. Köp uppgraderingar → passiv FP/sekund
3. Lås upp nya eror/stadier
4. Slumpmässiga händelser (bonusar, utmaningar)
5. Klara spelet → reflekterande sluttext

### Valuta
- **Försvarspoäng (FP)** - primär valuta

### 5 Eror (progressionsstadier)
1. **Hemberedskap** - Ditt hem, din beredskap
2. **Grannskapet** - Organisera med grannar
3. **Kommunen** - Lokal civil beredskap
4. **Regionen** - Regional samordning
5. **Nationen** - Totalförsvar och NATO

### Uppgraderingar (~22 st)
- Varje era har 4-6 uppgraderingar
- Baserade på riktiga försvarsbegrepp och myndigheter
- Kostnaden ökar exponentiellt (1.15x per köpt)
- Varje upgrade har en kort faktabaserad beskrivning

### Klickkraft-uppgraderingar (~6 st)
- Engångsköp som multiplicerar klickkraften
- Humoristiska svenska teman (vikingblod, karolinsk beslutsamhet)
- Sista: "NU JÄVLAR-knappen"

### Slumpmässiga händelser
- Poppar upp var 45-90:e sekund
- Ger bonus-FP eller tillfällig produktionsmultiplikator
- Baserade på riktiga fenomen (beredskapslarm, JAS-flyby, desinformation)

### Meriter/Achievements (~14 st)
- Klick-milstolpar
- Era-milstolpar
- Specifika upgrades
- Slutföra spelet

### Slutskärm
- Visas när sista uppgraderingen (Totalförsvar 3,5% av BNP) köps
- Spelstatistik (klick, tid, poäng)
- Reflekterande text om försvarsvilja
- Avslutas med "Nu jävlar."
- Länkar till riktiga resurser (MCF, Försvarsmakten, Hemvärnet, etc.)

### Nyhetsticker
- Löpande text längst ner med riktiga budskap om beredskap

---

## Teknik

- **HTML/CSS/JS** - ren webbteknologi, inga ramverk
- **En fil** (index.html) eller uppdelat i html/css/js
- **Web Audio API** för klickljud
- **CSS animations** för partikeleffekter
- **Responsiv** - ska fungera på mobil
- **Ingen backend** - helt klientbaserat
- **localStorage** för att spara spelläge (valfritt)

---

## Sprint-plan (förslag)

### Sprint 1: Grundspel
- HTML-struktur och layout
- CSS-styling (militärt/svenskt tema)
- Klick-mekanik med poängräkning
- Grundläggande uppgraderingar (Era 1)
- FP/sekund-beräkning
- Formatering av stora tal

### Sprint 2: Progression
- Alla 5 eror med uppgraderingar
- Era-progression och progress bar
- Klickkraft-uppgraderingar
- Kostnadseskalering

### Sprint 3: Juice & Events
- Partikeleffekter vid klick
- Float-text (+FP)
- Ljud (Web Audio API)
- Slumpmässiga händelser med overlays
- Bonus-multiplikatorer (tidsbegränsade)
- Nyhetsticker

### Sprint 4: Achievements & Slutspel
- Achievement-system
- Achievement-toasts (notifikationer)
- Slutskärm med text och statistik
- Länkar till riktiga resurser

### Sprint 5: Polish
- Responsiv design (mobil)
- localStorage-sparning
- Balansering av ekonomi/progression
- Buggfixar
- README.md

---

## Öppna frågor

- [ ] Ska det finnas en prestige-mekanik? (nollställ spelet för permanent bonus)
- [ ] Ska spelet vara oändligt eller ha ett tydligt slut?
- [ ] Ska det finnas "fiender" eller motstånd (t.ex. desinformation som minskar FP)?
- [ ] Hur lång bör en genomspelning vara? (10 min? 30 min? 1 timme?)
- [ ] Ska det finnas en "idle" save-funktion (spara i localStorage)?
- [ ] Vill vi ha fler interaktioner än bara klick (t.ex. mini-games)?
- [ ] Hostning - bara lokal fil eller ska det deployas någonstans?

---

## Filstruktur (förslag)

```
forsvarsvilja/
├── index.html          # Huvudfil
├── style.css           # Styling
├── game.js             # Spellogik
├── research.md         # Research (denna fil)
├── plan.md             # Plan (denna fil)
├── tasks.md            # Sprint-tasks (skapas nästa session)
└── README.md           # Projektbeskrivning (sista sprint)
```

---

## Referenser

- Försvarsmakten - Totalförsvaret: https://www.forsvarsmakten.se/sv/om-forsvarsmakten/totalforsvaret/
- Regeringen - Försvarsbeslutet 2025-2030: https://www.regeringen.se/regeringens-politik/totalforsvar/forsvarsbeslutet-20252030/
- Riksdagen - Interpellation om försvarsvilja: https://www.riksdagen.se/sv/dokument-och-lagar/dokument/interpellation/forsvarsvilja-i-sverige_hb10488/
- MCF (Myndigheten för civilt försvar): https://www.mcf.se/sv/
- Om krisen eller kriget kommer: https://www.mcf.se/sv/rad-till-privatpersoner/broschyren-om-krisen-eller-kriget-kommer/
- Länsstyrelsen - Civilt försvar: https://www.lansstyrelsen.se/stockholm/samhalle/sakerhet-och-beredskap/civilt-forsvar.html
- Regeringen - Civilt försvar: https://www.regeringen.se/regeringens-politik/civilt-forsvar/
- Trump Clicker (inspiration): https://lagged.com/en/g/trump-clicker
- A Dark Forest (inspiration): https://tinytakinteller.itch.io/the-best-game-ever
- Incremental game mechanics: https://en.wikipedia.org/wiki/Incremental_game
