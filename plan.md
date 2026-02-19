# Plan: FÖRSVARSVILJA v2 — Beredskap under press

## Datum: 2026-02-19

---

## Vision

Försvarsvilja var ett rakt klickerspel. Nu blir det ett spel om val under press.

Spelaren börjar med att bygga hemberedskap (som innan), men gradvis eskalerar situationen. Strömavbrott, vattenavstängning, informationskaos — händelser som tvingar spelaren att prioritera, samarbeta med grannar och ta ställning. Det finns inte nog med resurser för allt, och det är poängen.

Spelet ska lämna spelaren med frågan: "Hur förberedd är jag egentligen?"

**Ton:** Grounded, lite satiriskt, aldrig alarmistiskt. Spänning genom val, inte genom skräck.

**Målgrupp:** Vanliga svenska medborgare. Ingen förkunskap krävs.

**Speltid:** ~30–40 minuter.

---

## Designprinciper

1. **Behåll klickerkärnan** — Klick, köp, progression, juice — rör det inte
2. **Motspel genom resurstryck** — Kriser dränerar resurser, inte bara FP
3. **Val > siffror** — Varje nytt system ska skapa intressanta val, inte fler meters att optimera
4. **Visa, förklara inte** — Spelaren lär sig genom att uppleva kriser, inte genom tutorials
5. **Verklig förankring** — Alla scenarier baseras på verkliga situationer
6. **Inget kan tolkas som propaganda** — Pro-beredskap, inte pro-panik eller politiskt

---

## Vad som ändras vs stannar

### Stannar (kärnan)
- Klickmekanik (klicka sköld, tjäna FP)
- FP som primär valuta för att köpa uppgraderingar
- Kostnadseskalering (1.15^count)
- Partikeleffekter, float-text, ljud
- Nyhetsticker
- Save/load (utökas med nya fält, bakåtkompatibelt)
- Visuell design och färgtema

### Ändras
- **Uppgraderingar**: Från en platt lista → fördelade i flikar
- **Händelsesystem**: Från enbart positiva → kriser + dilemman + bonusar
- **Spelflöde**: Från linjär FP-ackumulering → tryckbaserad eskalering
- **Slutskärm**: Från enkel stats → "beredskapsrapport" med fakta och reflektion
- **Achievements**: Utökas med nya för resurser, dilemman, kriser

### Nytt
- **Fliksystem** (5 flikar som låses upp progressivt)
- **Resurssystem** (3 resursmätare: Försörjning, Samband, Samhörighet)
- **Beredskapsläge** (hottermostat: Vardag → Oro → Störning → Kris → Uppbyggnad)
- **Kriser** (negativa events som dränerar resurser)
- **Dilemman** (binära val med konsekvenser)
- **Beredskapsrapport** (utökad slutskärm med fakta och reflektion)

---

## Spelmekaniker

### 1. Fliksystem (Tabs)

5 flikar som låses upp av beredskapsläge:

| Flik | Namn | Låses upp vid | Fokus | Resurs |
|------|------|---------------|-------|--------|
| 1 | Hemmet | Start | Personlig beredskap: vatten, mat, värme, el | Försörjning |
| 2 | Info & Kommunikation | Oro | Radio, kontakter, fakta vs rykten | Samband |
| 3 | Familj & Grannar | Störning | Samarbete, tillit, delad beredskap | Samhörighet |
| 4 | Kommun & Region | Kris | Samhällsberedskap, räddningstjänst, civilplikt | Alla |
| 5 | Nationen | Uppbyggnad | Totalförsvar, NATO, endgame | — |

Varje flik har:
- Egna uppgraderingar (6–8 st per flik)
- Koppling till en specifik resurs (uppgraderingar i den fliken fyller på resursen)
- En visuell identitet (ikon, färgaccent)

Låsta flikar visas med lås-ikon och text: "Låses upp vid [beredskapsläge]".

### 2. Resurssystem

3 resursmätare, var och en 0–100:

| Resurs | Vad det representerar | Fylls av | Dräneras av |
|--------|----------------------|----------|-------------|
| **Försörjning** | Vatten, mat, värme, el | Hemmet-uppgraderingar | Strömavbrott, kyla, matbrist |
| **Samband** | Kommunikation, info | Info-uppgraderingar | Mobilnät nere, desinformation |
| **Samhörighet** | Tillit, grannkontakt, moral | Familj & Grannar-uppgraderingar | Isolering, konflikter, panik |

Resurser:
- Börjar på 80 (inte 100 — du är inte perfekt beredd)
- Dräneras passivt baserat på beredskapsläge (Vardag: 0, Oro: ~1/min, Kris: ~3/min)
- Dräneras akut av kriser (specifik resurs -10 till -25 per kris)
- Fylls på av uppgraderingar (varje köpt upgrade ger +X till relevant resurs)
- Fylls på av rätt val i dilemman

**Straff vid 0:**
- Försörjning = 0: FP/s halveras ("Du fryser, du har inte ätit, ingenting fungerar")
- Samband = 0: Inga event-bonusar kan fås, dilemman ger sämre utfall
- Samhörighet = 0: Uppgraderingskostnader +50% ("Ingen vill hjälpa dig")

