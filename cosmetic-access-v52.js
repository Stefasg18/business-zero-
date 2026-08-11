(()=>{
  if(window.__BZ_COSMETIC_ACCESS_V52__)return;
  window.__BZ_COSMETIC_ACCESS_V52__=true;

  const DEFAULTS=new Set(['title_novice','avatar_initial','name_glow_none','avatar_glow_none']);

  function allowedSet(){
    const p=window.state?.profileCustomization;
    return new Set([...(p?.unlocked||[]),...DEFAULTS]);
  }

  function applyLocks(root=document){
    const panel=root.querySelector?.('#cosmeticsPanelV44')||document.getElementById('cosmeticsPanelV44');
    if(!panel)return;
    const allowed=allowedSet();

    panel.querySelectorAll('[data-equip-cosmetic]').forEach(btn=>{
      const id=String(btn.dataset.equipCosmetic||'');
      const ok=allowed.has(id);
      btn.hidden=!ok;
      btn.style.display=ok?'':'none';
    });

    panel.querySelectorAll('.bz-cos-group').forEach(group=>{
      const visible=[...group.querySelectorAll('[data-equip-cosmetic]')].some(b=>!b.hidden&&b.style.display!=='none');
      group.style.display=visible?'':'none';
    });

    const credits=Number(window.state?.profileCustomization?.renameCredits||0);
    const credit=document.querySelector('.bz-credit');
    if(credit&&credits>=999999){
      credit.textContent='👑 OWNER';
      credit.title='Владелец: смена имени без жетонов';
    }
  }

  const observer=new MutationObserver(records=>{
    for(const r of records){
      for(const n of r.addedNodes){
        if(n.nodeType===1&&(n.id==='cosmeticsPanelV44'||n.querySelector?.('#cosmeticsPanelV44'))){
          queueMicrotask(()=>applyLocks(document));
          return;
        }
      }
    }
  });
  observer.observe(document.documentElement,{subtree:true,childList:true});

  document.addEventListener('click',()=>queueMicrotask(()=>applyLocks(document)),true);
  document.addEventListener('visibilitychange',()=>{
    if(document.visibilityState==='visible')setTimeout(()=>applyLocks(document),50);
  });
  window.addEventListener('pageshow',()=>setTimeout(()=>applyLocks(document),50));
  setTimeout(()=>applyLocks(document),300);
  setTimeout(()=>applyLocks(document),1200);
})();
