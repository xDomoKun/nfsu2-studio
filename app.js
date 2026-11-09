(() => {
'use strict';
const core = window.NFSU2;
const $ = id => document.getElementById(id);
const state = {filename:'', original:null, zip:null, profilePath:null, garagePath:null, save:null, garage:null, slot:1, dirty:false, loaded:false, event:0};
const fmt = n => new Intl.NumberFormat('de-DE').format(n);
function errorText(e){return e instanceof Error?e.message:String(e);}
function message(text, error=false){const el=$('message');el.textContent=text;el.className='message'+(error?' error':'');}
function clearMessage(){$('message').className='message hidden';}
function copyBytes(b){return new Uint8Array(b);}
function ready(){if(!state.loaded)throw new Error('Bitte zuerst einen Spielstand öffnen.');}
function dirty(note){state.dirty=true;renderStats();renderGarage();if(window.UndergroundTrafficUI)window.UndergroundTrafficUI.render();if(note)message(note);}
function show(page){
 document.querySelectorAll('[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page===page));
 document.querySelectorAll('.section').forEach(s=>s.classList.toggle('active',s.id==='page-'+page));
 $('title').textContent=({mycars:'Meine Autos',overview:'Karriere',garage:'Garage & Tuning',lab:'Experimente',files:'Dateien'})[page];
 $('subtitle').textContent=({mycars:'Schnellrennen / 20 Plätze',overview:'Profil, Geld und Karrierefortschritt bearbeiten.',garage:'Karrieregarage, Upgrades und Original-Dyno verwalten.',lab:'Archiv älterer Save-only-Experimente.',files:'Spielstände exportieren und Original sichern.'})[page];
 if(page==='garage')renderGarage();if(page==='mycars'&&window.UndergroundTrafficUI)window.UndergroundTrafficUI.render();if(page==='lab'&&window.UndergroundLabUI)window.UndergroundLabUI.render();
}
async function importFile(file){
 clearMessage();
 try{
  if(file.size>30*1024*1024)throw new Error('Die Datei ist für einen Spielstand-Export zu groß (max. 30 MB).');
  const raw=new Uint8Array(await file.arrayBuffer());
  const zip=raw[0]===0x50&&raw[1]===0x4b;
  let selected=null, path=null, garagePath=null, garage=null, archive=null;
  if(zip){
   archive=await JSZip.loadAsync(raw,{checkCRC32:true,createFolders:false});
   const entries=Object.values(archive.files).filter(e=>!e.dir && !e.name.includes('__MACOSX') && !e.name.startsWith('._'));
   const candidates=[];
   for(const ent of entries){
     if(ent._data && ent._data.uncompressedSize!==core.SIZE)continue;
     const candidate=new Uint8Array(await ent.async('uint8array'));
     try{core.assertCareer(candidate);candidates.push({ent,bytes:candidate});}catch(_){}
   }
   if(candidates.length===0)throw new Error('Diese ZIP-Datei enthält keinen kompatiblen NFSU2-Karriere-Spielstand.');
   // One main profile is the common nfsu2.xyz use case. Multiple profiles prompt selection.
   let chosen=candidates[0];
   if(candidates.length>1){const names=candidates.map((c,i)=>`${i+1}: ${c.ent.name}`).join('\n');const answer=prompt('Welches Profil bearbeiten?\n'+names,'1');if(answer===null)return;const idx=Number.parseInt(answer,10)-1;if(!Number.isInteger(idx)||!candidates[idx])throw new Error('Ungültige Profilnummer.');chosen=candidates[idx];}
   selected=chosen.bytes;path=chosen.ent.name;
   const folder=path.includes('/')?path.slice(0,path.lastIndexOf('/')+1):'';
   const ge=archive.file(folder+'GARAGE.DAT');
   if(ge){const b=await ge.async('uint8array');if(b.length===core.GARAGE_SIZE){core.assertGarage(b);garage=new Uint8Array(b);garagePath=ge.name;}}
  } else {selected=raw;core.assertCareer(selected);}
  // Explicitly preserve original before any work.
  state.filename=file.name;state.original=raw;state.zip=archive;state.profilePath=path;state.garagePath=garagePath;
  state.save=copyBytes(selected);state.originalSave=copyBytes(selected);state.garage=garage;state.slot=1;state.event=0;state.dirty=false;state.loaded=true;
  renderAll();
  if(window.UndergroundTrafficUI)window.UndergroundTrafficUI.onImported();
  show('mycars');
  const c=core.checkCareer(state.save);
  message(`Spielstand „${core.getName(state.save)}“ geladen · ${c.ok?'alle drei Prüfsummen gültig':'Prüfsummen sind fehlerhaft – Export repariert sie'} · ${garage?'10':'5'} Garagenslots verfügbar.`,!c.ok);
 }catch(e){message('Import fehlgeschlagen: '+errorText(e),true);}
}
function renderAll(){
 $('startZone').classList.add('hidden');$('stats').classList.remove('hidden');
 $('garageNone').classList.add('hidden');$('garageContent').classList.remove('hidden');
 $('name').value=core.getName(state.save);$('money').value=core.money(state.save);$('stage').value=String(core.stage(state.save));
 $('saveTop').disabled=false;$('downloadBackup').disabled=false;$('saveFiles').disabled=false;
 $('loadedFilename').value=state.filename;
 $('exportKind').textContent=state.zip?'ZIP inklusive Einstellungen':'Einzelner Karriere-Spielstand';
 $('saveTop').innerHTML=state.zip?'↓ &nbsp; EXPORTIEREN':'↓ &nbsp; EXPORTIEREN';
 $('fileDetails').textContent=(state.zip?'nfsu2.xyz / ZIP-Archiv':'Einzeldatei')+(state.profilePath?' · Profil: '+state.profilePath:'')+(state.garagePath?' · GARAGE.DAT erkannt':' · keine zusätzliche Garage');
 renderStats();renderGarage();if(window.UndergroundLabUI)window.UndergroundLabUI.render();if(window.UndergroundTrafficUI)window.UndergroundTrafficUI.render();
}
function renderStats(){if(!state.loaded)return;
 $('statMoney').textContent=fmt(core.money(state.save))+' $';$('statStage').textContent='Stufe '+core.stage(state.save);
 let owned=0;for(let i=1;i<=10;i++){if(i>5&&!state.garage)break;if(core.slotInfo(state.save,state.garage,i).owned)owned++;}
 $('statSlots').textContent=owned+' / '+(state.garage?10:5);
 const ok=core.checkCareer(state.save).ok;
 $('checksumStatus').textContent=ok?'Gültig':state.dirty?'Nach Export gültig':'Nicht gültig';
 $('checksumStatus').className='status'+((ok||state.dirty)?'':' bad');
}
function renderGarage(){if(!state.loaded)return;
 const grid=$('garageGrid');grid.textContent='';const count=state.garage?10:5;
 if(state.slot>count)state.slot=1;
 for(let i=1;i<=count;i++){
  const car=core.slotInfo(state.save,state.garage,i);
  const b=document.createElement('button');b.className='vehicle'+(state.slot===i?' selected':'');
  const stateTxt=car.locked?'Gesperrt':car.owned?'Belegt':'Leer';
  const tagClass=car.locked?'locked':car.owned?'':'empty';
  b.innerHTML=`<div class="carpic">${car.owned?(car.traffic?'🚕':'🏎️'):'◌'}</div><div class="slot">SLOT ${i.toString().padStart(2,'0')}</div><div class="model"></div><span class="tag ${tagClass}">${stateTxt}</span>`;
  b.querySelector('.model').textContent=car.owned?car.model:'Freier Platz';
  b.onclick=()=>{state.slot=i;renderGarage();};grid.append(b);
 }
 renderInspector();
}
function renderInspector(){const car=core.slotInfo(state.save,state.garage,state.slot);
 $('inspectorTitle').textContent=car.owned?car.model:'Leerer Garagenplatz';$('slotCaption').textContent='Slot '+state.slot;
 $('modelHash').value='0x'+car.key;$('slotId').value='Slot '+state.slot+' / '+(state.slot>5?'GARAGE.DAT':'Karriere');
 $('slotUnlocked').checked=!car.locked;
 $('emptySlotNote').classList.toggle('hidden',car.owned);
 $('donorTools').classList.toggle('hidden',!car.owned);
 const donor=$('donorSlot'), previous=donor.value;donor.textContent='';
 for(let i=1;i<=(state.garage?10:5);i++){
  const c=core.slotInfo(state.save,state.garage,i);if(!c.owned||i===state.slot)continue;
  const opt=document.createElement('option');opt.value=String(i);opt.textContent=`Slot ${i} · ${c.model}`;donor.append(opt);
 }
 if([...donor.options].some(o=>o.value===previous))donor.value=previous;
 $('applyDonor').disabled=!donor.options.length;
 const traffic=$('trafficType'),oldTraffic=traffic.value;traffic.textContent='';
 for(const c of core.TRAFFIC){const option=document.createElement('option');option.value=c.id;option.textContent=`${c.name} · 0x${c.key}`;traffic.append(option);}
 if(car.traffic)traffic.value=car.traffic.id;
 else if(core.TRAFFIC.some(c=>c.id===oldTraffic))traffic.value=oldTraffic;
 $('applyTraffic').disabled=!car.owned || car.locked;
 const perf=$('perfDonorSlot'),oldPerf=perf.value;perf.textContent='';
 for(let i=1;i<=(state.garage?10:5);i++){
   const c=core.slotInfo(state.save,state.garage,i);
   if(!c.owned || c.traffic || i===state.slot)continue;
   const option=document.createElement('option');option.value=String(i);option.textContent=`Slot ${i} · ${c.model}`;perf.append(option);
 }
 if([...perf.options].some(o=>o.value===oldPerf))perf.value=oldPerf;
 $('applyPerfDonor').disabled=!car.owned || car.locked || !perf.options.length;
 const parent=$('uniqueGrid');parent.textContent='';
 for(let i=0;i<car.unique.length;i++){
  const item=car.unique[i];const row=document.createElement('label');row.className='toggle-row';
  const text=document.createElement('span');text.textContent=item.name;const inp=document.createElement('input');
  inp.className='switch';inp.type='checkbox';inp.checked=item.on;inp.disabled=!car.owned;
  inp.onchange=()=>{try{core.setUnique(state.save,state.garage,state.slot,i,inp.checked);dirty('Unique-Tuning „'+item.name+'“ geändert. Exportiere den Spielstand, um die Änderung zu übernehmen.');}catch(e){message(errorText(e),true);renderInspector();}};
  row.append(text,inp);parent.append(row);
 }
 renderDyno();
}
function dynoRange(control){
 const row=document.createElement('label');row.className='dyno-control';
 const up=document.createElement('div');up.className='upper';const label=document.createElement('span');label.textContent=control.label;
 const out=document.createElement('output');out.textContent=control.value+' / 200';up.append(label,out);
 const slider=document.createElement('input');slider.type='range';slider.min=0;slider.max=200;slider.step=1;slider.value=control.value;
 slider.dataset.dynoId=control.id;slider.setAttribute('aria-label',control.label);
 slider.oninput=()=>{out.textContent=slider.value+' / 200';};
 slider.onchange=()=>{try{core.dynoWrite(state.save,state.garage,state.slot,state.event,control.id,Number(slider.value));dirty('Dyno-Wert „'+control.label+'“ für '+core.DYNO_EVENTS[state.event]+' geändert.');}catch(e){message(errorText(e),true);renderDyno();}};
 row.append(up,slider);return row;
}
function renderDyno(){
 if(!state.loaded)return;
 const car=core.slotInfo(state.save,state.garage,state.slot);
 const data=core.dynoData(state.save,state.garage,state.slot,state.event);
 const supported=data.available&&core.CARS.has(car.key);
 $('dynoUnavail').classList.toggle('hidden',supported);
 $('dynoEditor').classList.toggle('hidden',!supported);
 if(!supported)return;
 $('dynoEvent').value=String(state.event);
 $('dynoGearStatus').textContent=data.installedGearPart?'Getriebe-Upgrade (ID 11) eingetragen. Die gültigen Bereiche hängen von den Spielpaketen ab.':'Kein Getriebe-Upgrade (ID 11) erkannt. Nicht freigeschaltete Gang-Regler können wirkungslos sein.';
 const priority=data.controls.find(c=>c.id==='final').value-100;
 $('dynoPriority').value=priority;
 $('dynoPriorityValue').textContent=priority===0?'Neutral':priority<0?Math.abs(priority)+'% Richtung Vmax':priority+'% Richtung Anfahren';
 for(const [group,id] of [['gear','dynoGears'],['ecu','dynoECU'],['turbo','dynoTurbo']]){
   const target=$(id);target.replaceChildren();
   for(const c of data.controls.filter(c=>c.group===group))target.append(dynoRange(c));
 }
}
async function exportEdited(){
 try{ready();
  const game=new Uint8Array(state.save);core.repairCareer(game);
  const garageCopy=state.garage?new Uint8Array(state.garage):null;
  if(garageCopy)core.repairGarageFingerprint(game,garageCopy);
  if(!core.checkCareer(game).ok)throw new Error('Prüfsummen konnten nicht korrigiert werden.');
  let blob,filename;
  if(state.zip){
    const archive=await JSZip.loadAsync(state.original,{checkCRC32:true});
    const lastSlash=state.profilePath.lastIndexOf('/');
    const oldBase=state.profilePath.slice(lastSlash+1);
    const newBase=core.getName(game);
    let profilePath=state.profilePath;
    let garagePath=state.garagePath;
    if(oldBase!==newBase && lastSlash>=0){
      const oldFolder=state.profilePath.slice(0,lastSlash+1);
      const parent=oldFolder.slice(0,oldFolder.slice(0,-1).lastIndexOf('/')+1);
      const newFolder=parent+newBase+'/';
      // Move all files in the selected profile folder, without altering unrelated profiles.
      const originals=Object.values(archive.files).filter(e=>!e.dir&&e.name.startsWith(oldFolder));
      for(const ent of originals){
        const tail=ent.name.slice(oldFolder.length);
        const newPath=newFolder+(tail===oldBase?newBase:tail);
        archive.file(newPath,await ent.async('uint8array'),{date:ent.date});
      }
      archive.remove(oldFolder);
      profilePath=newFolder+newBase;
      if(garagePath)garagePath=newFolder+'GARAGE.DAT';
      const autosave=archive.file('autosave-profiles.txt');
      if(autosave){const originalTxt=await autosave.async('string');const revised=originalTxt.split('\n').map(x=>x.trimEnd()===oldBase?newBase:x).join('\n');archive.file('autosave-profiles.txt',revised);}
    }
    archive.file(profilePath,game);
    if(garageCopy&&garagePath)archive.file(garagePath,garageCopy);
    blob=await archive.generateAsync({type:'blob',compression:'DEFLATE',compressionOptions:{level:6}});
    filename=state.filename.replace(/\.zip$/i,'')+'-bearbeitet.zip';
  }else{blob=new Blob([game],{type:'application/octet-stream'});filename=(core.getName(game)||'NFSU2')+'-bearbeitet.sav';}
  download(blob,filename);message('Export erstellt: '+filename+' · Spielstand-Prüfsummen und '+(garageCopy?'Zusatzgaragen-Fingerprint':'Dateiprüfsummen')+' korrigiert. Das Original bleibt unverändert.'); 
 }catch(e){message(errorText(e),true);}
}
function download(blob,name){const a=document.createElement('a'),u=URL.createObjectURL(blob);a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1500);}
function backup(){try{ready();download(new Blob([state.original],{type:'application/octet-stream'}),state.filename);message('Unveränderte Originaldatei als Backup heruntergeladen.');}catch(e){message(errorText(e),true);}}
function bind(){
 document.querySelectorAll('[data-page]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.page)));
 $('openTop').onclick=$('startPick').onclick=()=>{$('fileInput').click()};
 $('fileInput').onchange=e=>{if(e.target.files[0])importFile(e.target.files[0]);e.target.value='';};
 const zone=$('startZone');zone.addEventListener('dragover',e=>{e.preventDefault();zone.classList.add('drag')});zone.addEventListener('dragleave',()=>zone.classList.remove('drag'));zone.addEventListener('drop',e=>{e.preventDefault();zone.classList.remove('drag');if(e.dataTransfer.files[0])importFile(e.dataTransfer.files[0]);});
 zone.addEventListener('click',e=>{if(e.target.id!=='startPick')$('fileInput').click()});
 $('applyProfile').onclick=()=>{try{ready();core.setName(state.save,$('name').value.trim());core.setMoney(state.save,Number($('money').value));dirty('Profilname und Guthaben übernommen. Bitte bearbeiteten Spielstand exportieren.');}catch(e){message(errorText(e),true);}};
 document.querySelectorAll('[data-cash]').forEach(b=>b.onclick=()=>{$('money').value=b.dataset.cash;});
 $('applyStage').onclick=()=>{try{ready();core.setStage(state.save,Number($('stage').value));dirty('Karrierestufe geändert – dies ersetzt keine absolvierten Rennen oder Missionsziele.');}catch(e){message(errorText(e),true);}};
 $('slotUnlocked').onchange=e=>{try{ready();core.setUnlocked(state.save,state.garage,state.slot,e.target.checked);dirty('Garagenplatz '+state.slot+' angepasst.');}catch(err){message(errorText(err),true);renderInspector();}};
 $('applyTraffic').onclick=()=>{try{
  ready();const chosen=core.TRAFFIC.find(c=>c.id===$('trafficType').value);
  const current=core.slotInfo(state.save,state.garage,state.slot);
  if(!chosen)return;
  if(!confirm(`Slot ${state.slot} (${current.model}) experimentell auf ${chosen.name} ändern?\n\nNur der Fahrzeugtyp-Hash wird geändert. Fahrzeugmodelle und Physik aus dem Spieldatenpaket werden NICHT verändert. Das bisherige ID-Experiment zeigte die Optik, aber nicht die Fahrbarkeit. Im Save-only Lab gibt es weitere Testvarianten. Ob sie funktionieren, ist unbewiesen. Original-Backup behalten.`))return;
  core.setTraffic(state.save,state.garage,state.slot,chosen.id);
  dirty(`Traffic-ID auf ${chosen.name} (0x${chosen.key}) geändert. Im Browser testen; Fahrbarkeit und Optik sind nicht garantiert.`);
 }catch(e){message(errorText(e),true);}};
 $('dynoEvent').onchange=()=>{state.event=Number($('dynoEvent').value);renderDyno();};
 $('dynoPriority').oninput=()=>{const v=Number($('dynoPriority').value);$('dynoPriorityValue').textContent=v===0?'Neutral':v<0?Math.abs(v)+'% Richtung Vmax':v+'% Richtung Anfahren';};
 $('dynoPriority').onchange=()=>{try{core.dynoPriority(state.save,state.garage,state.slot,state.event,Number($('dynoPriority').value));dirty('Endübersetzung angepasst. Reale Beschleunigung/Vmax bitte im Browser testen.');}catch(e){message(errorText(e),true);renderDyno();}};
 for(const [id,val] of [['presetSpeed',-70],['presetBalanced',0],['presetAccel',70]])$(id).onclick=()=>{try{core.dynoPriority(state.save,state.garage,state.slot,state.event,val);dirty('Original-Endübersetzung für '+core.DYNO_EVENTS[state.event]+' angepasst.');}catch(e){message(errorText(e),true);}};
 $('resetDyno').onclick=()=>{try{if(!confirm('Alle 25 editierbaren Getriebe-/ECU-/Turbo-Werte für diese Rennart auf neutral 100 setzen?'))return;core.dynoReset(state.save,state.garage,state.slot,state.event);dirty('Dyno-Abstimmung für '+core.DYNO_EVENTS[state.event]+' zurückgesetzt.');}catch(e){message(errorText(e),true);}};
 $('applyAllDyno').onclick=()=>{try{if(!confirm('Diese Abstimmung auf Circuit, Drag, Drift, Street X und URL übertragen?'))return;const x=core.dynoData(state.save,state.garage,state.slot,state.event);for(let e=0;e<5;e++)for(const p of x.controls)core.dynoWrite(state.save,state.garage,state.slot,e,p.id,p.value);dirty('Aktuelle Dyno-Abstimmung auf alle fünf Rennarten kopiert.');}catch(e){message(errorText(e),true);}};
 $('applyPerfDonor').onclick=()=>{try{
   ready();const from=Number($('perfDonorSlot').value);
   if(!Number.isInteger(from)||from<1)return;
   const car=core.slotInfo(state.save,state.garage,from);
   if(!confirm(`Gespeicherte Performance-Flags und Dyno-Setups von ${car.model} aus Slot ${from} übernehmen?\n\nWichtig: Die Motor- und Fahrzeugphysik aus GLOBALB wird dadurch nicht kopiert.`))return;
   core.copyPerformance(state.save,state.garage,state.slot,from);
   dirty(`Gespeicherte Performance von Slot ${from} kopiert. Kein Eingriff in die Basisphysik des Spiels.`);
 }catch(e){message(errorText(e),true);}};
 $('applyDonor').onclick=()=>{try{ready();const donor=Number($('donorSlot').value);const a=core.slotInfo(state.save,state.garage,donor);if(!confirm(`Modell- und Karosseriedaten von „${a.model}“ auf Slot ${state.slot} übertragen?\n\nExperimentelle Funktion – vor dem Import unbedingt ein Backup behalten.`))return;core.replaceIdentity(state.save,state.garage,state.slot,donor);dirty('Fahrzeugmodell aus Slot '+donor+' übernommen. Experimentell – bitte im Spiel prüfen.');}catch(e){message(errorText(e),true);}};
 document.querySelectorAll('[data-unlock]').forEach(b=>b.onclick=()=>{try{ready();const category=b.dataset.unlock;if(!confirm('Kategorie '+b.textContent+' für dieses Fahrzeug freischalten? Dies ist eine experimentelle Änderung.'))return;core.unlockCategory(state.save,state.garage,state.slot,category);dirty('Kategorie '+b.textContent+' für Slot '+state.slot+' freigeschaltet.');}catch(e){message(errorText(e),true);}});
 for(const id of ['saveTop','saveInner','saveFiles'])$(id).onclick=exportEdited;
 $('downloadBackup').onclick=backup;
}
window.UndergroundLabHost={get:()=>({loaded:state.loaded,original:state.original,originalSave:state.originalSave,profilePath:state.profilePath,garagePath:state.garagePath,filename:state.filename,zip:!!state.zip,save:state.save,garage:state.garage}),message,changed:dirty};
bind();
})();