### 3. Beredskapsläge (Threat Level)

En termometer i headern som eskalerar automatiskt:

| Nivå | Namn | Tidpunkt | Visuellt | Effekt |
|------|------|----------|----------|--------|
| 1 | **Vardag** | 0–5 min | Grön | Lugnt. Bara positiva events. Ingen resursdränering. |
| 2 | **Oro** | ~5 min | Gul | Tab 2 öppnas. Kriser börjar (sällsynta). Lätt resursdränering. |
| 3 | **Störning** | ~12 min | Orange | Tab 3 öppnas. Dilemman börjar. Kriser vanligare. Ökad dränering. |
| 4 | **Kris** | ~20 min | Röd | Tab 4 öppnas. Allvarliga kriser. Hög dränering. Flera simultana hot. |
| 5 | **Uppbyggnad** | ~28 min | Blå | Tab 5 öppnas. Slutfas. Dränering minskar. Reflektion börjar. |

Eskaleringen är oundviklig — spelaren kan inte stoppa den. Men bättre beredskap = mildare konsekvenser.

Beredskapsläget visas visuellt med en färgkodad indikator bredvid era-indikatorn.

### 4. Händelsesystem (utökat)

Tre eventtyper:

**Bonusar** (behålls från v1, justerade)
- Beredskapslarm, JAS-flyby, ärtsoppetorsdag, frivilligvåg, etc.
- Ger FP-bonus eller tillfällig multiplikator
- Vanligast i Vardag, sällsyntare i Kris

**Kriser** (NYTT — negativa händelser)
- Strömavbrott: Försörjning -20
- Vattenledning brast: Försörjning -25
- Mobilnätet nere: Samband -30
- Storm: Alla resurser -10
- Matbrist i butikerna: Försörjning -15, Samhörighet -5
- Cyberangrepp: Samband -25
- Desinformationsvåg: Samband -15, Samhörighet -10
- Kyla utan el: Försörjning -20 (dubbelt om Försörjning < 30)
- Grannbråk om resurser: Samhörighet -20
- Sjukdomsutbrott: Försörjning -15, Samhörighet -10
- Kriser kommer oftare ju högre beredskapsläge

**Dilemman** (NYTT — val med konsekvenser)
- Presenteras som event med TVÅ knappar istället för "stäng"
- Varje val har tydliga konsekvenser som visas
- Valen sparas och påverkar slutrapporten
- Exempel:
  - "Grannen behöver vatten" → Dela (-10 Försörjning, +15 Samhörighet) / Avvisa (+0, -5 Samhörighet)
  - "Rykten om förorenat vatten" → Kolla fakta (-5 Samband, +10 Försörjning vid rätt info) / Hamstra direkt (-20 FP, +10 Försörjning)
  - "Kommunen söker frivilliga" → Ställ upp (-FP/s 20% i 60s, +20 Samhörighet) / Avböj (+0)
  - "Ovaccinerad granne är sjuk" → Hjälp (-10 Försörjning, +10 Samhörighet) / Håll avstånd (-5 Samhörighet)
  - "Din arbetsgivare vill att du krigsplaceras" → Acceptera (+stor FP/s-bonus, -20 Samhörighet) / Stanna hemma (+10 Samhörighet, +0 FP)
  - "Tonåringen vill inte stanna hemma" → Bestäm (lås Samhörighet i 30s) / Kompromissa (-5 Samhörighet, +5 Samband)
  - "Grannen har bensin, du har mat. Byta?" → Byt (+10 Försörjning, -5 Försörjning, +10 Samhörighet) / Avböj (+0)

### 5. Uppgraderingsomfördelning

Befintliga 30 uppgraderingar omfördelas i flikar. Några nya tillkommer.

**Tab 1 — Hemmet** (6 uppgraderingar, befintliga)
- Vattenflaskor, Konservburkar, Stormkök, Sovsäck & filtar, Hemberedskapskit
- + 1 ny: "Reservkraft" (powerbank/generator, ger Försörjning-bonus)

**Tab 2 — Info & Kommunikation** (6–8 uppgraderingar, mix)
- Ficklampa/radio/batterier (flyttad från Tab 1)
- Rakel-kommunikation (flyttad från Kommunen)
- + NYA: Grannlista med telefonnummer, Vevradio-nätverk, Faktakoll-grupp, Kommunens informationskanal, Krisapp på mobilen

**Tab 3 — Familj & Grannar** (6–8 uppgraderingar, befintliga + nya)
- Grannsamverkan, Vedförråd, Vattenrenare, Informationsmöte, Lokal beredskapsgrupp, Gemensamt skyddsrum
- + NYA: Gemensam matlagning, Barnpassning-rotation

**Tab 4 — Kommun & Region** (6–8 uppgraderingar, befintliga)
- Kommunal krisplan, Beredskapsveckan, Nödvattenförsörjning, Räddningstjänst, Civilplikt, Länsstyrelse-samordning, Regionalt civilområde, Elberedskap, Livsmedelsförsörjning, Drivmedelsreserver, Cybersäkerhet
- (fler att välja från — exakt urval i Sprint 4)

