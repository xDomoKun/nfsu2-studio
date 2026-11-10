/* Underground Studio bilingual UI. Source UI strings are German; English is the default. */
(()=>{'use strict';
const en={
 'Karriere-Traffic: K01/K03 auf Slot 4 bestätigt.':'Career traffic: K01/K03 confirmed in slot 4.',
 'MEINE AUTOS':'MY CARS','KARRIERE':'CAREER','DATEIEN':'FILES','EXPERIMENTE':'EXPERIMENTS','Meine Autos':'My Cars','Karriere':'Career','Garage & Tuning':'Garage & Tuning','Dateien':'Files','Experimente':'Experiments',
 'Schnellrennen / 20 Plätze':'Quick Race / 20 slots','Profil, Geld und Karrierefortschritt bearbeiten.':'Edit profile, cash and career progress.','Karrieregarage, Upgrades und Original-Dyno verwalten.':'Manage career garage, upgrades and original dyno.','Archiv älterer Save-only-Experimente.':'Archive of earlier save-only experiments.','Spielstände exportieren und Original sichern.':'Export saves and back up the original.',
 'LADEN':'LOAD','SPEICHERN':'SAVE','SCHNELLRENNEN':'QUICK RACE','FAHRZEUGAUSWAHL':'CAR SELECTION','SPIELSTAND LADEN':'LOAD SAVE','ALLE TRAFFIC CARS':'ALL TRAFFIC CARS','KONFIGURATIONEN':'CONFIGURATIONS','ZIP-Datei von nfsu2.xyz öffnen.':'Open an nfsu2.xyz ZIP save.','ZIP ÖFFNEN':'OPEN ZIP',
 'FAHRZEUGSLOTS':'CAR SLOTS','20 PLÄTZE':'20 SLOTS','Alle Slots':'All slots','Belegt':'Occupied','Traffic Cars':'Traffic Cars','Freie Slots':'Empty slots','Keine passenden Slots gefunden.':'No matching slots found.','COUPÉ HINZUFÜGEN':'ADD COUPE','RÜCKGÄNGIG':'UNDO','LEER':'EMPTY','FREI':'FREE','LEERER SLOT':'EMPTY SLOT','Kein Fahrzeug gespeichert':'No car saved','Originalplatz':'Original slot','ORIGINALPLATZ':'ORIGINAL SLOT','IN SLOT EINSETZEN*':'INSTALL IN SLOT*','CAR TYPE':'CAR TYPE','FAHRZEUGE':'CARS','AUSWAHL':'SELECT','Originalkonfiguration':'Original configuration',
 'LEISTUNGSTUNING':'PERFORMANCE TUNING','FAHRZEUG':'CAR','LEISTUNG ÜBERNEHMEN':'COPY PERFORMANCE','MAX TUNING*':'MAX TUNING*','SERIE':'STOCK','OUTRUN-UNIQUES':'OUTRUN UNIQUES','PRÜFSTAND':'DYNO','AUF ALLE RENNEN':'APPLY TO ALL RACES','GETRIEBE':'TRANSMISSION','ECU (9 PUNKTE)':'ECU (9 POINTS)','TURBO (9 PUNKTE)':'TURBO (9 POINTS)','DYNO NEUTRAL':'RESET DYNO','TEILE-FLAGS ANZEIGEN':'SHOW PART FLAGS','TEILE-FLAGS VERBERGEN':'HIDE PART FLAGS',
 '* Original-Savewerte; Wirkung auf Traffic Cars im Schnellrennen noch nicht bestätigt.':'* Original save values; their effect on traffic cars in quick races is not yet confirmed.',
 'SLOT-AKTIONEN':'SLOT ACTIONS','KOPIEREN*':'COPY*','ENTFERNEN':'REMOVE','Karriere-Traffic: derzeit nicht fahrbar.':'Career traffic: not drivable yet.','ZURÜCKSETZEN':'RESET','ZIP EXPORTIEREN':'EXPORT ZIP','* Platzwechsel/Kopieren experimentell. G00/G01 in „Meine Autos“ bestätigt.':'* Moving/copying slots is experimental. G00/G01 confirmed in My Cars.',
 'Traffic-Fahrzeuge derzeit nicht fahrbar · „Meine Autos“ funktioniert.':'Traffic cars are not drivable in career mode · My Cars works.',
 'KARRIERE / TRAFFIC EXPERIMENTE':'CAREER / TRAFFIC EXPERIMENTS','TRAFFIC-QUELLE':'TRAFFIC SOURCE','KARRIERE-ZIEL':'CAREER TARGET','4 TEST-ZIPS ERSTELLEN':'CREATE 4 TEST ZIPS','Fahrbarkeit in der Karriere unbestätigt. Originalspielstand sichern.':'Career drivability is unconfirmed. Back up the original save.',
 'Deinen NFSU2-Spielstand öffnen':'Open your NFSU2 save','ZIP-Export von nfsu2.xyz oder eine einzelne Karriere-Datei hier ablegen':'Drop an nfsu2.xyz ZIP export or a single career save here','Datei auswählen':'Choose file','Aktuelles Guthaben':'Current cash','Frei bearbeitbar bis 2,1 Mrd.':'Editable up to 2.1 billion.','Aktueller Stufenindex':'Current stage index','Garagenplätze':'Garage slots','Inklusive fünf Zusatzplätze':'Includes five extra slots','Profil bearbeiten':'Edit profile','Fahrername':'Driver name','Bis zu 7 ASCII-Zeichen.':'Up to 7 ASCII characters.','Geldbetrag ($)':'Cash ($)','Wird als 32-Bit-Zahl gespeichert.':'Stored as a 32-bit integer.','999.999 $':'$999,999','10 Mio. $':'$10 million','Profil übernehmen':'APPLY PROFILE',
 'Karrierestufe · experimentell':'Career stage · experimental','0 – Intro':'0 – Intro','1 – Stufe 1':'1 – Stage 1','2 – Stufe 2':'2 – Stage 2','3 – Stufe 3':'3 – Stage 3','4 – Stufe 4':'4 – Stage 4','5 – Stufe 5':'5 – Stage 5','6 – Nach Karriere':'6 – Post-career','Stufe ändern':'CHANGE STAGE','Die Stufe ändert nicht automatisch gewonnene Rennen oder Freischalt-Voraussetzungen.':'Changing the stage does not automatically complete races or unlock prerequisites.',
 'Spielstand-Sicherheit':'Save safety','Signatur und Prüfsummen':'Signature and checksums','Gültig':'Valid','Nach Export gültig':'Valid after export','Nicht gültig':'Invalid','Originaldatei unverändert':'Original file unchanged','Ja':'Yes','ZIP inklusive Einstellungen':'ZIP including settings','Einzelner Karriere-Spielstand':'Single career save',
 'Beim Export werden alle drei Spielstand-Prüfsummen':'All three save checksums','und':'and','der 64-Bit-Garagen-Fingerprint von nfsu2.xyz automatisch neu berechnet. Deine ursprüngliche ZIP-Datei wird niemals überschrieben. Vor einem Browserimport das Original sichern.':'and the nfsu2.xyz 64-bit garage fingerprint are recalculated automatically on export. Your original ZIP is never overwritten. Back up the original before importing into the game.',
 'Bearbeiteten Spielstand exportieren':'EXPORT MODIFIED SAVE','Öffne zuerst einen Karriere-Spielstand.':'Open a career save first.','Deine Garage':'Your garage','Fahrzeug auswählen, um Tuning zu bearbeiten':'Select a car to edit tuning','Fahrzeug bearbeiten':'Edit car','Fahrzeug':'Car','Modell-ID':'Model ID','Slot':'Slot','Garagenplatz entsperrt':'Garage slot unlocked',
 'Dieser Platz ist aktuell leer. Fahrzeuge können in dieser Version nur zwischen bereits belegten Slots übertragen werden.':'This slot is currently empty. In this version, cars can only be transferred between occupied slots.',
 'Fahrzeugmodell übernehmen':'Copy car model','· experimentell':'· experimental','Fahrzeugquelle':'Source car','Modell übernehmen':'COPY MODEL','Performance eines normalen Autos übernehmen':'Copy performance from a standard car','· Experiment':'· experimental','Übernimmt vorhandene Tuningwerte; keine Engine-Physik.':'Copies saved tuning values, not engine physics.','Performance-Quelle':'Performance source','Performance übernehmen':'COPY PERFORMANCE','Teile freischalten':'Unlock parts','Karosserie':'Body','Grafiken':'Graphics','Extras':'Extras','Performance':'Performance',
 'TRAFFIC-ID / KARRIERE – NICHT FAHRBAR':'TRAFFIC ID / CAREER – NOT DRIVABLE','Karriere: Traffic-IDs werden angezeigt, sind bisher nicht fahrbar.':'Career: traffic IDs render, but cannot be driven yet.','Traffic-Fahrzeug wählen':'Choose traffic car','TRAFFIC-ID TESTEN (KARRIERE)':'TEST TRAFFIC ID (CAREER)','Outrun-Upgrades':'Outrun upgrades',
 'Leistungseditor · Original-Dyno':'Performance editor · Original dyno','Für normale Fahrzeuge im Browser-Spiel':'For standard cars in the browser game','Beschleunigung und Höchstgeschwindigkeit abstimmen':'Tune acceleration and top speed','Originale Dyno-Werte, keine frei einstellbare Höchstgeschwindigkeit.':'Original dyno values; top speed cannot be set freely.',
 'Nur normale, belegte und entsperrte Fahrzeuge können das Original-Dyno nutzen. Traffic Cars in „Meine Autos“ funktionieren ohne Browser-Patch, hier wird aber ausschließlich die Karrieregarage abgestimmt.':'Only normal, occupied and unlocked cars can use original dyno tuning. Traffic cars work in My Cars without a browser patch, but this section tunes career cars only.',
 'Abstimmung für Renntyp':'Tuning for race type','Circuit / Freie Fahrt (wahrscheinlicher Standard)':'Circuit / Free Roam (likely default)','Getriebe-Ausstattung':'Transmission upgrades','Wird beim Laden geprüft.':'Checked when loading.','Fahrcharakter':'Driving character','Kurze Übersetzung: mehr Anzug. Lange: höhere theoretische Endgeschwindigkeit.':'Shorter gearing: more acceleration. Longer gearing: higher theoretical top speed.','Höchstgeschwindigkeit':'Top speed','Neutral':'Neutral','Beschleunigung':'Acceleration','Lange Übersetzung':'Long gearing','Ausgewogen':'Balanced','Kurze Übersetzung':'Short gearing','Getriebe · 7 Parameter':'Transmission · 7 parameters','100 = neutral.':'100 = neutral.','ECU · 9 Drehzahlpunkte':'ECU · 9 RPM points','Gespeicherte Drehmomentkurve.':'Stored torque curve.','Turbo · 9 Drehzahlpunkte':'Turbo · 9 RPM points','Diese Abstimmung neutralisieren':'RESET THIS TUNE','Auf alle fünf Renntypen übertragen':'APPLY TO ALL FIVE RACE TYPES','Nur reguläre Dyno-Werte. Keine freien km/h- oder PS-Limits.':'Regular dyno values only. No custom km/h or horsepower limits.',
 'Experiment-Archiv':'Experiment archive','Für nfsu2.xyz · Ohne Game-Assets':'For nfsu2.xyz · No game assets','Ältere Tests · Traffic Cars sind derzeit nur in „Meine Autos“ fahrbar.':'Earlier tests · Traffic cars are currently drivable in My Cars only.','Lade oben deinen nfsu2.xyz-ZIP-Spielstand, um Versuche zu erzeugen.':'Load your nfsu2.xyz ZIP save to generate test variants.','1. Fahrzeugkombination':'1. Car combination','Zielslot':'Target slot','Normaler Spender':'Normal donor car','Traffic-Body-ID':'Traffic body ID','Hybrid-Methode':'Hybrid method','2. Leistungsversuche':'2. Performance experiments','Performance-Teile':'Performance parts','Extreme Save-Dyno-Werte':'Extreme save dyno values','Auch Traffic im Stock-Katalog versuchen (sehr riskant)':'Try adding traffic to the stock catalog (high risk)',
 'Das Stock-Katalogexperiment ergänzt einen 48er-Eintrag in der Save-Datei. Es modifiziert nicht die Engine-Klas…':'The stock catalog experiment adds a 48-byte record to the save. It does not alter the engine class…',
 'Einzelnes Test-ZIP erstellen':'CREATE SINGLE TEST ZIP','3. Automatische Versuchsreihe':'3. Automated test matrix','Erzeugt elf einzeln importierbare ZIP-Spielstände. Darin enthalten: vier Traffic-Varianten, drei extreme Traff…':'Creates eleven separately importable ZIP saves, including four traffic variants and three extreme traffic…','Unbedingt beachten:':'Important:',
 '„500 km/h“ und „5× Beschleunigung“ sind hier Testziele, keine fest einstellbaren Save-Felder. Rohwerte 255 werden von der Engine in der Regel auf 200 begrenzt.':'“500 km/h” and “5× acceleration” are test goals, not directly configurable save fields. The engine usually clamps raw values of 255 to 200.',
 '11 Test-Spielstände erstellen':'CREATE 11 TEST SAVES','Letzter Patch-Bericht':'Last patch report','Noch kein Versuch erstellt.':'No test created yet.','Spielstand verwalten':'Manage save','Geladene Datei':'Loaded file','Noch keine Datei geöffnet.':'No file opened yet.','Unbearbeitetes Original herunterladen':'DOWNLOAD UNMODIFIED ORIGINAL','Bearbeiteten Export laden':'DOWNLOAD MODIFIED EXPORT',
 'ZIP-Dateien von nfsu2.xyz behalten den ursprünglichen Ordneraufbau, einschließlich':'ZIP files from nfsu2.xyz preserve the original folder structure, including',
 '. Bearbeitet werden nur die Karriere-Datei und, falls benötigt,':'. Only the career file and, when needed,','UNDERGROUND STUDIO · FAN-PROJEKT · SPIELSTÄNDE SICHERN':'UNDERGROUND STUDIO · FAN PROJECT · BACK UP YOUR SAVES',
 'SLOT':'SLOT','Gesperrt':'Locked','Leer':'Empty','Freier Platz':'Empty slot','Leerer Garagenplatz':'Empty garage slot','Stufe':'Stage','ORIGINALPLATZ':'ORIGINAL SLOT','Slot':'Slot',' · belegt':' · occupied',' · frei':' · empty',
 'IN-GAME BILD':'IN-GAME IMAGE','INGAME-BILD LADEN':'LOAD IN-GAME PHOTO','+ INGAME-BILD':'+ IN-GAME PHOTO','BILD LÖSCHEN':'REMOVE PHOTO','INGAME-FOTO · EIGENE AUFNAHME':'IN-GAME PHOTO · YOUR SCREENSHOT','KEIN ORIGINALBILD · EIGENEN SCREENSHOT LADEN':'NO OFFICIAL IMAGE · ADD YOUR SCREENSHOT',
 'TRAFFIC-Fahrzeug':'TRAFFIC CAR','TEILE-FLAGS':'PART FLAGS','PERFORMANCE-FLAGS':'PERFORMANCE FLAGS',
 'CIRCUIT':'CIRCUIT','COUPÉ HINZUFÜGEN':'ADD COUPE','KARRIERE / TRAFFIC EXPERIMENTE':'CAREER / TRAFFIC EXPERIMENTS',
 'Keine belegte Karrieregarage.':'No occupied career garage.','Spielstand fehlt.':'Save missing.','Bitte ein Bild auswählen.':'Please choose an image.','BILD NICHT VERFÜGBAR':'IMAGE NOT AVAILABLE',
 'Getriebe-Upgrade (ID 11) eingetragen. Die gültigen Bereiche hängen von den Spielpaketen ab.':'Transmission upgrade (ID 11) installed. Valid ranges depend on game packages.','Kein Getriebe-Upgrade (ID 11) erkannt. Nicht freigeschaltete Gang-Regler können wirkungslos sein.':'No transmission upgrade (ID 11) detected. Locked gear controls may have no effect.',
 'Wird nur lokal im Browser angezeigt.':'Displayed locally in this browser only.',
 'Bitte zuerst einen Spielstand öffnen.':'Open a save first.','Import fehlgeschlagen:':'Import failed:','Die Datei ist für einen Spielstand-Export zu groß (max. 30 MB).':'This file is too large for a save export (max. 30 MB).',
 'Diese ZIP-Datei enthält keinen kompatiblen NFSU2-Karriere-Spielstand.':'This ZIP does not contain a compatible NFSU2 career save.',
 'Welches Profil bearbeiten?':'Which profile would you like to edit?','Ungültige Profilnummer.':'Invalid profile number.','Prüfsummen konnten nicht korrigiert werden.':'Could not repair checksums.',
 'Original sichern!':'Back up your original!','Vier experimentelle Save-only-Varianten.':'Four experimental save-only variants.'
};
// Additional runtime labels, search placeholders and original traffic-model names.
Object.assign(en,{
 'EXPORTIEREN':'EXPORT','Suchen …':'Search…','Suchen ...':'Search…','Suchen ... ':'Search…','Suchen':'Search',
 'Pakettransporter':'Delivery Van','Kompaktwagen':'Compact Car','Traffic-Coupé':'Traffic Coupe',
 'Limousine 02':'Sedan 02','Kastenwagen':'Panel Van','Krankenwagen':'Ambulance',
 'Feuerwehr':'Fire Truck','Feuerwehrauto':'Fire Truck','Polizeiwagen':'Police Car','Kleinwagen':'Compact Car',
 'LKW':'Truck','Stufenheck':'Sedan','Limousine':'Sedan','Verkehrsbus':'Bus','TRAFFIC COUPÉ':'TRAFFIC COUPE',
 'Ingame-Bild gespeichert. Wird nur lokal im Browser angezeigt.':'In-game image saved. Displayed locally in this browser only.',
 'Bild wird nur für diese Sitzung angezeigt (Browser-Speicher nicht verfügbar).':'Image is available for this session only (browser storage unavailable).',
 'Vier Karriere-Tests erzeugt. Original sichern; Spielstand für jeden Test einzeln importieren.':'Four career tests created. Back up your original; import each test separately.',
 'Alle 20 „Meine Autos“-Datensätze durch den originalen, in G00 funktionierenden Traffic-Mod ersetzen? Bestehende Meine-Autos-Konfigurationen werden dadurch überschrieben.':'Replace all 20 My Cars configurations with the original working G00 traffic mod? Existing My Cars configurations will be overwritten.',
 'Komplette Original-20er-Konfiguration übernommen (bestätigte G00-Methode).':'All 20 original configurations installed (confirmed G00 method).',
 'Den gesamten „Meine Autos“-Bereich exakt auf den Stand beim Import zurücksetzen? Deine Karriere bleibt unverändert.':'Reset the entire My Cars section to the exact state it had at import? Your career remains unchanged.',
 '„Meine Autos“ auf Importzustand zurückgesetzt.':'My Cars restored to imported state.',
 'Letzte Meine-Autos-Aktion rückgängig gemacht.':'Last My Cars action undone.',
 'Konfiguration kopiert – experimentelle Platzverschiebung.':'Configuration copied – experimental slot relocation.',
 'Hohe Tuning-Flags und alle neun Uniques setzen? Dies sind experimentelle Kombinationen.':'Set high tuning flags and all nine unique upgrades? These combinations are experimental.',
 'Performance-Teile und Unique-Upgrades für dieses Auto zurücksetzen?':'Reset performance parts and unique upgrades for this car?',
 'Traffic-Tuning-Maximum gesetzt.':'Maximum traffic tuning applied.',
 'Performance zurückgesetzt.':'Performance reset.',
 'Dyno-Abstimmung auf fünf Rennarten kopiert.':'Dyno tune copied to five race types.',
 'Dyno-Werte dieser Rennart neutralisiert.':'Dyno values for this race type reset.',
 'Vier EXPERIMENTELLE Karriere-Import-ZIPs aus den Original-Traffic-Konfigurationen erzeugen? Bisherige Karriere-Tests waren nicht fahrbar.':'Create four EXPERIMENTAL career import ZIPs from the original traffic configurations? Previous career tests were not drivable.',
 'Ingame-Bild gespeichert. Wird nur lokal im Browser angezeigt.':'In-game photo saved. Displayed locally in the browser.',
 'Unveränderte Originaldatei als Backup heruntergeladen.':'Unmodified original file downloaded as a backup.',
 'Profilname und Guthaben übernommen. Bitte bearbeiteten Spielstand exportieren.':'Profile name and cash updated. Export the modified save.',
 'Karrierestufe geändert – dies ersetzt keine absolvierten Rennen oder Missionsziele.':'Career stage updated – this does not complete races or mission objectives.',
 'Endübersetzung angepasst. Reale Beschleunigung/Vmax bitte im Browser testen.':'Final drive adjusted. Test actual acceleration and top speed in the browser game.',
 'Diese Abstimmung auf Circuit, Drag, Drift, Street X und URL übertragen?':'Copy this tune to Circuit, Drag, Drift, Street X and URL?',
 'Alle 25 editierbaren Getriebe-/ECU-/Turbo-Werte für diese Rennart auf neutral 100 setzen?':'Reset all 25 editable transmission/ECU/turbo values for this race type to neutral (100)?',
 'Aktuelle Dyno-Abstimmung auf alle fünf Rennarten kopiert.':'Current dyno tune copied to all five race types.',
 'Kein Fahrzeug gespeichert':'No car saved',
 'Performance & Dyno von Karriere-Slot':'Performance and dyno from career slot',
 'Vorschau':'Preview',
 'Zusatzgaragen-Fingerprint':'extra garage fingerprint','Dateiprüfsummen':'file checksums'
});
// Dynamic status messages are generated by the existing save-editor logic. The
// replacements below translate their recurring fragments without touching IDs,
// hashes, money amounts or filenames.
const dynamic=[
 [/^Stufe (\d+)$/,'Stage $1'],[/^Slot (\d+)$/,'Slot $1'],[/^Slot (\d+) · belegt$/,'Slot $1 · occupied'],[/^Slot (\d+) · frei$/,'Slot $1 · empty'],
 [/^Originalplatz (\d+)$/,'Original slot $1'],[/^ORIGINALPLATZ (\d+)$/,'ORIGINAL SLOT $1'],[/^Konfigurationsplätze$/,'Configuration slots'],[/^Konfigurationsplatz$/,'Configuration slot'],
 [/^\d+% Richtung Vmax$/,'$&'],[/^(\d+)% Richtung Vmax$/,'$1% toward top speed'],[/^(\d+)% Richtung Anfahren$/,'$1% toward acceleration'],
 [/^Slot (\d+) \/ (Karriere|GARAGE\.DAT)$/,(m,n,v)=>`Slot ${n} / ${v==='Karriere'?'Career':'GARAGE.DAT'}`],
 [/^Spielstand „(.*?)“ geladen · alle drei Prüfsummen gültig · (\d+) Garagenslots verfügbar\.$/,'Save “$1” loaded · all three checksums valid · $2 garage slots available.'],
 [/^Spielstand „(.*?)“ geladen · Prüfsummen sind fehlerhaft – Export repariert sie · (\d+) Garagenslots verfügbar\.$/,'Save “$1” loaded · invalid checksums (repaired on export) · $2 garage slots available.'],
 [/^Kein Fahrzeug gespeichert$/,'No car saved'],[/^LEERER SLOT$/,'EMPTY SLOT'],
 [/^Originales (.*?) in Konfiguration #(\d+) übernommen\..*$/,'Original $1 installed in configuration #$2. G01 method: unchanged mod template.'],
 [/^(.*?) testweise in Slot (\d+) eingesetzt\..*$/,'$1 placed in slot $2 for testing. Slot relocation is experimental.'],
 [/^Originales (.*?) in Originalplatz (\d+) übernommen\..*$/,'Original $1 installed in original slot $2.'],
 [/^Performance-Flag (\d+) geändert\.$/,'Performance flag $1 changed.'],[/^Unique (.*?) geändert\.$/,'Unique upgrade $1 changed.'],
 [/^(.*?) angepasst\. Test im Schnellrennen erforderlich\.$/,'$1 updated. Test in Quick Race required.'],
 [/^Gespeicherte Performance aus Karriere-Slot (\d+) übernommen \(experimentell\)\.$/,'Saved performance copied from career slot $1 (experimental).'],
 [/^Dyno-Abstimmung für (.*?) zurückgesetzt\.$/,'Dyno tune reset for $1.'],
 [/^Traffic-ID auf (.*?) \(0x(.*?)\) geändert\..*$/,'Traffic ID changed to $1 (0x$2). Check in-game; drivability and appearance are not guaranteed.'],
 [/^Export erstellt: (.*?) · Spielstand-Prüfsummen und (.*?) korrigiert\..*$/,'Export created: $1 · save checksums and $2 repaired. Original is unchanged.'],
 [/^Import fehlgeschlagen: (.*)$/,'Import failed: $1'],
 [/^Bild konnte nicht gespeichert werden: (.*)$/,'Could not save image: $1'],
 [/^Slot (\d+) ist bereits mit „(.*?)“ belegt\. Wirklich überschreiben\?$/,'Slot $1 already contains “$2”. Overwrite it?'],
 [/^Kein Getriebe-Upgrade.*$/,'No transmission upgrade (ID 11) detected. Locked gear controls may have no effect.'],
 [/^Getriebe-Upgrade.*$/,'Transmission upgrade (ID 11) installed. Valid ranges depend on game packages.']
];
dynamic.unshift(
 [/^EXPERIMENTELL: (.*?) aus Originalplatz (\d+) nach (\d+) verlagern\? Nur die Originalplatz-Methode wurde im Spiel bestätigt\.$/,'EXPERIMENTAL: Move $1 from original slot $2 to $3? Only installation into the original slot is confirmed in-game.'],
 [/^EXPERIMENT: Konfiguration (\d+) auf Platz (\d+) kopieren\? Eine Platzverschiebung ist bisher nicht im Spiel bestätigt\.$/,'EXPERIMENT: Copy configuration $1 to slot $2? Moving configurations between slots is not yet confirmed in-game.'],
 [/^Slot (\d+) löschen\? Die gespeicherte Fahrzeugkonfiguration wird durch den neutralen Original-Slot ersetzt\. Nur mit Backup importieren\.$/,'Delete slot $1? The saved configuration will be replaced with the original empty slot. Import only with a backup.'],
 [/^Performance & Dyno von Karriere-Slot (\d+) übernehmen\? Die Traffic-Karosserie bleibt erhalten\. Wirkung im Spiel noch ungetestet\.$/,'Copy performance and dyno from career slot $1? The traffic body will stay unchanged. In-game effect is untested.'],
 [/^Slot (\d+) \(.*?\) experimentell auf (.*?) ändern\?[\s\S]*$/,'Change slot $1 experimentally to $2? Only the car hash is changed, not the engine physics. Keep your original backup.'],
 [/^Gespeicherte Performance-Flags und Dyno-Setups von (.*?) aus Slot (\d+) übernehmen\?[\s\S]*$/,'Copy saved performance flags and dyno setups from $1 in slot $2? This does not copy the engine physics from GLOBALB.'],
 [/^Modell- und Karosseriedaten von „(.*?)“ auf Slot (\d+) übertragen\?[\s\S]*$/,'Copy model and body data from “$1” into slot $2? Experimental feature — keep a backup.'],
 [/^Kategorie (.*?) für dieses Fahrzeug freischalten\? Dies ist eine experimentelle Änderung\.$/,'Unlock category $1 for this car? This is experimental.'],
 [/^Garagenplatz (\d+) angepasst\.$/,'Garage slot $1 updated.'],
 [/^My-Cars-Slot (\d+) zurückgesetzt\.$/,'My Cars slot $1 reset.'],
 [/^Slot (\d+) wird.*$/,'Slot $1 updated.'],
 [/^Dyno-Wert „(.*?)“ für (.*?) geändert\.$/,'Dyno value “$1” updated for $2.'],
 [/^Unique-Tuning „(.*?)“ geändert\. Exportiere den Spielstand, um die Änderung zu übernehmen\.$/,'Unique tuning “$1” updated. Export the save to apply the change.'],
 [/^Gespeicherte Performance von Slot (\d+) kopiert\. Kein Eingriff in die Basisphysik des Spiels\.$/,'Saved performance copied from slot $1. Base game physics is unchanged.'],
 [/^Fahrzeugmodell aus Slot (\d+) übernommen\. Experimentell – bitte im Spiel prüfen\.$/,'Car model copied from slot $1. Experimental — verify in-game.'],
 [/^Kategorie (.*?) für Slot (\d+) freigeschaltet\.$/,'Category $1 unlocked for slot $2.'],
 [/^Original-Endübersetzung für (.*?) angepasst\.$/,'Original final drive updated for $1.'],
 [/^Dyno-Abstimmung für (.*?) zurückgesetzt\.$/,'Dyno tune reset for $1.'],
 [/^Test-Spielstand erstellt\..*$/,'Test save created. Back up the original and import this ZIP into nfsu2.xyz.'],
 [/^Testpaket erstellt:.*$/,'Test package created: 11 separate ZIP saves and a test plan. Your original is unchanged.']
);
const replacementFragments=[
 ['Spielstand','save'],['Prüfsummen','checksums'],['Karrierestufe','career stage'],['Garagenplatz','garage slot'],['Karriere-Slot','career slot'],['Originaldatei','original file'],['konfiguriert','configured'],['übernommen','copied'],['zurückgesetzt','reset'],['geändert','changed'],['gespeichert','saved'],['Kopieren','Copy'],['Quelle','Source'],['Rennarten','race types'],['experimentell','experimental'],['bearbeitet','modified'],['hinzugefügt','added'],['geladen','loaded']
];
function translate(input){if(!input || !input.trim())return input;const leading=input.match(/^\s*/)[0],trailing=input.match(/\s*$/)[0],raw=input.trim();let out=en[raw];
 if(out===undefined){for(const [re,repl] of dynamic){if(re.test(raw)){out=raw.replace(re,repl);break;}}}
 if(out===undefined && raw.length>24 && /[äöüÄÖÜß]|\b(?:die|der|das|einen|einer|nicht|Bitte|übernehmen|Spielstand|Karriere|geändert|gespeichert|zurücksetzen|Fahrzeug)\b/i.test(raw)){
   out=raw;
   // Known repeatable short phrases; longer messages get the best-effort fallback.
   for(const [from,to] of replacementFragments)out=out.replaceAll(from,to);
 }
 return leading+(out===undefined?raw:out)+trailing;
}
let language='en';try{const saved=localStorage.getItem('underground-studio-language');if(saved==='en'||saved==='de')language=saved;}catch{}
const originals=new WeakMap();const last=new WeakMap();
function convertNode(node){if(node.nodeType!==Node.TEXT_NODE || !node.parentElement || /^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA|CODE|PRE)$/i.test(node.parentElement.tagName) || node.parentElement.closest('.language-switch'))return;
 const value=node.nodeValue;let orig=originals.get(node);if(orig===undefined || (last.has(node)&&value!==last.get(node))){orig=value;originals.set(node,orig);}
 const result=language==='de'?orig:translate(orig);if(value!==result)node.nodeValue=result;last.set(node,result);
}
const attributeOrigins=new WeakMap();
function translateAttributes(el){if(!(el instanceof Element) || el.closest('.language-switch'))return;
 let saved=attributeOrigins.get(el);if(!saved){saved={};attributeOrigins.set(el,saved);}
 for(const attr of ['placeholder','title','aria-label']){if(!el.hasAttribute(attr))continue;
  const now=el.getAttribute(attr),prev=saved[attr];
  if(!prev || now!==prev.last)saved[attr]={original:now,last:now};
  const entry=saved[attr],result=language==='de'?entry.original:translate(entry.original);
  if(now!==result)el.setAttribute(attr,result);
  entry.last=result;
 }
}
function apply(root=document.body){if(!root)return;const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);if(root.nodeType===Node.TEXT_NODE)convertNode(root);while(w.nextNode())convertNode(w.currentNode);
 if(root.nodeType===Node.ELEMENT_NODE)translateAttributes(root);root.querySelectorAll?.('[placeholder],[title],[aria-label]').forEach(translateAttributes);
 document.documentElement.lang=language;
 document.querySelectorAll('.lang-btn').forEach(b=>{const active=b.dataset.lang===language;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active?'true':'false');});
}
let pending=false;function schedule(){if(pending)return;pending=true;queueMicrotask(()=>{pending=false;apply();});}
function setLanguage(next){if(next!=='de'&&next!=='en')return;language=next;try{localStorage.setItem('underground-studio-language',next);}catch{}apply();window.dispatchEvent(new CustomEvent('underground-language-change',{detail:{language:next}}));}
// Localize native confirmation / prompt UI without rewriting save-game logic.
const nativeConfirm=window.confirm.bind(window),nativePrompt=window.prompt.bind(window),nativeAlert=window.alert.bind(window);
window.confirm=function(msg){return nativeConfirm(language==='en'?translate(String(msg)):msg);};
window.prompt=function(msg,defaultValue){return nativePrompt(language==='en'?translate(String(msg)):msg,defaultValue);};
window.alert=function(msg){return nativeAlert(language==='en'?translate(String(msg)):msg);};
window.USI18N={setLanguage,getLanguage:()=>language,translate:(s)=>language==='en'?translate(s):s,apply};
function init(){document.querySelectorAll('.lang-btn').forEach(b=>b.addEventListener('click',()=>setLanguage(b.dataset.lang)));apply();new MutationObserver(schedule).observe(document.body,{subtree:true,childList:true,characterData:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
