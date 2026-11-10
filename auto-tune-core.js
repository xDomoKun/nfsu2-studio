/* Underground Studio 1.5: event-specific, save-only dyno recommendations.
 * Exact Traffic Coupe circuit reference: user-tested ECU_01_MID_RANGE.
 * Other event/model profiles are hypotheses derived from the saved setup,
 * community event guidance, and bounded bytes (not verified lap-time optima).
 * Never changes identity, purchased parts, vehicle geometry or career flags.
 */
(function(root,factory){
  const api=factory(typeof require==='function'?require('./core.js'):root.NFSU2,
    typeof require==='function'?require('./mycars-core.js'):root.UndergroundMyCars);
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  if(root)root.UndergroundAutoTune=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(S,M){'use strict';
const EVENTS=['Circuit','Drag','Drift','Street X','URL'];
const RACE_PROFILES=[
 [0,0,100,200,200,200,100,0,0],     // Circuit: K01 Mid Range baseline
 [0,0,0,70,160,200,200,200,70],    // Drag: high RPM
 [0,70,170,200,200,140,20,0,0],   // Drift: low/mid RPM
 [0,100,180,200,180,110,20,0,0],  // Street X: response
 [0,0,50,150,200,200,180,100,0]  // URL: broad/higher RPM
];
const TURBO_PROFILES=[
 [80,85,90,100,115,130,140,135,125],
 [70,75,80,95,115,140,160,175,175],
 [100,105,110,115,120,120,110,100,95],
 [105,105,110,115,120,115,105,95,90],
 [75,80,90,105,125,140,155,160,145]
];
const BEHAVIOR={0:'Broad mid-range',1:'High-RPM pull',2:'Low/mid response',3:'Short-track acceleration',4:'Sustained high-speed'};
const CHANGES=[0,1,2,3,4];
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
function access(d,g,mode,slot){
  S.assertCareer(d);
  if(mode==='arcade'){
    const c=M.info(d,slot);if(!c.active)throw Error('Select an occupied My Cars slot.');
    return {data:d,at:M.at(slot)+0x35c,partBase:M.at(slot)+0x318,car:c,mode,slot};
  }
  if(mode==='career'){
    const c=S.slotInfo(d,g,slot);if(!c.owned||c.locked)throw Error('Select an owned and unlocked career car.');
    const data=slot<=5?d:g;
    if(!data)throw Error('Extra garage not present.');
    const base=slot<=5?S.OFF.slot+(slot-1)*S.OFF.stride:S.OFF.garage+(slot-6)*S.OFF.stride;
    return {data,at:base+0x354,partBase:base+0x310,car:c,mode,slot};
  }
  throw Error('Unknown mode.');
}
function original(d,g,mode,slot,event){
  const a=access(d,g,mode,slot);
  if(!CHANGES.includes(event))throw Error('Unknown race type.');
  return new Uint8Array(a.data.subarray(a.at+event*41,a.at+(event+1)*41));
}
function readAll(d,g,mode,slot){const a=access(d,g,mode,slot);return new Uint8Array(a.data.subarray(a.at,a.at+205));}
function restore(d,g,mode,slot,bytes){const a=access(d,g,mode,slot);if(!(bytes instanceof Uint8Array)||bytes.length!==205)throw Error('Invalid tune backup.');a.data.set(bytes,a.at);}
function isCoupe(c){return c.key==='0294073B';}
function isTraffic(c){return !!c.traffic;}
function modelShift(c){
  // A minimal, explicit per-model heuristic. These are unverified and bounded;
  // true optimized RPM targets need the car's engine database and lap tests.
  if(isTraffic(c)){
    const text=(c.model||c.name||'').toLowerCase();
    if(/bus|truck|fire|van|pickup|ambulance|bus|feuerwehr|lieferwagen|krankenwagen/.test(text))return -1;
    return 0;
  }
  const name=(c.model||c.name||'').toLowerCase();
  if(/rx-7|rx-8|skyline|supra|evolution|impreza|civic|rsx/.test(name))return 1;
  if(/hummer|escalade|navigator|mustang|gto/.test(name))return -1;
  return 0;
}
function savedShift(bytes){
  // Only use already saved dyno shape as a weak car-specific calibration.
  // Already strongly tuned curves are not used to re-shift themselves.
  // This keeps applying the same preset idempotent.
  if(Array.from(bytes.slice(23,32)).some(v=>v===0||v===200))return 0;
  let sum=0,total=0;
  for(let i=0;i<9;i++){const v=bytes[23+i]-100;if(v>0){sum+=i*v;total+=v;}}
  if(total<80)return 0;
  return clamp(Math.round(sum/total)-4,-1,1);
}
function shifted(arr,shift){if(!shift)return arr.slice();const out=Array(9).fill(0);for(let i=0;i<9;i++){const to=clamp(i+shift,0,8);out[to]=Math.max(out[to],arr[i]);}return out;}
function recommendation(d,g,mode,slot,event){
  const a=access(d,g,mode,slot),before=original(d,g,mode,slot,event);
  const traffic=isTraffic(a.car),coupe=isCoupe(a.car);
  // Preserve user-tested ECU_01_MID_RANGE exactly for the Traffic Coupe / Circuit.
  const shift=coupe&&event===0?0:clamp(modelShift(a.car)+savedShift(before),-1,1);
  const ecu=shifted(RACE_PROFILES[event],shift);
  const hasTurbo=!traffic&&Array.from(a.data.subarray(a.partBase+26,a.partBase+29)).some(Boolean);
  // For traffic, leave untested turbo, gear and handling bytes completely unchanged.
  // For regular cars, only change turbo when an installed turbo part is indicated.
  const turbo=hasTurbo?shifted(TURBO_PROFILES[event],shift):null;
  const bytes=new Uint8Array(before);
  for(let i=0;i<9;i++)bytes[23+i]=ecu[i];
  if(turbo)for(let i=0;i<9;i++)bytes[32+i]=turbo[i];
  const confirmed=coupe&&event===0&&mode==='career'&&slot===4;
  return {car:a.car,event,mode,ecu,turbo,bytes,confirmed,shift,behavior:BEHAVIOR[event],
    untouched:['Vehicle identity','Career status','Installed parts','Unique upgrades','Suspension','Handling','Gear ratios']};
}
function apply(d,g,mode,slot,event){const a=access(d,g,mode,slot),r=recommendation(d,g,mode,slot,event);a.data.set(r.bytes,a.at+event*41);return r;}
function applyAll(d,g,mode,slot){const result=[];for(let i=0;i<5;i++)result.push(apply(d,g,mode,slot,i));return result;}
// Bulk tuning always works on the actual occupied slots and is reversible.
// Only the five 41-byte Dyno blocks per vehicle are modified.
function eligibleSlots(d,g,mode,normalCareerOnly=false){
  S.assertCareer(d);
  const max=mode==='career'?(g?10:5):mode==='arcade'?20:0;
  if(!max)throw Error('Unknown garage mode.');
  const slots=[];
  for(let slot=1;slot<=max;slot++){
    try {
      const c=mode==='career'?S.slotInfo(d,g,slot):M.info(d,slot);
      if(mode==='career'?(c.owned&&!c.locked&&(!normalCareerOnly||!c.traffic)):c.active)slots.push(slot);
    } catch(e) {
      // Empty/invalid records are skipped; a corrupt save fails at assertCareer.
    }
  }
  return slots;
}
function sameBytes(a,b){return a.length===b.length&&a.every((v,i)=>v===b[i]);}
function applyGarage(d,g,mode,normalCareerOnly=false){
  const slots=eligibleSlots(d,g,mode,normalCareerOnly);
  if(!slots.length)throw Error('No usable cars in this garage.');
  const entries=slots.map(slot=>({slot,before:readAll(d,g,mode,slot)}));
  try {
    for(const entry of entries)applyAll(d,g,mode,entry.slot);
    for(const entry of entries)entry.after=readAll(d,g,mode,entry.slot);
  } catch(err) {
    for(const entry of entries)restore(d,g,mode,entry.slot,entry.before);
    throw err;
  }
  return {mode,entries};
}
function restoreGarage(d,g,transaction){
  if(!transaction||!['career','arcade'].includes(transaction.mode)||!Array.isArray(transaction.entries))throw Error('Invalid garage snapshot.');
  // Do not silently overwrite any manual dyno edits made after bulk auto-tune.
  for(const e of transaction.entries){
    if(!sameBytes(readAll(d,g,transaction.mode,e.slot),e.after))throw Error('A car was tuned again after the bulk action. Restore that car first or reload your backup.');
  }
  for(const e of transaction.entries)restore(d,g,transaction.mode,e.slot,e.before);
  return transaction.entries.length;
}
return {EVENTS,RACE_PROFILES,readAll,original,recommendation,apply,applyAll,restore,eligibleSlots,applyGarage,restoreGarage};
});
