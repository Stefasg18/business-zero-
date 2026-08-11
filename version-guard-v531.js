(()=>{
  if(window.__BZ_VERSION_GUARD_V531__) return;
  window.__BZ_VERSION_GUARD_V531__=true;

  const VERSION=window.BZ_APP_VERSION||'5.3.1';
  const titleText=`Бизнес с нуля ${VERSION}`;
  const badgeText=`BUSINESS GAME · ${VERSION}`;

  function enforce(){
    if(document.title!==titleText) document.title=titleText;
    const badge=document.querySelector('.topbar .eyebrow');
    if(badge&&badge.textContent!==badgeText) badge.textContent=badgeText;
  }

  enforce();
  const observer=new MutationObserver(enforce);
  observer.observe(document.documentElement,{subtree:true,childList:true,characterData:true});
  window.addEventListener('pageshow',enforce);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')enforce();});
})();
