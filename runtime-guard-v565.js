(()=>{
  if(window.__BZ_RUNTIME_GUARD_V565__)return;
  window.__BZ_RUNTIME_GUARD_V565__=true;
  const VERSION='5.6.5';
  window.BZ_APP_VERSION=VERSION;

  function enforceVersion(){
    const badge=document.querySelector('.topbar .eyebrow');
    if(badge&&badge.textContent!==`BUSINESS GAME · ${VERSION}`)badge.textContent=`BUSINESS GAME · ${VERSION}`;
    if(document.title!==`Бизнес с нуля ${VERSION}`)document.title=`Бизнес с нуля ${VERSION}`;
  }

  function enforceMode(){
    const mode=document.getElementById('modeBadge');
    if(!mode)return;
    const tg=window.Telegram?.WebApp;
    if(tg?.initData){
      if(mode.textContent!=='ONLINE')mode.textContent='ONLINE';
      mode.classList.add('online');
      return;
    }
    if(document.readyState==='complete' && String(tg?.platform||'unknown')!=='unknown'){
      if(mode.textContent==='ЗАГРУЗКА')mode.textContent='TG ERROR';
      mode.classList.remove('online');
    }
  }

  function enforce(){enforceVersion();enforceMode()}
  enforce();
  let ticks=0;
  const timer=setInterval(()=>{
    enforce();
    ticks+=1;
    if(ticks>=40)clearInterval(timer);
  },500);
  window.addEventListener('pageshow',enforce);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')enforce()});
})();