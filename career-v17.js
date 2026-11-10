/* Underground Studio v1.7.6 – Traffic template fix and de-duplicated model catalog.
   No engine assets are modified. Do not describe untested transfers as verified.
 */
(()=>{'use strict';
const S=window.NFSU2,M=window.UndergroundMyCars,L=window.UndergroundCareerLab,T=window.UndergroundCareerTuning,A=window.USCareerShop;
const host=window.UndergroundLabHost,$=id=>document.getElementById(id);
let tab='shop',undoVisual=null,importIdentity=null,lastSelection=null;
const lang=()=>window.USI18N?.getLanguage?.()||'en';
const tr=(en,de)=>lang()==='de'?de:en;
const h=()=>host.get();
const warn=(text)=>host.message(text,true);
const status=(text)=>host.message(text,false);
const available=()=>h()?.loaded;
const bb=n=>n<=5?S.OFF.slot+(n-1)*S.OFF.stride:S.OFF.garage+(n-6)*S.OFF.stride;
const dataset=(c,n)=>n<=5?c.save:c.garage;
const bytes=(src,start,length)=>src.slice(start,start+length);
const hex8=n=>S.hex(n>>>0);
const englishNames={COUPE:'Traffic Coupe',TAXI:'Taxi 1',TAXI02:'Taxi 2',AMBULANCE:'Ambulance',FIRETRUCK:'Fire Truck',BUS:'Coach / Bus',PICKUP:'Pickup Truck',SUV:'Traffic SUV',PANELVAN:'Van (Panel Van)',PARCELVAN:'Parcel Van',MINIVAN:'Minivan',HATCHBACK:'Hatchback 1',HATCHBACK02:'Hatchback 2','4DR_SEDAN':'Sedan 1','4DR_SEDAN02':'Sedan 2'};
const carName=c=>c?.traffic&&lang()==='en'?(englishNames[c.traffic.id]||c.model):c?.model||'—';
const allCount=c=>c.garage?10:5;
const cloneOptions=(selector,opts,previous)=>{selector.replaceChildren();for(const [value,label] of opts)selector.add(new Option(label,value));if(opts.some(([value])=>value===previous))selector.value=previous;};
const setText=(selector,en,de)=>{const el=$(selector);if(el)el.textContent=tr(en,de);};
function setTab(name){if(!['shop','tune'].includes(name))return;
 const current=getCurrent();
 if(name==='shop'&&current?.owned&&current?.traffic)name='tune';
 tab=name;
 document.querySelectorAll('[data-career-tab]').forEach(b=>{const active=b.dataset.careerTab===name;b.classList.toggle('active',active);b.setAttribute('aria-selected',String(active));});
 document.querySelectorAll('[data-us17-view]').forEach(el=>{
  const always=['garage','edit'].includes(el.dataset.us17View);
  el.classList.toggle('active',always||el.dataset.us17View===name);
 });
 refresh();}
// v1.7.6 audit: 13 genuine user-supplied templates plus 2 RECONSTRUCTED,
// EXPERIMENTAL identity-swapped records. User confirmed both added cars are driveable in-game; remaining tuning is untested.
function trafficCatalog(){
 const templateByKey=new Map();
 const generated=new Map((window.USGeneratedTrafficTemplates||[]).map(x=>[x.id,x]));
 for(const x of M.catalog()){
  if(templateByKey.has(x.key))continue;
  const entry=generated.get(x.intern);
  templateByKey.set(x.key,{...x,generated:!!entry,sourceId:entry?.sourceId||null});
 }
 return {templateByKey,available:S.TRAFFIC.filter(x=>templateByKey.has(x.key)),missing:S.TRAFFIC.filter(x=>!templateByKey.has(x.key))};
}
function modelOptions(){const locale=lang()==='de'?'de':'en';
 const collator=new Intl.Collator(locale,{sensitivity:'base',numeric:true});
 const cars=[...S.CARS.entries()].sort((a,b)=>collator.compare(a[1],b[1])).map(([key,name])=>['N:'+key,name]);
 const {available,missing,templateByKey}=trafficCatalog();
 const show=c=>lang()==='en'?(englishNames[c.id]||c.name):c.name;
 const sort=(x,y)=>collator.compare(show(x),show(y));
 // Hash is the only uniqueness key; not a display label or source slot.
 const availableOptions=[...available].sort(sort).map(c=>{
  const entry=templateByKey.get(c.key);
  const suffix=entry?.generated?(' · '+tr('RECONSTRUCTED / DRIVABLE','REKONSTRUIERT / FAHRBAR')):'';
  return ['T:'+c.id,`${show(c)} · ${c.id}${suffix}`];
 });
 const unavailableOptions=[...missing].sort(sort).map(c=>['U:'+c.id,`${show(c)} · ${tr('no template','keine Vorlage')}`]);
 return [['','— '+tr('Select a vehicle','Fahrzeug auswählen')+' —'],['heading','── '+tr('STANDARD CARS (31)','NORMALE AUTOS (31)')+' ──'],...cars,
 ['traffic','── TRAFFIC CARS ('+availableOptions.length+') ──'],...availableOptions,
 ...(unavailableOptions.length?[['unavailable','── '+tr('NOT INSTALLABLE YET','NOCH NICHT HINZUFÜGBAR')+' ──'],...unavailableOptions]:[])];}
function getCurrent(){const c=h();return c?.loaded?S.slotInfo(c.save,c.garage,c.slot):null;}
function renderSelector(){const select=$('us17CarSelect'),c=h();
 const car=c?.loaded?getCurrent():null;
 const signature=c?.loaded?{save:c.save,slot:c.slot,key:car?.key,owned:!!car?.owned}:null;
 const changedSlot=!lastSelection||!signature||lastSelection.save!==signature.save||lastSelection.slot!==signature.slot||lastSelection.key!==signature.key||lastSelection.owned!==signature.owned;
 const prev=changedSlot?'':select.value;
 cloneOptions(select,modelOptions(),prev);
 for(const o of select.options)if(['heading','traffic','unavailable'].includes(o.value)||o.value.startsWith('U:'))o.disabled=true;
 if(!c?.loaded){$('us17AddCar').disabled=true;$('us17RemoveCar').disabled=true;$('us17SlotOneNotice').hidden=true;lastSelection=null;return;}
 $('us17AddCar').disabled=false;
 $('us17RemoveCar').disabled=c.slot===1||!car?.owned||!!car?.locked;
 const first=S.slotInfo(c.save,c.garage,1),bad=!first.owned||first.locked;
 const notice=$('us17SlotOneNotice');notice.hidden=false;notice.classList.toggle('danger',bad);
 notice.textContent=bad?tr(
 '⚠ SLOT 01 IS EMPTY OR LOCKED: The game may crash. Install and unlock a car in slot 01 before exporting. Export is blocked until this is fixed.',
 '⚠ SLOT 01 IST LEER ODER GESPERRT: Das Spiel kann abstürzen. Setze ein Auto in Platz 01 ein und entsperre ihn vor dem Export. Der Export bleibt bis dahin gesperrt.'
 ):tr(
 '⚠ SLOT 01 IS MANDATORY: Always keep a car in the first career-garage slot. Removing it is disabled to prevent game crashes.',
 '⚠ SLOT 01 IST PFLICHT: Im ersten Karriere-Garagenslot muss immer ein Auto stehen. Entfernen ist gesperrt, um Spielabstürze zu vermeiden.'
 );
 $('us17SelectedSlot').textContent='SLOT '+String(c.slot).padStart(2,'0')+(car?.owned?' · '+carName(car):' · '+tr('EMPTY','LEER'));
 $('us17CurrentCar').textContent=car?.owned?carName(car):tr('EMPTY SLOT','LEERER PLATZ');
 $('us17SlotSummary').textContent=Array.from({length:allCount(c)},(_,i)=>S.slotInfo(c.save,c.garage,i+1).owned).filter(Boolean).length+' / '+allCount(c)+' '+tr('CARS','AUTOS');
 if(changedSlot){
  const current=car?.owned?(car.traffic?'T:'+car.traffic.id:'N:'+car.key):'';
  select.value=[...select.options].some(o=>o.value===current)?current:'';
 }
 lastSelection=signature;
}
function refreshVisual(){const ctx=h();if(!ctx?.loaded)return;
 const idx=Number($('us17VisualIndex').value);if(!Number.isInteger(idx)||idx<0||idx>=170)return;
 const d=dataset(ctx,ctx.slot);if(!d)return;
 $('us17VisualHash').value=hex8(S.u32(d,bb(ctx.slot)+0x18+idx*4));
 const opts=[];for(let n=1;n<=allCount(ctx);n++){const c=S.slotInfo(ctx.save,ctx.garage,n);if(c.owned&&n!==ctx.slot)opts.push([String(n),'SLOT '+n+' · '+carName(c)]);}
 cloneOptions($('us17VisualDonor'),opts,$('us17VisualDonor').value);
 $('us17VisualCopy').disabled=opts.length===0;
}
function refresh(){renderSelector();refreshVisual();window.USUnlockPartsUI?.render();
 const loaded=available(),current=getCurrent(),trafficMode=!!(loaded&&current?.owned&&!current.locked&&current.traffic);
 $('page-overview').dataset.tuningMode=trafficMode?'traffic':'standard';
 // Traffic Cars have no Appearance / Body Shop tab, even if a normal car's
 // last-opened tab was Shop. Force the simplified profile view.
 if(trafficMode&&tab!=='tune'){setTab('tune');return;}
 for(const id of ['us17VisualApply','us17ShopAll'])$(id).disabled=!loaded||(id==='us17ShopAll'&&trafficMode);
 $('us17VisualUndo').disabled=!loaded||!undoVisual||undoVisual.file!==h().original||undoVisual.slot!==h().slot;
 $('us17ShopUndoAll').disabled=!loaded||!current?.owned||!!current?.locked||trafficMode;
 // Main career heading and navigation; no German text in the English variant.
 const labels=trafficMode?
   {shop:['PERFORMANCE / PARTS SHOP','LEISTUNG / TEILE-SHOP'],tune:['TRAFFIC PERFORMANCE PROFILES','TRAFFIC-LEISTUNGSPROFILE']}:
   {shop:['PERFORMANCE / PARTS SHOP','LEISTUNG / TEILE-SHOP'],tune:['ACCELERATION & TOP SPEED','BESCHLEUNIGUNG & TEMPO']};
 $('us17ShopHeading').textContent=tr(...labels.shop);
 $('us17TuneHeading').textContent=tr(...labels.tune);
 $('us17DynoHeading').textContent=trafficMode?tr('TRAFFIC CAR PROFILES','TRAFFIC CAR PROFILE'):tr('DYNO TUNING','DYNO-TUNING');
 $('us17DynoDescription').textContent=trafficMode?
   tr('Pick one performance profile for the selected Traffic Car. The detailed Dyno editor and standard parts upgrades are hidden for clarity.',
      'Wähle ein Leistungsprofil für das ausgewählte Traffic Car. Der detaillierte Dyno-Editor und die normalen Tuningteile sind für eine übersichtliche Bedienung ausgeblendet.'):
   tr('Customize performance parts and each race type individually. These are save-game values, not direct HP or speed limits.',
      'Leistungsteile und jede Rennart einzeln abstimmen. Dies sind Spielstandwerte, keine direkten PS- oder Geschwindigkeitsbegrenzungen.');
 document.querySelectorAll('[data-career-tab]').forEach(b=>{const k=b.dataset.careerTab,badge=b.querySelector('span');b.textContent='';if(badge)b.append(badge);b.append(' '+tr(...labels[k]));});
}
function change(note){host.changed(note);refresh();}
// Copy the payload but NEVER the slot-specific CAREER_SLOT_<n> handle.
function seed(c,target,donor){const d=dataset(c,target),from=dataset(c,donor),tb=bb(target),fb=bb(donor);
 if(!d||!from)throw Error(tr('The selected slot is not available.','Der gewählte Platz ist nicht verfügbar.'));
 // Each record is 2034 bytes. Preserve native slot handle at base-8 and target's bookkeeping tail.
 d.set(bytes(from,fb,0x428),tb);d[tb+0x428]=0;d[tb+0x429]=1;
 return {d,tb};}
function chooseDonor(c,target,key){const all=[];for(let n=1;n<=allCount(c);n++){const x=S.slotInfo(c.save,c.garage,n);if(x.owned && !x.locked && n!==target)all.push(x);}
 if(!all.length)throw Error(tr('A saved donor car is required to initialize an empty slot.','Zum Erstellen eines leeren Platzes wird ein vorhandenes Spenderauto benötigt.'));
 return all.find(x=>x.key===key)?.n || all.find(x=>!x.traffic)?.n || all[0].n;}
function writeHash(d,off,hash){new DataView(d.buffer,d.byteOffset,d.byteLength).setUint32(off,hash>>>0,true);}
function installCar(){const c=h();if(!c?.loaded)return warn(tr('Open a save first.','Zuerst Spielstand laden.'));
 const value=$('us17CarSelect').value;if(!/^[NT]:/.test(value))return warn(tr('Select a car.','Bitte ein Auto auswählen.'));
 const target=c.slot,car=S.slotInfo(c.save,c.garage,target),traffic=value.startsWith('T:');
 const spec=traffic?S.TRAFFIC.find(x=>x.id===value.slice(2)):null;
 const hash=traffic?spec?.hash:parseInt(value.slice(2),16),key=hex8(hash);
 if(!Number.isFinite(hash)||traffic&&!spec)return;
 const reconstructed=traffic?trafficCatalog().templateByKey.get(key)?.generated:false;
 const experimental=traffic?(reconstructed||target!==4 || spec.id!=='COUPE'):(!Array.from({length:allCount(c)},(_,i)=>S.slotInfo(c.save,c.garage,i+1)).some(x=>x.key===key&&x.owned));
 const explanation=traffic?
 (reconstructed?tr(
 'EXPERIMENTAL RECONSTRUCTION: this vehicle does not have an original mod template. Its record is copied from '+(spec.id==='MINIVAN'?'Panel Van':'Hatchback 2')+' and only the identity is changed. The user confirmed this reconstructed model is driveable in career mode. Performance tuning remains unverified. An arcade configuration may also be overwritten. Import only into a backed-up save.',
 'EXPERIMENTELLE REKONSTRUKTION: Für dieses Fahrzeug gibt es keine originale Mod-Vorlage. Der Datensatz stammt von '+(spec.id==='MINIVAN'?'Panel Van':'Kleinwagen 2')+'; nur die Fahrzeug-ID wurde geändert. Das rekonstruierte Modell wurde in der Karriere vom Nutzer als fahrbar bestätigt. Leistungstuning ist noch nicht bestätigt. Eine Schnellrennen-Konfiguration kann ebenfalls überschrieben werden. Nur mit Backup testen.'
 ):tr('The Traffic Coupe K01 was tested in career slot 4. Other traffic models and slots are experimental.','Traffic-Coupé K01 wurde in Karriereplatz 4 getestet. Andere Traffic-Autos und Plätze sind experimentell.')):
 tr('Existing models use saved donor data. Performance always starts at stock. Factory appearance for unseen models is not guaranteed.','Bekannte Modelle nutzen gespeicherte Spenderdaten. Leistung startet immer auf Serie. Originaloptik unbekannter Modelle ist nicht garantiert.');
 if(!confirm(tr(`Install ${traffic?spec.name:S.CARS.get(key)} in slot ${target}? This ${car.owned?'replaces '+car.model:'fills the empty slot'}.\nPerformance upgrades and Dyno will be reset to stock.\n\n${explanation}\nKeep a backup.`,
 `${traffic?spec.name:S.CARS.get(key)} in Platz ${target} einsetzen? ${car.owned?'Ersetzt '+car.model:'Befüllt den leeren Platz'}.\nLeistungs-Upgrades und Dyno werden auf Serie gesetzt.\n\n${explanation}\nBackup behalten.`)))return;
 const backup=new Uint8Array(c.save),garageBackup=c.garage&&new Uint8Array(c.garage);
 try{
  if(traffic){
   const source=trafficCatalog().templateByKey.get(key)?.slot;
   if(!source)throw Error(tr('No traffic template available for this model.','Für dieses Traffic-Modell ist keine Vorlage vorhanden.'));
   if(!car.owned||car.locked){const donor=chooseDonor(c,target,key);seed(c,target,donor);}
   if(target<=5){
     let p;
     if(spec.id==='COUPE')p=T.convert(c.save,c.garage,{slot:target,source,variant:'K01_ORIGINAL',tuning:'original'});
     else{p=L.make(c.save,c.garage,{source,target,variant:'K01_ORIGINAL'});M.install(p.save,source);}
     c.save.set(p.save);if(c.garage&&p.garage)c.garage.set(p.garage);
   }else{
     // Extended slots: copied template's player-car payload, with target handle intact.
     const src=M.getTemplateRecord(source),dest=c.garage,b=bb(target);
     dest.set(src.slice(0x14,0x430),b+0x0c);
     dest[b+0x428]=0;dest[b+0x429]=1;
   }
  }else{
   const donor=chooseDonor(c,target,key);
   const match=S.slotInfo(c.save,c.garage,donor).key===key;
   if(!car.owned||car.key!==key)seed(c,target,donor);
   const d=dataset(c,target),b=bb(target);
   writeHash(d,b+0x14,hash);
   // When no same-model donor exists, inherit only an approximate donor visual setup.
   // Safe for the archive format, not guaranteed visually valid in the engine.
   if(!match){d[b+0x428]=0;d[b+0x429]=1;}
  }
  // Newly installed/replaced cars must never inherit a tuned donor's installed
  // performance upgrades. Also reset the five stored Dyno setups. Keep the
  // working traffic template's geometry/identity and model-specific visual
  // hashes intact: there is no verified factory appearance catalog for all cars.
  const stock=A.resetToStock(c.save,c.garage,target);
  if(!stock||S.slotInfo(c.save,c.garage,target).key!==key)throw Error(tr('Stock initialization failed; installation reverted.','Serienzustand fehlgeschlagen; Installation zurückgenommen.'));
  importIdentity={slot:target,key};
  change(tr(`${traffic?'Traffic':'Standard'} car installed in slot ${target} with stock performance (0 installed upgrades, 0 Uniques, neutral Dyno). ${experimental?'Experimental: test drivability in the game.':'Export the save to use it.'}`,
   `${traffic?'Traffic':'Standard'}-Auto in Platz ${target} mit Serienleistung eingesetzt (0 Upgrades, 0 Uniques, neutrales Dyno). ${experimental?'Experimentell: Fahrbarkeit im Spiel prüfen.':'Spielstand zum Anwenden exportieren.'}`));
 }catch(e){c.save.set(backup);if(c.garage&&garageBackup)c.garage.set(garageBackup);warn(e.message);refresh();}
}
// Non-destructive slot removal: only mark ownership as absent. The 2,034-byte
// record, its CAREER_SLOT handle, car hash, garage record count and unrelated
// references stay as-is. The game may still reference the currently active car;
// keep a backup and verify in-game before treating this as universally safe.
function removeCar(){
 const c=h();if(!c?.loaded)return;
 if(c.slot===1)return warn(tr('Slot 01 must always contain a vehicle. Removing it is disabled to prevent game crashes.','Platz 01 muss immer ein Auto enthalten. Entfernen ist wegen möglicher Spielabstürze gesperrt.'));
 const current=getCurrent();if(!current?.owned||current.locked)return warn(tr('Select an unlocked, occupied slot.','Einen entsperrten, belegten Platz wählen.'));
 const occupied=Array.from({length:allCount(c)},(_,i)=>S.slotInfo(c.save,c.garage,i+1)).filter(x=>x.owned&&!x.locked);
 if(occupied.length<=1)return warn(tr('Keep at least one usable car in your garage.','Mindestens ein nutzbares Auto muss in der Garage bleiben.'));
 const text=tr('Remove '+carName(current)+' from slot '+c.slot+'? The slot will become empty.\n\nThis is an experimental save-only removal. The game can still reference your current car, so switch to another car in-game before using this save. Keep an original backup.',
  carName(current)+' aus Platz '+c.slot+' entfernen? Der Platz wird leer.\n\nDas Entfernen ist experimentell. Das Spiel kann das aktive Fahrzeug noch referenzieren. Wechsle vor dem Import im Spiel auf ein anderes Auto und behalte ein Original-Backup.');
 if(!confirm(text))return;
 const d=dataset(c,c.slot),b=bb(c.slot);
 // Ownership flag. Keeping the previous payload avoids rewriting unknown fields.
 d[b+0x429]=0;d[b+0x428]=0;
 undoVisual=null;importIdentity=null;
 change(tr('Car removed from slot '+c.slot+'. Export and test in game.','Auto aus Platz '+c.slot+' entfernt. Exportieren und im Spiel testen.'));
}
function shopAll(){const c=h();if(!c?.loaded)return;
 if(getCurrent()?.traffic)return warn(tr('Traffic Cars use the profile tuner.','Traffic Cars werden über Leistungsprofile abgestimmt.'));
 const car=getCurrent();if(!car?.owned||car.locked)return warn(tr('Select an unlocked car first.','Zuerst ein entsperrtes Auto wählen.'));
 const prompt=tr('INSTALL ALL PERFORMANCE PARTS? This activates all 54 documented active part flags and all 9 Unique upgrades. Some upgrades are mutually exclusive in the game, so not all can work at once. This operation is experimental; make a backup.',
 'ALLE PERFORMANCE-TEILE EINBAUEN? Aktiviert alle 54 dokumentierten aktiven Teile-Flags und 9 Unique-Upgrades. Manche Teile schließen sich im Spiel gegenseitig aus und können daher nicht gleichzeitig wirken. Experimentell – Backup sichern.');
 if(!confirm(prompt))return;
 try{const result=A.maxOut(c.save,c.garage,c.slot);
 change(tr(`${result.flagCount} installed performance flags and ${result.uniqueCount} Unique upgrades saved. Some combinations may be incompatible in-game.`,
 `${result.flagCount} Performance-Flags und ${result.uniqueCount} Unique-Upgrades gespeichert. Einige Kombinationen können im Spiel inkompatibel sein.`));
 }catch(e){warn(e.message);refresh();}
}
function undoShopAll(){const c=h();if(!c?.loaded)return;
 if(getCurrent()?.traffic)return warn(tr('Traffic Cars use the profile tuner.','Traffic Cars werden über Leistungsprofile abgestimmt.'));
 const car=getCurrent();if(!car?.owned||car.locked)return warn(tr('Select an unlocked car first.','Zuerst ein entsperrtes Auto wählen.'));
 if(!confirm(tr('RESET THIS CAR TO STOCK? Removes all installed performance parts and Unique upgrades and resets all five Dyno setups to neutral. Appearance, car identity and purchases are preserved. Keep a backup.',
 'DIESES AUTO AUF SERIE ZURÜCKSETZEN? Entfernt alle eingebauten Performance-Teile und Unique-Upgrades und setzt alle fünf Dyno-Abstimmungen auf neutral. Optik, Fahrzeug-ID und Kaufdaten bleiben erhalten. Backup sichern.')))return;
 try{A.resetToStock(c.save,c.garage,c.slot);
 change(tr('Stock performance restored: 0 installed performance parts, 0 Unique upgrades and five neutral Dyno setups.',
 'Serienleistung wiederhergestellt: 0 Performance-Teile, 0 Unique-Upgrades und fünf neutrale Dyno-Abstimmungen.'));
 }catch(e){warn(e.message);refresh();}
}
function applyVisual(copy){const c=h();if(!c?.loaded)return;
 const target=Number($('us17VisualIndex').value),to=dataset(c,c.slot),p=bb(c.slot)+0x18+target*4;
 const car=getCurrent();if(!car?.owned||!to)return warn(tr('Select an occupied slot.','Belegten Platz auswählen.'));
 let value;
 if(copy){const donor=Number($('us17VisualDonor').value);if(!Number.isInteger(donor)||donor<1)return;
 const source=dataset(c,donor);value=S.u32(source,bb(donor)+0x18+target*4);
 }else{const raw=$('us17VisualHash').value.trim().replace(/^0x/i,'');if(!/^[a-f0-9]{8}$/i.test(raw))return warn(tr('Use an eight-digit hex hash.','Achtstellige Hex-ID verwenden.'));value=parseInt(raw,16);}
 const before=S.u32(to,p);if(before===value)return;
 if(copy&&!confirm(tr('Copy a visual part reference from another car? Cross-model geometry can break.','Teilereferenz von anderem Fahrzeug übernehmen? Modellübergreifend können Darstellungsfehler entstehen.')))return;
 undoVisual={file:c.original,slot:c.slot,index:target,before};writeHash(to,p,value);
 change(tr('Saved part reference updated. Verify the part in game.','Gespeicherte Teile-ID geändert. Im Spiel überprüfen.'));
}
function undoBody(){const c=h(),u=undoVisual;if(!c?.loaded||!u||u.file!==c.original||c.slot!==u.slot)return;
 writeHash(dataset(c,c.slot),bb(c.slot)+0x18+u.index*4,u.before);undoVisual=null;change(tr('Body reference restored.','Body-Referenz wiederhergestellt.'));
}
function localizeNew(){const terms={
 'CAREER MODE / GARAGE':['CAREER MODE / GARAGE','KARRIEREMODUS / GARAGE'],
 'YOUR GARAGE':['YOUR GARAGE','DEINE GARAGE'],
 'Choose a slot. Edit, build and tune the selected car.':['Choose a slot. Edit, build and tune the selected car.','Platz wählen, Fahrzeug bearbeiten und abstimmen.'],
 'SELECT A SLOT':['SELECT A SLOT','PLATZ WÄHLEN'],
 'SELECTED SLOT':['SELECTED SLOT','GEWÄHLTER PLATZ'],
 'ADD / REPLACE CAR':['ADD / REPLACE CAR','AUTO HINZUFÜGEN / ERSETZEN'],
 'INSTALL CAR':['INSTALL CAR','AUTO EINSETZEN'],
   'REMOVE CAR':['REMOVE CAR','AUTO ENTFERNEN'],
 'EDIT CAR':['EDIT CAR','FAHRZEUG BEARBEITEN'],
 'Selected model, ownership and model transfers.':['Selected model, ownership and model transfers.','Modell, Besitzstatus und Fahrzeugübernahme.'],
 'PERFORMANCE / PARTS SHOP':['PERFORMANCE / PARTS SHOP','LEISTUNG / TEILE-SHOP'],
 'Install stage packages, unique upgrades or edit saved visual-part references.':['Install stage packages, unique upgrades or edit saved visual-part references.','Stufenpakete, Unique-Upgrades und optische Teile bearbeiten.'],
 'ALL STAGE 3 PACKAGES':['ALL STAGE 3 PACKAGES','ALLE PAKETE STUFE 3'],
 'Applies Stage 3 recipes across all categories. Actual game compatibility must be tested.':['Applies Stage 3 recipes across all categories. Actual game compatibility must be tested.','Wendet Stufe-3-Rezepte auf alle Kategorien an. Spielkompatibilität muss getestet werden.'],
 'INSTALL ALL PARTS':['INSTALL ALL PARTS','ALLE TEILE EINBAUEN'],
 'BODY SHOP (EXPERIMENTAL)':['BODY SHOP (EXPERIMENTAL)','BODY SHOP (EXPERIMENTELL)'],
 'Edit the 170 stored visual part hashes or copy a compatible part reference from another car.':['Edit the 170 stored visual part hashes or copy a compatible part reference from another car.','170 gespeicherte optische Teile-IDs bearbeiten oder von anderem Auto übernehmen.'],
 'SAVED PART POSITION':['SAVED PART POSITION','GESPEICHERTER TEILEPLATZ'],
 'PART HASH (HEX)':['PART HASH (HEX)','TEILE-ID (HEX)'],
 'APPLY PART':['APPLY PART','TEIL ÜBERNEHMEN'],
 'COPY FROM CAR':['COPY FROM CAR','VON AUTO KOPIEREN'],
 'COPY SELECTED PART':['COPY SELECTED PART','AUSGEWÄHLTES TEIL KOPIEREN'],
 'UNDO BODY CHANGE':['UNDO BODY CHANGE','BODY-ÄNDERUNG RÜCKGÄNGIG'],
 'ACCELERATION & TOP SPEED':['ACCELERATION & TOP SPEED','BESCHLEUNIGUNG & TEMPO'],
 'Auto-tune all five race types or adjust gearing, ECU and turbo manually.':['Auto-tune all five race types or adjust gearing, ECU and turbo manually.','Fünf Rennarten automatisch abstimmen oder Getriebe, ECU und Turbo selbst einstellen.'],
 'PROFILE & CAREER PROGRESS':['PROFILE & CAREER PROGRESS','PROFIL & KARRIEREFORTSCHRITT'],
 'MANUAL DYNO / CUSTOM SETUP':['MANUAL DYNO / CUSTOM SETUP','MANUELLES DYNO / EIGENE ABSTIMMUNG'],
 'CUSTOM PARTS':['CUSTOM PARTS','OPTISCHE TEILE'],
 'Advanced: enter a part code':['Advanced: enter a part code','Erweitert: Teile-Code eingeben'],
 'RESET TO STOCK':['RESET TO STOCK','AUF SERIE ZURÜCKSETZEN'],
 'Activates all 54 available performance flags and 9 Unique upgrades. Incompatible combinations are possible.':['Activates all 54 available performance flags and 9 Unique upgrades. Incompatible combinations are possible.','Aktiviert alle 54 verfügbaren Performance-Flags und 9 Unique-Upgrades. Inkompatible Kombinationen sind möglich.'],
 'ALL PERFORMANCE UPGRADES':['ALL PERFORMANCE UPGRADES','ALLE PERFORMANCE-UPGRADES'],
   'MAX OUT PERFORMANCE':['MAX OUT PERFORMANCE','ALLE LEISTUNGSTEILE AKTIVIEREN'],
   'Enables all 54 active performance flags and all 9 Unique upgrades, as in hackch MAX OUT. Some parts conflict.':['Enables all 54 active performance flags and all 9 Unique upgrades, as in hackch MAX OUT. Some parts conflict.','Aktiviert alle 54 aktiven Performance-Flags und 9 Unique-Upgrades wie bei hackch MAX OUT. Einige Teile widersprechen sich.'],
 'COPY PART':['COPY PART','TEIL KOPIEREN'],
 'COPY APPEARANCE FROM':['COPY APPEARANCE FROM','OPTIK KOPIEREN VON'],
 'PART CODE':['PART CODE','TEILE-CODE'],
 'APPEARANCE SLOT':['APPEARANCE SLOT','OPTISCHER TEILEPLATZ'],
 'Slot unlocked':['Slot unlocked','Garagenplatz entsperrt'],
 'Technical details':['Technical details','Technische Details'],
 'VEHICLE DETAILS':['VEHICLE DETAILS','FAHRZEUGDETAILS'],
 'SELECTED CAR':['SELECTED CAR','AUSGEWÄHLTES AUTO'],
 'TRAFFIC COUPE · VERIFIED K01 / K03 IMPORT (SLOT 4)':['TRAFFIC COUPE · VERIFIED K01 / K03 IMPORT (SLOT 4)','TRAFFIC-COUPÉ · BESTÄTIGTER K01/K03-IMPORT (PLATZ 4)'],
 'ADVANCED · LEGACY TRANSFERS':['ADVANCED · LEGACY TRANSFERS','ERWEITERT · ALTE TRANSFERFUNKTIONEN'],
 'TRAFFIC ID ONLY · OLD EXPERIMENT':['TRAFFIC ID ONLY · OLD EXPERIMENT','NUR TRAFFIC-ID · ALTER VERSUCH']};
 for(const el of document.querySelectorAll('#page-overview *')){if(!el.children.length){const text=el.dataset.us17Original || el.textContent.trim();if(terms[text]){el.dataset.us17Original=text;el.textContent=tr(...terms[text]);}}}
}
function prepare(){
 const select=$('us17VisualIndex');for(let i=0;i<170;i++)select.add(new Option(tr('Appearance slot ','Optischer Teileplatz ')+String(i+1).padStart(2,'0'),String(i)));
 $('us17AddCar').onclick=installCar;$('us17RemoveCar').onclick=removeCar;$('us17ShopAll').onclick=shopAll;$('us17ShopUndoAll').onclick=undoShopAll;
 $('us17VisualIndex').onchange=refreshVisual;$('us17VisualApply').onclick=()=>applyVisual(false);
 $('us17VisualCopy').onclick=()=>applyVisual(true);$('us17VisualUndo').onclick=undoBody;
 document.querySelectorAll('[data-career-tab]').forEach(b=>b.onclick=()=>setTab(b.dataset.careerTab));
 $('garageGrid').addEventListener('click',()=>queueMicrotask(()=>{undoVisual=null;refresh();}));
 document.querySelectorAll('[data-page="overview"]').forEach(b=>b.addEventListener('click',()=>queueMicrotask(refresh)));
 // Host's changed method is used by all pre-existing save writers.
 const orig=host.changed;host.changed=(...a)=>{const result=orig(...a);queueMicrotask(()=>{refresh();window.USUnlockPartsUI?.render();});return result;};
 document.addEventListener('change',e=>{if(e.target?.id==='fileInput')setTimeout(refresh,350);});
 window.addEventListener('underground-language-change',()=>{localizeNew();refresh();});
 localizeNew();setTab('shop');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',prepare,{once:true});else prepare();
window.USCareerV17={setTab,refresh};
})();
