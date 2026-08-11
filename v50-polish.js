(()=>{
  if(window.__BZ_V50_POLISH__)return;
  window.__BZ_V50_POLISH__=true;

  const safe=s=>typeof escapeHtml==='function'?escapeHtml(s):String(s??'').replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  const num=n=>typeof fmt==='function'?fmt(Number(n)||0):Math.floor(Number(n)||0).toLocaleString('ru-RU');
  let statsLoaded=false;
  let loading=false;

  function currentUserId(){
    try{return Number(typeof telegramUser==='function'?telegramUser()?.id:window.Telegram?.WebApp?.initDataUnsafe?.user?.id)||0;}catch{return 0;}
  }

  function ensureLifetimeShell(){
    const profile=document.querySelector('#tab-profile .profile-card');
    if(!profile||document.getElementById('v50LifetimeStats'))return;
    const section=document.createElement('section');
    section.id='v50LifetimeStats';
    section.className='v50-life-card';
    section.innerHTML=`
      <div class="v50-life-head">
        <div><span>СТАТИСТИКА ЗА ВСЁ ВРЕМЯ</span><strong>Карьерный профиль</strong></div>
        <div class="v50-life-mark">∞</div>
      </div>
      <div id="v50LifeGrid" class="v50-life-grid">
        <div class="v50-life-loading">Открой профиль — статистика загрузится автоматически.</div>
      </div>`;
    profile.insertAdjacentElement('afterend',section);
  }

  async function loadLifetime(force=false){
    if((statsLoaded&&!force)||loading||!window.ONLINE_MODE)return;
    const id=currentUserId();if(!id)return;
    loading=true;ensureLifetimeShell();
    const grid=document.getElementById('v50LifeGrid');if(grid)grid.innerHTML='<div class="v50-life-loading">Загрузка статистики…</div>';
    try{
      const d=await api(`/api/v5/profile/${id}`),p=d.profile||{};
      const success=Number(p.deals)>0?Math.round(Number(p.successfulDeals||0)/Number(p.deals)*100):0;
      if(grid)grid.innerHTML=`
        <div><i>♛</i><span>Престиж</span><strong>P${num(p.prestige)}</strong></div>
        <div><i>🏁</i><span>Сезон</span><strong>${num(p.seasonTier)} ур.</strong></div>
        <div><i>🤝</i><span>Сделок</span><strong>${num(p.deals)}</strong></div>
        <div><i>✓</i><span>Успешность</span><strong>${success}%</strong></div>
        <div><i>🏢</i><span>Бизнесов</span><strong>${num(p.businesses)}</strong></div>
        <div><i>🏆</i><span>Достижений</span><strong>${num(p.achievements)}</strong></div>
        <div><i>🔥</i><span>Лучшая серия</span><strong>${num(p.bestStreak)} дн.</strong></div>
        <div><i>✨</i><span>Оформлений</span><strong>${num(p.cosmetics)}</strong></div>`;
      statsLoaded=true;
    }catch(e){if(grid)grid.innerHTML=`<div class="v50-life-loading error">${safe(e.message||'Не удалось загрузить статистику')}</div>`;}
    finally{loading=false;}
  }

  function wireProfile(){
    document.querySelector('.nav-btn[data-tab="profile"]')?.addEventListener('click',()=>setTimeout(()=>loadLifetime(true),100));
  }

  const style=document.createElement('style');
  style.textContent=`
    .bz-name-glow-emerald{color:#c8ffe9!important;text-shadow:0 0 5px #34d399,0 0 16px rgba(52,211,153,.78),0 0 28px rgba(16,185,129,.38)!important}
    .bz-avatar-glow-ice{box-shadow:0 0 0 2px rgba(103,232,249,.34),0 0 16px rgba(103,232,249,.82),0 0 30px rgba(56,189,248,.35),inset 0 1px 0 rgba(255,255,255,.18)!important}
    .v50-life-card{margin-top:13px;padding:17px;border-radius:22px;border:1px solid rgba(111,140,220,.15);background:radial-gradient(circle at 100% 0,rgba(94,94,221,.10),transparent 35%),linear-gradient(145deg,rgba(18,33,56,.97),rgba(12,24,42,.98));box-shadow:0 14px 32px rgba(0,0,0,.14),inset 0 1px 0 rgba(255,255,255,.025);text-align:left}
    .v50-life-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:13px}.v50-life-head>div:first-child{display:flex;flex-direction:column}.v50-life-head span{font-size:9px;font-weight:950;letter-spacing:1.45px;color:#7287ad}.v50-life-head strong{font-size:18px;line-height:1.15;margin-top:3px;color:#f5f8ff}.v50-life-mark{width:40px;height:40px;border-radius:13px;display:grid;place-items:center;background:linear-gradient(145deg,rgba(90,121,229,.20),rgba(129,76,208,.14));border:1px solid rgba(120,139,226,.14);font-size:19px;font-weight:950;color:#aebcff}
    .v50-life-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.v50-life-grid>div:not(.v50-life-loading){min-width:0;padding:11px 10px;border-radius:15px;border:1px solid rgba(119,142,203,.10);background:rgba(255,255,255,.025);display:grid;grid-template-columns:25px 1fr;grid-template-rows:auto auto;column-gap:7px;align-items:center}.v50-life-grid i{grid-row:1/3;width:25px;height:25px;border-radius:9px;display:grid;place-items:center;background:rgba(93,122,212,.10);font-style:normal;font-size:11px}.v50-life-grid span{font-size:8px;color:#7687a3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.v50-life-grid strong{font-size:12px;color:#f4f7ff;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.v50-life-loading{grid-column:1/-1;padding:18px;text-align:center;color:#74849e;font-size:9px;border:1px dashed rgba(116,139,200,.12);border-radius:14px}.v50-life-loading.error{color:#e49c9c}
    @media(max-width:360px){.v50-life-card{padding:14px}.v50-life-head strong{font-size:16px}.v50-life-grid{gap:6px}.v50-life-grid>div:not(.v50-life-loading){padding:9px 7px;grid-template-columns:22px 1fr;column-gap:5px}.v50-life-grid i{width:22px;height:22px}.v50-life-grid strong{font-size:10.5px}.v50-life-grid span{font-size:7px}}
    @media(prefers-reduced-motion:reduce){.v50-overlay *,.v50-profile-pop *,.v50-notify-pop *,.v50-gift-pop *{animation:none!important;transition:none!important}}
  `;
  document.head.appendChild(style);

  function boot(){ensureLifetimeShell();wireProfile();document.title='Бизнес с нуля 5.0';}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
