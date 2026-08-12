(()=>{
  if(window.__BZ_BOOT_V5662__)return;
  window.__BZ_BOOT_V5662__=true;
  const CACHE='5662';
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  function loadScript(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.defer=true;s.onload=()=>resolve(true);s.onerror=()=>reject(new Error(`Не загрузился ${src}`));document.head.appendChild(s)});}
  function execute(name,code){const s=document.createElement('script');s.textContent=`${code}\n//# sourceURL=${name}?v=${CACHE}`;document.head.appendChild(s);s.remove();}
  async function boot(){
    try{
      await loadScript('boot-v565.js?v=5661');
      const until=Date.now()+18000;
      while(Date.now()<until){
        if(document.getElementById('tab-profile')&&typeof window.BZ_APP_VERSION!=='undefined'&&typeof window.Telegram!=='undefined')break;
        await sleep(120);
      }
      const r=await fetch(`growth-v571.js?v=${CACHE}`,{cache:'no-store'});
      if(r.ok)execute('growth-v571.js',await r.text());
    }catch(e){console.error('Growth boot error',e);}
  }
  boot();
})();
