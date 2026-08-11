(()=>{
  if(window.__BZ_BOOT_V564__)return;
  window.__BZ_BOOT_V564__=true;

  const VERSION='5.6.4';
  const BUILD='564';
  const errors=[];
  window.BZ_APP_VERSION=VERSION;
  window.BZ_CONFIG={API_BASE:'https://business-zero-backend.onrender.com',BOT_USERNAME:'BusinessZeroGameBot'};
  // Party Arena remains isolated from startup until its own loader is made fully lazy.
  window.__BZ_PARTY_ARENA_V55__=true;

  const status=()=>document.getElementById('bzBoot564');
  const statusText=()=>document.getElementById('bzBoot564Text');
  const remember=e=>{errors.push(String(e?.message||e||'unknown').slice(0,180));if(errors.length>8)errors.shift()};
  const q=(text,kind='')=>{
    const d=status(),t=statusText();
    if(t)t.textContent=text;
    if(d){d.classList.remove('ok','err');if(kind)d.classList.add(kind)}
  };

  window.addEventListener('error',e=>remember(`${e.message||'JS error'} · ${String(e.filename||'').split('/').pop()}:${e.lineno||0}`));
  window.addEventListener('unhandledrejection',e=>remember(e.reason?.message||e.reason||'promise error'));

  function frame(){return new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))}
  function timeout(ms,label='тайм-аут'){return new Promise((_,rej)=>setTimeout(()=>rej(new Error(label)),ms))}
  function enforceVersion(){
    window.BZ_APP_VERSION=VERSION;
    const badge=document.querySelector('.topbar .eyebrow');
    if(badge)badge.textContent=`BUSINESS GAME · ${VERSION}`;
    document.title=`Бизнес с нуля ${VERSION}`;
  }
  function loadCss(href){
    return new Promise(resolve=>{
      const l=document.createElement('link');l.rel='stylesheet';l.href=href;
      l.onload=()=>resolve(true);l.onerror=()=>{remember(`CSS ${href}`);resolve(false)};
      document.head.appendChild(l);
      setTimeout(()=>resolve(false),5000);
    });
  }
  function loadScript(src,ms=6500){
    return Promise.race([
      new Promise((resolve,reject)=>{
        const s=document.createElement('script');s.src=src;s.async=false;
        s.onload=()=>resolve(true);s.onerror=()=>reject(new Error(`не загрузился ${src}`));
        document.head.appendChild(s);
      }),
      timeout(ms,`тайм-аут ${src}`)
    ]);
  }
  function preloadScript(src){
    const l=document.createElement('link');l.rel='preload';l.as='script';l.href=src;document.head.appendChild(l);
  }
  function installTelegramFallback(){
    if(window.Telegram?.WebApp?.initData)return false;
    const merged=new URLSearchParams(location.search);
    const hash=new URLSearchParams(String(location.hash||'').replace(/^#/,''));
    for(const [k,v] of hash.entries())if(!merged.has(k))merged.set(k,v);
    const initData=merged.get('tgWebAppData')||'';
    if(!initData)return false;
    let user={};
    try{const raw=new URLSearchParams(initData).get('user');if(raw)user=JSON.parse(raw)}catch{}
    const old=window.Telegram?.WebApp||{};
    window.Telegram=window.Telegram||{};
    window.Telegram.WebApp={
      ...old,
      initData,
      initDataUnsafe:{...(old.initDataUnsafe||{}),user},
      platform:old.platform||merged.get('tgWebAppPlatform')||'ios',
      version:old.version||merged.get('tgWebAppVersion')||'8.0',
      ready:typeof old.ready==='function'?old.ready:()=>{},
      expand:typeof old.expand==='function'?old.expand:()=>{},
      HapticFeedback:old.HapticFeedback||{impactOccurred(){},notificationOccurred(){}}
    };
    return true;
  }

  const modules=[
    'app.js','minigame.js','progression-v32.js','security-v33.js','admin-v34.js','store-v35.js',
    'ux-v37.js','ux-v37-patch.js','mobile-fix-v371.js','stability-v372.js','arcade-v39.js','ui-v39.js',
    'passive-income-v40.js','quest-state-v401.js','referral-v402.js','action-labels-v44.js','profile-cosmetics-v44.js',
    'store-personalization-v45.js','title-preview-fix-v451.js','profile-polish-v453.js','stat-text-fix-v454.js','affiliate-v46.js',
    'game-v50.js','v50-polish.js','season-market-fix-v502.js','cards-v51.js','cosmetic-access-v52.js',
    'social-racing-v53.js','racing-stability-v564.js','performance-v54.js','safe-overlay-v561.js','version-guard-v56.js'
  ];

  async function boot(){
    try{
      q('Получаю свежий интерфейс…');
      const r=await Promise.race([fetch(`./?shell=${BUILD}-${Date.now()}`,{cache:'no-store'}),timeout(7000,'не удалось получить интерфейс')]);
      if(!r?.ok)throw new Error(`страница HTTP ${r?.status||0}`);
      const source=await r.text();
      const parsed=new DOMParser().parseFromString(source,'text/html');
      if(!parsed.querySelector('.app')||!parsed.getElementById('tab-home'))throw new Error('не найден интерфейс игры');

      document.body.innerHTML=parsed.body.innerHTML;
      const diag=document.createElement('div');
      diag.id='bzBoot564';
      diag.innerHTML='<strong>Загрузка 5.6.4</strong><span id="bzBoot564Text">Интерфейс готов…</span>';
      document.body.appendChild(diag);
      enforceVersion();
      await Promise.all([loadCss(`styles.css?v=${BUILD}`),loadCss(`minigame.css?v=${BUILD}`)]);
      await frame();

      modules.forEach(name=>preloadScript(`${name}?v=${BUILD}`));

      q('Подключаю Telegram…');
      try{await loadScript('https://telegram.org/js/telegram-web-app.js?63',5000)}catch(e){remember(e)}
      if(!window.Telegram?.WebApp?.initData)installTelegramFallback();
      enforceVersion();
      await frame();

      const nativeAdd=window.addEventListener.bind(window);
      window.addEventListener=function(type,listener,options){
        const out=nativeAdd(type,listener,options);
        if(type==='load'&&document.readyState==='complete')setTimeout(()=>{
          try{typeof listener==='function'?listener.call(window,new Event('load')):listener?.handleEvent?.(new Event('load'))}catch(e){remember(e)}
        },0);
        return out;
      };

      for(let i=0;i<modules.length;i++){
        const name=modules[i];
        q(`Модуль ${i+1}/${modules.length}: ${name}`);
        await frame();
        try{await loadScript(`${name}?v=${BUILD}`,6500)}catch(e){remember(e)}
        enforceVersion();
      }
      window.addEventListener=nativeAdd;
      enforceVersion();

      const d=status();
      if(errors.length){
        q(`Готово. Пропущено ошибок: ${errors.length}`,'err');
        if(d)d.title=errors.join('\n');
        setTimeout(()=>d?.classList.add('ok'),2600);
      }else{
        q('Готово','ok');
      }
    }catch(e){
      remember(e);
      q(`Ошибка запуска: ${String(e?.message||e)}`,'err');
    }
  }

  boot();
})();
