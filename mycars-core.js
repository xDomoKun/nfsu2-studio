/* Underground Studio | 20 saved "My Cars" configurations.
   Based on the user-supplied, in-game-tested 2014 Traffic Car Save File.
   G00 (all original 20 slots) and G01 (original coupe slot) confirmed
   to work on nfsu2.xyz by the user. Arbitrary slot relocation is EXPERIMENTAL.
   The profile's original CRCs are fixed by core.js during export. */
(function(root,factory){const api=factory(root.NFSU2);if(typeof module!=='undefined'&&module.exports)module.exports=api;if(root)root.UndergroundMyCars=api;})(typeof globalThis!=='undefined'?globalThis:this,function(core){
 'use strict';
 const BASE=0x4A8,STRIDE=0x430,COUNT=20,END=BASE+STRIDE*COUNT;
 const labels={
  'A90CA25B':['Pakettransporter','Parcel Van','van'], 'AAF20CDA':['Kompaktwagen','Hatchback 02','hatch'],
  '0294073B':['Traffic-Coupé','Coupe','coupe'], '7BC0CF17':['Taxi 02','Taxi 02','taxi'],
  '90035175':['Limousine 02','4DR Sedan 02','sedan'], '001D1775':['Taxi','Taxi','taxi'],
  'A69DA174':['Kastenwagen','Panel Van','van'],'72F17A0B':['Pickup','Pickup','pickup'],
  '0000DFFD':['Traffic-SUV','SUV','suv'],'43A98EA7':['Krankenwagen','Ambulance','emergency'],
  '83FBE66E':['Feuerwehr','Firetruck','truck'],'F27F6A53':['Limousine','4DR Sedan','sedan'],
  '000097A9':['Silver Eagle Bus','Bus','bus'], '0293FAD7':['Unbekanntes Sonderfahrzeug','Unbekannt','special'],
  '00000000':['Spezialkonfiguration ohne ID','Unbekannt','special']
 };
 const templates=typeof window!=='undefined'?window.UndergroundTrafficTemplates:null;
 const emptyTemplates=typeof window!=='undefined'?window.UndergroundEmptyTemplates:null;
 function assert(d){core.assertCareer(d);if(d.length<END)throw Error('Konfigurationsbereich fehlt.');return true;}
 function n(n){if(!Number.isInteger(n)||n<1||n>20)throw Error('Slot 1–20 erwartet.');return n;}
 const at=slot=>BASE+(n(slot)-1)*STRIDE;
 const hex=x=>core.hex(x);
 function meta(hash){let key=hex(hash);let t=labels[key];return {name:t?.[0]||core.CARS.get(key)||'Unbekanntes Fahrzeug',intern:t?.[1]||key,kind:t?.[2]||'regular',traffic:!!t&&key!=='00000000'&&key!=='0293FAD7',key};}
 function info(d,slot){assert(d);let off=at(slot),handle=core.u32(d,off+4),enabled=core.u32(d,off+12),type=core.u32(d,off+16),initialised=core.u32(d,off+20),hash=core.u32(d,off+28),m=meta(hash),active=!!handle&&!!enabled&&!!initialised;return {slot,off,handle,enabled,type,initialised,hash,active,...m};}
 function list(d){return Array.from({length:COUNT},(_,i)=>info(d,i+1));}
 function catalog(){if(!templates)throw Error('Original-Vorlagen fehlen.');const out=[];for(let i=1;i<=20;i++){const z=infoTemplate(i);if(z.active&&z.traffic)out.push(z);}return out;}
 function infoTemplate(slot){if(!templates)throw Error('Traffic-Vorlagen fehlen.');let off=(n(slot)-1)*STRIDE;let hash=core.u32(templates,off+28),handle=core.u32(templates,off+4);return {slot,hash,handle,active:!!handle&&!!core.u32(templates,off+12)&&!!core.u32(templates,off+20),...meta(hash)};}
 function getTemplateRecord(slot){n(slot);return templates.subarray((slot-1)*STRIDE,slot*STRIDE);}
 function install(d,sourceSlot,targetSlot=sourceSlot){assert(d);n(sourceSlot);n(targetSlot);if(!infoTemplate(sourceSlot).active)throw Error('Keine aktive Originalvorlage in diesem Slot.');const record=getTemplateRecord(sourceSlot);d.set(record,at(targetSlot));if(targetSlot!==sourceSlot){ // Tentative handle rebinding by original slot group; not confirmed in-game.
   let h=(targetSlot<=10?0x6996C982:0x9C6FFA29)+targetSlot;
   new DataView(d.buffer,d.byteOffset,d.byteLength).setUint32(at(targetSlot)+4,h>>>0,true);
  }
  return info(d,targetSlot);
 }
 function installAll(d){assert(d);if(!templates||templates.length!==COUNT*STRIDE)throw Error('Originalmod-Vorlagen fehlen.');d.set(templates,BASE);return list(d);}
 function clear(d,slot){assert(d);n(slot);if(!emptyTemplates||emptyTemplates.length!==COUNT*STRIDE)throw Error('Leervorlagen fehlen.');d.set(emptyTemplates.subarray((slot-1)*STRIDE,slot*STRIDE),at(slot));return info(d,slot);}
 function restore(d,original){assert(d);assert(original);d.set(original.subarray(BASE,END),BASE);return list(d);}
 function copy(d,source,target){assert(d);n(source);n(target);if(source===target)throw Error('Quelle und Ziel sind identisch.');const s=info(d,source);if(!s.active)throw Error('Quellslot enthält kein aktives Auto.');d.set(d.slice(at(source),at(source)+STRIDE),at(target));let h=(target<=10?0x6996C982:0x9C6FFA29)+target;new DataView(d.buffer,d.byteOffset,d.byteLength).setUint32(at(target)+4,h>>>0,true);return info(d,target);}
 return {BASE,STRIDE,COUNT,END,labels,assert,at,meta,info,list,catalog,infoTemplate,getTemplateRecord,install,installAll,clear,restore,copy};
});
