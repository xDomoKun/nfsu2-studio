/* NFSU2 Save Editor – binary format model. No network or external game data needed.
   Sources: hackch/NFSU2-Savegame-Editor (MIT) save format research,
   yugecin/nfsu2-re (vehicle hashes). Independently implemented. */
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.NFSU2 = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const SIZE = 54966, GARAGE_SIZE = 10202;
  const OFF = {money:0xA16A,name:0xD225,stage:0xA175,slot:0x5870,stride:0x7F2,garage:0x28};
  const UNIQUE = ['Gewicht', 'Getriebe', 'Nitro (NOS)', 'Motor', 'Turbo', 'Fahrwerk', 'Bremsen', 'ECU', 'Reifen'];
  const CARS = new Map(Object.entries({
    '000AC6D1':'Nissan 350Z','0000DC00':'Mazda RX-7','0000DC01':'Mazda RX-8',
    'BE48375E':'Nissan Skyline GT-R','04FD0522':'Hyundai Tiburon','2D7C9B5D':'Mitsubishi 3000GT',
    '00000453':'Audi A3','545AEC60':'Toyota Celica','7502DA84':'Mitsubishi Eclipse',
    'CF704771':'Cadillac Escalade','0000A86E':'Infiniti G35','00163087':'Volkswagen Golf GTI',
    '0000ACC9':'Pontiac GTO','6126DD4D':'Hummer H2','CF4458F8':'Subaru Impreza WRX',
    '030236EE':'Lexus IS300','09D2EFF6':'Mitsubishi Lancer Evolution VIII',
    '03455D6B':'Mazda MX-5 Miata','35165819':'Ford Mustang GT',
    '0219C94A':'Lincoln Navigator','0000DB7C':'Acura RSX','79AEBFEC':'Nissan Sentra',
    '03B8C48A':'Toyota Supra','000006E7':'Audi TT'}));
  // Original vehicle type names in NFSU2's CarTypeInfo table (31..45).
  // Hash uses bStringHash, initial 0xFFFFFFFF, hash = hash*33 + ASCII byte.
  // Traffic cars in saves are experimental. A vehicle type hash does NOT make
  // the engine adopt another vehicle's physics from the save alone.
  const TRAFFIC_NAMES = [
    ['TAXI','Taxi'], ['4DR_SEDAN02','Limousine 02'], ['AMBULANCE','Krankenwagen'],
    ['TAXI02','Taxi 02'], ['PANELVAN','Kastenwagen'], ['COUPE','Traffic-Coupé'],
    ['FIRETRUCK','Feuerwehr'], ['PARCELVAN','Lieferwagen (Grolson)'],
    ['PICKUP','Pickup (Chevrolet)'], ['4DR_SEDAN','Limousine (Chevrolet)'],
    ['BUS','Silver Eagle Bus'], ['SUV','Traffic-SUV'],
    ['MINIVAN','Minivan'], ['HATCHBACK','Kleinwagen'], ['HATCHBACK02','Kleinwagen 02']
  ];
  function carHash(name){
    if(!/^[A-Z0-9_]+$/.test(name))throw new Error('Ungültiger Fahrzeugtyp.');
    let hash=0xffffffff;
    for(let i=0;i<name.length;i++)hash=(Math.imul(hash,33)+name.charCodeAt(i))>>>0;
    return hash;
  }
  const TRAFFIC = TRAFFIC_NAMES.map(([id,name],i)=>Object.freeze({id,name,hash:carHash(id),key:hex(carHash(id)),index:i+31}));
  const TRAFFIC_BY_HASH = new Map(TRAFFIC.map(x=>[x.key,x]));
  const TABLE = new Uint32Array(256);
  for (let i=0;i<256;i++){let c=i<<24;for(let j=0;j<8;j++)c=(c&0x80000000)?(c<<1)^0x04c11db7:c<<1;TABLE[i]=c>>>0;}
  function u32(d,p){return new DataView(d.buffer,d.byteOffset,d.byteLength).getUint32(p,true);}
  function i32(d,p){return new DataView(d.buffer,d.byteOffset,d.byteLength).getInt32(p,true);}
  function w32(d,p,v){new DataView(d.buffer,d.byteOffset,d.byteLength).setUint32(p,v>>>0,true);}
  function wi32(d,p,v){new DataView(d.buffer,d.byteOffset,d.byteLength).setInt32(p,v,true);}
  function hex(v){return (v>>>0).toString(16).toUpperCase().padStart(8,'0');}
  function crc(d,start,end){ if(end-start<4)return 0; const first=((d[start]<<24)|(d[start+1]<<16)|(d[start+2]<<8)|d[start+3])>>>0;let r=(~first)>>>0;for(let i=start+4;i<end;i++)r=(((r<<8)|d[i])^TABLE[r>>>24])>>>0;return (~r)>>>0;}
  function assertCareer(d){
    if(!(d instanceof Uint8Array)||d.length!==SIZE)throw new Error('Kein unterstützter Karriere-Spielstand (erwartet: 54.966 Bytes).');
    if(String.fromCharCode(...d.slice(0,4))!=='20CM')throw new Error('Ungültige 20CM-Signatur.');
    if(u32(d,4)!==SIZE||0x1c+u32(d,8)+u32(d,12)!==SIZE)throw new Error('Fehlerhafte Blockgrößen im Spielstand.');
    if(u32(d,0x1c)!==0x10d)throw new Error('Nicht unterstützte Profil-Kompatibilitätskennung.');
    return true;
  }
  function checkCareer(d){assertCareer(d);const a=u32(d,8),b=u32(d,12),p=0x1c;
    const checks=[{name:'Block A',expected:u32(d,0x10),actual:crc(d,p,p+a)},{name:'Block B',expected:u32(d,0x14),actual:crc(d,p+a,p+a+b)},{name:'Header',expected:u32(d,0x18),actual:crc(d,0,0x18)}];
    return {ok:checks.every(c=>c.expected===c.actual),checks};
  }
  function repairCareer(d){assertCareer(d);const a=u32(d,8),b=u32(d,12),p=0x1c;
    w32(d,0x10,crc(d,p,p+a));w32(d,0x14,crc(d,p+a,p+a+b));w32(d,0x18,crc(d,0,0x18));return d;
  }
  function assertGarage(g){if(!(g instanceof Uint8Array)||g.length!==GARAGE_SIZE)throw new Error('GARAGE.DAT: Größe stimmt nicht (10.202 Bytes erwartet).');if(String.fromCharCode(...g.slice(0,4))!=='N2GA')throw new Error('GARAGE.DAT: ungültige N2GA-Signatur.');return true;}
  function getName(d){assertCareer(d);let r='';for(let i=OFF.name;i<OFF.name+32&&d[i];i++)r+=String.fromCharCode(d[i]);return r;}
  function setName(d,name){assertCareer(d);if(!/^[\x20-\x7E]{1,7}$/.test(name))throw new Error('Der Profilname darf 1–7 ASCII-Zeichen enthalten.');d.fill(0,OFF.name,OFF.name+32);for(let i=0;i<name.length;i++)d[OFF.name+i]=name.charCodeAt(i);}
  function money(d){return i32(d,OFF.money);}
  function setMoney(d,m){assertCareer(d);if(!Number.isSafeInteger(m)||m<0||m>2147483647)throw new Error('Geld muss zwischen 0 und 2.147.483.647 liegen.');wi32(d,OFF.money,m);}
  function stage(d){return u32(d,OFF.stage);}
  function setStage(d,s){assertCareer(d);if(!Number.isInteger(s)||s<0||s>6)throw new Error('Karrierestufe muss 0–6 sein.');w32(d,OFF.stage,s);}
  function slotBase(n){return n<=5?OFF.slot+(n-1)*OFF.stride:OFF.garage+(n-6)*OFF.stride;}
  function slotData(d,g,n){if(!Number.isInteger(n)||n<1||n>10)throw new Error('Garagenslot muss 1–10 sein.');if(n>5){assertGarage(g);return g;}assertCareer(d);return d;}
  function slotInfo(d,g,n){const data=slotData(d,g,n),b=slotBase(n),hash=u32(data,b+0x14),key=hex(hash),owned=data[b+0x429]!==0,locked=data[b+0x428]!==0,unique=UNIQUE.map((name,i)=>({name,on:u32(data,b+0x2e8+i*4)!==0}));return {n,hash,key,model:CARS.get(key)||(TRAFFIC_BY_HASH.has(key)?TRAFFIC_BY_HASH.get(key).name:`Unbekanntes Modell (${key})`),traffic:TRAFFIC_BY_HASH.get(key)||null,owned,locked,unique,activeInstalled:Array.from(data.subarray(b+0x310,b+0x310+56)).filter(Boolean).length};}
  function setTraffic(d,g,n,trafficId){
    const traffic=TRAFFIC.find(x=>x.id===trafficId);
    if(!traffic)throw new Error('Unbekannter Traffic-Fahrzeugtyp.');
    const data=slotData(d,g,n),b=slotBase(n);
    if(!data[b+0x429] || data[b+0x428])throw new Error('Traffic-Wechsel nur in belegten, freigeschalteten Slots.');
    // Identity only: deliberately preserve vehicle mesh/paint/parts/tuning bytes.
    w32(data,b+0x14,traffic.hash);
    return traffic;
  }
  function copyPerformance(d,g,target,donor){
    if(target===donor)throw new Error('Quelle und Ziel müssen verschieden sein.');
    const to=slotData(d,g,target),from=slotData(d,g,donor),tb=slotBase(target),fb=slotBase(donor);
    if(!to[tb+0x429] || !from[fb+0x429] || to[tb+0x428])throw new Error('Beide Plätze müssen belegt und das Ziel freigeschaltet sein.');
    // Copy only nine unique flags, installed performance flags and dyno configs;
    // no body hashes, model identifiers, slot ownership or unlock/purchase flags.
    // Does NOT overwrite the engine's GLOBALB physics or create a speed cap.
    to.set(from.slice(fb+0x2e8,fb+0x428),tb+0x2e8);
  }
  function setUnlocked(d,g,n,unlocked){const data=slotData(d,g,n),b=slotBase(n);data[b+0x428]=unlocked?0:1;}
  function setUnique(d,g,n,i,on){if(!Number.isInteger(i)||i<0||i>8)throw new Error('Ungültige Tuning-Kategorie.');const data=slotData(d,g,n),b=slotBase(n);if(data[b+0x429]===0)throw new Error('Der Slot enthält kein gekauftes Fahrzeug.');w32(data,b+0x2e8+i*4,on?1:0);}
  // Safe-ish donor-only identity transfer, keeps recipient owner/slot record and tuning.
  // Experimental: source and destination must already have a vehicle, no creation of unseen models.
  function replaceIdentity(d,g,target,donor){
    if(target===donor)return;
    const to=slotData(d,g,target),from=slotData(d,g,donor),tb=slotBase(target),fb=slotBase(donor);
    if(!to[tb+0x429]||!from[fb+0x429])throw new Error('Fahrzeugübernahme funktioniert nur für bereits belegte Slots.');
    const parts=[[0x00,0xe0],[0xe0,0x1d0],[0x2b0,0x14]];
    for(const [rel,len] of parts)to.set(from.slice(fb+rel,fb+rel+len),tb+rel);
    to[tb+0x428]=0;to[tb+0x429]=1;
  }
  // Category unlocks reflect known ranges, do not simulate purchased reward progression.
  const UNLOCK = {
    body:[[0x462,0x475],[0x47e,0x485],[0x59a,0x5fd],[0x61e,0x64d],[0x696,0x6b1],[0x6b6,0x6bd],[0x6c2,0x6c9]],
    speciality:[[0x486,0x495],[0x49a,0x49d],[0x4a2,0x4ad],[0x4b6,0x4bd],[0x5fe,0x61d],[0x7da,0x7e1]],
    graphics:[[0x4ce,0x53d]],performance:[[0x586,0x58d]]
  };
  function unlockCategory(d,g,n,cat){if(!Object.hasOwn(UNLOCK,cat))throw new Error('Unbekannte Tuning-Kategorie.');const data=slotData(d,g,n),b=slotBase(n);if(!data[b+0x429])throw new Error('Leerer Garagenslot.');for(const [s,e] of UNLOCK[cat])data.fill(0xff,b+s,b+e+1);}
  // v0.3: NFSU2's genuine five saved DYNO tuning setups. Engine values
  // are normalized byte controls, NOT user-defined power/speed in km/h.
  // See the x86-car tuning trace documented in hackch/technical.md.
  const DYNO_EVENTS=['Circuit','Drag','Drift','Street X','URL'];
  const DYNO_CONTROLS=[
    {id:'final',offset:9,label:'Endübersetzung',group:'gear'},
    ...Array.from({length:6},(_,i)=>({id:'gear'+(i+1),offset:10+i,label:(i+1)+'. Gang',group:'gear'})),
    ...Array.from({length:9},(_,i)=>({id:'ecu'+(i+1),offset:23+i,label:'ECU '+(i+1),group:'ecu'})),
    ...Array.from({length:9},(_,i)=>({id:'turbo'+(i+1),offset:32+i,label:'Turbo '+(i+1),group:'turbo'}))
  ];
  const DYNO_BY_ID=new Map(DYNO_CONTROLS.map(c=>[c.id,c]));
  function setupOffset(d,g,n,event){
    if(!Number.isInteger(event)||event<0||event>4)throw new Error('Ungültige Dyno-Kategorie (0–4).');
    const data=slotData(d,g,n),b=slotBase(n);
    return {data,b,start:b+0x354+event*41};
  }
  function dynoData(d,g,n,event){
    const {data,b,start}=setupOffset(d,g,n,event);
    const car=slotInfo(d,g,n);
    return {event,n,model:car.model,available:car.owned&&!car.locked&&!car.traffic,
      traffic:!!car.traffic,installedGearPart:!!data[b+0x310+11],
      controls:DYNO_CONTROLS.map(c=>({...c,value:data[start+c.offset]}))};
  }
  function dynoWrite(d,g,n,event,id,value){
    const c=DYNO_BY_ID.get(id);
    if(!c)throw new Error('Unbekannter Dyno-Parameter.');
    if(!Number.isInteger(value)||value<0||value>200)throw new Error('Dyno-Wert muss ganzzahlig zwischen 0 und 200 liegen.');
    const info=slotInfo(d,g,n);
    if(!info.owned||info.locked||info.traffic||!CARS.has(info.key))throw new Error('Dyno nur für bekannte normale, belegte und entsperrte Autos. Traffic Cars sind nicht fahrbar.');
    const {data,start}=setupOffset(d,g,n,event);
    data[start+c.offset]=value;
    return value;
  }
  function dynoReset(d,g,n,event){
    const info=slotInfo(d,g,n);
    if(!info.owned||info.locked||info.traffic||!CARS.has(info.key))throw new Error('Dyno benötigt ein normales, belegtes Fahrzeug.');
    const {data,start}=setupOffset(d,g,n,event);
    for(const c of DYNO_CONTROLS)data[start+c.offset]=100;
  }
  // Genuine final-drive changes. Higher final-drive ratio is shorter gearing
  // (more wheel torque, less redline-limited speed); lower = taller gearing.
  // The game's per-car tuning ranges and drag/limiter physics still apply.
  function dynoPriority(d,g,n,event,priority){
    if(!Number.isInteger(priority)||priority<-100||priority>100)throw new Error('Priorität muss -100 bis +100 betragen.');
    dynoWrite(d,g,n,event,'final',Math.max(0,Math.min(200,100+priority)));
  }
  // nfsu2-web garage.c uses FNV-1a 64 of 39,230 career-car bytes.
  // Without a matching header fingerprint the browser game discards GARAGE.DAT.
  function garageFingerprint(d){
    assertCareer(d);
    let h=0xcbf29ce484222325n;
    for(let i=36;i<39266;i++)h=BigInt.asUintN(64,(h^BigInt(d[i]))*0x100000001b3n);
    return h;
  }
  function storedGarageFingerprint(g){
    assertGarage(g);
    return (BigInt(u32(g,12))<<32n)|BigInt(u32(g,8));
  }
  function garagePairValid(d,g){return storedGarageFingerprint(g)===garageFingerprint(d);}
  function repairGarageFingerprint(d,g){
    assertGarage(g);
    const h=garageFingerprint(d);
    w32(g,8,Number(h&0xffffffffn));w32(g,12,Number((h>>32n)&0xffffffffn));
    return g;
  }
  return {SIZE,GARAGE_SIZE,UNIQUE,CARS,TRAFFIC,carHash,OFF,u32,i32,hex,crc,assertCareer,assertGarage,checkCareer,repairCareer,getName,setName,money,setMoney,stage,setStage,slotInfo,setTraffic,copyPerformance,setUnlocked,setUnique,replaceIdentity,unlockCategory,DYNO_EVENTS,DYNO_CONTROLS,dynoData,dynoWrite,dynoReset,dynoPriority,garageFingerprint,storedGarageFingerprint,garagePairValid,repairGarageFingerprint};
});
