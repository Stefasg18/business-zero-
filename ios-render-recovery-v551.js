(()=>{
  if(window.__BZ_IOS_RENDER_RECOVERY_V552__)return;
  window.__BZ_IOS_RENDER_RECOVERY_V552__=true;

  const VERSION='5.5.2';
  window.BZ_APP_VERSION=VERSION;
  window.__BZ_BOOT_ERRORS__=window.__BZ_BOOT_ERRORS__||[];

  function rememberError(type,value){
    try{
      window.__BZ_BOOT_ERRORS__.push({type,value:String(value||'').slice(0,260),at:Date.now()});
      if(window.__BZ_BOOT_ERRORS__.length>20)window.__BZ_BOOT_ERRORS__.shift();
    }catch{}
  }
  window.addEventListener('error',e=>rememberError('error',`${e.message||''} ${e.filename||''}:${e.lineno||0}`));
  window.addEventListener('unhandledrejection',e=>rememberError('promise',e.reason?.message||e.reason||'unhandled rejection'));

  function visible(el){
    if(!el||el.classList.contains('hidden'))return false;
    try{
      const s=getComputedStyle(el);
      return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity||1)>0;
    }catch{return true}
  }

  function removeHiddenHeavyOverlays(){
    for(const id of ['v55PartyOverlay','v50Overlay']){
      const el=document.getElementById(id);
      if(!el)continue;
      let hidden=el.classList.contains('hidden');
      try{
        const s=getComputedStyle(el);
        hidden=hidden||s.display==='none'||s.visibility==='hidden';
      }catch{}
      if(hidden)el.remove();
    }
  }

  function enforceVersion(){
    window.BZ_APP_VERSION=VERSION;
    document.title=`Бизнес с нуля ${VERSION}`;
    const badge=document.querySelector('.topbar .eyebrow');
    if(badge)badge.textContent=`BUSINESS GAME · ${VERSION}`;
  }

  function recoverLayout(){
    if(!document.body)return;
    removeHiddenHeavyOverlays();

    const partyOpen=visible(document.getElementById('v55PartyOverlay'));
    const hubOpen=visible(document.getElementById('v50Overlay'));
    const quickOpen=visible(document.getElementById('quickSheet37'));
    const miniOpen=visible(document.getElementById('miniGameModal'));
    const modalOpen=visible(document.getElementById('modal'));

    if(!partyOpen&&!hubOpen&&!quickOpen&&!miniOpen&&!modalOpen){
      document.body.classList.remove('v55-lock','v50-no-scroll','q37-lock');
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('height');
      document.documentElement.style.removeProperty('overflow');
      document.documentElement.style.removeProperty('height');
    }

    const app=document.querySelector('.app');
    const main=app?.querySelector(':scope > main');
    const active=document.querySelector('.tab-page.active');
    for(const el of [app,main,active]){
      if(!el)continue;
      el.style.removeProperty('height');
      el.style.removeProperty('max-height');
      el.style.removeProperty('overflow');
    }

    enforceVersion();
    void document.documentElement.offsetHeight;
  }

  const style=document.createElement('style');
  style.id='bzIosRenderRecovery552';
  style.textContent=`
    #v55PartyOverlay.hidden,#v50Overlay.hidden,.modal.hidden,.mini-modal.hidden,.q37-shell.hidden{display:none!important;visibility:hidden!important;pointer-events:none!important}
    body:not(.v55-lock):not(.v50-no-scroll):not(.q37-lock){height:auto!important;min-height:100dvh!important;max-height:none!important;overflow-y:auto!important;overflow-x:hidden!important}
    .app{height:auto!important;min-height:100dvh!important;max-height:none!important;overflow:visible!important}
    .app>main{display:block!important;height:auto!important;min-height:0!important;max-height:none!important;overflow:visible!important}
    .tab-page.active{display:block!important;height:auto!important;min-height:0!important;max-height:none!important;overflow:visible!important}
    @supports (-webkit-touch-callout:none){
      .v55-back,.v50-backdrop,.modal-backdrop,.mini-modal-backdrop{-webkit-backdrop-filter:none!important;backdrop-filter:none!important}
    }
  `;
  (document.head||document.documentElement).appendChild(style);

  const start=()=>{
    if(!document.body)return setTimeout(start,20);
    const observer=new MutationObserver(records=>{
      let shouldRecover=false;
      for(const record of records){
        for(const node of record.addedNodes){
          if(node.nodeType!==1)continue;
          if(node.id==='v55PartyOverlay'||node.id==='v50Overlay')shouldRecover=true;
        }
        if(record.type==='attributes')shouldRecover=true;
      }
      if(shouldRecover)queueMicrotask(recoverLayout);
    });
    observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style']});
    recoverLayout();
    [150,500,1200,2500,5000,8000].forEach(ms=>setTimeout(recoverLayout,ms));
  };
  start();

  document.addEventListener('DOMContentLoaded',()=>setTimeout(recoverLayout,0),{once:true});
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')setTimeout(recoverLayout,20)});
  window.addEventListener('pageshow',()=>setTimeout(recoverLayout,20));
})();
