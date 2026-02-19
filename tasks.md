# Tasks: FÖRSVARSVILJA - Klickerspel

## Datum: 2026-02-19

---

## Sprint 1: Grundspel ✅

### 1.1 HTML-struktur ✅
- [x] Skapa `index.html` med grundläggande HTML5-boilerplate
- [x] Header med speltitel "FÖRSVARSVILJA"
- [x] Klickområde med sköld-ikon (SVG med tre kronor)
- [x] Poängdisplay: totala FP, FP/sekund, FP/klick
- [x] Uppgraderingspanel (sidebar/nedre sektion)
- [x] Era-indikator med progress bar
- [x] Nyhetsticker-container längst ner

### 1.2 CSS-styling ✅
- [x] Färgschema: svenskt/militärt tema (blått, gult, mörkt grönt)
- [x] Layout: klickområde centrerat, upgrades till höger/under
- [x] Styling för klickknapp med hover/active-states
- [x] Styling för uppgraderingskort (namn, kostnad, beskrivning, FP/s)
- [x] Typografi: tydliga siffror, läsbar text
- [x] Grundläggande animationer (knapp-press, pulsering)

### 1.3 Klick-mekanik ✅
- [x] Klick-eventlistener på sköld
- [x] FP-räknare som ökar per klick
- [x] Visa aktuellt FP/klick-värde
- [x] Visuell feedback vid klick (skala-animation)

### 1.4 Uppgraderingssystem (Era 1: Hemberedskap) ✅
- [x] Datastruktur för uppgraderingar: `{ id, name, description, baseCost, fpPerSecond, count }`
- [x] Era 1-uppgraderingar:
  - Vattenflaskor (cost 10, 0.5 FP/s)
  - Konservburkar (cost 50, 2 FP/s)
  - Stormkök & bränsle (cost 200, 8 FP/s)
  - Ficklampa, radio & batterier (cost 600, 30 FP/s)
  - Sovsäck & filtar (cost 1500, 100 FP/s)
  - Hemberedskapskit (cost 5000, 300 FP/s)
- [x] Köp-logik: dra FP, öka count, uppdatera FP/s
- [x] Kostnadseskalering: `baseCost * 1.15^count`
- [x] Knapp disabled + visuell dimming om inte råd
- [x] Visa antal köpta per uppgradering

### 1.5 FP/sekund-motor ✅
- [x] Game loop med `setInterval` (uppdatera var 100ms)
- [x] Summera alla uppgraderingars FP/s-bidrag
- [x] Visa total FP/s i UI
- [x] Ackumulera FP varje tick

### 1.6 Formatering av stora tal ✅
- [x] Funktion för att formatera tal: 1 000 → "1K", 1 000 000 → "1M", etc.
- [x] Stöd för: K (tusen), M (miljoner), B (miljarder), T (biljoner), Q (kvadriljoner)
- [x] Använd genomgående i UI (FP, kostnader, FP/s)

### 1.7 Tester ✅
- [x] test.js: 147 automatiserade tester (Node.js) — utökat i Sprint 2
- [x] test.html: Webbläsarbaserad testrunner
- [x] Testar: formatering, kostnad, FP/s, köplogik, era-progression, dataintegritet, balanssimuleringar
- [x] Balans verifierad: Era 2 nås på ~3.7 min (2 cps), alla upgrades x1 på ~7.3 min (3 cps)

---

## Sprint 2: Progression ✅

### 2.1 Alla eror och uppgraderingar ✅

**Era 1: Hemberedskap** (redan i Sprint 1)
- [x] Vattenflaskor (cost 10, 0.5 FP/s)
- [x] Konservburkar (cost 50, 2 FP/s)
- [x] Stormkök & bränsle (cost 200, 8 FP/s)
- [x] Ficklampa, radio & batterier (cost 600, 30 FP/s)
- [x] Sovsäck & filtar (cost 1500, 100 FP/s)
- [x] Hemberedskapskit (cost 5000, 300 FP/s)

**Era 2: Grannskapet** (threshold 5K)
- [x] Grannsamverkan (cost 8K, 500 FP/s)
- [x] Vedförråd & gemensam eldstad (cost 25K, 1.5K FP/s)
- [x] Vattenrenare & vattendunkar (cost 75K, 5K FP/s)
- [x] Informationsmöte (cost 200K, 15K FP/s)
- [x] Lokal beredskapsgrupp (cost 500K, 40K FP/s)
- [x] Gemensamt skyddsrum (cost 1.2M, 100K FP/s)

**Era 3: Kommunen** (threshold 100K)
- [x] Kommunal krisplan (cost 1.5M, 200K FP/s)
- [x] Beredskapsveckan (cost 4M, 500K FP/s)
- [x] Nödvattenförsörjning (cost 10M, 1.2M FP/s)
- [x] Räddningstjänst-uppgradering (cost 25M, 3M FP/s)
- [x] Civilplikt-organisering (cost 60M, 8M FP/s)
- [x] Rakel-kommunikation (cost 150M, 20M FP/s)

