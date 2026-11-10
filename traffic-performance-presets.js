/* Underground Studio v1.7.12 — Save-only Traffic Performance Test Bench.
 * B03 is a subjective, in-game favorite confirmed on the Career Traffic Coupe.
 * All other Traffic Cars and B03 derivatives are experiments; this never edits
 * vehicle identity/appearance/purchase flags or the game engine's physics.
 * K01 remains byte-for-byte compatible with the v1.7.6 Coupe preset.
 */
(function(root,factory){
 const api=factory(typeof require==='function'?require('./core.js'):root.NFSU2);
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.UndergroundTrafficPresets=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(S){'use strict';
 const PART_HEX='0101010101010101000001010000010001000001010101010101000001000000000000000000000100000101010100010101010101000001000000000000000000000000';
 const UNIQUE=0x2e8,PARTS=0x310,DYNO=0x354;
 const ECU=[0,0,100,200,200,200,100,0,0];
 const TURBO_HIGH=[0,0,100,200,200,200,200,100,0];
 // P01 is a controlled, UNVERIFIED wider 200-capped ECU/Turbo test.
 // The engine can clamp or ignore it; displayed ratings are not road tests.
 const POWER_WIDE=[0,100,200,200,200,200,200,100,0];
 const PART_BYTES=new Uint8Array(PART_HEX.match(/../g).map(x=>parseInt(x,16)));
 if(PART_BYTES.length!==68)throw Error('Invalid reference performance flags.');
 const MODES=new Set(['original','stock','boost','final105','final125','turboHigh','powerWide','handling','powerHandling','diagU5','diagU6','diagU8','diagStage']);
 const TESTS=[
   {id:'boost',en:'B03 · COUPE TEST FAVORITE',de:'B03 · COUPÉ-TESTFAVORIT',purpose:'reference'},
   {id:'final105',en:'G01 · LONGER FINAL DRIVE (105)',de:'G01 · LÄNGERE ENDÜBERSETZUNG (105)',purpose:'top speed test'},
   {id:'final125',en:'G02 · SHORTER FINAL DRIVE (125)',de:'G02 · KÜRZERE ENDÜBERSETZUNG (125)',purpose:'acceleration test'},
   {id:'turboHigh',en:'T01 · HIGH-RPM TURBO (TEST)',de:'T01 · HOCHDREHZAHL-TURBO (TEST)',purpose:'turbo curve test'},
   {id:'powerWide',en:'P01 · WIDE POWER BAND (DRIVABLE)',de:'P01 · BREITES LEISTUNGSBAND (FAHRBAR)',purpose:'ECU and Turbo curve test'},
   {id:'diagU5',en:'D01 · UNIQUE FLAG 5 (TEST)',de:'D01 · UNIQUE-FLAG 5 (TEST)',purpose:'one flag relative to B03'},
   {id:'diagU6',en:'D02 · UNIQUE FLAG 6 (TEST)',de:'D02 · UNIQUE-FLAG 6 (TEST)',purpose:'one flag relative to B03'},
   {id:'diagU8',en:'D03 · UNIQUE FLAG 8 (TEST)',de:'D03 · UNIQUE-FLAG 8 (TEST)',purpose:'one flag relative to B03'}
 ];
 const bytesEqual=(a,b)=>a.length===b.length&&a.every((x,i)=>x===b[i]);
 function ref(preset){
   if(!MODES.has(preset))throw Error('Unknown traffic performance preset.');
   const uniques=new Uint8Array(36);
   const parts=new Uint8Array(preset==='stock'?68:PART_BYTES);
   // Restore curated Stage-3 suspension flags, not arbitrary unknown/visual bytes.
   // Brake and tire stage-3 flags already exist in B03; also enable the corresponding Uniques.
   if(['handling','powerHandling','diagStage'].includes(preset)){
     for(const i of [30,35,36,37])parts[i]=1;
   }
   const dyno=new Uint8Array(205).fill(100);
   if(!['stock','original'].includes(preset)){
     const v=new DataView(uniques.buffer);
     v.setUint32(3*4,1,true);v.setUint32(4*4,1,true);
     if(preset==='handling'||preset==='powerHandling'){
       for(const i of [5,6,8])v.setUint32(i*4,1,true);
     }
     if(preset==='diagU5')v.setUint32(5*4,1,true);
     if(preset==='diagU6')v.setUint32(6*4,1,true);
     if(preset==='diagU8')v.setUint32(8*4,1,true);
     const final=preset==='final105'?105:preset==='final125'?125:115;
     const wide=preset==='powerWide'||preset==='powerHandling';
     const ecu=wide?POWER_WIDE:ECU;
     const turbo=wide?POWER_WIDE:(preset==='turboHigh'?TURBO_HIGH:ECU);
     for(let e=0;e<5;e++){
       const b=e*41;
       dyno[b+9]=final;
       dyno.set(ecu,b+23);
       dyno.set(turbo,b+32);
     }
   }
   return {uniques,parts,dyno};
 }
 function target(save,garage,slot){
   S.assertCareer(save);
   if(!Number.isInteger(slot)||slot<1||slot>10)throw Error('Traffic performance requires a career garage slot from 1–10.');
   const c=S.slotInfo(save,garage,slot);
   if(!c.owned||c.locked||!c.traffic)throw Error('Select an owned, unlocked Traffic Car in the career garage.');
   const data=slot<=5?save:garage;
   const b=(slot<=5?S.OFF.slot:S.OFF.garage)+(slot<=5?slot-1:slot-6)*S.OFF.stride;
   return {data,b,car:c};
 }
 function capture(save,garage,slot){
   const {data,b}=target(save,garage,slot);
   return {uniques:new Uint8Array(data.slice(b+UNIQUE,b+UNIQUE+36)),parts:new Uint8Array(data.slice(b+PARTS,b+PARTS+68)),dyno:new Uint8Array(data.slice(b+DYNO,b+DYNO+205))};
 }
 function same(a,b){return !!a&&!!b&&bytesEqual(a.uniques,b.uniques)&&bytesEqual(a.parts,b.parts)&&bytesEqual(a.dyno,b.dyno);}
 function status(save,garage,slot){
   const {car}=target(save,garage,slot),snap=capture(save,garage,slot);
   const neutral=car.traffic.id==='COUPE'?'original':'stock';
   if(same(snap,ref(neutral)))return neutral;
   for(const t of TESTS)if(same(snap,ref(t.id)))return t.id;
   // Both H01 and PH01 were reported unplayable in NFSU2 (vehicle falls and wheels spin).
   // Keep legacy signatures to recognize unsafe existing saves for recovery.
   if(same(snap,ref('handling')))return 'handling';
   if(same(snap,ref('powerHandling')))return 'powerHandling';
   // D04's four part flags also failed an actual in-game driving test.
   if(same(snap,ref('diagStage')))return 'diagStage';
   return 'custom';
 }
 function write(save,garage,slot,value){
   const {data,b}=target(save,garage,slot);
   for(const [name,length] of [['uniques',36],['parts',68],['dyno',205]])
     if(!(value?.[name] instanceof Uint8Array)||value[name].length!==length)throw Error('Invalid tuning snapshot: '+name);
   // Data validation is complete before writes; do not modify saved vehicle identity.
   data.set(value.uniques,b+UNIQUE);
   data.set(value.parts,b+PARTS);
   data.set(value.dyno,b+DYNO);
   return status(save,garage,slot);
 }
 function apply(save,garage,slot,preset){
   // H01, PH01, D04 failed real game drive tests; their byte signatures
   // remain accessible only to identify and repair previously edited saves.
   if(['handling','powerHandling','diagStage'].includes(preset))throw Error('H01, PH01 and D04 failed in-game driving tests and are disabled. Restore the known-good B03 Coupe profile or stock values.');
   const {car}=target(save,garage,slot);
   if(preset==='original'&&car.traffic.id!=='COUPE')throw Error('K01 original is only a verified Traffic Coupe reference; use stock for other traffic cars.');
   if(preset==='stock'&&car.traffic.id==='COUPE')throw Error('Use K01 original for the Traffic Coupe.');
   return write(save,garage,slot,ref(preset));
 }
 return {ECU,TURBO_HIGH,POWER_WIDE,TESTS,PART_BYTES,ref,capture,write,same,status,apply};
});
