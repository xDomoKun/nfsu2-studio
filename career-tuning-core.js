/* Underground Studio 1.3 – Career traffic performance, save-only.
 * K01 and K03 slot 4 are user-confirmed driveable. Other combinations remain tests.
 * Source layout: hackch/NFSU2-Savegame-Editor technical.md.
 */
(function(root,factory){const api=factory(typeof require==='function'?require('./core.js'):root.NFSU2,typeof require==='function'?require('./career-traffic-core.js'):root.UndergroundCareerLab,typeof require==='function'?require('./mycars-core.js'):root.UndergroundMyCars);
if(typeof module!=='undefined'&&module.exports)module.exports=api;if(root)root.UndergroundCareerTuning=api;})(typeof globalThis!=='undefined'?globalThis:this,function(S,L,M){'use strict';
const NATIVE=0x5868,BASE=S.OFF.slot,STRIDE=S.OFF.stride;
const UNIQUE_REL=0x2e8,PART_REL=0x310,DYNO_REL=0x354;
const PERF_SIZE=68,EVENT_SIZE=41,EVENTS=5;
const PRESET_STAGE3=[0,1,2,3,4,5,6,7,10,11,14,16,20,21,22,23,24,25,28,30,35,36,37,39,42,43,44,45,48,49,50,51,52,55];
const SKYLINE_FLAGS=[...Array.from({length:33},(_,i)=>i),...Array.from({length:21},(_,i)=>i+35),58,61,64,67];
const PACKAGE_RANGES=[[0,5],[6,11],[12,14],[15,25],[26,28],[29,37],[38,44],[45,52],[53,55]];
const PACKAGES=[
  {name:'Weight',items:[0,1,2,3,4,5]},
  {name:'Transmission',items:[6,7,10,11]},
  {name:'NOS',items:[14]},
  {name:'Engine',items:[16,20,21,22,23,24,25]},
  {name:'Turbo',items:[28]},
  {name:'Suspension',items:[30,35,36,37]},
  {name:'Brakes',items:[39,42,43,44]},
  {name:'ECU',items:[45,48,49,50,51,52]},
  {name:'Tires',items:[55]}
];
function assertSlot(d,g,n){const c=S.slotInfo(d,g,n);if(!c.owned||c.locked)throw Error('The target garage slot must be owned and unlocked.');if(n>5)throw Error('Career Traffic tuning currently targets slots 1–5.');return {b:BASE+(n-1)*STRIDE,c};}
function sourceData(d,g,n){const c=S.slotInfo(d,g,n);if(!c.owned||c.locked||c.traffic)throw Error('Donor must be a regular, owned car.');return {from:n<=5?d:g,b:n<=5?BASE+(n-1)*STRIDE:S.OFF.garage+(n-6)*STRIDE,c};}
// Never change the traffic identity, visuals, initialized marker, or career purchase subobject.
function copyKnownPerformance(to,tb,from,fb){
  to.set(from.slice(fb+UNIQUE_REL,fb+UNIQUE_REL+36),tb+UNIQUE_REL);
  to.set(from.slice(fb+PART_REL,fb+PART_REL+PERF_SIZE),tb+PART_REL);
  to.set(from.slice(fb+DYNO_REL,fb+DYNO_REL+EVENTS*EVENT_SIZE),tb+DYNO_REL);
}
function read(d,g,n){const {b,c}=assertSlot(d,g,n);const parts=Array.from(d.slice(b+PART_REL,b+PART_REL+PERF_SIZE));
return {slot:n,model:c.model,hash:c.key,traffic:!!c.traffic,typeMask:S.u32(d,b-8+0x10),parts,unique:Array.from({length:9},(_,i)=>S.u32(d,b+UNIQUE_REL+i*4)),activeParts:parts.slice(0,56).filter(Boolean).length};}
function fromDonor(d,g,target,donor){const {b,c}=assertSlot(d,g,target);const src=sourceData(d,g,donor);if(!c.traffic)throw Error('Select a Traffic Car in the career garage.');copyKnownPerformance(d,b,src.from,src.b);return src.c;}
function setUniq(d,g,n,i,value){const {b,c}=assertSlot(d,g,n);if(!c.traffic)throw Error('Select a Traffic Car.');if(!Number.isInteger(i)||i<0||i>=9)throw Error('Invalid unique upgrade index.');const view=new DataView(d.buffer,d.byteOffset,d.byteLength);view.setUint32(b+UNIQUE_REL+i*4,value?1:0,true);}
function setPart(d,g,n,i,value){const {b,c}=assertSlot(d,g,n);if(!c.traffic)throw Error('Select a Traffic Car.');if(!Number.isInteger(i)||i<0||i>=56)throw Error('Invalid performance part.');d[b+PART_REL+i]=value?1:0;}
function stage3(d,g,n){const {b,c}=assertSlot(d,g,n);if(!c.traffic)throw Error('Select a Traffic Car.');d.fill(0,b+PART_REL,b+PART_REL+56);for(const i of PRESET_STAGE3)d[b+PART_REL+i]=1;for(let i=0;i<9;i++)setUniq(d,g,n,i,true);}
function allUniques(d,g,n){for(let i=0;i<9;i++)setUniq(d,g,n,i,true);}
function skylineReference(d,g,n){const {b,c}=assertSlot(d,g,n);if(!c.traffic)throw Error('Select a Traffic Car.');d.fill(0,b+PART_REL,b+PART_REL+PERF_SIZE);for(const i of SKYLINE_FLAGS)d[b+PART_REL+i]=1;for(let i=0;i<9;i++)setUniq(d,g,n,i,true);d.fill(100,b+DYNO_REL,b+DYNO_REL+EVENT_SIZE*EVENTS);}
function stage3Category(d,g,n,category){if(!Number.isInteger(category)||category<0||category>=PACKAGES.length)throw Error('Invalid category.');const {b,c}=assertSlot(d,g,n);if(!c.traffic)throw Error('Select a Traffic Car.');const [start,end]=PACKAGE_RANGES[category];d.fill(0,b+PART_REL+start,b+PART_REL+end+1);for(const i of PACKAGES[category].items)d[b+PART_REL+i]=1;setUniq(d,g,n,category,true);}

function purchaseFlags(d,g,n){const {b,c}=assertSlot(d,g,n);if(!c.traffic)throw Error('Select a Traffic Car.');d.fill(0xff,b+0x586,b+0x58f);}
function convert(d,g,{slot=4,source=6,variant='K01_ORIGINAL',tuning='original',donor=4}={}){
 if(!['K01_ORIGINAL','K03_BOTH'].includes(variant))throw Error('Only user-verified K01 and K03 are supported here.');
 let donorSnap=null;
 if(tuning==='donor'){const src=sourceData(d,g,donor);donorSnap={bytes:new Uint8Array(src.from),b:src.b};}
 const p=L.make(d,g,{source,target:slot,variant});
 // The known-good K01/K03 files also contained the matching G01 generic slot.
 // Install this same original My Cars record so the baseline is byte-identical.
 M.install(p.save,source);
 if(source===6){
   // K01/K03 original user-tested ZIPs contain this tuned G01 configuration.
   // Keep the exact observed generic record; this changes no career physics fields.
   const gb=M.at(6),v=new DataView(p.save.buffer,p.save.byteOffset,p.save.byteLength);
   for(let i=0;i<9;i++)v.setUint32(gb+0x2f0+i*4,1,true);
   for(const i of [30,35,36,37])p.save[gb+0x318+i]=1;
   p.save[gb+0x35c+41+9]=183;
 }
 if(tuning==='donor')copyKnownPerformance(p.save,BASE+(slot-1)*STRIDE,donorSnap.bytes,donorSnap.b);
 else if(tuning==='stage3')stage3(p.save,p.garage,slot);
 else if(tuning==='unique')allUniques(p.save,p.garage,slot);
 else if(tuning!=='original')throw Error('Unknown tuning profile.');
 S.repairCareer(p.save);if(p.garage)S.repairGarageFingerprint(p.save,p.garage);
 if(!S.checkCareer(p.save).ok||p.garage&&!S.garagePairValid(p.save,p.garage))throw Error('Invalid converted save.');
 if(S.slotInfo(p.save,p.garage,slot).key!==S.TRAFFIC.find(t=>t.id==='COUPE').key&&source===6)throw Error('Traffic identity was changed unexpectedly.');
 return p;
}
function applyPreset(d,g,n,preset,donor){if(preset==='donor')return fromDonor(d,g,n,donor);
 if(preset==='stage3')return stage3(d,g,n);
 if(preset==='skyline')return skylineReference(d,g,n);
 if(preset==='unique')return allUniques(d,g,n);
 if(preset==='ownership')return purchaseFlags(d,g,n);
 throw Error('Unknown preset.');}
return {PRESET_STAGE3,PACKAGES,SKYLINE_FLAGS,PERF_SIZE,read,fromDonor,setUniq,setPart,stage3,stage3Category,skylineReference,allUniques,purchaseFlags,convert,applyPreset,copyKnownPerformance};});
