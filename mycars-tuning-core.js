/* Underground Studio 1.1: mapped performance/dyno in the 20 generic configurations.
 * Mappings established by hackch/NFSU2-Savegame-Editor technical.md (Nov 2026).
 * In-game behavior of modified traffic setups is experimental.
 */
(function(root,factory){const a=factory(typeof require==='function'?require('./core.js'):root.NFSU2,typeof require==='function'?require('./mycars-core.js'):root.UndergroundMyCars);if(typeof module!=='undefined'&&module.exports)module.exports=a;if(root)root.UndergroundTrafficTuning=a;})(typeof globalThis!=='undefined'?globalThis:this,function(S,M){'use strict';
const UNIQUE_OFF=0x2f0,PERF_OFF=0x318,DYNO_OFF=0x35c;
const N_PERF=68,N_EVENTS=5,EVENT_SIZE=41;
const FIELDS=[{id:'final',off:9,label:'Endübersetzung'},...Array.from({length:6},(_,i)=>({id:'gear'+(i+1),off:10+i,label:(i+1)+'. Gang'})),...Array.from({length:9},(_,i)=>({id:'ecu'+(i+1),off:23+i,label:'ECU '+(i+1)})),...Array.from({length:9},(_,i)=>({id:'turbo'+(i+1),off:32+i,label:'Turbo '+(i+1)}))];
const FIELD_MAP=new Map(FIELDS.map(f=>[f.id,f]));
const MAX_COMPAT=[0,1,2,3,4,5,6,7,10,11,14,16,19,20,21,22,23,24,25,28,30,35,36,37,39,42,43,44,45,47,48,49,50,51,52,55];
function access(d,slot){M.assert(d);const c=M.info(d,slot);if(!c.active)throw Error('Bitte einen belegten „Meine Autos“-Platz wählen.');return {at:M.at(slot),info:c};}
function assertEvent(event){if(!Number.isInteger(event)||event<0||event>=N_EVENTS)throw Error('Renntyp 0 bis 4 erwartet.');}
function read(d,slot){const {at,info}=access(d,slot);return {info,parts:Array.from(d.slice(at+PERF_OFF,at+PERF_OFF+N_PERF)),unique:Array.from({length:9},(_,i)=>S.u32(d,at+UNIQUE_OFF+i*4)),setups:Array.from({length:N_EVENTS},(_,i)=>Array.from(d.slice(at+DYNO_OFF+i*EVENT_SIZE,at+DYNO_OFF+(i+1)*EVENT_SIZE)))};}
function changeUnique(d,slot,index,on){if(!Number.isInteger(index)||index<0||index>=9)throw Error('Unique-Index ungültig.');const {at}=access(d,slot);new DataView(d.buffer,d.byteOffset,d.byteLength).setUint32(at+UNIQUE_OFF+index*4,on?1:0,true);}
function changePart(d,slot,index,on){if(!Number.isInteger(index)||index<0||index>=56)throw Error('Teile-Index 0–55 erwartet.');const {at}=access(d,slot);d[at+PERF_OFF+index]=on?1:0;}
function resetPerformance(d,slot){const {at}=access(d,slot);d.fill(0,at+PERF_OFF,at+PERF_OFF+56);for(let i=0;i<9;i++)changeUnique(d,slot,i,false);}
function maxCompatible(d,slot){const {at}=access(d,slot);d.fill(0,at+PERF_OFF,at+PERF_OFF+56);for(const i of MAX_COMPAT)d[at+PERF_OFF+i]=1;for(let i=0;i<9;i++)changeUnique(d,slot,i,true);}
function fromCareer(d,slot,garage,source){const {at}=access(d,slot);if(!Number.isInteger(source)||source<1||source>10)throw Error('Karrierequelle 1–10 erwartet.');const info=S.slotInfo(d,garage,source);if(!info.owned||info.locked||info.traffic)throw Error('Quelle muss ein normales, belegtes und entsperrtes Karriereauto sein.');const bytes=source<=5?d:garage;const b=source<=5?S.OFF.slot+(source-1)*S.OFF.stride:S.OFF.garage+(source-6)*S.OFF.stride;
// Identical generic/car payload: 9x unique dwords, 68 part bytes, 5x 41 dyno bytes.
d.set(bytes.slice(b+0x2e8,b+0x421),at+0x2f0);
return info;}
function dynoField(d,slot,event,id,value){assertEvent(event);const f=FIELD_MAP.get(id);if(!f)throw Error('Unbekannter Dyno-Parameter.');if(!Number.isInteger(value)||value<0||value>200)throw Error('Dyno-Werte: 0 bis 200.');const {at}=access(d,slot);d[at+DYNO_OFF+event*EVENT_SIZE+f.off]=value;}
function dynoRead(d,slot,event){assertEvent(event);const {at}=access(d,slot),p=at+DYNO_OFF+event*EVENT_SIZE;return FIELDS.map(f=>({...f,value:d[p+f.off]}));}
function dynoCopy(d,slot,sourceEvent,targetEvent){assertEvent(sourceEvent);assertEvent(targetEvent);const {at}=access(d,slot);d.set(d.slice(at+DYNO_OFF+sourceEvent*EVENT_SIZE,at+DYNO_OFF+(sourceEvent+1)*EVENT_SIZE),at+DYNO_OFF+targetEvent*EVENT_SIZE);}
function dynoNeutral(d,slot,event){for(const f of FIELDS)dynoField(d,slot,event,f.id,100);}
return {UNIQUE_OFF,PERF_OFF,DYNO_OFF,N_PERF,EVENT_SIZE,FIELDS,MAX_COMPAT,read,changeUnique,changePart,resetPerformance,maxCompatible,fromCareer,dynoField,dynoRead,dynoCopy,dynoNeutral};
});
