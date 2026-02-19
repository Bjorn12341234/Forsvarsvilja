# Tasks: FÖRSVARSVILJA v2 — Beredskap under press

## Datum: 2026-02-19

---

## Avslutade sprints (v1)

Sprint 1–5 från v1 är klara. Se git-historik för detaljer.
- 394 tester, 30 uppgraderingar, 5 eror, 12 events, 16 achievements
- Fullt fungerande spel med save/load, responsiv design, ljud, partiklar

---

## Sprint 1: Fliksystem + UI-grund

**Mål:** Lägg till flik-navigation i uppgraderingspanelen. Omfördela befintliga uppgraderingar i 5 flikar. Sista 4 flikarna börjar låsta. Spelet ska vara fullt spelbart efter denna sprint (inga nya mekaniker, bara ny UI-struktur).

### 1.1 Flik-navigation (HTML/CSS)
- [ ] Lägg till tab-bar ovanför upgrades-listan i `<aside class="upgrades-panel">`
- [ ] 5 flikar: Hemmet, Info & Komm, Familj & Grannar, Kommun & Region, Nationen
- [ ] Varje flik har: ikon/emoji, namn, locked/unlocked/active-state
- [ ] Låst flik: grå, lås-ikon, tooltip "Låses upp vid [beredskapsläge]"
- [ ] Aktiv flik: gul border-bottom, ljusare bakgrund
- [ ] Responsiv: tabs scrollar horisontellt på mobil, eller wrappas till 2 rader

### 1.2 Flik-logik (JS)
- [ ] `activeTab` state i `game`-objektet (default: 0)
- [ ] `tabUnlocked[]` array (default: [true, false, false, false, false])
- [ ] Tab-klick byter vilka uppgraderingar som visas
- [ ] Låsta flikar kan inte klickas (visar tooltip)
- [ ] `unlockTab(index)` funktion (spelar ljud, visar kort animation)
- [ ] Tab-state inkluderas i save/load (version 2 migration)

### 1.3 Omfördelning av uppgraderingar
- [ ] Lägg till `tab`-fält på varje upgrade (0–4)
- [ ] Tab 0 (Hemmet): water, cans, stove, sleeping, kit + ny "backup_power"
- [ ] Tab 1 (Info & Komm): radio (flyttad), + nya placeholder-upgrades
- [ ] Tab 2 (Familj & Grannar): neighbors, firewood, water_purifier, info_meeting, local_group, shelter
- [ ] Tab 3 (Kommun & Region): crisis_plan, prep_week, water_supply, fire_service, civil_duty, rakel, county_coord, civil_area, power_prep, food_supply, fuel_reserves, cyber_security
- [ ] Tab 4 (Nationen): mcf, home_guard, gripen, global_eye, nato_art5, total_defense
- [ ] `buildUpgrades()` filtrerar på `activeTab` istället för `era`
- [ ] Behåll era-baserad synlighet INOM varje flik (upgrades i låsta flikar syns inte)

### 1.4 Era → Flik-mappning
- [ ] Befintliga era-trösklar styr fortfarande vilka upgrades som syns
- [ ] Men flikar styrs separat av beredskapsläge (implementeras fullt i Sprint 2)
- [ ] I Sprint 1: alla flikar utom Tab 0 börjar låsta, men kan forceras öppna via totalFp-trösklar (temporärt, tills beredskapsläge finns)
- [ ] Alternativt: lås upp flikar baserat på befintliga era-trösklar som placeholder

### 1.5 Klickkraft-sektion
- [ ] Klickkraft-uppgraderingar visas i ALLA flikar (gemensam sektion under tab-innehållet)
- [ ] Eller: flytta till en egen "mini-tab" / alltid-synlig sektion

### 1.6 Save/Load v2
- [ ] Bumpa save version till 2
- [ ] Spara `activeTab` och `tabUnlocked[]`
- [ ] Migration: v1 spardata → v2 (sätt alla tabs utom 0 till locked, activeTab = 0)
- [ ] Testa att v1 saves laddas korrekt

### 1.7 Tester
- [ ] Tab switching: byta flik visar rätt upgrades
- [ ] Tab locking: låsta flikar kan inte aktiveras
- [ ] Tab unlocking: `unlockTab()` ändrar state korrekt
- [ ] Upgrade visibility: upgrades filtreras på aktiv tab
- [ ] Save/load v2: ny data sparas och laddas korrekt
- [ ] Migration: v1 → v2 migration fungerar
- [ ] Data integrity: alla upgrades har `tab`-fält, alla tab-tilldelningar är giltiga