**Era 4: Regionen** (threshold 2M)
- [x] Länsstyrelse-samordning (cost 200M, 40M FP/s)
- [x] Regionalt civilområde (cost 500M, 100M FP/s)
- [x] Elberedskap & reservkraft (cost 1.5B, 250M FP/s)
- [x] Livsmedelsförsörjning (cost 4B, 600M FP/s)
- [x] Drivmedelsreserver (cost 10B, 1.5B FP/s)
- [x] Cybersäkerhet (cost 25B, 4B FP/s)

**Era 5: Nationen** (threshold 50M)
- [x] MCF (cost 40B, 8B FP/s)
- [x] Hemvärnet (cost 100B, 20B FP/s)
- [x] JAS 39 Gripen (cost 300B, 50B FP/s)
- [x] Global Eye-flygplan (cost 800B, 120B FP/s)
- [x] NATO artikel 5 (cost 2T, 300B FP/s)
- [x] Totalförsvar 3,5% av BNP (cost 5T, 800B FP/s)

### 2.2 Era-progression ✅
- [x] FP-trösklar: 0, 5K, 100K, 2M, 50M
- [x] Progress bar visar avstånd till nästa era
- [x] Visuell "unlock"-animation vid ny era (overlay med puls-animation)
- [x] Uppgraderingar för nya eror synliggörs först vid unlock
- [x] Era-namn med headers i upgrade-listan

### 2.3 Klickkraft-uppgraderingar ✅
- [x] Separat sektion i UI ("Klickkraft")
- [x] Engångsköp (kan bara köpas en gång)
- [x] 6 uppgraderingar:
  - Vikingblod (2x, cost 500)
  - Karolinsk beslutsamhet (3x, cost 15K)
  - Ärtsoppekraft (5x, cost 250K)
  - Beredskapskämpe (10x, cost 5M)
  - Försvarsminister-handslag (25x, cost 100M)
  - "NU JÄVLAR"-knappen (100x, cost 5B)
- [x] Markera som köpt (grön bakgrund + ✓)

### 2.4 Balansering ✅
- [x] Baskostad och FP/s för alla 30 uppgraderingar
- [x] Progression verifierad via 147 automatiserade tester
- [x] Era-timing: ~3.2, 3.7, 3.8, 5.4 min per era
- [x] Full genomspelning: ~23 min (3 cps)
- [x] Klickkraft: 500 → 5B FP (750,000x total multiplikator)

---

## Sprint 3: Juice & Events ✅

### 3.1 Partikeleffekter ✅
- [x] Generera partiklar vid klick (CSS-animerade element)
- [x] Partiklar flyger ut från klickpunkten
- [x] Variation i riktning, hastighet, storlek
- [x] Ta bort partiklar efter animation (performance)

### 3.2 Float-text ✅
- [x] Visa "+X FP" text som flyter uppåt vid klick
- [x] Text fadar ut och försvinner
- [x] Positionera vid klickpunkten

### 3.3 Ljud ✅
- [x] Web Audio API-setup
- [x] Klickljud (kort, tillfredsställande)
- [x] Köp-ljud
- [x] Era-unlock-ljud
- [ ] Achievement-ljud (Sprint 4)
- [x] Volymkontroll / mute-knapp

### 3.4 Slumpmässiga händelser ✅
- [x] Event-system: slumpmässigt event var 45-90 sekund
- [x] Overlay/popup med eventbeskrivning och klickbar knapp
- [x] 12 events med 5 typer (multiplier, bonus, conditional, click_bonus, upgrade_bonus)
- [x] Timer/countdown på aktiva events
- [x] Visuell indikation på aktiv bonus (glödande indikator med tid)

### 3.5 Nyhetsticker ✅ (Sprint 1)
- [x] Löpande text längst ner på skärmen (CSS animation)
- [x] 25 riktiga budskap om beredskap
- [x] Seamless loop med duplicerade meddelanden

### 3.6 Tester ✅
- [x] 278 automatiserade tester (131 nya event-tester)
- [x] Event data integrity, type distribution, multiplier math, bonus calculations
- [x] Conditional event logic, scheduling range, upgrade references

---

## Sprint 4: Achievements & Slutspel ✅

