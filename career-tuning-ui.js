/* v1.3 career-traffic tuning interface. Only proven K01/K03 at slot 4 are
 * offered as one-click installs. Performance effects are experimental. */
(()=>{'use strict';const T=window.UndergroundCareerTuning,S=window.NFSU2;
const $=id=>document.getElementById(id);
const h=()=>window.UndergroundLabHost?.get();
const language=()=>window.USI18N?.getLanguage?.()||'en';
const tx=(en,de)=>language()==='de'?de:en;
const message=(text,error)=>window.UndergroundLabHost?.message(text,error);
const changed=text=>window.UndergroundLabHost?.changed(text);
const staticItems={
 ctSkyline:['SKYLINE PERFORMANCE','SKYLINE-LEISTUNG'],ctStage3:['STAGE 3 + UNIQUES','STUFE 3 + UNIQUES'],ctUniques:['9 UNIQUES','9 UNIQUES'],ctCopyDonor:['COPY PERFORMANCE','LEISTUNG KOPIEREN'],
 careerApplyK01:['INSTALL K01','K01 INSTALLIEREN'],careerApplyK03:['INSTALL K03','K03 INSTALLIEREN']};
const cloneSelect=(id,all,fallback)=>{const select=$(id);if(!select)return;const prior=select.value;select.replaceChildren();for(const c of all){const op=new Option(c.label,String(c.slot));select.add(op);}select.value=all.some(x=>String(x.slot)===prior)?prior:String(fallback??all[0]?.slot??'');};
function render(){const ctx=h();$('careerVerifiedBox').classList.toggle('hidden',!ctx?.loaded);
 if(!ctx?.loaded){$('careerTrafficTuning').classList.add('hidden');return;}
 const choices=[];for(let n=1;n<=(ctx.garage?10:5);n++){const c=S.slotInfo(ctx.save,ctx.garage,n);if(c.owned&&!c.locked&&!c.traffic)choices.push({slot:n,label:tx('SLOT ','PLATZ ')+n+' · '+c.model});}
 cloneSelect('careerInitDonor',choices,4);const donor=$('careerInitDonor');const initTuning=$('careerInitTuning');donor.disabled=initTuning.value!=='donor'||!choices.length;
 if(initTuning.value==='donor'&&!choices.length){initTuning.value='stage3';donor.disabled=true;}
 $('careerApplyK01').disabled=!ctx.zip||!S.slotInfo(ctx.save,ctx.garage,4).owned;
 $('careerApplyK03').disabled=!ctx.zip||!S.slotInfo(ctx.save,ctx.garage,4).owned;
 const selected=ctx.slot||1,car=S.slotInfo(ctx.save,ctx.garage,selected);const isCareerTraffic=selected<=5&&!!car.traffic&&car.owned&&!car.locked;
 $('careerTrafficTuning').classList.toggle('hidden',!isCareerTraffic);
 if(isCareerTraffic){const r=T.read(ctx.save,ctx.garage,selected);$('ctType').textContent='SLOT '+String(selected).padStart(2,'0')+' / '+tx('EXPERIMENTAL TUNING','EXPERIMENTELLES TUNING');
 $('ctPerfNum').textContent=r.activeParts+' / 56';$('ctUniqueNum').textContent=r.unique.filter(Boolean).length+' / 9';$('ctIdentity').textContent=r.hash;
 const avail=choices.filter(c=>c.slot!==selected);cloneSelect('ctDonor',avail,3);$('ctCopyDonor').disabled=!avail.length;
 const buttons=$('ctCategories');if(!buttons.childElementCount){T.PACKAGES.forEach((p,i)=>{const b=document.createElement('button');b.type='button';b.dataset.category=String(i);b.onclick=()=>changeProfile(()=>T.stage3Category(ctx.save,ctx.garage,selected,i),tx('Applied Level 3: ','Stufe 3 angewendet: ')+p.name);buttons.append(b);});}
 const categoryDe=['Gewicht','Getriebe','Nitro','Motor','Turbo','Fahrwerk','Bremsen','ECU','Reifen'];
 [...buttons.children].forEach((b,i)=>b.textContent=tx('LVL 3 · ','STUFE 3 · ')+(language()==='de'?categoryDe[i]:T.PACKAGES[i].name));
 }
 for(const [id,[en,de]] of Object.entries(staticItems))$(id).textContent=tx(en,de);
 // The language switch should work for every new feature without rebuilding the save.
 const setupNames={original:["ORIGINAL TRAFFIC","ORIGINAL TRAFFIC"],boost:["B03 PERFORMANCE BOOST · OPTIONAL","B03 LEISTUNGS-BOOST · OPTIONAL"],donor:["COPY ORIGINAL CAR TUNING","ORIGINAL-FAHRZEUGTUNING KOPIEREN"],stage3:["STAGE 3 + 9 UNIQUES","STUFE 3 + 9 UNIQUES"],unique:["9 UNIQUES ONLY","NUR 9 UNIQUES"]};
 for(const o of $('careerInitTuning').options){const labels=setupNames[o.value];if(labels)o.textContent=tx(...labels);}
 const texts={
 'careerVerifiedTitle':['K01 / K03 – VERIFIED IN CAREER','K01 / K03 – IN KARRIERE BESTÄTIGT'],
 'careerVerifiedSlot':['SLOT 04 · TRAFFIC COUPÉ','PLATZ 04 · TRAFFIC-COUPÉ'],
 'careerInitLabel':['PERFORMANCE','LEISTUNG'],
 'careerDonorLabel':['DONOR CAR','SPENDERFAHRZEUG'],
 'careerVerifiedHint':['Confirmed for slot 4. Installing replaces that car. You can keep its original performance before replacement.','Für Platz 4 bestätigt. Installation ersetzt das Auto. Die ursprüngliche Leistung kann vor dem Wechsel übernommen werden.'],
 'ctTuningHint':['Car ID, body and ownership are preserved. Whether traffic upgrades improve gameplay must be tested.','Fahrzeug-ID, Karosserie und Besitzstatus bleiben erhalten. Ob Traffic-Upgrades wirken, muss im Spiel getestet werden.'],
 'careerStatusText':['Traffic Coupe: K01 and K03 driveable in career slot 4 (user-tested).','Traffic-Coupé: K01 und K03 in Karriereplatz 4 fahrbar (Nutzertest).'],
 'ctPerfHeader':['CAREER TRAFFIC / PERFORMANCE','KARRIERE-TRAFFIC / LEISTUNG'],
 'ctPerfParts':['INSTALLED PARTS','INSTALLIERTE TEILE'],
 'ctPerfUnique':['UNIQUE UPGRADES','UNIQUE-UPGRADES'],
 'ctPerfId':['CAR ID','FAHRZEUG-ID'],
 'ctDonorLabel':['TRANSFER FROM EXISTING CAR','LEISTUNG VON ANDEREM AUTO'],
 'ctDetailsLabel':['PERFORMANCE CATEGORIES','LEISTUNGSKATEGORIEN']
 };
 for(const [id,labels] of Object.entries(texts)){const e=$(id);if(e)e.textContent=tx(...labels);}
}
function changeProfile(fn,desc){const ctx=h();if(!ctx?.loaded)return;try{fn();changed(desc);render();}catch(e){message(e.message,true);}}
function install(variant){const ctx=h();if(!ctx?.loaded)return;const car=S.slotInfo(ctx.save,ctx.garage,4);
 if(!car.owned||car.locked)return message(tx('Slot 4 must be occupied and unlocked.','Platz 4 muss belegt und entsperrt sein.'),true);
 const profile=$('careerInitTuning').value,donor=Number($('careerInitDonor').value)||4;
 if(!confirm(tx(`Install ${variant} into career slot 4? This replaces ${car.model}. Your existing ZIP should be backed up first.`,
 `${variant} auf Karriereplatz 4 installieren? Dadurch wird ${car.model} ersetzt. Sichere vorher deine ZIP-Datei.`)))return;
 changeProfile(()=>{const p=T.convert(ctx.save,ctx.garage,{slot:4,source:6,variant,tuning:profile==='boost'?'original':profile,donor});
  if(profile==='boost'){
    window.UndergroundTrafficPresets.apply(p.save,p.garage,4,'boost');
    S.repairCareer(p.save);if(p.garage)S.repairGarageFingerprint(p.save,p.garage);
  }
  ctx.save.set(p.save);if(ctx.garage&&p.garage)ctx.garage.set(p.garage);},
 tx(`${variant} installed in career slot 4. Driving confirmed for the base variant; tuning remains experimental.`,
 `${variant} in Karriereplatz 4 installiert. Grundvariante fahrbar; Tuning bleibt experimentell.`));}
function tuneClick(fn,text){const ctx=h();if(!ctx?.loaded)return;const selected=ctx.slot||1;const original=S.slotInfo(ctx.save,ctx.garage,selected);if(!original.traffic||selected>5)return;
 const id=original.key,type=S.u32(ctx.save,S.OFF.slot+(selected-1)*S.OFF.stride-8+0x10);
 changeProfile(()=>{fn(ctx.save,ctx.garage,selected);const post=S.slotInfo(ctx.save,ctx.garage,selected);const postType=S.u32(ctx.save,S.OFF.slot+(selected-1)*S.OFF.stride-8+0x10);if(post.key!==id||postType!==type)throw Error('Traffic identity changed unexpectedly.');},text);}
$('careerInitTuning').addEventListener('change',render);
$('careerApplyK01').onclick=()=>install('K01_ORIGINAL');
$('careerApplyK03').onclick=()=>install('K03_BOTH');
$('ctSkyline').onclick=()=>tuneClick(T.skylineReference,tx('Skyline reference performance applied. Test the acceleration in career mode.','Skyline-Leistungsprofil übernommen. Beschleunigung im Karrieremodus testen.'));
$('ctStage3').onclick=()=>tuneClick(T.stage3,tx('Compatible Level 3 parts and all 9 uniques applied.','Kompatible Teile der Stufe 3 und alle 9 Uniques aktiviert.'));
$('ctUniques').onclick=()=>tuneClick(T.allUniques,tx('All 9 unique upgrades applied.','Alle 9 Unique-Upgrades aktiviert.'));
$('ctCopyDonor').onclick=()=>{const d=Number($('ctDonor').value);if(!d)return;const ctx=h(),car=S.slotInfo(ctx.save,ctx.garage,d);if(!confirm(tx(`Copy performance from ${car.model}? Traffic identity and body remain unchanged.`,`Leistungsdaten von ${car.model} übernehmen? Traffic-ID und Karosserie bleiben erhalten.`)))return;
 tuneClick((s,g,n)=>T.fromDonor(s,g,n,d),tx('Performance copied from ','Leistung kopiert von ')+car.model);};
window.addEventListener('underground-language-change',render);
window.USCareerTuningUI={render};render();})();
