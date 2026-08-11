(()=>{
  if(window.__BZ_SAFE_OVERLAY_V561__)return;
  window.__BZ_SAFE_OVERLAY_V561__=true;

  function isHidden(el){
    if(!el)return true;
    if(el.classList.contains('hidden'))return true;
    try{
      const s=getComputedStyle(el);
      return s.display==='none'||s.visibility==='hidden'||Number(s.opacity||1)===0;
    }catch{return false;}
  }

  function cleanup(){
    for(const id of ['v50Overlay','v55PartyOverlay']){
      const el=document.getElementById(id);
      if(el&&isHidden(el))el.remove();
    }
    const visibleOverlay=['v50Overlay','v55PartyOverlay','quickSheet37','miniGameModal','modal']
      .map(id=>document.getElementById(id))
      .some(el=>el&&!isHidden(el));
    if(!visibleOverlay){
      document.body?.classList.remove('v50-no-scroll','v55-lock','q37-lock');
      document.body?.style.removeProperty('overflow');
      document.documentElement.style.removeProperty('overflow');
    }
  }

  if(document.readyState==='complete')setTimeout(cleanup,0);
  else window.addEventListener('load',()=>setTimeout(cleanup,0),{once:true});
  document.addEventListener('click',()=>setTimeout(cleanup,80),true);
  window.addEventListener('pageshow',()=>setTimeout(cleanup,30));
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')setTimeout(cleanup,30)});
})();
