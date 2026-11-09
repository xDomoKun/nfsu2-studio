/* Save-only Lab user interface: isolates every test from the active editor state. */
(function(){'use strict';
const host=window.UndergroundLabHost, lab=window.NFSU2SaveLab, S=window.NFSU2, $=id=>document.getElementById(id);
const makeOption=(value,label)=>{const e=document.createElement('option');e.value=value;e.textContent=label;return e;};
let rendering=false;
function selectOptions(el,options,pref){const prev=el.value;el.replaceChildren(...options.map(([value,label])=>makeOption(value,label)));el.value=options.some(([val])=>val===prev)?prev:(options.some(([val])=>val===pref)?pref:(options[0]?.[0]||''));}
function render(){const h=host.get();$('labEmpty').classList.toggle('hidden',h.loaded);$('labReady').classList.toggle('hidden',!h.loaded);if(!h.loaded)return;
 if(rendering)return;rendering=true;
 const owned=[];const donors=[];
 for(let n=1;n<=(h.garage?10:5);n++){
 const c=S.slotInfo(h.save,h.garage,n);if(!c.owned||c.locked)continue;
 owned.push([String(n),`Slot ${n} · ${c.model}`]);if(!c.traffic&&S.CARS.has(c.key))donors.push([String(n),`Slot ${n} · ${c.model}`]);
 }
 selectOptions($('labTarget'),owned,'1');selectOptions($('labDonor'),donors,'4');
 selectOptions($('labTraffic'),S.TRAFFIC.map(c=>[c.id,c.name+' · '+c.key]),'COUPE');
 selectOptions($('labMethod'),Object.entries(lab.METHODS),'full');
 selectOptions($('labParts'),Object.entries(lab.PARTS),'compatible');
 selectOptions($('labTune'),Object.entries(lab.TUNES),'speed');
 rendering=false;
}
function values(){return {slot:Number($('labTarget').value),donor:Number($('labDonor').value),trafficId:$('labTraffic').value,method:$('labMethod').value,parts:$('labParts').value,tune:$('labTune').value,catalogue:$('labCatalogue').checked};}
function report(p,label){return `${label}\nMethode: ${lab.METHODS[p.method]}\nZielslot: ${p.slot} | Spender: ${p.donor}\nTraffic-ID: ${p.traffic.id} / ${p.traffic.key}\nErgebnis-ID: ${p.finalKey}\nTeile: ${lab.PARTS[p.parts]}\nDyno: ${lab.TUNES[p.tune]} (alle 5 Setups)\nStock-Katalog: ${p.catalogue?`${p.catalogue.oldCount} → ${p.catalogue.newCount} (risikoreich)`:'unangetastet'}\nGeänderte Karriere-Bytes (inkl. CRC): ${p.careerDiff.total}\nGeänderte Zusatzgarage-Bytes: ${p.garageDiff?.total??0}\nKarriere-Offsets (erste 60): ${p.careerDiff.offsets.join(', ')}${p.careerDiff.truncated?' …':''}\nHinweis: Nur Binärformat-Prüfung. Fahrbarkeit und Leistung im Spiel noch nicht validiert.`;}
async function serialize(p,h){if(!h.zip)throw Error('Für nfsu2.xyz benötigst du den originalen Browser-ZIP-Export. Bitte diesen öffnen.');
 const z=await JSZip.loadAsync(h.original,{checkCRC32:true,createFolders:false});z.file(h.profilePath,p.save);if(p.garage&&h.garagePath)z.file(h.garagePath,p.garage);
 const data=await z.generateAsync({type:'uint8array',compression:'DEFLATE',compressionOptions:{level:6}});
 // Reparse the resulting file and inspect both checksums and garage binding.
 const verified=await JSZip.loadAsync(data,{checkCRC32:true});const rs=await verified.file(h.profilePath).async('uint8array');if(!S.checkCareer(rs).ok)throw Error('Export-Verifizierung fehlgeschlagen (CRC).');
 if(p.garage&&h.garagePath){const rg=await verified.file(h.garagePath).async('uint8array');if(!S.garagePairValid(rs,rg))throw Error('Export-Verifizierung fehlgeschlagen (Garagenbindung).');}
 return data;
}
function download(bytes,name){const blob=new Blob([bytes],{type:'application/zip'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);}
function setBusy(yes){$('labSingle').disabled=yes;$('labMatrix').disabled=yes;}
async function single(){setBusy(true);try{const h=host.get();if(!h.loaded)throw Error('Bitte erst einen Spielstand öffnen.');const p=lab.build({...values(),save:h.save,garage:h.garage});const bytes=await serialize(p,h);const id=`Test_${p.method}_${p.tune}_S${p.slot}_${p.finalKey}`;download(bytes,`UndergroundStudio_${id}.zip`);$('labReport').textContent=report(p,id);host.message('Test-Spielstand erstellt. Bitte erst Original sichern, dann nur dieses eine ZIP in nfsu2.xyz importieren.');}catch(e){host.message('Save-only Lab: '+e.message,true);}finally{setBusy(false);}}
async function matrix(){setBusy(true);try{
 const h=host.get();if(!h.loaded||!h.zip)throw Error('Bitte den nfsu2.xyz-Browser-ZIP-Export öffnen.');const c=values();const outer=new JSZip();const results=[];
 for(const test of lab.TEST_MATRIX){const p=lab.build({...c,...test,save:h.save,garage:h.garage});const bytes=await serialize(p,h);outer.file(`${test.id}.zip`,bytes,{compression:'STORE'});results.push(report(p,test.id+' · '+test.label));}
 const readme=['UNDERGROUND STUDIO — SAVE-ONLY TESTS','',`Profil: ${S.getName(h.save)}; Zielslot: ${c.slot}; Normaler Spender: ${c.donor}; Traffic: ${c.trafficId}`,'','WICHTIG: 500 km/h / 5× Beschleunigung sind NICHT durch diese ZIPs garantiert.','Traffic-Klasse ist Engine-Dateninhalt. Save-Änderung kann durch das Spiel ignoriert werden.','', 'VOR JEDEM TEST: 1) Ursprünglichen Save sichern 2) Spiel ganz schließen 3) EIN Test-ZIP importieren 4) Im Einzelspielermodus testen 5) Spiel erneut speichern/exportieren 6) Danach Original wiederherstellen.','', 'Wenn ein Versuch scheitert, den Originalexport wieder importieren.','', 'Normale Kontrolltests mit N01/N02/N03 vor extremen Traffic-Experimenten ausprobieren.','',...results];
 outer.file('TESTPLAN.txt',readme.join('\n'));const data=await outer.generateAsync({type:'uint8array',compression:'DEFLATE',compressionOptions:{level:3}});download(data,`UndergroundStudio_SaveOnly_Testreihe_${c.trafficId}_Slot${c.slot}.zip`);$('labReport').textContent=`${results.length} Test-ZIPs erstellt.\n\n`+results.map((v,i)=>`${i+1}. ${lab.TEST_MATRIX[i].id}: ${lab.TEST_MATRIX[i].label}`).join('\n')+'\n\nEinzelne ZIPs aus dem Paket entpacken und einzeln importieren. Zuerst Normal-Kontrollen testen.';
 host.message('Testpaket erstellt: 11 einzelne Spielstand-ZIPs + Prüfplan. Die Originaldatei blieb unverändert.');
 }catch(e){host.message('Testreihe: '+e.message,true);}finally{setBusy(false);}}
$('labSingle').onclick=single;$('labMatrix').onclick=matrix;window.UndergroundLabUI={render};render();
})();
