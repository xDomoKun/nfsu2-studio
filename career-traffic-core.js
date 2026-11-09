/* Career payload migration lab. Every variant uses a known working generic
 * traffic donor. No runtime/class/collision fixes are claimed. */
(function(root,factory){const a=factory(typeof require==='function'?require('./core.js'):root.NFSU2,typeof require==='function'?require('./mycars-core.js'):root.UndergroundMyCars);if(typeof module!=='undefined'&&module.exports)module.exports=a;if(root)root.UndergroundCareerLab=a;})(typeof globalThis!=='undefined'?globalThis:this,function(S,M){'use strict';
const VARIANTS=[
{id:'K01_ORIGINAL',label:'G01-Originalkonfiguration mit Karriere-Typ',start:0x14,end:0x430},
{id:'K02_GENERIC',label:'G01-Originalkonfiguration mit Generic-Typ 2',start:0x14,end:0x430,type:2},
{id:'K03_BOTH',label:'G01-Originalkonfiguration mit beiden Typbits 6',start:0x14,end:0x430,type:6},
{id:'K04_HANDLE',label:'G01-Originalkonfiguration mit Generic-Handle',start:0x14,end:0x430,handle:true}
];
function make(save,garage,{source=6,target=4,variant='K01_CONFIG'}={}){
 S.assertCareer(save);const m=M.infoTemplate(source),v=VARIANTS.find(v=>v.id===variant);if(!m.active||!m.traffic)throw Error('Quelle muss eine aktive Traffic-Mod-Vorlage sein.');if(!v)throw Error('Unbekannter Karrieretest.');if(!Number.isInteger(target)||target<1||target>5)throw Error('Nur Karriere-Slots 1–5.');const c=S.slotInfo(save,garage,target);if(!c.owned||c.locked)throw Error('Karriere-Ziel muss ein gekauftes, entsperrtes Fahrzeug sein.');
 const out=new Uint8Array(save),g=garage?new Uint8Array(garage):null,from=M.getTemplateRecord(source),native=S.OFF.slot+(target-1)*S.OFF.stride-8;
 // Source and career are both native configuration structures; career's +0x432
 // purchase subobject and original CAREER_SLOT handle MUST be preserved.
 out.set(from.subarray(v.start,v.end),native+v.start);
 const view=new DataView(out.buffer,out.byteOffset,out.byteLength);
 if(v.type)view.setUint32(native+0x10,v.type,true);
 if(v.handle)view.setUint32(native+0x04,S.u32(from,0x04),true);
 // Keep bought/unlocked and every career purchase/reward byte unchanged.
 S.repairCareer(out);if(g)S.repairGarageFingerprint(out,g);
 if(!S.checkCareer(out).ok||g&&!S.garagePairValid(out,g))throw Error('Exportprüfung fehlgeschlagen.');
 return {save:out,garage:g,source,target,variant:v,originalName:c.model,trafficName:m.name,carHash:S.u32(out,native+0x1c)};
}
return {VARIANTS,make};});