**Tab 5 — Nationen** (6 uppgraderingar, befintliga)
- MCF, Hemvärnet, JAS 39 Gripen, Global Eye, NATO artikel 5, Totalförsvar 3,5% av BNP

### 6. Slutskärm: Beredskapsrapport

Ersätter nuvarande enkla slutskärm med 5 sektioner:

**Sektion 1: Spelstatistik**
- Klick, speltid, totalt FP, uppgraderingar, meriter (som idag)

**Sektion 2: Din beredskapsrapport**
- Lägsta nivå per resurs (t.ex. "Försörjning sjönk till 3 under stormen")
- Antal gånger en resurs nådde 0
- Antal kriser du klarade / antal totalt
- Dina dilemma-val med kort sammanfattning

**Sektion 3: Verklighetscheck**
Fakta kopplade till spelarens upplevelse (konservativa, verifierade):
- "MCF rekommenderar att du ska kunna klara dig i minst en vecka utan samhällets hjälp."
- "Sverige har cirka 65 000 skyddsrum."
- "Försvarsbudgeten ska nå 3,5% av BNP till 2030."
- "Broschyren 'Om krisen eller kriget kommer' skickades till 5,2 miljoner hushåll."

**Sektion 4: Reflektionsfrågor**
- "Hur många dagars vatten har du hemma just nu?"
- "Har du en vevradio?"
- "Vet du var ditt närmaste skyddsrum ligger?"
- "Har du pratat med dina grannar om vad ni gör vid en kris?"
- "Hur förberedd är du, på riktigt?"

**Sektion 5: Nu jävlar**
- "Det här var ett spel. Men frågorna är verkliga."
- "Nu jävlar."
- Länkar till MCF, Försvarsmakten, Hemvärnet, broschyren

---

## Teknik

### Arkitektur
- Fortsatt ren HTML/CSS/JS, inga ramverk
- game.js utökas med tydliga sektioner per system
- Save format version 2 (bakåtkompatibel: v1 spardata migreras)
- Befintlig DOM-referens-teknik och dirty-flag-optimering behålls

### Filstruktur (oförändrad)
```
forsvarsvilja/
├── index.html          # Utökad med flikar, resursmätare, dilemma-overlay
├── style.css           # Utökad med nya komponenter
├── game.js             # Utökad med nya system
├── test.js             # Utökad för alla nya system
├── playtest.js         # Uppdaterad med resurssimulering
├── plan.md             # Denna fil
├── tasks.md            # Sprint-tasks
└── research.md         # Research (oförändrad)
```

### Prestandahänsyn
- Resursmätare uppdateras i befintlig game loop (100ms tick)
- Event-frekvens justeras dynamiskt efter beredskapsläge
- DOM-uppdateringar via dirty-flaggor (befintlig teknik)
- Inga nya beroenden eller bibliotek

---

## Sprint-översikt

| Sprint | Fokus | Mål |
|--------|-------|-----|
| 1 | Tab System + UI Foundation | Flikar i UI, omfördelning av befintliga upgrades |
| 2 | Resurser + Beredskapsläge | Resursmätare, hottermostat, straff, dränering |
| 3 | Kriser & Dilemman | Utökat eventsystem med negativa events och val |
| 4 | Flik-innehåll & strategiskt djup | Unika mekaniker per flik, nya uppgraderingar, balans |
| 5 | Slutskärm & Polish | Beredskapsrapport, fakta, reflektion, responsivt, test |

Varje sprint inkluderar: implementation, tester (automatiserade + manuell playtesting), save/load-uppdatering.

---

## Öppna frågor

- [ ] Exakt uppgraderingsfördelning per flik? (Förslag ovan — justera under Sprint 4)
- [ ] Ska resurser kunna gå under 0 (skuld) eller stanna på 0?
- [ ] Hur svårt ska det vara att hålla resurser uppe? (Bör vara utmanande men inte omöjligt)
- [ ] Ska det finnas en kort "tutorial hint" första gången en kris slår till?
- [ ] Vill vi ha en "sammanfattning" vid varje beredskapsläge-byte?
- [ ] Vilka fakta får användas i slutskärmen? (Bara det som finns i research.md, eller ny research?)
- [ ] Vill vi ha "game over" om alla resurser når 0, eller bara hårda straff?
- [ ] Ska dilemma-val kunna ångras? (Förslag: nej — konsekvenser är poängen)

---

## Inspirationer

- **Universal Paperclips**: Fasbyten som helt förändrar spelet ("unfolding")
- **A Dark Room**: Textbaserat, gradvis avslöjande av mekaniker
- **Slashprojects / orangeman**: Politisk satir + klickermekanik
- **Slashprojects / forest**: Resurshantering + environmentellt tema

---

## Referenser

(Behålls från v1 — se research.md för fullständiga källor)
- Försvarsmakten, Regeringen, MCF, Riksdagen
- Broschyren "Om krisen eller kriget kommer"
- Försvarsbeslutet 2025–2030
