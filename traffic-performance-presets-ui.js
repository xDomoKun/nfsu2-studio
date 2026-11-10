/* v1.7.12: D04 also failed in-game; preserve legacy recovery, keep D01-03 isolated. */
(()=>{'use strict';const S=window.NFSU2,P=window.UndergroundTrafficPresets;
 const $=id=>document.getElementById(id);
 const tx=(en,de)=>window.USI18N?.getLanguage?.()==='de'?de:en;
 const host=()=>{const c=window.UndergroundLabHost?.get();return c?.loaded?c:null;};
 const notice=(msg,bad=false)=>window.UndergroundLabHost?.message(msg,bad);
 const changed=msg=>window.UndergroundLabHost?.changed(msg);
 const undo=new WeakMap();
 const CARDS=[['trafficPresetOriginal','base'],['trafficPresetBoost','boost'],['trafficPresetFinal105','final105'],['trafficPresetFinal125','final125'],['trafficPresetTurboHigh','turboHigh'],['trafficPresetPowerWide','powerWide'],['trafficPresetDiagU5','diagU5'],['trafficPresetDiagU6','diagU6'],['trafficPresetDiagU8','diagU8']];
 function state(){const c=host();if(!c)return null;
   try{const slot=c.slot||1,car=S.slotInfo(c.save,c.garage,slot);
     return car.owned&&!car.locked&&car.traffic?{c,slot,car}:null;
   }catch{return null;}
 }
 const isCoupe=st=>st.car.traffic.id==='COUPE';
 const baseline=st=>isCoupe(st)?'original':'stock';
 const label=mode=>({original:'K01',stock:tx('STOCK','SERIE'),boost:'B03',final105:'G01',final125:'G02',turboHigh:'T01',powerWide:'P01',diagU5:'D01',diagU6:'D02',diagU8:'D03',diagStage:'D04 · '+tx('UNPLAYABLE','NICHT FAHRBAR'),handling:'H01 · '+tx('UNPLAYABLE','NICHT FAHRBAR'),powerHandling:'PH01 · '+tx('UNPLAYABLE','NICHT FAHRBAR'),custom:tx('CUSTOM','EIGEN')})[mode]||mode;
 function record(st){const e=undo.get(st.c.save)?.[st.slot];return e?.key===st.car.key&&P.same(P.capture(st.c.save,st.c.garage,st.slot),e.after)?e:null;}
 function card(el,mode,title,detail,current){
   const active=current===mode;
   el.dataset.profile=mode;
   el.classList.toggle('is-active',active);
   el.setAttribute('aria-pressed',String(active));
   el.querySelector('.tp-card-code').textContent=label(mode);
   el.querySelector('.tp-card-name').textContent=title;
   el.querySelector('.tp-card-description').textContent=detail;
   el.querySelector('.tp-card-status').textContent=active?tx('ACTIVE','AKTIV'):'';
   el.title=active?tx('Currently applied','Aktuell angewendet'):tx('Apply this profile','Dieses Profil anwenden');
 }
 function render(){const root=$('trafficPresetPanel'),st=state();if(!root)return;
   root.classList.toggle('hidden',!st);if(!st)return;
   const coupe=isCoupe(st),val=P.status(st.c.save,st.c.garage,st.slot),base=baseline(st);
   $('trafficPresetHeading').textContent=tx('PERFORMANCE · '+st.car.traffic.name.toUpperCase(),'LEISTUNG · '+st.car.traffic.name.toUpperCase());
   $('trafficPresetEyebrow').textContent=tx('TRAFFIC CAR · PROFILE TUNING','TRAFFIC CAR · PROFIL-TUNING');
   $('trafficPresetCurrent').textContent=tx('CURRENT · ','AKTUELL · ')+label(val);
   $('trafficPresetLead').textContent=tx('Choose a profile directly. It tunes only this vehicle and updates all 5 race types.','Einfach Profil auswählen. Die Abstimmung gilt nur für dieses Auto und alle 5 Rennarten.');
   const specs={
     original:[tx('Original K01','Original K01'),tx('Saved Coupe reference configuration','Gespeicherte Coupé-Referenzkonfiguration')],
     stock:[tx('Stock tuning','Serien-Abstimmung'),tx('Neutral stored setup; original engine physics unchanged','Neutrale Speicherwerte; originale Motorphysik unverändert')],
     boost:[tx('B03 · Both Uniques','B03 · Beide Uniques'),tx('Mid-range ECU + Turbo, final drive 115','Mittlere ECU-/Turbo-Kurve, Endübersetzung 115')],
     final105:[tx('G01 · Top-speed test','G01 · Tempo-Test'),tx('B03 with longer final drive: 105','B03 mit längerer Endübersetzung: 105')],
     final125:[tx('G02 · Acceleration test','G02 · Anzugs-Test'),tx('B03 with shorter final drive: 125','B03 mit kürzerer Endübersetzung: 125')],
     turboHigh:[tx('T01 · Turbo test','T01 · Turbo-Test'),tx('B03 with extended high-RPM turbo plateau','B03 mit längerem Turbo-Plateau bei hoher Drehzahl')],
     powerWide:[tx('P01 · Wide power band','P01 · Breites Leistungsband'),tx('B03 with broader ECU + Turbo curves; experimental','B03 mit breiteren ECU- und Turbo-Kurven; experimentell')],
     diagU5:[tx('Unique flag 5 only','Nur Unique-Flag 5'),tx('B03 + one flag (ID 5); effect unknown','B03 + nur ein Flag (ID 5); Wirkung unbekannt')],
     diagU6:[tx('Unique flag 6 only','Nur Unique-Flag 6'),tx('B03 + one flag (ID 6); effect unknown','B03 + nur ein Flag (ID 6); Wirkung unbekannt')],
     diagU8:[tx('Unique flag 8 only','Nur Unique-Flag 8'),tx('B03 + one flag (ID 8); effect unknown','B03 + nur ein Flag (ID 8); Wirkung unbekannt')],
     // H01 and PH01 are known failing legacy profiles; removed from selection.
   };
   for(const [id,choice] of CARDS){const mode=choice==='base'?base:choice;card($(id),mode,...specs[mode],val);}
   // Recovery for both previously released failing packages.
   const recovery=$('trafficPresetRecovery'),broken=['handling','powerHandling','diagStage'].includes(val);
   recovery.classList.toggle('hidden',!broken);
   if(broken){
     $('trafficPresetRecoveryTitle').textContent=label(val);
     $('trafficPresetRecoveryDetail').textContent=coupe?
       tx('This configuration failed an in-game drive test. Restore the known-good B03 Coupe profile and export. Your original file is unchanged.','Diese Abstimmung schlug im Fahrtest fehl. Stelle das bewährte B03-Coupé-Profil wieder her und exportiere. Deine Originaldatei bleibt unverändert.'):
       tx('This configuration failed an in-game drive test. Reset saved tuning to stock and export. Stock drivability is not verified for every Traffic Car.','Diese Abstimmung schlug im Fahrtest fehl. Setze die Speicherwerte auf Serie zurück und exportiere. Die Fahrbarkeit der Serienwerte ist nicht für alle Traffic Cars bestätigt.');
     $('trafficPresetRecover').textContent=coupe?tx('RESTORE B03','B03 WIEDERHERSTELLEN'):tx('RESET TO STOCK','AUF SERIE ZURÜCKSETZEN');
   }
   $('trafficPresetScope').textContent=tx('Only this car is changed. Rating bars reflect stored flags, not proven speed or cornering grip.','Nur dieses Auto wird geändert. Bewertungsbalken zeigen Speicherwerte – keine bewiesene Höchstgeschwindigkeit oder Kurvenhaftung.');
   $('trafficPresetExperimentsTitle').textContent=tx('POWER · CONFIRMED / EXPERIMENTAL','LEISTUNG · BESTÄTIGT / EXPERIMENTELL');
   $('trafficDiagnosticSummary').textContent=tx('HANDLING · ISOLATED DIAGNOSTIC TESTS','HANDLING · EINZELNE DIAGNOSETESTS');
   $('trafficDiagnosticLead').textContent=tx('D01 produced the highest reported HANDLING BAR, but road handling and drivability are NOT verified. D02 and D03 remain untested. D04 was unplayable and has been removed. Test only one save variant at a time.','D01 zeigt laut deinem Test den höchsten HANDLING-BALKEN; Fahrbarkeit und Kurvenhaftung sind noch NICHT bestätigt. D02 und D03 sind ungetestet. D04 war nicht fahrbar und wurde entfernt. Varianten immer einzeln testen.');
   if(['diagU5','diagU6','diagU8','diagStage'].includes(val))$('trafficDiagnosticDetails').open=true;
   $('trafficPresetUndo').textContent=tx('UNDO LAST PROFILE','LETZTES PROFIL RÜCKGÄNGIG');
   $('trafficPresetUndo').disabled=!record(st);
   $('trafficPresetHint').textContent=coupe?
      tx('B03 and P01 were drivable in the Coupe test. H01, PH01, and D04 failed in-game and are disabled. D01 showed the highest Handling rating so far, NOT proven real grip. D02/D03 remain experimental. Back up your save.',
         'B03 und P01 waren im Coupé-Test fahrbar. H01, PH01 und D04 waren nicht fahrbar und sind gesperrt. D01 zeigte bislang den höchsten Handling-Balken – KEIN Nachweis für echte Haftung. D02/D03 bleiben experimentell. Spielstand sichern.'):
      tx('These performance profiles were only tested in-game on the Traffic Coupe (B03). Results on this car are experimental; stock resets saved tuning, not game physics.',
         'Diese Leistungsprofile wurden bislang nur beim Traffic-Coupé (B03) im Spiel getestet. Hier sind sie experimentell; Serie setzt Speicherwerte zurück, nicht die Spielphysik.');
 }
 function apply(mode){const st=state();if(!st)return;
   const {c,slot}=st;
   if(!['stock','original',...P.TESTS.map(x=>x.id)].includes(mode))return;
   if(mode===P.status(c.save,c.garage,slot))return;
   const base=baseline(st);
   if(mode==='original'&&base!=='original'||mode==='stock'&&base!=='stock')return;
   const isDiagnostic=['diagU5','diagU6','diagU8'].includes(mode);
   const description=mode===base?tx('restore the baseline saved tuning','gespeicherte Basisabstimmung wiederherstellen'):
     tx('apply ','anwenden: ')+label(mode)+' ('+tx('unverified outside Coupe B03','außerhalb Coupé B03 unbestätigt')+')';
   if(!confirm(tx('Apply profile to slot ','Profil auf Platz ')+slot+' · '+st.car.model+'?\n\n'+
      description+'\n'+(isDiagnostic?tx('WARNING: UNVERIFIED HANDLING DIAGNOSTIC. Your vehicle may fall or become unplayable. Always export to a COPY of the save.\n\n','WARNUNG: UNBESTÄTIGTER HANDLING-TEST. Das Auto könnte fallen oder unspielbar werden. Nur eine KOPIE des Spielstands testen.\n\n'):'')+tx('Changes 68 performance bytes, 9 Unique flags and 5 Dyno sets of this vehicle only. Identity, visuals and other cars remain unchanged. Undo works until you make another manual edit.',
      'Ändert 68 Leistungsbytes, neun Unique-Flags und fünf Dyno-Datensätze nur dieses Autos. Fahrzeug-ID, Optik und andere Autos bleiben unverändert. Rückgängig bis zur nächsten manuellen Änderung.')))return;
   try{
     const prior=P.capture(c.save,c.garage,slot),key=st.car.key;
     P.apply(c.save,c.garage,slot,mode);
     const entries=undo.get(c.save)||{};
     entries[slot]={key,prior,after:P.capture(c.save,c.garage,slot)};
     undo.set(c.save,entries);
     changed(tx('Traffic performance profile saved. Export the game save to test it in NFSU2.',
       'Traffic-Leistungsprofil gespeichert. Spielstand exportieren und in NFSU2 testen.'));
   }catch(e){notice(e.message,true);}render();
 }
 function revert(){const st=state();if(!st)return;const e=record(st);if(!e){notice(tx('Undo unavailable: the vehicle or tuning has changed.','Rückgängig nicht verfügbar: Fahrzeug oder Abstimmung geändert.'),true);return;}
   try{P.write(st.c.save,st.c.garage,st.slot,e.prior);
     delete undo.get(st.c.save)[st.slot];
     changed(tx('Previous performance profile restored.','Vorheriges Leistungsprofil wiederhergestellt.'));
   }catch(err){notice(err.message,true);}render();
 }
 for(const [id,choice] of CARDS)$(id).onclick=()=>{const st=state();if(st)apply(choice==='base'?baseline(st):choice);};
 $('trafficPresetRecover').onclick=()=>{const st=state();if(st&&['handling','powerHandling','diagStage'].includes(P.status(st.c.save,st.c.garage,st.slot)))apply(isCoupe(st)?'boost':'stock');};
 $('trafficPresetUndo').onclick=revert;
 window.USTrafficPresetUI={render};
 window.addEventListener('underground-language-change',render);
 render();
})();
