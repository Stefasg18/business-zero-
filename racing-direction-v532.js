(()=>{
  if(window.__BZ_RACING_DIRECTION_V532__)return;
  window.__BZ_RACING_DIRECTION_V532__=true;

  const NEEDLE_SPEED=1.45;
  const watchedNeedles=new WeakSet();

  const style=document.createElement('style');
  style.id='v532RaceDirectionStyle';
  style.textContent=`
    .v53-lane>div>i{
      transform:scaleX(-1)!important;
      transform-origin:center center!important;
      display:inline-block!important;
    }
    .v53-meter{
      background:linear-gradient(90deg,#8c3540 0 44%,#2ca56e 44% 56%,#8c3540 56%)!important;
    }
  `;
  document.head.appendChild(style);

  function fixCars(root=document){
    if(root?.matches?.('.v53-lane>div>i')&&root.textContent==='🏁')root.textContent='🚕';
    root?.querySelectorAll?.('.v53-lane>div>i').forEach((car,index)=>{
      if(car.textContent==='🏁')car.textContent='🚕';
      car.setAttribute('aria-label',`Машина ${index+1}`);
    });
  }

  function watchNeedle(needle){
    if(!needle||needle.id!=='v53Needle'||watchedNeedles.has(needle))return;
    watchedNeedles.add(needle);
    let writing=false;
    const adjust=()=>{
      if(writing)return;
      const raw=String(needle.style.left||'');
      if(!raw.endsWith('%'))return;
      const left=Number.parseFloat(raw);
      if(!Number.isFinite(left))return;
      const adjusted=Math.max(0,Math.min(100,50+(left-50)*NEEDLE_SPEED));
      const value=`${adjusted.toFixed(2)}%`;
      if(raw===value)return;
      writing=true;
      needle.style.left=value;
      queueMicrotask(()=>{writing=false});
    };
    const observer=new MutationObserver(adjust);
    observer.observe(needle,{attributes:true,attributeFilter:['style']});
    adjust();
  }

  function scan(root=document){
    fixCars(root);
    if(root?.id==='v53Needle')watchNeedle(root);
    root?.querySelectorAll?.('#v53Needle').forEach(watchNeedle);
  }

  scan(document);
  const observer=new MutationObserver(records=>{
    for(const record of records){
      for(const node of record.addedNodes){if(node.nodeType===1)scan(node)}
    }
  });
  observer.observe(document.body,{subtree:true,childList:true});
})();
