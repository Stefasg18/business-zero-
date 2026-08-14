(()=>{
  if(window.__BZ_BOOT_V5662__)return;
  window.__BZ_BOOT_V5662__=true;
  const CACHE='5669';
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  function loadScript(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.defer=true;s.onload=()=>resolve(true);s.onerror=()=>reject(new Error(`Не загрузился ${src}`));document.head.appendChild(s)});}
  function execute(name,code){const s=document.createElement('script');s.textContent=`${code}\n//# sourceURL=${name}?v=${CACHE}`;document.head.appendChild(s);s.remove();}
  function installCanvasRoundRect(){
    try{
      const p=window.CanvasRenderingContext2D?.prototype;if(!p||p.roundRect)return;
      p.roundRect=function(x,y,w,h,r=0){const rr=Math.max(0,Math.min(Number(Array.isArray(r)?r[0]:r)||0,Math.abs(w)/2,Math.abs(h)/2));this.moveTo(x+rr,y);this.arcTo(x+w,y,x+w,y+h,rr);this.arcTo(x+w,y+h,x,y+h,rr);this.arcTo(x,y+h,x,y,rr);this.arcTo(x,y,x+w,y,rr);this.closePath();return this;};
    }catch{}
  }
  async function boot(){
    try{
      await loadScript('boot-v565.js?v=5669');
      const until=Date.now()+18000;
      while(Date.now()<until){
        if(document.getElementById('tab-profile')&&typeof window.BZ_APP_VERSION!=='undefined'&&typeof window.Telegram!=='undefined')break;
        await sleep(120);
      }
      installCanvasRoundRect();
      const growth=await fetch(`growth-v571.js?v=${CACHE}`,{cache:'no-store'});
      if(growth.ok){
        execute('growth-v571.js',await growth.text());
        setTimeout(()=>{const badge=document.querySelector('.growth571-hot');if(badge)badge.textContent='🔥 Делись прогрессом';},450);
      }
      const ui=await fetch(`unified-ui-v572.js?v=${CACHE}`,{cache:'no-store'});
      if(ui.ok)execute('unified-ui-v572.js',await ui.text());
      const fix=await fetch(`unified-ui-fix-v573.js?v=${CACHE}`,{cache:'no-store'});
      if(fix.ok)execute('unified-ui-fix-v573.js',await fix.text());
      const responsive=await fetch(`responsive-fix-v574.js?v=${CACHE}`,{cache:'no-store'});
      if(responsive.ok)execute('responsive-fix-v574.js',await responsive.text());
      const spend=await fetch(`business-spend-feedback-v575.js?v=${CACHE}`,{cache:'no-store'});
      if(spend.ok)execute('business-spend-feedback-v575.js',await spend.text());
    }catch(e){console.error('Growth/UI boot error',e);}
  }
  boot();
})();
