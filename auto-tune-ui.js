/* Compact, bilingual race setup recommendations for career and arcade garages. */
(()=>{'use strict';const A=window.UndergroundAutoTune,S=window.NFSU2,M=window.UndergroundMyCars;
const $=id=>document.getElementById(id);
let mcEvent=0,careerEvent=0;
let undoCareer=new WeakMap(),undoArcade=new WeakMap();
let undoBulkCareer=new WeakMap(),undoBulkArcade=new WeakMap();
const lang=()=>window.USI18N?.getLanguage?.()||'en';
const tx=(en,de)=>lang()==='de'?de:en;
const host=()=>{const v=window.UndergroundLabHost?.get();return v?.loaded?v:null;};
function toast(text,error){window.UndergroundLabHost?.message(text,error);}
function changed(text){window.UndergroundLabHost?.changed(text);}
const names=['Circuit','Drag','Drift','Street X','URL'];
const tips=[['Balanced pull','Ausgewogener Durchzug'],['High-RPM power','Leistung bei hoher Drehzahl'],['Quick throttle response','Direkte Gasannahme'],['Short-track response','Anzug auf engen Strecken'],['Sustained power','Konstante Leistung']];
function getState(mode){const h=host();if(!h)return null;
 const slot=mode==='career'?h.slot:window.USAutoTuneUI?.arcadeSlot||6;
 try{const a=mode==='career'?S.slotInfo(h.save,h.garage,slot):M.info(h.save,slot);
 const ok=mode==='career'?a.owned&&!a.locked:a.active;
 return ok?{h,slot,car:a,mode}:null;}catch{return null;}}
function selectRows(container,selected,change){container.replaceChildren();names.forEach((name,i)=>{
 const b=document.createElement('button');b.type='button';b.className='auto-race'+(selected===i?' is-selected':'');
 b.innerHTML='<span class="auto-race-number">0'+(i+1)+'</span><span class="auto-race-name"></span>';
 b.querySelector('.auto-race-name').textContent=name;
 b.onclick=()=>change(i);container.append(b);
 });}
function renderMode(mode){const root=$(mode==='career'?'autoCareer':'autoArcade');if(!root)return;
 const st=getState(mode);root.classList.toggle('hidden',!st);if(!st)return;
 const event=mode==='career'?careerEvent:mcEvent;
 const prefix=mode==='career'?'careerAuto':'arcadeAuto';
 const rootTitle=root.querySelector('.auto-head h3');
 if(rootTitle){rootTitle.firstChild.textContent=tx('AUTO-TUNE · ','AUTO-ABSTIMMUNG · ');}
 const overline=root.querySelector('.auto-overline');if(overline)overline.textContent=mode==='career'?tx('CUSTOM DYNO / CAREER','DYNO / KARRIERE'):tx('CUSTOM DYNO / QUICK RACE','DYNO / SCHNELLRENNEN');
 const manual=root.parentElement?.querySelector(':scope > details.us-manual > summary');
 if(manual)manual.textContent=mode==='career'?tx('MANUAL DYNO / CUSTOM SETUP','MANUELLER DYNO / EIGENE ABSTIMMUNG'):tx('MANUAL DYNO & ADVANCED UPGRADES','MANUELLES TUNING & ERWEITERTE UPGRADES');
 selectRows($(prefix+'Events'),event,i=>{if(mode==='career')careerEvent=i;else mcEvent=i;renderMode(mode);});
 const r=A.recommendation(st.h.save,st.h.garage,mode,st.slot,event);
 $(prefix+'Name').textContent=st.car.model||st.car.name||tx('Selected car','Ausgewähltes Auto');
 $(prefix+'Description').textContent=tx(...tips[event]);
 $(prefix+'Badge').textContent=r.confirmed?tx('TESTED ECU-01 BASE','ECU-01-BASIS GETESTET'):tx('SUGGESTED / UNVERIFIED','EMPFEHLUNG / UNGETESTET');
 $(prefix+'Badge').classList.toggle('auto-tested',r.confirmed);
 const after=r.ecu.map(x=>Math.round(x/10));
 const plot=$(prefix+'Plot');plot.replaceChildren();for(let i=0;i<9;i++){
   const outer=document.createElement('span');outer.className='auto-bar';outer.title='RPM '+(i+1)+' · ECU '+r.ecu[i];
   const fill=document.createElement('span');fill.className='auto-bar-fill';fill.style.height=(Math.max(3,r.ecu[i]/2))+'%';outer.append(fill);plot.append(outer);
 }
 $(prefix+'Apply').textContent=tx('APPLY TO '+names[event].toUpperCase(),'FÜR '+names[event].toUpperCase()+' ANWENDEN');
 $(prefix+'All').textContent=tx('BEST SETUPS · ALL 5 RACES','BESTE SETUPS · ALLE 5 RENNARTEN');
 $(prefix+'AllHint').textContent=tx('One click: five distinct race setups for this car.','Ein Klick: fünf unterschiedliche Renn-Setups für dieses Auto.');
 const fleet=A.eligibleSlots(st.h.save,st.h.garage,mode,mode==='career');
 $(prefix+'Fleet').textContent=mode==='career'?tx('APPLY TO '+fleet.length+' STANDARD CARS','FÜR '+fleet.length+' NORMALE AUTOS ANWENDEN'):tx('APPLY TO ALL '+fleet.length+' CARS','FÜR ALLE '+fleet.length+' AUTOS ANWENDEN');
 $(prefix+'FleetUndo').textContent=tx('UNDO GARAGE','GARAGE ZURÜCKSETZEN');
 $(prefix+'FleetUndo').disabled=!(mode==='career'?undoBulkCareer:undoBulkArcade).has(st.h.save);
 $(prefix+'FleetHint').textContent=tx('Applies five recommendations to each occupied car in this garage. Previous Dyno values are backed up for undo.','Wendet fünf Empfehlungen auf jedes belegte Fahrzeug dieser Garage an. Vorherige Dyno-Werte werden zum Rückgängigmachen gesichert.');
 $(prefix+'Undo').textContent=tx('UNDO CAR','AUTO RÜCKGÄNGIG');
 $(prefix+'Undo').disabled=!(mode==='career'?undoCareer:undoArcade).get(st.h.save)?.[st.slot];
 $(prefix+'Hint').textContent=r.confirmed?
  tx('Based on your working ECU-01 test. Other race setups remain suggestions.','Basierend auf deinem funktionierenden ECU-01-Test. Andere Rennarten bleiben Empfehlungen.'):
  tx('Adapted to this car’s saved setup. Not a measured optimum. Manual tune stays available.','An diesen Spielstand angepasst. Kein gemessenes Optimum. Manuelle Abstimmung bleibt verfügbar.');
}
function action(mode,all,undo){const st=getState(mode);if(!st)return;const {h,slot}=st,store=mode==='career'?undoCareer:undoArcade;
 try{
  if(undo){const saved=store.get(h.save)?.[slot];if(!saved)return;
   A.restore(h.save,h.garage,mode,slot,saved);const before=store.get(h.save);delete before[slot];
  }else{
   const map=store.get(h.save)||{};
   // One snapshot of all race setups before the most recent auto-tune action.
   map[slot]=A.readAll(h.save,h.garage,mode,slot);store.set(h.save,map);
   if(all)A.applyAll(h.save,h.garage,mode,slot);
   else A.apply(h.save,h.garage,mode,slot,mode==='career'?careerEvent:mcEvent);
  }
  changed(undo?tx('Previous dyno setup restored.','Vorherige Dyno-Abstimmung wiederhergestellt.'):
    all?tx('Five race recommendations saved. Export ZIP to use them in game.','Fünf Rennart-Presets gespeichert. Für das Spiel ZIP exportieren.'):
    tx('Race setup applied. Export ZIP to test in game.','Rennart-Preset angewendet. Zum Testen ZIP exportieren.'));
  renderMode(mode);
 }catch(e){toast(e.message,true);}}
function fleetAction(mode,undo){
 const st=getState(mode);if(!st)return;
 const {h}=st,store=mode==='career'?undoBulkCareer:undoBulkArcade;
 try {
  if(undo){
   const transaction=store.get(h.save);if(!transaction)return;
   const count=A.restoreGarage(h.save,h.garage,transaction);store.delete(h.save);
   changed(tx(count+' cars restored to their previous Dyno setups.',count+' Autos auf ihre vorherige Dyno-Abstimmung zurückgesetzt.'));
  } else {
   if(store.has(h.save)){
    toast(tx('Undo the previous whole-garage action before applying another.','Vor einer erneuten Sammelaktion zuerst die bisherige rückgängig machen.'),true);
    return;
   }
   const count=A.eligibleSlots(h.save,h.garage,mode,mode==='career').length;
   if(!count)return;
   const scope=mode==='career'?tx('Career','Karriere'):tx('My Cars','Meine Autos');
   if(!confirm(tx('Apply five race recommendations to all '+count+' cars in '+scope+'?\n\nThis replaces their saved Dyno setups. Your vehicle identities and installed parts will not change. Undo Garage restores the previous setups. Keep an original ZIP backup.','Alle fünf Rennart-Empfehlungen auf '+count+' Fahrzeuge in '+scope+' anwenden?\n\nGespeicherte Dyno-Abstimmungen werden ersetzt. Fahrzeug-IDs und verbaute Teile bleiben unverändert. Garage zurücksetzen stellt die bisherigen Werte wieder her. Original-ZIP sichern.')))return;
   const transaction=A.applyGarage(h.save,h.garage,mode,mode==='career');store.set(h.save,transaction);
   changed(tx('Best setups saved for '+count+' cars. Export ZIP to use them.','Beste Setups für '+count+' Fahrzeuge gespeichert. Zum Spielen ZIP exportieren.'));
  }
  renderMode(mode);
 }catch(e){toast(e.message,true);renderMode(mode);}
}
function init(mode){const p=mode==='career'?'careerAuto':'arcadeAuto';
 $(p+'Apply').onclick=()=>action(mode,false,false);$(p+'All').onclick=()=>action(mode,true,false);$(p+'Undo').onclick=()=>action(mode,false,true);
 $(p+'Fleet').onclick=()=>fleetAction(mode,false);$(p+'FleetUndo').onclick=()=>fleetAction(mode,true);
}
init('career');init('arcade');
// In v1.7 the career dyno is permanently placed in the Acceleration & Top Speed tab.
const shopSummary=document.querySelector('#careerShop > summary');
if(shopSummary){
 const refreshShopSummary=()=>{shopSummary.textContent=tx('ADVANCED PERFORMANCE PARTS','ERWEITERTE LEISTUNGSTEILE')+' · STOCK / STREET / PRO / EXTREME';};
 refreshShopSummary();window.addEventListener('underground-language-change',refreshShopSummary);
}

window.USAutoTuneUI={arcadeSlot:6,renderCareer:()=>renderMode('career'),renderArcade:(slot)=>{window.USAutoTuneUI.arcadeSlot=slot;renderMode('arcade');}};
window.addEventListener('underground-language-change',()=>{renderMode('career');renderMode('arcade');});
})();
