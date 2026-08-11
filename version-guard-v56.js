(()=>{
  if(window.__BZ_VERSION_GUARD_V562__)return;
  window.__BZ_VERSION_GUARD_V562__=true;
  const VERSION='5.6.2';
  window.BZ_APP_VERSION=VERSION;

  function enforce(){
    const badge=document.querySelector('.topbar .eyebrow');
    if(badge&&badge.textContent!==`BUSINESS GAME · ${VERSION}`)badge.textContent=`BUSINESS GAME · ${VERSION}`;
    document.title=`Бизнес с нуля ${VERSION}`;
  }

  function diagnoseTelegram(){
    const tg=window.Telegram?.WebApp;
    const mode=document.getElementById('modeBadge');
    if(!mode)return;
    if(tg?.initData){
      if(['DEMO','TG ERROR','ЗАГРУЗКА'].includes(mode.textContent)){
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
  [0,400,1200,3000].forEach(ms=>setTimeout(enforce,ms));
  window.addEventListener('load',()=>{enforce();setTimeout(diagnoseTelegram,250)},{once:true});
  window.addEventListener('pageshow',()=>{enforce();setTimeout(diagnoseTelegram,100)});
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){enforce();setTimeout(diagnoseTelegram,100)}});
})();
