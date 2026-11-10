/* Underground Studio 1.7.2 — save-only career performance shop.
 * Stage profiles are curated SAVE-FLAG recipes, NOT original game purchases,
 * power simulation or guaranteed in-game tuning. Do not modify the player ID.
 */
(function(root,factory){const api=factory(typeof require==='function'?require('./core.js'):root.NFSU2);
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.USCareerShop=api;})(typeof globalThis!=='undefined'?globalThis:this,function(S){'use strict';
 const SLOT=S.OFF.slot,STRIDE=S.OFF.stride,PART=0x310,UNIQUE=0x2e8;
 const GROUPS=[
 {id:'weight',en:'Weight',de:'Gewicht',range:[0,5],stages:[[],[0,1],[0,1,2,3],[0,1,2,3,4,5]]},
 {id:'trans',en:'Transmission',de:'Getriebe',range:[6,11],stages:[[],[6,7],[6,7,10],[6,7,10,11]]},
 {id:'nos',en:'Nitrous',de:'Nitro',range:[12,14],stages:[[],[12],[13],[14]]},
 {id:'engine',en:'Engine',de:'Motor',range:[15,25],stages:[[],[15,16],[16,19,20],[16,19,20,21,22,23,24,25]]},
 {id:'turbo',en:'Turbo',de:'Turbo',range:[26,28],stages:[[],[26],[27],[28]]},
 {id:'susp',en:'Suspension',de:'Fahrwerk',range:[29,37],stages:[[],[30],[30,35],[30,35,36,37]]},
 {id:'brakes',en:'Brakes',de:'Bremsen',range:[38,44],stages:[[],[39],[39,42],[39,42,43,44]]},
 {id:'ecu',en:'ECU',de:'ECU',range:[45,52],stages:[[],[45,46],[45,47,48,49],[45,47,48,49,50,51,52]]},
 {id:'tires',en:'Tires',de:'Reifen',range:[53,55],stages:[[],[53],[54],[55]]}
 ];
 const ACTIVE_IDS=Object.freeze(Array.from({length:56},(_,i)=>i).filter(i=>i!==33&&i!==34));
 const ACTIVE_SET=new Set(ACTIVE_IDS);
 const UNIQUE_NAMES=['Weight','Transmission','Nitrous','Engine','Turbo','Suspension','Brakes','ECU','Tires'];
 function slot(d,g,n){S.assertCareer(d);if(!Number.isInteger(n)||n<1||n>10)throw Error('Select a garage slot 1–10.');
 const c=S.slotInfo(d,g,n);if(!c.owned||c.locked)throw Error('Select an owned, unlocked car.');return {b:n<=5?SLOT+(n-1)*STRIDE:S.OFF.garage+(n-6)*STRIDE,c,data:n<=5?d:g};}
 function capture(d,g,n){const {b,c,data}=slot(d,g,n);return {n,model:c.model,traffic:!!c.traffic,hash:c.key,parts:new Uint8Array(data.slice(b+PART,b+PART+68)),unique:new Uint8Array(data.slice(b+UNIQUE,b+UNIQUE+36)),dyno:new Uint8Array(data.slice(b+0x354,b+0x354+41*5))};}
 function verifyIdentity(d,g,n,old){const now=slot(d,g,n);if(now.c.key!==old.hash||!!now.c.traffic!==old.traffic)throw Error('Vehicle identity changed unexpectedly.');}
 function restore(d,g,n,snapshot){const {b,c,data}=slot(d,g,n);if(snapshot.n!==n||snapshot.hash!==c.key)throw Error('Backup belongs to another car.');
 data.set(snapshot.parts,b+PART);data.set(snapshot.unique,b+UNIQUE);if(snapshot.dyno)data.set(snapshot.dyno,b+0x354);verifyIdentity(d,g,n,snapshot);}
 function apply(d,g,n,id,level){const grp=GROUPS.find(x=>x.id===id);if(!grp||!Number.isInteger(level)||level<0||level>3)throw Error('Invalid package/stage.');
 const old=capture(d,g,n),{b,data}=slot(d,g,n),[a,z]=grp.range;
 // Retain OTHER categories, 56–67 derived/unknown entries and all purchases.
 data.fill(0,b+PART+a,b+PART+z+1);
 for(const p of grp.stages[level])data[b+PART+p]=1;
 verifyIdentity(d,g,n,old);
 return {group:grp.id,level,changed:grp.range[1]-grp.range[0]+1};}
 function applyUnique(d,g,n,i,on){const old=capture(d,g,n);if(!Number.isInteger(i)||i<0||i>8)throw Error('Invalid unique index.');const {b,data}=slot(d,g,n);
 new DataView(data.buffer,data.byteOffset,data.byteLength).setUint32(b+UNIQUE+4*i,on?1:0,true);
 verifyIdentity(d,g,n,old);}
 // Enable all 54 identified *active* performance flags, not the two inactive
 // positions 33/34 or the twelve visual-derived bytes (56–67).
 // This is a raw save-edit; the original game has mutually exclusive upgrades.
 function maxOut(d,g,n){
  const previous=capture(d,g,n),{b,data}=slot(d,g,n);
  data.fill(0,b+PART,b+PART+56);
  for(const i of ACTIVE_IDS)data[b+PART+i]=1;
  const view=new DataView(data.buffer,data.byteOffset,data.byteLength);
  for(let i=0;i<9;i++)view.setUint32(b+UNIQUE+i*4,1,true);
  verifyIdentity(d,g,n,previous);
  return {previous,flagCount:ACTIVE_IDS.length,uniqueCount:9};
 }
 // True Stock: clear installed performance upgrades, unique rewards and all
 // five 41-byte Dyno profiles. Do not touch the visual-derived part flags,
 // unlock/purchase history, vehicle identity, ownership or appearance.
 function resetToStock(d,g,n){
  const previous=capture(d,g,n),{b,data}=slot(d,g,n);
  data.fill(0,b+PART,b+PART+56);
  data.fill(0,b+UNIQUE,b+UNIQUE+36);
  data.fill(100,b+0x354,b+0x354+41*5);
  verifyIdentity(d,g,n,previous);
  return {previous,resetParts:56,resetUniques:9,resetDyno:5};
 }
 function inspect(d,g,n){const {b,c,data}=slot(d,g,n);
 const p=Array.from(data.slice(b+PART,b+PART+68));
 const unique=Array.from({length:9},(_,i)=>S.u32(data,b+UNIQUE+i*4));
 return {traffic:!!c.traffic,model:c.model,hash:c.key,parts:p,unique,
  installedCount:ACTIVE_IDS.filter(i=>p[i]!==0).length,totalCount:ACTIVE_IDS.length,
  uniqueCount:unique.filter(Boolean).length,
  groups:GROUPS.map(x=>{
   const ids=ACTIVE_IDS.filter(i=>i>=x.range[0]&&i<=x.range[1]);
   const enabled=ids.filter(i=>p[i]!==0);
   const level=x.stages.findIndex(arr=>arr.length===enabled.length&&arr.every(i=>enabled.includes(i)));
   return {id:x.id,enabled,level:level<0?null:level,max:ids.length,allInstalled:enabled.length===ids.length};
  })
 };
 }
 return {GROUPS,ACTIVE_IDS,UNIQUE_NAMES,capture,restore,apply,applyUnique,maxOut,resetToStock,inspect};
});
