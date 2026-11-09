/* Underground Studio 0.5 — SAVE-ONLY experiment generator.
 * All transformations affect only a 20CM career profile and optional GARAGE.DAT.
 * Does NOT patch any game resources or claim real 500 km/h / x5 acceleration.
 * Source documentation: hackch/NFSU2-Savegame-Editor technical.md (2026-11-05).
 */
(function(root,factory){const API=factory(typeof require==='function'?require('./core.js'):root.NFSU2);if(typeof module!=='undefined'&&module.exports)module.exports=API;if(root)root.NFSU2SaveLab=API;})(typeof globalThis!=='undefined'?globalThis:this,function(S){
'use strict';
const PART_ACTIVE=Array.from({length:56},(_,i)=>i).filter(i=>i!==33&&i!==34);
// Highest level per conflicting group, plus independent add-ons. 56–67 (aero/body) untouched.
const PART_COMPAT=[0,1,2,3,4,5,6,7,10,11,14,16,19,20,21,22,23,24,25,28,30,35,36,37,39,42,43,44,45,47,48,49,50,51,52,55];
const METHODS=Object.freeze({id:'Traffic-ID allein',performance:'Traffic-ID + Performance-Kopie',configuration:'Traffic-ID + normale Fahrzeugkonfiguration',full:'Traffic-ID + fast kompletter Spieler-Slot',normal:'Normales Spenderfahrzeug als Kontrolltest'});
const TUNES=Object.freeze({none:'Unverändert',speed:'Geschwindigkeits-Fokus: erlaubte Extremwerte',accel:'Beschleunigungs-Fokus: erlaubte Extremwerte',mixed:'Gemischt: Sprint / hohe Gänge',curve:'Asymmetrische ECU-Kurve (Load-Ausgleich-Test)',raw255:'Rohwerte 255 (Clamp-Test)'});
const PARTS=Object.freeze({keep:'Teile unverändert',compatible:'Hohe kompatible Performance-Stufen + Uniques',all:'Alle 54 Performance-Flags gleichzeitig (Konflikt-Test)'});
function validateIndex(n){if(!Number.isInteger(n)||n<1||n>10)throw Error('Garagenslot muss 1 bis 10 sein.');}
function targetArray(s,g,n){validateIndex(n);if(n>5){S.assertGarage(g);return g;}S.assertCareer(s);return s;}
function base(n){return n<=5?S.OFF.slot+(n-1)*S.OFF.stride:S.OFF.garage+(n-6)*S.OFF.stride;}
function cloneInto(s,g,target,donor,stop){const from=targetArray(s,g,donor),to=targetArray(s,g,target);const a=base(target),b=base(donor);to.set(from.slice(b,b+stop),a);}
function patchParts(s,g,n,mode){if(mode==='keep')return;if(!(mode in PARTS))throw Error('Unbekannter Performance-Modus.');const bytes=targetArray(s,g,n),p=base(n);for(const i of PART_ACTIVE)bytes[p+0x310+i]=0;const selected=mode==='compatible'?PART_COMPAT:PART_ACTIVE;for(const i of selected)bytes[p+0x310+i]=1;const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);for(let i=0;i<9;i++)view.setUint32(p+0x2E8+i*4,1,true);}
function patchTune(s,g,n,mode){if(mode==='none')return;if(!(mode in TUNES))throw Error('Unbekannter Dyno-Modus.');const bytes=targetArray(s,g,n),p=base(n);for(let event=0;event<5;event++){
 const o=p+0x354+event*41;let final,gears,ecu,turbo;
 switch(mode){
 case 'speed': final=0;gears=[0,0,0,0,0,0];ecu=Array(9).fill(200);turbo=Array(9).fill(200);break;
 case 'accel':final=200;gears=[200,200,200,200,200,200];ecu=Array(9).fill(200);turbo=Array(9).fill(200);break;
 case 'mixed':final=50;gears=[200,200,140,100,0,0];ecu=Array(9).fill(200);turbo=Array(9).fill(200);break;
 case 'curve':final=100;gears=[100,100,100,100,100,100];ecu=[200,200,200,200,200,200,0,0,0];turbo=[200,200,200,200,200,200,0,0,0];break;
 case 'raw255':final=255;gears=[255,255,255,255,255,255];ecu=Array(9).fill(255);turbo=Array(9).fill(255);break;
 }
 bytes[o+9]=final;gears.forEach((v,i)=>bytes[o+10+i]=v);ecu.forEach((v,i)=>bytes[o+23+i]=v);turbo.forEach((v,i)=>bytes[o+32+i]=v);
 }
}
// Stock catalogue modification is an intentionally separate, high-risk save experiment.
// It clones one existing STOCK record into the next unused catalogue entry and points
// it at the traffic car's known index. The game may regenerate or reject that table.
function stockCatalogExperiment(s,traffic,donorIndex=0){const count=S.u32(s,0x4A4);if(count<1||count>=48)throw Error('Kein freier Stock-Katalogeintrag.');const src=0x24+donorIndex*0x18,dst=0x24+count*0x18;const d=new DataView(s.buffer,s.byteOffset,s.byteLength);s.set(s.slice(src,src+0x18),dst);d.setUint32(dst+4,S.carHash('STOCK_'+traffic.id),true);d.setUint32(dst+12,1,true);d.setUint32(dst+16,1,true);d.setInt32(dst+20,traffic.index,true);d.setUint32(0x4A4,count+1,true);return {oldCount:count,newCount:count+1};}
function diff(a,b){let total=0;const offsets=[];for(let i=0;i<a.length;i++)if(a[i]!==b[i]){total++;if(offsets.length<60)offsets.push('0x'+i.toString(16).toUpperCase());}return {total,offsets,truncated:total>60};}
function build({save,garage,slot=1,donor=4,trafficId='COUPE',method='full',tune='speed',parts='compatible',catalogue=false}){
 S.assertCareer(save);validateIndex(slot);validateIndex(donor);
 const origS=new Uint8Array(save),origG=garage?new Uint8Array(garage):null;
 const s=new Uint8Array(save),g=garage?new Uint8Array(garage):null;
 if(!(method in METHODS)||!(tune in TUNES)||!(parts in PARTS))throw Error('Unbekannte Testmethode.');
 const car=S.slotInfo(s,g,slot),source=S.slotInfo(s,g,donor);
 if(!car.owned||car.locked)throw Error('Zielslot muss belegt und freigeschaltet sein.');
 if(!source.owned||source.locked||source.traffic||!S.CARS.has(source.key))throw Error('Spender muss ein normales, entsperrtes Serienfahrzeug sein.');
 if(donor===slot&&method!=='id')throw Error('Spender und Ziel müssen verschieden sein.');
 const traffic=S.TRAFFIC.find(x=>x.id===trafficId);if(!traffic)throw Error('Unbekannte Traffic-ID.');
 switch(method){
 case 'id': S.setTraffic(s,g,slot,trafficId);break;
 case 'performance':S.setTraffic(s,g,slot,trafficId);if(slot!==donor)S.copyPerformance(s,g,slot,donor);break;
 case 'configuration':cloneInto(s,g,slot,donor,0x428);S.setTraffic(s,g,slot,trafficId);break;
 case 'full':cloneInto(s,g,slot,donor,0x7EA);S.setTraffic(s,g,slot,trafficId);break;
 case 'normal':cloneInto(s,g,slot,donor,0x7EA);break;
 }
 patchParts(s,g,slot,parts);patchTune(s,g,slot,tune);
 let catalogueResult=null;if(catalogue){if(method==='normal')throw Error('Katalogexperiment nur für Traffic.');catalogueResult=stockCatalogExperiment(s,traffic);}
 const finalCar=S.slotInfo(s,g,slot);if(method==='normal'){if(finalCar.key!==source.key)throw Error('Kontroll-Fahrzeug-ID falsch.');}else if(finalCar.key!==traffic.key)throw Error('Traffic-ID wurde nicht erhalten.');
 // 20CM three CRCs; nfsu2.xyz 64-bit FNV garage fingerprint.
 S.repairCareer(s);if(g)S.repairGarageFingerprint(s,g);
 if(!S.checkCareer(s).ok)throw Error('Ungültige Prüfsumme.');if(g&&!S.garagePairValid(s,g))throw Error('Ungültiger Garagen-Fingerprint.');
 return {save:s,garage:g,slot,donor,traffic,sourceKey:source.key,finalKey:finalCar.key,method,tune,parts,catalogue:catalogueResult,careerDiff:diff(origS,s),garageDiff:g?diff(origG,g):null};
}
const TEST_MATRIX=[
 {id:'T01_identitaet',label:'Traffic-ID allein / Basistest',method:'id',parts:'keep',tune:'none'},
 {id:'T02_performance',label:'Traffic-ID plus Spender-Performance',method:'performance',parts:'keep',tune:'none'},
 {id:'T03_konfiguration',label:'Traffic-ID plus normale Konfiguration',method:'configuration',parts:'keep',tune:'none'},
 {id:'T04_vollslot',label:'Traffic-ID plus kompletter Spender-Slot',method:'full',parts:'keep',tune:'none'},
 {id:'T05_vmax_versuch',label:'Traffic-ID + kompatible Teile + max. Speed-Tuning',method:'full',parts:'compatible',tune:'speed'},
 {id:'T06_beschleunigung',label:'Traffic-ID + kompatible Teile + max. Beschleunigungs-Tuning',method:'full',parts:'compatible',tune:'accel'},
 {id:'T07_alle_flags',label:'Traffic-ID + widersprüchliche Teile-Flags + rohe 255',method:'full',parts:'all',tune:'raw255'},
 {id:'T08_stock_katalog',label:'Traffic-ID + experimentell Stock-Katalogeintrag',method:'full',parts:'keep',tune:'none',catalogue:true},
 {id:'N01_vmax_kontrolle',label:'Normales Auto + kompatible Teile + Speed-Tuning',method:'normal',parts:'compatible',tune:'speed'},
 {id:'N02_sprint_kontrolle',label:'Normales Auto + kompatible Teile + Sprint-Tuning',method:'normal',parts:'compatible',tune:'accel'},
 {id:'N03_drehmomentkurve',label:'Normales Auto + asymmetrische ECU/Turbo-Kurven',method:'normal',parts:'compatible',tune:'curve'}
];
return {METHODS,TUNES,PARTS,TEST_MATRIX,PART_ACTIVE,PART_COMPAT,build,stockCatalogExperiment,diff};
});
