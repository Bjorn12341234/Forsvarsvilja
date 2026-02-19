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
- [x] test.js: 55 automatiserade tester (Node.js)
- [x] test.html: Webbläsarbaserad testrunner
- [x] Testar: formatering, kostnad, FP/s, köplogik, era-progression, dataintegritet, balanssimuleringar
- [x] Balans verifierad: Era 2 nås på ~3.7 min (2 cps), alla upgrades x1 på ~7.3 min (3 cps)

---

## Sprint 2: Progression

### 2.1 Alla eror och uppgraderingar

**Era 1: Hemberedskap** (redan i Sprint 1)
- [ ] Vattenflaskor ("3 liter/person/dag i minst en vecka")
- [ ] Konservburkar ("Mat som inte behöver kylskåp")
- [ ] Stormkök & bränsle ("Laga mat utan el")
- [ ] Ficklampa, radio & batterier ("Vevradio = guld värt vid strömavbrott")
- [ ] Sovsäck & filtar ("Håll värmen om elementen slutar fungera")
- [ ] Hemberedskapskit ("Kontanter, mediciner, viktiga dokument, första hjälpen")

**Era 2: Grannskapet**
- [ ] Grannsamverkan ("Kolla till varandra vid kris")
- [ ] Vedförråd & gemensam eldstad ("Värme till hela kvarteret")
- [ ] Vattenrenare & vattendunkar ("Rent vatten även om kranen slutar fungera")
- [ ] Informationsmöte ("Prata igenom: vad gör vi om strömmen går?")
- [ ] Lokal beredskapsgrupp ("Organisera roller: vem har generator? Vem kan första hjälpen?")
- [ ] Gemensamt skyddsrum ("Sverige har ~65 000 skyddsrum")

**Era 3: Kommunen**
- [ ] Kommunal krisplan ("Varje kommun ska ha en plan för höjd beredskap")
- [ ] Beredskapsveckan ("Årlig övning sedan 2017")
- [ ] Nödvattenförsörjning ("Drickvattenberedskap för hela kommunen")
- [ ] Räddningstjänst-uppgradering
- [ ] Civilplikt-organisering ("Alla yrken kan krigsplaceras")
- [ ] Rakel-kommunikation ("Radiosystem som fungerar när mobilnätet är nere")

**Era 4: Regionen**
- [ ] Länsstyrelse-samordning ("Sex civilområden i Sverige")
- [ ] Regionalt civilområde
- [ ] Elberedskap & reservkraft ("Håll elnätet igång eller bygg alternativ")
- [ ] Livsmedelsförsörjning ("Centrallager och dagligvaruhandel vid kris")
- [ ] Drivmedelsreserver ("Samhället stannar utan bränsle")
- [ ] Cybersäkerhet ("IT-incidenthantering och skydd mot cyberhot")

**Era 5: Nationen**
- [ ] MCF (Myndigheten för civilt försvar)
- [ ] Hemvärnet
- [ ] JAS 39 Gripen
- [ ] Global Eye-flygplan
- [ ] NATO artikel 5
- [ ] Totalförsvar 3,5% av BNP (sista uppgraderingen)

### 2.2 Era-progression
- [ ] Definiera FP-trösklar för att låsa upp varje era
- [ ] Progress bar som visar avstånd till nästa era
- [ ] Visuell "unlock"-animation vid ny era
- [ ] Uppgraderingar för nya eror synliggörs först vid unlock
- [ ] Era-namn och beskrivning visas i UI

### 2.3 Klickkraft-uppgraderingar
- [ ] Separat sektion i UI för klickkraft-upgrades
- [ ] Engångsköp (kan bara köpas en gång)
- [ ] ~6 uppgraderingar:
  - Vikingblod (2x klick)
  - Karolinsk beslutsamhet (3x klick)
  - Ärtsoppekraft (5x klick)
  - Beredskapskämpe (10x klick)
  - Försvarsminister-handslag (25x klick)
  - "NU JÄVLAR"-knappen (100x klick)
- [ ] Markera som köpt efter köp (grå + bock)

### 2.4 Balansering
- [ ] Sätt baskostad och FP/s för alla ~22 uppgraderingar
- [ ] Testa att progressionen känns bra (inte för snabb, inte för långsam)
- [ ] Kalibrera era-trösklar så varje era tar ~2-5 min
- [ ] Klickkraft-priser balanserade mot passiv inkomst