### 4.1 Achievement-system ✅
- [x] Datastruktur: `{ id, name, description, check, unlocked }`
- [x] 16 achievements:
  - Första steget (1 klick)
  - Hundra klick (100 klick)
  - Tusen klick (1 000 klick)
  - Tiotusen klick (10 000 klick)
  - Första inköpet (första uppgradering)
  - "Hemberedskapen klar" (alla Era 1-uppgraderingar)
  - "Grannen du vill ha" (alla Era 2-uppgraderingar)
  - Kommunal kraft (nå Era 3)
  - Regional samordning (nå Era 4)
  - Nationens försvar (nå Era 5)
  - Klickkraftare (första klickkraft-uppgradering)
  - "NU JÄVLAR" (NU JÄVLAR-knappen köpt)
  - "Kontanter?!" (nå 10 000 FP)
  - "Har du läst broschyren?" (nå 5 200 000 FP)
  - Totalförsvaret komplett (slutför spelet)
  - Fullständig beredskap (alla andra achievements — meta)
- [x] Kontrollera achievements varje sekund
- [x] Achievement sound (triumphant arpeggio)

### 4.2 Achievement-toasts ✅
- [x] Toast-notifikation som glider in från höger vid unlock
- [x] Visa achievement-namn, beskrivning och trophy-ikon
- [x] Försvinner efter 3 sekunder
- [x] Queue-system — stackar om flera triggas

### 4.3 Achievement-display ✅
- [x] Panel/modal med alla achievements (klickbar knapp i header)
- [x] Unlockade visas med guld trophy-ikon, låsta visas gråa med lås
- [x] Visa progress (X/16 unlockade)
- [x] Stäng genom att klicka utanför

### 4.4 Slutskärm ✅
- [x] Triggas vid köp av sista uppgraderingen ("Totalförsvar 3,5% av BNP")
- [x] Overlay som täcker spelet med fade-in animation
- [x] Spelstatistik: klick, speltid, totalt FP, uppgraderingar, meriter
- [x] Reflekterande text om försvarsvilja
- [x] Avslutas med "Nu jävlar."
- [x] Grand fanfare sound
- [x] Länkar till riktiga resurser (MCF, Försvarsmakten, Hemvärnet, broschyren)
- [x] "Spela igen"-knapp (full game reset)

### 4.5 Tester ✅
- [x] 355 automatiserade tester (77 nya achievement/endgame-tester)
- [x] Achievement data integrity, click milestones, upgrade milestones, era milestones
- [x] Click upgrade achievements, FP milestones, game complete detection
- [x] Full game achievement simulation (15/15 unlock in ~55 min)

---

## Sprint 5: Polish ✅

### 5.1 Responsiv design ✅
- [x] Mobillayout (< 768px): stacked, klickknapp överst, upgrades under
- [x] Surfplattelayout (768-1024px): anpassad
- [x] Liten telefon (< 400px): extra kompakt layout
- [x] Touch-events för mobil (touchend preventDefault mot zoom)
- [x] touch-action: manipulation på klickknapp och upgrade-kort
- [x] user-select: none i spelområdet

### 5.2 localStorage-sparning ✅
- [x] Spara spelläge: FP, alla upgrade-counts, achievements, era, statistik
- [x] Ladda sparning vid sidladdning
- [x] Auto-save varje 30 sekund
- [x] Sparar vid beforeunload
- [x] "Nollställ spelet"-knapp (↻) med confirm-dialog i header
- [x] Versionerad spardata (version: 1) för framtidskompatibilitet

### 5.3 Balansering och playtesting ✅
- [x] Balance verifierad via 394 automatiserade tester
- [x] Full genomspelning ~23 min (3 cps), alla eror 2-5 min
- [x] Alla achievements triggar korrekt i simulering (15/15)
- [x] Event edge cases testade (conditional bonusar, upgrade bonusar)

### 5.4 Buggfixar ✅
- [x] Memory leaks: safety-timeout på partiklar och float-text (1.5s)
- [x] Reset rensar DOM-partiklar och float-text
- [x] Reset rensar event-timers (eventTimer, _eventDismissTimer)
- [x] Reset nollställer _clickBonusValue
- [x] Reset startar om event-scheduling
- [x] Dubbelklick-zoom förhindrad på klickknapp

### 5.5 Slutfinish ✅
- [x] Favicon (SVG inline — svensk sköld med kronor)
- [x] Meta-taggar (description, og:title, og:description, og:type, theme-color)
- [x] 394 tester (39 nya Sprint 5-tester: save/load, reset, edge cases)

---

## Öppna frågor (avslutade)

- [x] Prestige-mekanik? → Nej, spelet har tydligt slut
- [x] Oändligt spel eller tydligt slut? → Tydligt slut vid Totalförsvar 3,5% av BNP
- [x] "Fiender" som desinformation? → Desinformation som klick-event istället
- [x] Målad speltid? → ~23 min
- [x] Idle save-funktion? → Ja, localStorage med auto-save
- [x] Mini-games? → Nej, fokus på klick + slumpmässiga events
- [x] Hosting/deploy? → Öppen fråga, statiska filer
