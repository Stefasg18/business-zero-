(()=>{
  if(window.__BZ_IOS_RENDER_RECOVERY_V551__)return;
  window.__BZ_IOS_RENDER_RECOVERY_V551__=true;

  function visible(el){
    if(!el||el.classList.contains('hidden'))return false;
    try{return getComputedStyle(el).display!=='none'&&getComputedStyle(el).visibility!=='hidden'}catch{return true}
  }

  function removeHiddenHeavyOverlays(){
    const party=document.getElementById('v55PartyOverlay');
    if(party?.classList.contains('hidden'))party.remove();
    const hub=document.getElementById('v50Overlay');
    if(hub?.classList.contains('hidden'))hub.remove();
  }

  function recoverLayout(){
    if(!document.body)return;
    removeHiddenHeavyOverlays();

    const partyOpen=visible(document.getElementById('v55PartyOverlay'));
    const hubOpen=visible(document.getElementById('v50Overlay'));
    const quickOpen=visible(document.getElementById('quickSheet37'));
    if(!partyOpen&&!hubOpen&&!quickOpen){
      document.body.classList.remove('v55-lock','v50-no-scroll','q37-lock');
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('height');
      document.documentElement.style.removeProperty('overflow');
      document.documentElement.style.removeProperty('height');
    }

    const active=document.querySelector('.tab-page.active');
    if(active){
      active.style.removeProperty('height');
      active.style.removeProperty('max-height');
      active.style.removeProperty('overflow');
    }

    // Force a cheap WebKit repaint after stale compositor layers are removed.
    void document.documentElement.offsetHeight;
  }

  const style=document.createElement('style');
  style.id='bzIosRenderRecovery551';
  style.textContent=`
    #v55PartyOverlay.hidden,#v50Overlay.hidden{display:none!important;visibility:hidden!important;pointer-events:none!important}
    body:not(.v55-lock):not(.v50-no-scroll):not(.q37-lock){height:auto!important;min-height:100dvh!important;overflow-y:auto!important;overflow-x:hidden!important}
    .app{height:auto!important;min-height:100dvh!important}
    .app>main{height:auto!important;min-height:0!important;max-height:none!important;overflow:visible!important}
    .tab-page.active{height:auto!important;min-height:0!important;max-height:none!important;overflow:visible!important}
    @supports (-webkit-touch-callout:none){
      .v55-back,.v50-backdrop{-webkit-backdrop-filter:none!important;backdrop-filter:none!important}
    }
  `;
  document.head.appendChild(style);

  const observer=new MutationObserver(records=>{
    let shouldRecover=false;
    for(const record of records){
      for(const node of record.addedNodes){
        if(node.nodeType!==1)continue;
        if((node.id==='v55PartyOverlay'||node.id==='v50Overlay')&&node.classList.contains('hidden')){
          queueMicrotask(()=>{
            if(node.isConnected&&node.classList.contains('hidden'))node.remove();
            recoverLayout();
          });
        }
      }
      if(record.type==='attributes'&&(record.target?.id==='v55PartyOverlay'||record.target?.id==='v50Overlay'))shouldRecover=true;
    }
    if(shouldRecover)queueMicrotask(recoverLayout);
  });

  const start=()=>{
    if(!document.body)return setTimeout(start,25);
    observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
    recoverLayout();
    setTimeout(recoverLayout,250);
    setTimeout(recoverLayout,1200);
  };
  start();

  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')setTimeout(recoverLayout,20)});
  window.addEventListener('pageshow',()=>setTimeout(recoverLayout,20));
})();
