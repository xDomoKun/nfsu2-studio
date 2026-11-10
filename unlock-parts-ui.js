/* v1.7.13 - Per-car availability bits (does not install equipment) */
(()=>{'use strict';
 const S=window.NFSU2,$=id=>document.getElementById(id);
 let undo=null;
 const lang=()=>window.USI18N?.getLanguage?.()||'en';
 const tr=(en,de)=>lang()==='de'?de:en;
 function context(){const c=window.UndergroundLabHost?.get();return c?.loaded?c:null;}
 function render(){const c=context(),el=$('usUnlockPanel');if(!el)return;
   const car=c?S.slotInfo(c.save,c.garage,c.slot):null,can=!!car?.owned&&!car.locked;
   el.classList.toggle('hidden',!can);
   if(!can)return;
   const availability=S.partsAvailability(c.save,c.garage,c.slot);
   $('usUnlockCount').textContent=availability.unlocked+' / '+availability.total;
   $('usUnlockTitle').textContent=tr('UNLOCK ALL PARTS','ALLE TEILE FREISCHALTEN');
   $('usUnlockDescription').textContent=tr('Mark mapped body, graphics, specialties and performance parts available for this car. This does not install parts or alter Dyno. The in-game effect is experimental.',
     'Markiert Karosserie-, Grafik-, Extra- und Performance-Teile für dieses Auto als verfügbar. Es wird nichts eingebaut und Dyno bleibt unverändert. Die Wirkung im Spiel ist experimentell.');
   $('usUnlockAll').textContent=tr('UNLOCK ALL PARTS','ALLE TEILE FREISCHALTEN');
   $('usUnlockAll').disabled=availability.unlocked===availability.total;
   $('usUnlockUndo').textContent=tr('UNDO UNLOCK','FREISCHALTUNG RÜCKGÄNGIG');
   $('usUnlockUndo').disabled=!undo||undo.save!==c.save||undo.garage!==c.garage||undo.slot!==c.slot;
 }
 function unlock(){const c=context();if(!c)return;
   const car=S.slotInfo(c.save,c.garage,c.slot);if(!car.owned||car.locked)return;
   if(!confirm(tr('Unlock all mapped parts for '+car.model+'? Existing installed parts and tuning remain unchanged. Save-format change only; back up before testing in game.',
    'Alle erfassten Teile für '+car.model+' freischalten? Eingebaute Teile und Tuning bleiben unverändert. Wirkung im Spiel noch unbestätigt – vorher Backup sichern.')))return;
   try{const snapshot=S.unlockAllParts(c.save,c.garage,c.slot);
     undo={save:c.save,garage:c.garage,slot:c.slot,snapshot};
     window.UndergroundLabHost.changed(tr('Parts availability updated for the selected car. No equipment installed.',
       'Teile für das ausgewählte Auto freigeschaltet. Nichts eingebaut.'));render();
   }catch(e){window.UndergroundLabHost.message(e.message,true);}}
 function restore(){const c=context();if(!c||!undo||undo.save!==c.save||undo.garage!==c.garage||undo.slot!==c.slot)return;
   try{S.restoreUnlockedParts(c.save,c.garage,undo.snapshot);undo=null;
     window.UndergroundLabHost.changed(tr('Part availability restored.','Teilefreischaltung rückgängig gemacht.'));render();
   }catch(e){window.UndergroundLabHost.message(e.message,true);}}
 $('usUnlockAll').onclick=unlock;$('usUnlockUndo').onclick=restore;
 document.addEventListener('click',e=>{if(e.target.closest('.slotcard, .car-card, [data-page], .us17-tab, #garageGrid'))queueMicrotask(render);});
 document.addEventListener('change',e=>{if(e.target.id==='fileInput')setTimeout(()=>{undo=null;render();},300);});
 window.addEventListener('underground-language-change',render);
 window.USUnlockPartsUI={render};render();
})();