### 1.8 Manuell verifiering
- [ ] Öppna spelet i browser — flikar syns
- [ ] Klicka mellan flikar — rätt upgrades visas
- [ ] Låsta flikar har visuell indikation
- [ ] Spela genom hela spelet — upgrades fungerar som förut
- [ ] Spara, ladda om — tab-state bevaras
- [ ] Mobilvy — flikar är användbara

**Filer:** index.html, style.css, game.js, test.js
**Beräknad storlek:** Medel

---

## Sprint 2: Resurssystem + Beredskapsläge

**Mål:** Lägg till resursmätare och beredskapsläge-termostat. Resurser dräneras passivt. Uppgraderingar fyller på resurser. Straff vid 0. Beredskapsläget eskalerar automatiskt och låser upp flikar.

### 2.1 Beredskapsläge-system
- [ ] State: `game.threatLevel` (0–4: Vardag, Oro, Störning, Kris, Uppbyggnad)
- [ ] Timer: eskalerar automatiskt (Vardag→Oro ~5 min, Oro→Störning ~12 min, etc.)
- [ ] Visuell indikator i headern (färgkodad: grön/gul/orange/röd/blå + text)
- [ ] Animation vid byte ("BEREDSKAPSLÄGE: ORO" — liknande era-unlock)
- [ ] Ljud vid byte (nytt ljud: stigande, lite oroande ton)
- [ ] Beredskapsläge styr:
  - Vilka flikar som är upplåsta
  - Resursdräneringsrate
  - Event-frekvens och event-pool
  - Krävd totalFp för att nå nästa nivå (eller ren tidsbas? — diskutera)

### 2.2 Resursmätare (UI)
- [ ] 3 meters i UI: Försörjning, Samband, Samhörighet
- [ ] Placering: under era-indikatorn i header, eller som fast sektion ovanför flikarna
- [ ] Visuell: horisontella bars med ikon, namn, värde (0–100)
- [ ] Färgkodning: grön (>60), gul (30–60), röd (<30), pulserande vid <15
- [ ] Tooltip med förklaring av vad resursen representerar

### 2.3 Resursmätare (logik)
- [ ] `game.resources = { supply: 80, comms: 80, community: 80 }`
- [ ] Maxvärde: 100 (kan inte överstiga)
- [ ] Passiv dränering i game loop, rate baserad på beredskapsläge:
  - Vardag: 0/min
  - Oro: ~0.5/min
  - Störning: ~1.5/min
  - Kris: ~3/min
  - Uppbyggnad: ~0.5/min
- [ ] Straff vid 0:
  - Försörjning = 0: `game.fpPerSecond` halveras (multiplier 0.5)
  - Samband = 0: Event-bonusar blockeras
  - Samhörighet = 0: Uppgraderingskostnader +50%
- [ ] Straff upphör direkt när resursen överstiger 0

### 2.4 Uppgraderingar → Resurser
- [ ] Varje upgrade ger resursbonus vid köp (engångseffekt per köpt)
- [ ] Hemmet-upgrades: +5–15 Försörjning per köp
- [ ] Info-upgrades: +5–15 Samband per köp
- [ ] Familj & Grannar-upgrades: +5–15 Samhörighet per köp
- [ ] Kommun & Region-upgrades: +5 alla resurser per köp
- [ ] Nationen-upgrades: +3 alla resurser per köp
- [ ] Alternativt: upgrades ger passiv resurs-regenerering (mer komplext, kanske Sprint 4)

### 2.5 Beredskapsläge ↔ Flikar
- [ ] Tab 2 låses upp vid Oro
- [ ] Tab 3 låses upp vid Störning
- [ ] Tab 4 låses upp vid Kris
- [ ] Tab 5 låses upp vid Uppbyggnad
- [ ] Ersätter den temporära era-baserade unlocking från Sprint 1

### 2.6 Save/Load-uppdatering
- [ ] Spara `threatLevel`, `resources`, resurstimers
- [ ] Behåll bakåtkompatibilitet (v1 → v2)

