window.BZ_CONFIG = {
  API_BASE: "https://business-zero-backend.onrender.com",
  BOT_USERNAME: "BusinessZeroGameBot"
};
window.BZ_APP_VERSION = "5.5.2";

(()=>{
  const BUILD='552';
  const modules=[
    "progression-v32.js",
    "security-v33.js",
    "admin-v34.js",
    "store-v35.js",
    "ux-v37.js",
    "ux-v37-patch.js",
    "mobile-fix-v371.js",
    "stability-v372.js",
    "arcade-v39.js",
    "ui-v39.js",
    "passive-income-v40.js",
    "quest-state-v401.js",
    "referral-v402.js",
    "action-labels-v44.js",
    "profile-cosmetics-v44.js",
    "store-personalization-v45.js",
    "title-preview-fix-v451.js",
    "profile-polish-v453.js",
    "stat-text-fix-v454.js",
    "affiliate-v46.js",
    "game-v50.js",
    "v50-polish.js",
    "season-market-fix-v502.js",
    "cards-v51.js",
    "cosmetic-access-v52.js",
    "social-racing-v53.js",
    "racing-direction-v532.js",
    "performance-v54.js",
    "party-arena-v55.js"
  ];

  // Start all network requests immediately. Execution still happens in the proven order below.
  for(const src of modules){
    const link=document.createElement('link');
    link.rel='preload';
    link.as='script';
    link.href=`${src}?v=${BUILD}`;
    document.head.appendChild(link);
  }

  function loadOnce(src,retry=0){
    return new Promise(resolve=>{
      const script=document.createElement('script');
      const suffix=retry?`&retry=${retry}`:'';
      script.src=`${src}?v=${BUILD}${suffix}`;
      script.async=false;
      let settled=false;
      const finish=ok=>{
        if(settled)return;
        settled=true;
        clearTimeout(timer);
        if(!ok)console.error(`Не удалось загрузить ${src}`);
        resolve(ok);
      };
      script.onload=()=>finish(true);
      script.onerror=()=>{
        script.remove();
        if(retry<1)loadOnce(src,retry+1).then(resolve);
        else finish(false);
      };
      const timer=setTimeout(()=>{
        script.remove();
        if(retry<1)loadOnce(src,retry+1).then(resolve);
        else finish(false);
      },8000);
      document.body.appendChild(script);
    });
  }

  async function bootModules(){
    if(window.__BZ_MODULE_BOOT_STARTED__)return;
    window.__BZ_MODULE_BOOT_STARTED__=true;
    for(const src of modules)await loadOnce(src);
    window.__BZ_MODULES_READY__=true;
    window.dispatchEvent(new CustomEvent('bz:modules-ready'));
    try{window.__BZ_FORCE_LAYOUT_RECOVERY__?.()}catch{}
  }

  if(document.readyState==='complete')bootModules();
  else window.addEventListener('load',bootModules,{once:true});
})();
