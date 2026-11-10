/* Browser-only UI for confirmed G00/G01 My Cars configuration experiment. */
(()=>{'use strict';
const C=window.UndergroundMyCars,core=window.NFSU2,$=id=>document.getElementById(id);
let selectedSlot=6,selectedTemplate=6,selectedModel='T:COUPE',previewChoice=false,filter='all',search='',catalogSearch='',catalogType='all',undo=null;
const originalCatalog=C.catalog();
const catalog=C.catalogAll().all;
const label=n=>n===1?'Konfigurationsplatz':'Konfigurationsplätze';
const fmt=i=>String(i).padStart(2,'0');
const stat=(name,value)=>`<div class="mc-stat"><span>${name}</span><strong>${value}</strong></div>`;
const menuCarIcon='<svg class="nfs-icon mc-mini-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true"><path d="M3 14.5 5.7 9h12.6l2.7 5.5V19h-2v-2H5v2H3v-4.5Z"/><path d="m6.5 9 2-4h7l2 4M4 14h4m8 0h4"/><circle cx="7" cy="17" r=".8" fill="currentColor" stroke="none"/><circle cx="17" cy="17" r=".8" fill="currentColor" stroke="none"/></svg>';
const menuBusIcon='<svg class="nfs-icon mc-mini-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true"><rect x="3.5" y="5" width="8" height="7" rx="1"/><rect x="12.5" y="12" width="8" height="7" rx="1"/><path d="M12 5h8v5M4 15v5h6"/></svg>';
const menuEmergencyIcon='<svg class="nfs-icon mc-mini-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true"><path d="M12 4v16M4 12h16"/></svg>';
const labels={coupe:'COUPÉ',taxi:'TAXI',sedan:'SEDAN',hatch:'HATCHBACK',van:'VAN',truck:'TRUCK',bus:'BUS',pickup:'PICKUP',suv:'SUV',emergency:'EMERGENCY',regular:'STREET',special:'SPECIAL'};
function shape(kind){
 const b={bus:'M44 85 L62 42 Q66 34 85 34 L415 34 Q437 36 448 56 L459 87 Z',van:'M46 87 L64 63 L72 45 Q77 37 96 37 H337 Q358 37 372 54 L423 64 L453 86 Z',truck:'M43 87 L58 59 H165 L188 36 H330 L360 58 H439 L454 89 Z',pickup:'M42 90 L53 72 H143 L173 38 H320 L349 70 H458 L459 90 Z',coupe:'M42 90 L80 74 L166 40 Q183 35 220 35 H304 Q332 36 363 61 L431 76 L459 90 Z',taxi:'M42 89 L80 72 L128 45 Q142 37 164 37 H313 L365 70 L446 79 L458 92 Z',emergency:'M44 89 L70 52 Q75 39 94 39 H339 L372 67 L446 78 L457 92 Z',suv:'M40 91 L66 65 L85 42 H353 L375 67 H448 L461 93 Z',sedan:'M41 89 L75 72 L129 46 Q140 38 164 38 H331 L379 73 L451 80 L459 93 Z',hatch:'M46 90 L78 70 L115 46 Q133 39 159 39 H325 L382 77 L452 82 L462 93 Z',regular:'M43 90 L82 71 L149 42 H325 L384 76 L449 81 L460 92 Z'};
 const path=b[kind]||b.sedan,wide=['bus','van','suv','emergency','truck'].includes(kind);
 const glass=kind==='bus'?'<path d="M90 45H406V66H90Z" fill="#111b23" stroke="#708b8e" stroke-width="2"/><path d="M145 45V66M199 45V66M253 45V66M307 45V66M361 45V66" stroke="#789196" stroke-width="3"/>':`<path d="M${wide?104:154} 47 H${wide?332:305} L${wide?351:351} 69 H${wide?94:119}Z" fill="#131e25" stroke="#70949b" stroke-width="2"/>`;
 const mark=kind==='taxi'?'<path d="M216 32H260L252 20H224Z" fill="#f3c543"/><text x="242" y="29" font-size="7" text-anchor="middle" font-weight="900" fill="#151913">TAXI</text>':kind==='emergency'||kind==='truck'?'<rect x="239" y="26" width="49" height="9" rx="2" fill="#d5ff67"/>':'';
 return `<svg class="mc-car-svg" viewBox="0 0 500 162" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="bodygrad" x1=".1" y1=".1" x2=".8" y2="1"><stop stop-color="#cddada"/><stop offset=".5" stop-color="#798f93"/><stop offset="1" stop-color="#485b60"/></linearGradient><linearGradient id="gloss" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#f3ffba" stop-opacity=".46"/><stop offset="1" stop-color="#7b8775" stop-opacity="0"/></linearGradient></defs><ellipse cx="250" cy="120" rx="218" ry="12" fill="#000" opacity=".32"/><path d="${path}" fill="url(#bodygrad)" stroke="#d0dfe0" stroke-width="2.5" stroke-linejoin="round"/>${glass}<path d="M55 85H445V91H55Z" fill="url(#gloss)"/><path d="M60 91H445" stroke="#c7f85b" stroke-width="3" opacity=".85"/><rect x="47" y="79" width="16" height="8" rx="2" fill="#e8ffb7"/><rect x="445" y="79" width="12" height="8" rx="2" fill="#fe9163"/>${mark}<circle cx="131" cy="95" r="25" fill="#161c22" stroke="#9fabae" stroke-width="4"/><circle cx="131" cy="95" r="12" fill="#65757a" stroke="#d0dada" stroke-width="3"/><circle cx="381" cy="95" r="25" fill="#161c22" stroke="#9fabae" stroke-width="4"/><circle cx="381" cy="95" r="12" fill="#65757a" stroke="#d0dada" stroke-width="3"/></svg>`;
}
function activeContext(){const h=window.UndergroundLabHost?.get();if(!h||!h.loaded)return null;return h;}
function notify(msg){window.UndergroundLabHost?.changed(msg);}
function recordUndo(s){undo={slice:s.save.slice(C.BASE,C.END),when:Date.now()};}
function execute(note,mutator){const s=activeContext();if(!s)return;try{recordUndo(s);mutator(s.save);notify(note);render();}catch(e){undo=null;window.UndergroundLabHost.message(e.message,true);}}
function chooseTemplate(){return catalog.find(x=>x.id===selectedModel)||catalog.find(x=>x.id==='T:COUPE')||catalog[0];}
function renderCatalog(){const el=$('mcTemplates');el.replaceChildren();
 const shown=catalog.filter(c=>(catalogType==='all'||(catalogType==='normal'&&!c.traffic)||(catalogType==='traffic'&&c.traffic))&&(c.name.toLowerCase().includes(catalogSearch.toLowerCase())||c.key.toLowerCase().includes(catalogSearch.toLowerCase())||c.id.toLowerCase().includes(catalogSearch.toLowerCase())));
 for(const car of shown){const btn=document.createElement('button');btn.className='mc-template'+(selectedModel===car.id?' selected':'');btn.type='button';
 btn.innerHTML=`<span class="mc-template-icon">${car.kind==='bus'?menuBusIcon:car.kind==='emergency'?menuEmergencyIcon:menuCarIcon}</span><span class="mc-template-copy"><b></b><small></small></span><span class="mc-template-tick"><svg class="nfs-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true"><path d="m8 5 7 7-7 7"/></svg></span>`;
 btn.querySelector('b').textContent=car.name;
 btn.querySelector('small').textContent=car.traffic?'TRAFFIC · '+(car.source?'MOD #'+fmt(car.source):'NO TEMPLATE'):'STREET CAR';
 const art=window.USCarImages?.make(car.key,'','mc-template-vehicle-art');if(art){art.alt='';btn.insertBefore(art,btn.querySelector('.mc-template-copy'));}
 btn.onclick=()=>{selectedModel=car.id;previewChoice=true;if(car.source)selectedTemplate=car.source;render();};el.append(btn);}
 $('mcCatalogCount').textContent=shown.length+' / '+catalog.length;
}
function renderSlots(s){const all=C.list(s.save),el=$('mcSlots');el.replaceChildren();const shown=all.filter(c=>(filter==='all'||(filter==='occupied'&&c.active)||(filter==='traffic'&&c.active&&c.traffic)||(filter==='empty'&&!c.active))&&(String(c.slot).includes(search)||c.name.toLowerCase().includes(search.toLowerCase())||c.key.toLowerCase().includes(search.toLowerCase())));
 for(const c of shown){const b=document.createElement('button');b.type='button';b.className='mc-slot'+(c.active?' is-active':'')+(c.slot===selectedSlot?' is-selected':'');b.innerHTML=`<span class="mc-slot-number">${fmt(c.slot)}</span><span class="mc-slot-symbol">${c.active?menuCarIcon:'+'}</span><span class="mc-slot-name"></span><span class="mc-slot-state"></span>`;b.querySelector('.mc-slot-name').textContent=c.active?c.name:'LEER';b.querySelector('.mc-slot-state').textContent=c.active?(c.traffic?'TRAFFIC':'CUSTOM'):'FREI';
  if(c.active){const art=window.USCarImages?.make(c.key,'','mc-slot-car-image');if(art){art.alt='';b.classList.add('has-car-image');b.querySelector('.mc-slot-symbol').replaceChildren();b.insertBefore(art,b.querySelector('.mc-slot-name'));}}
  b.onclick=()=>{selectedSlot=c.slot;render();};el.append(b);}
 $('mcNoResults').classList.toggle('hidden',!!shown.length);$('mcCount').textContent=all.filter(x=>x.active).length+' / 20';$('mcTrafficCount').textContent=all.filter(x=>x.active&&x.traffic).length;
}
function renderInspector(s){const c=C.info(s.save,selectedSlot),t=chooseTemplate();$('mcCurrentSlot').textContent='SLOT '+fmt(selectedSlot);$('mcCurrentStatus').textContent=c.active?(c.traffic?'TRAFFIC CAR':'CUSTOM CAR'):'LEERER SLOT';$('mcCurrentStatus').dataset.state=c.active?'on':'off';$('mcCurrentName').textContent=c.active?c.name:'Kein Fahrzeug gespeichert';$('mcCurrentId').textContent=c.active?'0x'+c.key:'–';$('mcCurrentHandle').textContent=c.active?'0x'+core.hex(c.handle):'–';$('mcPreview').innerHTML=shape(c.active?c.kind:t.kind);$('mcPreviewLabel').textContent=c.active?(labels[c.kind]||'CUSTOM'):(labels[t.kind]||'TRAFFIC')+' / PREVIEW';$('mcTemplateName').textContent=t.name;$('mcTemplateSource').textContent=t.traffic?(t.source?'Traffic-Mod · Originalplatz '+fmt(t.source):'Traffic · no template'):'Street Car · Career / Stock source';
 $('mcInstallAtNative').classList.toggle('hidden',!t.traffic||!t.source);$('mcInstallAtNative').disabled=!t.traffic||!t.source;$('mcInstallAtNative').innerHTML='<span>ORIGINALPLATZ '+fmt(t.source||1)+'</span>';$('mcInstallAtSelected').innerHTML='<span>INSTALL IN SLOT '+fmt(selectedSlot)+'</span>'; 
 $('mcRemove').disabled=!c.active;$('mcCopy').disabled=!c.active;
 $('mcCopyTarget').replaceChildren();for(let i=1;i<=20;i++){if(i===selectedSlot)continue;const opt=document.createElement('option');opt.value=i;opt.textContent='Slot '+fmt(i)+(C.info(s.save,i).active?' · belegt':' · frei');$('mcCopyTarget').append(opt);}
 $('mcUndo').disabled=!undo;
}
function render(){const s=activeContext();$('mcEmpty').classList.toggle('hidden',!!s);$('mcReady').classList.toggle('hidden',!s);if(!s){$('mcCount').textContent='– / 20';$('mcTrafficCount').textContent='–';renderCatalog();return;}renderSlots(s);renderInspector(s);renderCatalog();window.USExtra?.render(selectedSlot,selectedTemplate);}
function onImported(){selectedSlot=6;selectedTemplate=6;selectedModel='T:COUPE';previewChoice=false;undo=null;render();}
function askOverwrite(save,slot){const c=C.info(save,slot);return !c.active||confirm(`Slot ${fmt(slot)} ist bereits mit „${c.name}“ belegt. Wirklich überschreiben?`);}
function bind(){
 $('mcOpen').onclick=$('mcLoadEmpty').onclick=()=>$('fileInput').click();
 $('mcExport').onclick=()=>$('saveTop').click();
 $('mcSearch').oninput=e=>{search=e.target.value.trim();render();};
 $('mcFilter').onchange=e=>{filter=e.target.value;render();};
 $('mcCatalogSearch').oninput=e=>{catalogSearch=e.target.value.trim();renderCatalog();};
 $('mcCatalogType').onchange=e=>{catalogType=e.target.value;renderCatalog();};
 $('mcInstallAtNative').onclick=()=>{const s=activeContext(),t=chooseTemplate();if(!s||!t.traffic||!t.source)return;if(!askOverwrite(s.save,t.source))return;
   selectedSlot=t.source;execute(`Original Traffic Car ${t.name} restored at slot ${fmt(t.source)}.`,d=>C.install(d,t.source));};
 $('mcInstallAtSelected').onclick=()=>{const s=activeContext(),t=chooseTemplate();if(!s||!t)return;
   if(!t.traffic&&!C.info(s.save,selectedSlot).active){/* empty is supported */}
   if(!askOverwrite(s.save,selectedSlot))return;
   // Moving original generic slots or generating stock car records is not yet
   // proven by an actual NFSU2 race; keep that warning explicit.
   if(!confirm(`Install ${t.name} in My Cars slot ${fmt(selectedSlot)}?\n\nFree slot assignment is experimental. Export a backup and test in-game.`))return;
   execute(`${t.name} installed in arcade slot ${fmt(selectedSlot)} (save-format verified; in-game test pending).`,d=>C.installAny(d,s.garage,selectedSlot,t.id));};
 $('mcInstallAll').onclick=()=>{if(!activeContext())return;if(!confirm('Alle 20 „Meine Autos“-Datensätze durch den originalen, in G00 funktionierenden Traffic-Mod ersetzen? Bestehende Meine-Autos-Konfigurationen werden dadurch überschrieben.'))return;selectedSlot=6;execute('Komplette Original-20er-Konfiguration übernommen (bestätigte G00-Methode).',C.installAll);};
 $('mcInstallCoupe').onclick=()=>{selectedModel='T:COUPE';selectedTemplate=6;$('mcInstallAtSelected').click();};
 $('mcRemove').onclick=()=>{const s=activeContext();if(!s)return;if(!confirm(`Slot ${fmt(selectedSlot)} löschen? Die gespeicherte Fahrzeugkonfiguration wird durch den neutralen Original-Slot ersetzt. Nur mit Backup importieren.`))return;execute('My-Cars-Slot '+fmt(selectedSlot)+' zurückgesetzt.',d=>C.clear(d,selectedSlot));};
 $('mcCopy').onclick=()=>{const s=activeContext();if(!s)return;const target=Number($('mcCopyTarget').value),source=selectedSlot;if(!target||!Number.isInteger(target))return;if(!confirm(`EXPERIMENT: Konfiguration ${fmt(source)} auf Platz ${fmt(target)} kopieren? Eine Platzverschiebung ist bisher nicht im Spiel bestätigt.`))return;if(!askOverwrite(s.save,target))return;selectedSlot=target;execute('Konfiguration kopiert – experimentelle Platzverschiebung.',d=>C.copy(d,source,target));};
 $('mcReset').onclick=()=>{const s=activeContext();if(!s)return;if(!confirm('Den gesamten „Meine Autos“-Bereich exakt auf den Stand beim Import zurücksetzen? Deine Karriere bleibt unverändert.'))return;execute('„Meine Autos“ auf Importzustand zurückgesetzt.',d=>C.restore(d,s.originalSave));};
 $('mcUndo').onclick=()=>{const s=activeContext();if(!s||!undo)return;s.save.set(undo.slice,C.BASE);undo=null;notify('Letzte Meine-Autos-Aktion rückgängig gemacht.');render();};
}
bind();window.UndergroundTrafficUI={render,onImported,selectedModel:()=>chooseTemplate(),previewSelected:()=>previewChoice};render();
})();