### 2.7 Tester
- [ ] Resurser börjar på 80
- [ ] Resurser dräneras korrekt per beredskapsläge
- [ ] Resurser kan inte gå under 0 eller över 100
- [ ] Straff aktiveras/avaktiveras korrekt vid 0 / >0
- [ ] Beredskapsläge eskalerar vid rätt tid
- [ ] Flikar låses upp vid rätt beredskapsläge
- [ ] Uppgraderingar ger resursbonusar
- [ ] Save/load bevarar resurser och beredskapsläge
- [ ] Balanssimuleringar: kan spelaren hålla resurser uppe med aktivt spelande?

### 2.8 Manuell verifiering
- [ ] Resursmätare syns och uppdateras
- [ ] Beredskapsläge eskalerar visuellt
- [ ] Straff märks (FP/s sjunker vid Försörjning=0)
- [ ] Att köpa upgrades fyller på resurser
- [ ] Spelet är fortfarande spelbart och kul
- [ ] Mobilvy fungerar med nya UI-element

**Filer:** index.html, style.css, game.js, test.js
**Beräknad storlek:** Stor

---

## Sprint 3: Kriser & Dilemma-system

**Mål:** Ersätt det rena bonus-eventsystemet med tre eventtyper: bonusar, kriser, och dilemman. Kriser dränerar resurser. Dilemman ger spelaren binära val med konsekvenser.

### 3.1 Utökat eventsystem
- [ ] Events har nu `category`: 'bonus', 'crisis', 'dilemma'
- [ ] Event-pool filtreras baserat på beredskapsläge:
  - Vardag: 80% bonus, 20% lindrig kris
  - Oro: 50% bonus, 40% kris, 10% dilemma
  - Störning: 20% bonus, 40% kris, 40% dilemma
  - Kris: 10% bonus, 50% kris, 40% dilemma
  - Uppbyggnad: 40% bonus, 20% kris, 40% dilemma
- [ ] Event-frekvens ökar med beredskapsläge:
  - Vardag: var 45–90s (som idag)
  - Oro: var 30–60s
  - Störning: var 20–45s
  - Kris: var 15–30s
  - Uppbyggnad: var 30–60s

### 3.2 Kris-events (~12 stycken)
- [ ] Strömavbrott: Försörjning -20
- [ ] Vattenledning brast: Försörjning -25
- [ ] Mobilnätet nere: Samband -30
- [ ] Stormen Gudrun 2.0: Alla resurser -10
- [ ] Matbrist i butikerna: Försörjning -15, Samhörighet -5
- [ ] Cyberangrepp mot myndigheter: Samband -25
- [ ] Desinformationsvåg: Samband -15, Samhörighet -10
- [ ] Kyla utan el: Försörjning -20 (extra -10 om Försörjning redan < 30)
- [ ] Grannbråk om resurser: Samhörighet -20
- [ ] Sjukdomsutbrott: Försörjning -15, Samhörighet -10
- [ ] Bränslebrist: Försörjning -15
- [ ] Fler vid behov
- [ ] Kriser visar en röd/orange variant av event-overlay
- [ ] Krisljud: distinkt från bonus-ljud (sjunkande ton, lite oroande)

### 3.3 Dilemma-events (~10 stycken)
- [ ] Dilemma-overlay: som event-overlay men med TVÅ knappar
- [ ] Varje knapp visar kort beskrivning av konsekvenser
- [ ] Dilemma-val sparas i `game.dilemmaHistory[]`
- [ ] Initiala dilemman:
  1. "Grannen behöver vatten": Dela (-10 Försörj, +15 Samhörig) / Behåll (-5 Samhörig)
  2. "Rykten om förorenat vatten": Kolla fakta (-5 Samband, korrekt info) / Hamstra (-20 FP, +10 Försörj)
  3. "Kommunen söker frivilliga": Ställ upp (-FP/s 20% 60s, +20 Samhörig) / Avböj (+0)
  4. "Okänd bankar på — behöver hjälp": Öppna (-10 Försörj, +10 Samhörig) / Ignorera (-5 Samhörig)
  5. "Tonåringen vill ut och hjälpa grannar": Tillåt (-5 Samhörig [oro], +10 Samhörig [bidrag]) / Neka (-10 Samhörig)
  6. "Grannen erbjuder bensin mot mat": Byt (+10 Försörj, -5 Försörj, +10 Samhörig) / Avböj (+0)
  7. "Någon sprider falsk info i gruppen": Konfrontera (-10 Samhörig, +15 Samband) / Ignorera (-10 Samband)
  8. "Din arbetsgivare vill ha dig på plats": Gå (+FP/s bonus 60s, -10 Samhörig) / Stanna hemma (+10 Samhörig)
  9. "Äldre granne behöver medicin, du har extra": Dela (-10 Försörj, +15 Samhörig) / Behåll (-5 Samhörig)
  10. "Räddningstjänsten behöver ditt fordon": Lämna ut (-15 Försörj, +20 Samhörig, +FP bonus) / Neka (-10 Samhörig)

