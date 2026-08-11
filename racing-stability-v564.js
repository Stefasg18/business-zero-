(()=>{
  if(window.__BZ_RACING_STABILITY_V564__)return;
  window.__BZ_RACING_STABILITY_V564__=true;

  const NEEDLE_SPEED=1.45;
  const watchedNeedles=new WeakSet();

  const style=document.createElement('style');
  style.id='v564RaceStabilityStyle';
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

  function fixCar(car){
    if(!car||car.nodeType!==1)return;
    if(car.matches?.('.v53-lane>div>i')&&car.textContent==='🏁')car.textContent='🚕';
    car.querySelectorAll?.('.v53-lane>div>i').forEach(x=>{if(x.textContent==='🏁')x.textContent='🚕'});
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

  function scan(node=document){
    if(node?.id==='v53Needle')watchNeedle(node);
    node?.querySelectorAll?.('#v53Needle').forEach(watchNeedle);
    fixCar(node);
  }

  scan(document);
  const observer=new MutationObserver(records=>{
    for(const record of records){
      for(const node of record.addedNodes){
        if(node.nodeType===1)scan(node);
      }
    }
  });
  observer.observe(document.body,{subtree:true,childList:true});
})();
