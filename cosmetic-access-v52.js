(()=>{
  if(window.__BZ_COSMETIC_ACCESS_V52__)return;
  window.__BZ_COSMETIC_ACCESS_V52__=true;

  const VERSION='5.5';
  window.BZ_APP_VERSION=VERSION;
  const DEFAULTS=new Set(['title_novice','avatar_initial','name_glow_none','avatar_glow_none']);

  if(!window.__BZ_LATE_LOAD_COMPAT_V531__){
    window.__BZ_LATE_LOAD_COMPAT_V531__=true;
    const originalAdd=window.addEventListener.bind(window);
    window.addEventListener=function(type,listener,options){
      const result=originalAdd(type,listener,options);
      if(type==='load'&&document.readyState==='complete'){
        setTimeout(()=>{
          try{
            if(typeof listener==='function')listener.call(window,new Event('load'));
            else if(listener&&typeof listener.handleEvent==='function')listener.handleEvent(new Event('load'));
          }catch(e){console.error('late load listener',e);}
        },0);
      }
      return result;
    };
  }

  function enforceVersion(){
    const title=`Бизнес с нуля ${VERSION}`;
    const badge=`BUSINESS GAME · ${VERSION}`;
    if(document.title!==title)document.title=title;
    const v=document.querySelector('.topbar .eyebrow');
    if(v&&v.textContent!==badge)v.textContent=badge;
  }

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
    if(credit&&credits>=999999){credit.textContent='👑 OWNER';credit.title='Владелец: смена имени без жетонов';}
  }

  function ensureScript(src,flag,attr,done){
    if(window[flag]){done?.();return;}
    const existing=document.querySelector(`script[${attr}]`);
    if(existing){if(done)existing.addEventListener('load',done,{once:true});return;}
    const script=document.createElement('script');
    script.setAttribute(attr,'1');
    script.src=`${src}?v=551-${Date.now()}`;
    script.async=false;
    script.onload=()=>done?.();
    script.onerror=()=>console.error(`Не удалось загрузить ${src}`);
    document.body.appendChild(script);
  }
  const ensureRenderRecovery=()=>ensureScript('ios-render-recovery-v551.js','__BZ_IOS_RENDER_RECOVERY_V551__','data-v551-render-recovery');
  const ensureRacePatch=()=>ensureScript('racing-direction-v532.js','__BZ_RACING_DIRECTION_V532__','data-v55-racing-patch');
  const ensurePerformancePatch=()=>ensureScript('performance-v54.js','__BZ_PERFORMANCE_V54__','data-v55-performance-patch');
  const ensurePartyArena=()=>ensureScript('party-arena-v55.js','__BZ_PARTY_ARENA_V55__','data-v55-party-arena');

  // Start the iOS/WebView recovery before the later fixed-overlay modules load.
  ensureRenderRecovery();

  const observer=new MutationObserver(records=>{
    enforceVersion();
    for(const r of records){
      for(const n of r.addedNodes){
        if(n.nodeType===1&&(n.id==='cosmeticsPanelV44'||n.querySelector?.('#cosmeticsPanelV44'))){
          queueMicrotask(()=>applyLocks(document));
          return;
        }
      }
    }
  });
  observer.observe(document.documentElement,{subtree:true,childList:true,characterData:true});

  document.addEventListener('click',()=>queueMicrotask(()=>{applyLocks(document);enforceVersion();}),true);
  document.addEventListener('visibilitychange',()=>{
    if(document.visibilityState==='visible'){
      enforceVersion();
      ensureRenderRecovery();
      ensureRacePatch();
      ensurePerformancePatch();
      ensurePartyArena();
    }
  });
  window.addEventListener('pageshow',()=>{
    enforceVersion();
    ensureRenderRecovery();
    ensureRacePatch();
    ensurePerformancePatch();
    ensurePartyArena();
  });
  setTimeout(()=>applyLocks(document),300);
  setTimeout(()=>applyLocks(document),1200);
  setTimeout(enforceVersion,0);
  setTimeout(enforceVersion,800);
  setTimeout(ensureRacePatch,1100);
  setTimeout(ensurePerformancePatch,1500);
  setTimeout(ensureRenderRecovery,1650);
  setTimeout(ensurePartyArena,1900);
})();