### 3.4 Befintliga events — migrering
- [ ] Behåll befintliga 12 events men klassificera som 'bonus'
- [ ] Justera conditional events (strömavbrott, vattenledning, etc.) — de är nu kriser istället
- [ ] Ta bort/sammanfoga duplicerade scenarier

### 3.5 Dilemma-historik
- [ ] `game.dilemmaHistory = []` — loggar varje val: `{ eventId, choice: 'a'|'b', time }`
- [ ] Används i slutskärmen (Sprint 5)

### 3.6 UI-uppdateringar
- [ ] Kris-event: röd border/bakgrund i event-overlay
- [ ] Dilemma-event: event-overlay med två knappar + konsekvenstext
- [ ] Ljud: nytt kris-ljud (fallande, oroande), dilemma-ljud (tveksam ton)

### 3.7 Save/Load
- [ ] Spara dilemmaHistory
- [ ] Event-pool kan inte sparas (volatile) — bara aktiv event + timer

### 3.8 Tester
- [ ] Kris-events minskar rätt resurser
- [ ] Dilemma val A och val B ger korrekta konsekvenser
- [ ] Event-pool filtreras korrekt per beredskapsläge
- [ ] Event-frekvens matchar beredskapsläge
- [ ] Conditional kris-events (extra skada vid låg resurs) fungerar
- [ ] Dilemma-historik sparas korrekt
- [ ] Alla event-data har korrekta fält
- [ ] Save/load bevarar dilemma-historik

### 3.9 Manuell verifiering
- [ ] Kriser visas med distinkt visuellt tema (röd)
- [ ] Dilemman visas med två valknappar
- [ ] Resurser sjunker synligt vid kris
- [ ] Val i dilemman ger direkt feedback (resursändring syns)
- [ ] Event-takt ökar med beredskapsläge
- [ ] Spelet känns mer dynamiskt och pressat
- [ ] Mobilvy fungerar med dilemma-overlay

**Filer:** index.html, style.css, game.js, test.js
**Beräknad storlek:** Stor

---

## Sprint 4: Flik-innehåll & strategiskt djup

**Mål:** Fyll varje flik med unika uppgraderingar och mekaniker. Balansera hela upgrade-trädet. Lägg till inter-flik-synergier.

### 4.1 Tab 2: Info & Kommunikation (nya uppgraderingar)
- [ ] 6–8 uppgraderingar med Info/Samband-tema
- [ ] Unik mekanik: "Rykten vs Fakta" — dilemma-events ger bättre information om du har Info-upgrades
  - Exempelvis: med Faktakoll-grupp visar dilemma-events vilken konsekvens som är bäst
- [ ] Uppgraderingar:
  - Ficklampa & radio (befintlig, flyttad)
  - Grannlista med telefonnummer (ny)
  - Vevradio-nätverk (ny)
  - Faktakoll-grupp (ny — förbättrar dilemma-info)
  - Krisapp (ny)
  - Rakel-kommunikation (befintlig, flyttad)
  - Kommunens SMS-utskick (ny)
  - Lokal radiostation (ny)

### 4.2 Tab 3: Familj & Grannar (nya mekaniker)
- [ ] Befintliga grannuppgraderingar + nya
- [ ] Unik mekanik: "Tillit" (trust) som sub-resurs
  - Tillit byggs av Samhörighet-vänliga dilemma-val
  - Hög tillit ger billigare uppgraderingar i Tab 3
  - Låg tillit gör dilemman dyrare
- [ ] Nya uppgraderingar:
  - Gemensam matlagning
  - Barnpassning-rotation
  - Trygghetsvandringar

