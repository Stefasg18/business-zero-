(()=>{
  if(window.__BZ_RACING_DIRECTION_V532__)return;
  window.__BZ_RACING_DIRECTION_V532__=true;

  const VERSION='5.5';
  const NEEDLE_SPEED=1.45;
  window.BZ_APP_VERSION=VERSION;

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

  function enforceVersion(){
    const top=document.querySelector('.topbar .eyebrow');
    if(top)top.textContent=`BUSINESS GAME · ${VERSION}`;
    document.querySelectorAll('.v53-sheet header span').forEach(x=>x.textContent=`BUSINESS GAME · ${VERSION}`);
    const social=document.querySelector('.v53-head>div>span');
    if(social)social.textContent=`ДРУЗЬЯ · ${VERSION}`;
    document.title=`Бизнес с нуля ${VERSION}`;
  }

  function fixCars(){
    document.querySelectorAll('.v53-lane>div>i').forEach((car,index)=>{
      if(car.textContent==='🏁')car.textContent='🚕';
      car.setAttribute('aria-label',`Машина ${index+1}`);
    });
    enforceVersion();
  }

  function accelerateNeedle(needle){
    if(!needle||needle.id!=='v53Needle')return;
    const raw=String(needle.style.left||'');
    if(!raw.endsWith('%')||needle.dataset.v533Adjusted===raw)return;
    const left=Number.parseFloat(raw);
    if(!Number.isFinite(left))return;
    const adjusted=Math.max(0,Math.min(100,50+(left-50)*NEEDLE_SPEED));
    const value=`${adjusted.toFixed(2)}%`;
    needle.dataset.v533Adjusted=value;
    if(raw!==value)needle.style.left=value;
  }

  const domObserver=new MutationObserver(records=>{
    for(const record of records){
      record.addedNodes.forEach(node=>{
        if(node.nodeType!==1)return;
        if(node.id==='v53Needle')accelerateNeedle(node);
        node.querySelectorAll?.('.v53-lane>div>i').forEach((car,index)=>{
          if(car.textContent==='🏁')car.textContent='🚕';
          car.setAttribute('aria-label',`Машина ${index+1}`);
        });
      });
    }
    enforceVersion();
  });
  domObserver.observe(document.body,{subtree:true,childList:true});

  const needleObserver=new MutationObserver(records=>{
    for(const record of records){
      if(record.target?.id==='v53Needle')accelerateNeedle(record.target);
    }
  });
  needleObserver.observe(document.body,{subtree:true,attributes:true,attributeFilter:['style']});

  fixCars();
})();