---

## Sprint 3: Juice & Events

### 3.1 Partikeleffekter
- [ ] Generera partiklar vid klick (CSS-animerade element)
- [ ] Partiklar flyger ut från klickpunkten
- [ ] Variation i riktning, hastighet, storlek
- [ ] Ta bort partiklar efter animation (performance)

### 3.2 Float-text
- [ ] Visa "+X FP" text som flyter uppåt vid klick
- [ ] Text fadar ut och försvinner
- [ ] Positionera vid klickpunkten

### 3.3 Ljud
- [ ] Web Audio API-setup
- [ ] Klickljud (kort, tillfredsställande)
- [ ] Köp-ljud
- [ ] Era-unlock-ljud
- [ ] Achievement-ljud
- [ ] Volymkontroll / mute-knapp

### 3.4 Slumpmässiga händelser
- [ ] Event-system: slumpmässigt event var 45-90 sekund
- [ ] Overlay/popup med eventbeskrivning och klickbar knapp
- [ ] ~10-12 events:
  - Strömavbrott! ("Elen är borta — bra att du har ficklampa!" bonus om upgrade köpt)
  - Vattenledningen brast! ("Bra att du har vattendunkar!" bonus om upgrade köpt)
  - Beredskapslarm! (2x FP/s i 30 sek)
  - JAS-flyby (bonus-FP)
  - Hemvärnsövning (1.5x FP/s i 60 sek)
  - Desinformationsattack (klicka bort snabbt eller förlora FP)
  - "Om krisen kommer"-utskick (stor FP-bonus)
  - Ärtsoppetorsdag (boost)
  - NATO-övning (3x FP/s i 20 sek)
  - Frivilligvåg (bonus baserad på totala upgrades)
  - Kall vinter! ("Minus 25 och elementen är kalla — sovsäck räddar dig!" bonus om upgrade köpt)
  - Mobilnätet nere! ("Vevradion blir din livlina" bonus om upgrade köpt)
- [ ] Timer/countdown på aktiva events
- [ ] Visuell indikation på aktiv bonus (glödande ram, ikon)

### 3.5 Nyhetsticker
- [ ] Löpande text längst ner på skärmen (CSS marquee/animation)
- [ ] ~25 riktiga budskap om beredskap:
  - "Har du vatten hemma för minst en vecka? Räkna 3 liter per person per dag."
  - "Ha mat hemma som inte behöver kylskåp eller spis. Konserver, knäckebröd, müsli."
  - "Kontanter! Swish fungerar inte utan el och internet."
  - "En vevdriven radio ger dig information även vid strömavbrott."
  - "Ha en ficklampa med extra batterier — stearinljus är en brandrisk."
  - "Hur håller du dig varm om värmen försvinner? Sovsäck, filtar, varma kläder."
  - "Stormkök eller friluftskök — så lagar du mat utan el."
  - "Vet du var ditt närmaste skyddsrum är? Sverige har ~65 000."
  - "Ha viktiga mediciner hemma för minst en veckas förbrukning."
  - "Kopior på viktiga dokument: pass, försäkring, recept."
  - "Prata med dina grannar: vem kan hjälpa vem vid kris?"
  - "9 842 ansökte till Hemvärnet på EN vecka efter Ukraina-invasionen."
  - "Beredskapsveckan har hållits årligen sedan 2017."
  - "Värnpliktsmålet: minst 10 000 per år till 2030."
  - "Visste du att MSB blev MCF den 1 januari 2026?"
  - "Försvarsbudgeten ska nå 3,5% av BNP till 2030."
  - "Broschyren 'Om krisen eller kriget kommer' skickades till 5,2 miljoner hushåll."
  - "Vattenrening: koka vattnet i minst 3 minuter om du är osäker."
  - "Ladda powerbank — din mobil är din länk till omvärlden."
  - "Brandsläckare och brandvarnare — grunden i alla hem."
  - "Kan du första hjälpen? En kurs kan rädda liv."
  - "Bränsle i bilen — kör inte på tomma tanken i oroliga tider."
  - "Ha en plan med din familj: var träffas ni om ni tappar kontakten?"
  - "Totalförsvar = militärt försvar + civilt försvar. Du är en del av det."
  - "NATO artikel 5: en för alla, alla för en."
- [ ] Nya meddelanden roterar in

---

## Sprint 4: Achievements & Slutspel

