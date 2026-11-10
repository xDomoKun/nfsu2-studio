/* Career performance shop; retains v1.3 save engine and English-first interface. */
(()=>{'use strict';const A=window.USCareerShop,S=window.NFSU2,$=id=>document.getElementById(id),ctx=()=>window.UndergroundLabHost?.get();
 const lang=()=>window.USI18N?.getLanguage?.()||'en';const t=(en,de)=>lang()==='de'?de:en;
 const snapshots=new Map();let lastLoaded=null;
 const hint=$('shopHint');
 const labels={stock:['STOCK','SERIE'],street:['STREET','STREET'],pro:['PRO','PRO'],extreme:['EXTREME','EXTREME']};
 function render(){const c=ctx(),section=$('careerShop');if(!section)return;
 if(!c?.loaded){section.classList.add('hidden');snapshots.clear();lastLoaded=null;return;}
 if(lastLoaded!==c.original){snapshots.clear();lastLoaded=c.original;}
 const n=c.slot||1;let r;try{r=A.inspect(c.save,c.garage,n);}catch{section.classList.add('hidden');return;}
 section.classList.remove('hidden');$('shopTitle').textContent=t('PERFORMANCE SHOP','LEISTUNGS-SHOP');
 $('shopCar').textContent=`SLOT ${String(n).padStart(2,'0')} · ${lang()==='en'?r.model.replace('Traffic-Coupé','Traffic Coupe').replace('Krankenwagen','Ambulance').replace('Feuerwehr','Fire Truck').replace('Kastenwagen','Panel Van'):r.model} · ${r.installedCount}/${r.totalCount} ${t('parts','Teile')} · ${r.uniqueCount}/9 Unique`;
 $('shopSub').textContent=t('Install saved upgrade packages by category. No in-game shop unlock or horsepower prediction.',
 'Gespeicherte Tuningpakete je Kategorie. Keine Freischaltung des Ingame-Shops oder Leistungsprognose.');
 $('shopRestore').textContent=t('RESTORE SHOP ENTRY','SHOP-STARTSTAND WIEDERHERSTELLEN');
 $('shopUniqueTitle').textContent=t('OUTRUN UNIQUE UPGRADES','OUTRUN-UNIQUE-UPGRADES');
 hint.textContent=r.traffic?t('TRAFFIC EXPERIMENT: package bars are not real HP values. Keep a working K01 backup; Stage recipes can reduce performance.',
 'TRAFFIC-EXPERIMENT: Die Stufen sind keine echten PS-Werte. K01-Backup behalten; Pakete können Leistung verringern.'):
 t('Saved part flags only. Real handling depends on the game and installed vehicle data.',
 'Nur gespeicherte Teile-Flags. Die Fahrphysik hängt von den Spieldaten ab.');
 if(!snapshots.has(n))snapshots.set(n,A.capture(c.save,c.garage,n));
 const list=$('shopCategories');list.replaceChildren();
 for(const g of A.GROUPS){const info=r.groups.find(x=>x.id===g.id),label=lang()==='de'?g.de:g.en;
 const row=document.createElement('div');row.className='shop-category';
 const name=document.createElement('div');name.className='shop-category-label';name.textContent=label;
 const flags=document.createElement('span');flags.className='shop-flags';flags.textContent=info.enabled.length+' / '+info.max;flags.title=t('Installed / available parts','Installiert / verfügbare Teile');
 const selection=document.createElement('div');selection.className='shop-levels';
 const shownLevel=info.allInstalled?3:info.level;
 if(info.allInstalled){row.classList.add('all-installed');name.title=t('All available flags active (experimental)','Alle verfügbaren Flags aktiv (experimentell)');}
 for(let lvl=0;lvl<=3;lvl++){
  const btn=document.createElement('button');btn.className='shop-level'+(shownLevel===lvl?' selected':'');btn.type='button';
  btn.textContent=t(...labels[['stock','street','pro','extreme'][lvl]]);
  if(info.allInstalled&&lvl===3){btn.title=t('MAX OUT: all active flags installed, including incompatible ones.','MAX OUT: alle aktiven Flags installiert, einschließlich inkompatibler Teile.');btn.setAttribute('data-max-out','true');}
  btn.setAttribute('aria-label',label+' '+btn.textContent+(info.allInstalled&&lvl===3?' – MAX OUT':''));btn.setAttribute('aria-pressed',String(shownLevel===lvl));
  btn.onclick=()=>{if(r.traffic&&(g.id==='susp'||g.id==='turbo')&&lvl>0){const yes=confirm(t('This may make your traffic car unplayable. Continue?',
  'Dadurch könnte dein Traffic-Auto unfahrbar werden. Fortfahren?'));if(!yes)return;}
  try{A.apply(c.save,c.garage,n,g.id,lvl);window.UndergroundLabHost?.changed(t(label+' · '+btn.textContent+' saved.',label+' · '+btn.textContent+' gespeichert.'));render();}
  catch(e){window.UndergroundLabHost?.message(e.message,true);}};selection.append(btn);
 }
 row.append(name,flags,selection);list.append(row);
 }
 const unique=$('shopUniques');unique.replaceChildren();
 A.UNIQUE_NAMES.forEach((name,i)=>{const b=document.createElement('button');b.type='button';b.className='shop-unique'+(r.unique[i]?' active':'');
 b.textContent=(lang()==='de'?A.GROUPS[i].de:name)+(r.unique[i]?' ✓':' +');b.setAttribute('aria-pressed',String(!!r.unique[i]));
 b.onclick=()=>{try{A.applyUnique(c.save,c.garage,n,i,!r.unique[i]);window.UndergroundLabHost?.changed(t('Unique upgrade updated.','Unique-Upgrade aktualisiert.'));render();}
 catch(e){window.UndergroundLabHost?.message(e.message,true);}};unique.append(b);});}
 $('shopRestore').onclick=()=>{const c=ctx(),n=c?.slot||1;if(!c?.loaded)return;
 const snap=snapshots.get(n);if(!snap)return;
 if(!confirm(t('Restore the setup from when you first opened this car in the shop?','Tuningstand vom ersten Öffnen dieses Fahrzeugs im Shop wiederherstellen?')))return;
 try{A.restore(c.save,c.garage,n,snap);window.UndergroundLabHost?.changed(t('Performance restored.','Leistungsdaten wiederhergestellt.'));render();}
 catch(e){window.UndergroundLabHost?.message(e.message,true);}};
 window.addEventListener('underground-language-change',render);
 window.USCareerPerfUI={render};render();
})();
