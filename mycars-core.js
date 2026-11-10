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
  '000097A9':['Silver Eagle Bus','Bus','bus'],
  '00000000':['Spezialkonfiguration ohne ID','Unbekannt','special']
 };
 const templates=typeof window!=='undefined'?window.UndergroundTrafficTemplates:null;
 const emptyTemplates=typeof window!=='undefined'?window.UndergroundEmptyTemplates:null;
 function assert(d){core.assertCareer(d);if(d.length<END)throw Error('Konfigurationsbereich fehlt.');return true;}
 function n(n){if(!Number.isInteger(n)||n<1||n>20)throw Error('Slot 1–20 erwartet.');return n;}
 const at=slot=>BASE+(n(slot)-1)*STRIDE;
 const hex=x=>core.hex(x);
 function meta(hash){
  const key=hex(hash),t=labels[key],known=core.TRAFFIC.find(x=>x.key===key);
  const kind={PANELVAN:'van',PARCELVAN:'van',MINIVAN:'van',BUS:'bus',COUPE:'coupe',FIRETRUCK:'truck',PICKUP:'pickup',SUV:'suv',AMBULANCE:'emergency',TAXI:'taxi',TAXI02:'taxi','4DR_SEDAN':'sedan','4DR_SEDAN02':'sedan',HATCHBACK:'hatch',HATCHBACK02:'hatch'};
  return {name:known?.name||t?.[0]||core.CARS.get(key)||'Unbekanntes Fahrzeug',
    intern:known?.id||t?.[1]||key,kind:known?kind[known.id]:(t?.[2]||'regular'),traffic:!!known,key};
 }
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
 function installAll(d){assert(d);if(!templates||templates.length!==COUNT*STRIDE)throw Error('Originalmod-Vorlagen fehlen.');d.set(window.UndergroundOriginalTrafficTemplates||templates,BASE);return list(d);}
 function clear(d,slot){assert(d);n(slot);if(!emptyTemplates||emptyTemplates.length!==COUNT*STRIDE)throw Error('Leervorlagen fehlen.');d.set(emptyTemplates.subarray((slot-1)*STRIDE,slot*STRIDE),at(slot));return info(d,slot);}
 function restore(d,original){assert(d);assert(original);d.set(original.subarray(BASE,END),BASE);return list(d);}
 function copy(d,source,target){assert(d);n(source);n(target);if(source===target)throw Error('Quelle und Ziel sind identisch.');const s=info(d,source);if(!s.active)throw Error('Quellslot enthält kein aktives Auto.');d.set(d.slice(at(source),at(source)+STRIDE),at(target));let h=(target<=10?0x6996C982:0x9C6FFA29)+target;new DataView(d.buffer,d.byteOffset,d.byteLength).setUint32(at(target)+4,h>>>0,true);return info(d,target);}

 // Arbitrary 20-slot Quick Race configuration writer. Generic car records and
 // career records share the payload, but their first five header dwords differ.
 // Models without a same-identity donor require experimental default generation.
 function catalogAll(){
   const normals=[...core.CARS.entries()].map(([key,name])=>({id:'N:'+key,key,name,kind:'regular',traffic:false}));
   const traffic=core.TRAFFIC.map(x=>({id:'T:'+x.id,key:x.key,name:x.name,kind:meta(x.hash).kind,traffic:true,source:catalog().find(t=>t.key===x.key)?.slot||null}));
   return {normals,traffic,all:[...normals,...traffic]};
 }
 function nativeHandle(slot){return ((slot<=10?0x6996C982:0x9C6FFA29)+slot)>>>0;}
 function bindRecord(d,slot){
   const b=at(slot);core.w32?core.w32(d,b+4,nativeHandle(slot)):
      new DataView(d.buffer,d.byteOffset,d.byteLength).setUint32(b+4,nativeHandle(slot),true);
   const v=new DataView(d.buffer,d.byteOffset,d.byteLength);
   v.setUint32(b+12,1,true);v.setUint32(b+16,2,true);v.setUint32(b+20,1,true);
 }
 function installAny(d,garage,slot,modelId){
   assert(d);n(slot);if(typeof modelId!=='string'||!/^([NT]):[A-Z0-9_]+$/.test(modelId))throw Error('Invalid car selection.');
   const selection=catalogAll().all.find(x=>x.id===modelId);if(!selection)throw Error('Unknown vehicle model.');
   if(selection.traffic){if(!selection.source)throw Error('No complete Traffic Car template available.');
     const result=install(d,selection.source,slot);return {...result,method:'traffic-template',experimental:slot!==selection.source};}
   const dest=at(slot),saved=d.slice(dest,dest+STRIDE);
   const v=new DataView(d.buffer,d.byteOffset,d.byteLength);
   // Prefer same-identity generic configuration, then a matching owned career car.
   let source=null,method='';
   for(let i=1;i<=COUNT;i++){
     if(i===slot)continue;const c=info(d,i);if(c.active&&!c.traffic&&c.key===selection.key){source=d.slice(at(i),at(i)+STRIDE);method='same-model-arcade';break;}
   }
   const available=garage?10:5;
   if(!source){for(let i=1;i<=available;i++){
     const car=core.slotInfo(d,garage,i);if(!car.owned||car.locked||car.key!==selection.key)continue;
     const cd=i<=5?d:garage,b=(i<=5?core.OFF.slot:core.OFF.garage)+(i<=5?i-1:i-6)*core.OFF.stride;
     source=new Uint8Array(STRIDE);source.set(saved.subarray(0,0x1c),0);
     // Payload starts +0x14 in career vs +0x1c in generic.
     source.set(cd.subarray(b+0x14,b+0x421),0x1c);
     method='same-model-career';break;
   }}
   if(!source){
     // No genuine same-model payload is available: synthesize a generic stock
     // appearance from the closest available *normal* config. Experimental.
     const seed=Array.from({length:COUNT},(_,i)=>info(d,i+1)).find(x=>x.active&&!x.traffic);
     if(seed)source=d.slice(at(seed.slot),at(seed.slot)+STRIDE);
     else {
       let donor=null;
       for(let i=1;i<=available;i++){const c=core.slotInfo(d,garage,i);if(c.owned&&!c.locked&&!c.traffic){donor=i;break;}}
       if(donor){const cd=donor<=5?d:garage,b=(donor<=5?core.OFF.slot:core.OFF.garage)+(donor<=5?donor-1:donor-6)*core.OFF.stride;
         source=new Uint8Array(STRIDE);source.set(saved.subarray(0,0x1c));source.set(cd.subarray(b+0x14,b+0x421),0x1c);
       } else {const first=Array.from({length:COUNT},(_,i)=>info(d,i+1)).find(x=>x.active);
         source=first?d.slice(at(first.slot),at(first.slot)+STRIDE):new Uint8Array(getTemplateRecord(6));
       }
     }
     // Remove donor-dependent visual hashes and installed modifications.
     source.fill(0,0x20,0x2c8);source.fill(0,0x2f0,0x318);source.fill(0,0x318,0x35c);
     // Preserve per-event structural bytes, neutralize only documented knobs.
     for(let e=0;e<5;e++){const base=0x35c+e*41;for(let j=9;j<=15;j++)source[base+j]=100;
       for(let j=23;j<=40;j++)source[base+j]=100;}
     method='generated-stock-experimental';
   }
   // No partial updates: produce record first, then replace atomically.
   const newRecord=new Uint8Array(source);
   new DataView(newRecord.buffer).setUint32(0x1c,Number.parseInt(selection.key,16)>>>0,true);
   d.set(newRecord,dest);bindRecord(d,slot);
   const out=info(d,slot);
   if(!out.active||out.key!==selection.key){d.set(saved,dest);throw Error('Failed to initialize the selected arcade model.');}
   return {...out,method,experimental:method==='generated-stock-experimental'};
 }
 return {BASE,STRIDE,COUNT,END,labels,assert,at,meta,info,list,catalog,infoTemplate,getTemplateRecord,install,installAny,catalogAll,installAll,clear,restore,copy};
});