### 4.3 Tab 4: Kommun & Region (befintliga, ombalanserade)
- [ ] Välj 6–8 uppgraderingar från befintliga era 3+4 (de har redan bra teman)
- [ ] Unik mekanik: "Civilplikt-uppgifter" — vid Kris-beredskapsläge kan du ta uppdrag som ger stor FP-bonus men kostar resurser
- [ ] Ombalansera kostnader och FP/s nu när spelaren har resurstryck

### 4.4 Tab 5: Nationen (endgame)
- [ ] Befintliga nationella uppgraderingar
- [ ] Slutför spelet genom att köpa "Totalförsvar 3,5% av BNP"
- [ ] Kräver att spelaren har klarat sig genom krisen — om resurser är för låga, kan inte köpa

### 4.5 Inter-flik-synergier
- [ ] Info-upgrades förbättrar dilemma-utfall
- [ ] Familj & Grannar-upgrades minskar Samhörighet-dränering
- [ ] Kommun & Region-upgrades minskar ALL resursdränering
- [ ] Nationella upgrades ger global FP/s-multiplikator

### 4.6 Nya klickkraft-uppgraderingar
- [ ] 2–3 nya klickkraft-upgrades kopplade till resurser
- [ ] Exempelvis: "Krisstyrka" (klickkraft + Försörjning-bonus)

### 4.7 Balansering
- [ ] Justera ALL upgrade-kostnader för ny flödesbalans
- [ ] Simulera med playtest.js (utöka med resurser)
- [ ] Varje flik ska ta ~5–8 min att "klara" (köpa alla upgrades med normalt spelande)
- [ ] Total speltid: ~30–40 min
- [ ] Resurser ska kunna hållas uppe med aktivt spelande men kräva prioritering

### 4.8 Tester
- [ ] Alla nya upgrades har korrekta fält
- [ ] Tab-tilldelningar stämmer
- [ ] Inter-flik-synergier fungerar matematiskt
- [ ] Balanssimuleringar: hela spelet i ~35 min vid 3 cps
- [ ] Resurser hållbara men utmanande

### 4.9 Manuell verifiering
- [ ] Varje flik har meningsfullt innehåll
- [ ] Uppgraderingar i varje flik känns tematiskt rätt
- [ ] Resurstrycket gör att man måste prioritera
- [ ] Spelet är utmanande men inte frustrerande
- [ ] Alla flikar används under en genomspelning

**Filer:** game.js, test.js, playtest.js
**Beräknad storlek:** Stor

---

## Sprint 5: Slutskärm & Polish

**Mål:** Implementera den utökade beredskapsrapporten. Lägg till nya achievements. Responsiv design för alla nya element. Final balansering och testning.

### 5.1 Beredskapsrapport (slutskärm)
- [ ] Sektion 1: Spelstatistik (behåll befintlig)
- [ ] Sektion 2: Din beredskapsrapport
  - Lägsta nivå per resurs under spelet (spåra i game loop)
  - Antal gånger varje resurs nådde 0
  - Antal kriser klarade / totalt
  - Sammanfattning av dilemma-val (t.ex. "Du delade vatten 3 gånger")
- [ ] Sektion 3: Verklighetscheck (fakta från research.md)
  - 4–6 faktameningar om svensk beredskap
  - Konservativa, verifierade — inga gissningar
- [ ] Sektion 4: Reflektionsfrågor
  - 4–5 frågor som spelaren kan fundera på
- [ ] Sektion 5: "Nu jävlar" + länkar (behåll befintliga + ev. fler)

### 5.2 Spårning av speldata för rapporten
- [ ] `game.resourceHistory = { supplyMin: 80, commsMin: 80, communityMin: 80 }`
- [ ] `game.resourceZeroCount = { supply: 0, comms: 0, community: 0 }`
- [ ] `game.crisesHandled = 0, game.crisesTotal = 0`
- [ ] Uppdateras i game loop och event-handlers

### 5.3 Nya achievements (~8–10 nya)
- [ ] "Resursstark" — alla resurser > 50 under hela spelet
- [ ] "Medmänniska" — valt att hjälpa i alla dilemman
- [ ] "Pragmatiker" — valt att behålla i alla dilemman
- [ ] "Kriserfaren" — överlevt 10 kriser
- [ ] "Informerad" — alla Info-upgrades köpta
- [ ] "Gemenskapsmästare" — Samhörighet aldrig under 30
- [ ] "Nollgånger" — en resurs nådde 0 minst 3 gånger (men du överlevde)
- [ ] "Balanserad" — alla resurser slutade över 50
- [ ] Uppdatera achievement-panel och count

