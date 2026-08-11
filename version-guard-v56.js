(()=>{
  if(window.__BZ_VERSION_GUARD_V56__)return;
  window.__BZ_VERSION_GUARD_V56__=true;
  const VERSION='5.6';
  window.BZ_APP_VERSION=VERSION;

  function enforce(){
    const badge=document.querySelector('.topbar .eyebrow');
    if(badge)badge.textContent=`BUSINESS GAME · ${VERSION}`;
    document.title=`Бизнес с нуля ${VERSION}`;
  }

  function diagnoseTelegram(){
    const tg=window.Telegram?.WebApp;
    const mode=document.getElementById('modeBadge');
    if(!mode)return;
    if(tg?.initData){
      if(mode.textContent==='DEMO'||mode.textContent==='TG ERROR'){
        mode.textContent='ONLINE';
        mode.classList.add('online');
      }
      return;
    }
    const platform=String(tg?.platform||'unknown');
    if(platform!=='unknown'){
      mode.textContent='TG ERROR';
      mode.classList.remove('online');
      mode.title='Telegram открыл Mini App без initData. Открой игру кнопкой Играть в боте.';
    }
  }

  enforce();
  setTimeout(enforce,0);
  setTimeout(enforce,700);
  setTimeout(enforce,1800);
  window.addEventListener('load',()=>{enforce();setTimeout(diagnoseTelegram,250)});
  window.addEventListener('pageshow',()=>{enforce();setTimeout(diagnoseTelegram,100)});
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){enforce();setTimeout(diagnoseTelegram,100)}});

  const observer=new MutationObserver(enforce);
  observer.observe(document.documentElement,{subtree:true,childList:true,characterData:true});
})();
