(()=>{
  if(window.__BZ_RUNTIME_GUARD_V565__)return;
  window.__BZ_RUNTIME_GUARD_V565__=true;
  const VERSION='5.6.5';
  window.BZ_APP_VERSION=VERSION;

  function enforceVersion(){
    window.BZ_APP_VERSION=VERSION;
    const badge=document.querySelector('.topbar .eyebrow');
    if(badge&&badge.textContent!==`BUSINESS GAME · ${VERSION}`)badge.textContent=`BUSINESS GAME · ${VERSION}`;
    if(document.title!==`Бизнес с нуля ${VERSION}`)document.title=`Бизнес с нуля ${VERSION}`;
  }

  function enforceMode(){
    const mode=document.getElementById('modeBadge');
    if(!mode)return;
    const tg=window.Telegram?.WebApp;
    const text=String(mode.textContent||'').trim();
    if(tg?.initData){
      if(['ЗАГРУЗКА','DEMO','TG ERROR'].includes(text)){
        mode.textContent='ONLINE';
        mode.classList.add('online');
        return;
      }
      if(text==='ONLINE'){
        mode.classList.add('online');
        return;
      }
      mode.classList.remove('online');
      return;
    }
    if(document.readyState==='complete' && String(tg?.platform||'unknown')!=='unknown'){
      if(text==='ЗАГРУЗКА')mode.textContent='TG ERROR';
      mode.classList.remove('online');
    }
  }

  function enforce(){enforceVersion();enforceMode()}
  enforce();

  // Legacy feature modules still contain their historical release labels (3.9, 4.1, 5.5).
  // Observe the top badge so any late/asynchronous rewrite is corrected immediately.
  let observedBadge=null;
  let badgeObserver=null;
  function watchBadge(){
    const badge=document.querySelector('.topbar .eyebrow');
    if(!badge||badge===observedBadge)return;
    badgeObserver?.disconnect();
    observedBadge=badge;
    badgeObserver=new MutationObserver(()=>{
      if(badge.textContent!==`BUSINESS GAME · ${VERSION}`)badge.textContent=`BUSINESS GAME · ${VERSION}`;
    });
    badgeObserver.observe(badge,{childList:true,characterData:true,subtree:true});
    enforceVersion();
  }
  watchBadge();
  const bodyObserver=new MutationObserver(()=>watchBadge());
  if(document.body)bodyObserver.observe(document.body,{childList:true,subtree:true});

  let ticks=0;
  const fast=setInterval(()=>{
    enforce();watchBadge();
    ticks+=1;
    if(ticks>=40){
      clearInterval(fast);
      setInterval(()=>{enforce();watchBadge()},5000);
    }
  },500);

  window.addEventListener('pageshow',()=>{enforce();watchBadge()});
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){enforce();watchBadge()}});
})();