### 5.4 Responsiv design
- [ ] Flikar fungerar på mobil (scrollbar eller 2 rader)
- [ ] Resursmätare fungerar på mobil (kompakt vy)
- [ ] Beredskapsläge-indikator fungerar på mobil
- [ ] Dilemma-overlay fungerar på mobil (knappar klickbara)
- [ ] Beredskapsrapport scrollbar på mobil
- [ ] Testa på 320px, 375px, 768px, 1024px

### 5.5 Balansering
- [ ] Uppdatera playtest.js med resurssimulering
- [ ] Kör fullständig balanssimulering
- [ ] Justera: resursdräneringsrater, event-frekvenser, upgrade-kostnader
- [ ] Mål: ~35 min genomspelning vid 3 cps, resurser utmanande men överlevnadsbara

### 5.6 Buggfixar & edge cases
- [ ] Reset rensar alla nya state (resurser, beredskapsläge, dilemma-historik)
- [ ] Save/load hanterar alla nya fält
- [ ] Resource penalties avaktiveras korrekt vid reset
- [ ] Partiklar/float-text fungerar med nya overlays
- [ ] Performance: inga minneslexor vid lång spelsession

### 5.7 Tester
- [ ] Slutskärm visar korrekt beredskapsrapport
- [ ] Resurs-spårning (min, zero-counts) stämmer
- [ ] Nya achievements triggar korrekt
- [ ] Alla achievements i simulering
- [ ] Full save/load med alla nya fält
- [ ] Reset nollställer allt korrekt
- [ ] Responsiv: manuell test på olika skärmstorlekar

### 5.8 Manuell verifiering
- [ ] Spela igenom hela spelet — upplevelsen ska vara engagerande
- [ ] Slutskärmen ska lämna en eftertanke
- [ ] Fakta i verklighetscheck ska vara korrekta
- [ ] Reflektionsfrågor ska kännas relevanta
- [ ] Inga visuella buggar på mobil
- [ ] Spelet laddar korrekt med gammal save-data (bakåtkompatibilitet)

**Filer:** index.html, style.css, game.js, test.js, playtest.js
**Beräknad storlek:** Stor

---

## Sprint 6 (valfri): Final Balance & Release

**Mål:** Extern playtesting, slutjusteringar, ev. deployment.

### 6.1 Extern playtesting
- [ ] Låt 3–5 personer spela igenom
- [ ] Samla feedback: var fastnade de? Var det för svårt/lätt? Förstod de systemen?
- [ ] Justera baserat på feedback

### 6.2 Slutjusteringar
- [ ] Finjustera balans
- [ ] Textgenomgång: alla texter begripliga, korrekta, konsekvent ton
- [ ] Tillgänglighet: kontrastcheck, skärmläsare, tangentbordsnavigation
- [ ] Favicon och meta-taggar uppdaterade

### 6.3 Deployment
- [ ] Bestäm hosting (GitHub Pages, Netlify, annat)
- [ ] Konfigurera deployment
- [ ] Testa i produktion

**Filer:** Alla
**Beräknad storlek:** Medel

---

## Öppna frågor per sprint

### Sprint 1
- Ska klickkraft-uppgraderingar vara globala (syns i alla flikar) eller kopplas till specifik flik?
- Exakt vilka upgrades hamnar i vilken flik? (Förslag i plan.md — justera vid implementation)

### Sprint 2
- Ska beredskapsläge vara tidsstyrt eller FP-tröskelstyrt?
- Hur hård ska resursdränering vara? (Måste playtestas)
- Ska resurser kunna gå under 0?

### Sprint 3
- Hur många dilemman totalt? (10 förslag — fler kan läggas till)
- Ska dilemman ha timeout (auto-val om ingen input)?
- Ska samma dilemma kunna visas flera gånger?

### Sprint 4
- Exakt antal nya uppgraderingar per flik?
- Hur komplex ska "Rykten vs Fakta"-mekaniken vara?
- Ska det finnas upgrade-dependencies (kräv upgrade X innan Y)?

### Sprint 5
- Vilka specifika fakta ska finnas i verklighetscheck? (Bara research.md-data, eller ny research?)
- Ska reflektionsfrågor vara statiska eller baserade på spelarens val?