### 4.1 Achievement-system
- [ ] Datastruktur: `{ id, name, description, condition, unlocked }`
- [ ] ~16 achievements:
  - Första klicket
  - 100 klick
  - 1 000 klick
  - 10 000 klick
  - Första uppgraderingen
  - "Hemberedskapen klar" (alla Era 1-uppgraderingar — "Du klarar en vecka utan samhällets hjälp!")
  - "Grannen du vill ha" (alla Era 2-uppgraderingar)
  - Nå Era 3, 4, 5
  - "Prepper deluxe" (alla beredskapsrelaterade upgrades köpta)
  - Köp första klickkraft-uppgraderingen
  - "NU JÄVLAR"-knappen köpt
  - "Survivalist" (klara 3 kris-events med rätt upgrade)
  - Alla achievements unlockade (meta)
  - Slutför spelet
  - "Har du läst broschyren?" (easter egg)
  - "Kontanter?!" (nå 10 000 FP — "Swish fungerar inte utan el")
- [ ] Kontrollera achievements varje sekund / vid relevanta events
- [ ] Spara unlockade achievements

### 4.2 Achievement-toasts
- [ ] Toast-notifikation som glider in vid unlock
- [ ] Visa achievement-namn och ikon
- [ ] Försvinner efter ~3 sekunder
- [ ] Stacka om flera triggas samtidigt

### 4.3 Achievement-display
- [ ] Panel/modal med alla achievements
- [ ] Unlockade visas med guldram, låsta visas gråa
- [ ] Visa progress (X/14 unlockade)

### 4.4 Slutskärm
- [ ] Triggas vid köp av sista uppgraderingen ("Totalförsvar 3,5% av BNP")
- [ ] Overlay som täcker spelet
- [ ] Spelstatistik:
  - Totala klick
  - Total speltid
  - Totala FP tjänade
  - Antal uppgraderingar köpta
  - Antal achievements
- [ ] Reflekterande text om försvarsvilja ("Nu vet du lite mer...")
- [ ] Avslutas med "Nu jävlar."
- [ ] Länkar till riktiga resurser:
  - MCF: https://www.mcf.se
  - Försvarsmakten: https://www.forsvarsmakten.se
  - Hemvärnet: https://www.hemvarnet.se
  - "Om krisen eller kriget kommer": https://www.mcf.se/sv/rad-till-privatpersoner/broschyren-om-krisen-eller-kriget-kommer/
- [ ] "Spela igen"-knapp

---

## Sprint 5: Polish

### 5.1 Responsiv design
- [ ] Mobillayout (< 768px): stacked, klickknapp överst, upgrades under
- [ ] Surfplattelayout (768-1024px): anpassad
- [ ] Touch-events för mobil (inga hover-beroenden)
- [ ] Testa på iPhone Safari, Android Chrome
- [ ] Tillgänglig textstorlek

### 5.2 localStorage-sparning
- [ ] Spara spelläge: FP, alla upgrade-counts, achievements, era, statistik
- [ ] Ladda sparning vid sidladdning
- [ ] Auto-save varje 30 sekund
- [ ] "Nollställ spelet"-knapp med bekräftelsedialog

### 5.3 Balansering och playtesting
- [ ] Spela igenom hela spelet 2-3 gånger
- [ ] Justera kostnader och FP/s om det går för snabbt/långsamt
- [ ] Kontrollera att alla achievements triggar korrekt
- [ ] Kontrollera att alla events fungerar
- [ ] Testa edge cases (extremt snabbklick, lämna fliken, etc.)

### 5.4 Buggfixar
- [ ] Fixa alla kända buggar
- [ ] Kolla för memory leaks (partiklar, timers)
- [ ] Verifiera att formatering av stora tal fungerar korrekt
- [ ] Testa i Chrome, Firefox, Safari

### 5.5 Slutfinish
- [ ] Favicon (svensk sköld / flagga)
- [ ] Meta-taggar (title, description, og:image)
- [ ] README.md med projektbeskrivning och instruktioner

---

## Öppna frågor (från plan.md)

- [ ] Prestige-mekanik? (nollställ för permanent bonus)
- [ ] Oändligt spel eller tydligt slut?
- [ ] "Fiender" som desinformation som minskar FP?
- [ ] Målad speltid: ~15-30 min?
- [ ] Idle save-funktion?
- [ ] Mini-games utöver klick?
- [ ] Hosting/deploy?
