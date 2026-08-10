(() => {
  const VERSION='3.9';
  let toastTimer39=null;

  try{
    showToast=function(text){
      const el=document.getElementById('toast');if(!el)return;
      const value=String(text||'');
      el.textContent=value;
      el.classList.remove('good39','bad39');
      if(/[+]|успеш|получ|открыт|улучшен/i.test(value))el.classList.add('good39');
      if(/[−-]|неудач|ошиб|не хватает|законч/i.test(value))el.classList.add('bad39');
      el.classList.add('show');
      clearTimeout(toastTimer39);toastTimer39=setTimeout(()=>el.classList.remove('show'),2800);
    };
  }catch(e){console.error('toast v39',e)}

  function polish(){
    const version=document.querySelector('.topbar .eyebrow');if(version)version.textContent=`BUSINESS GAME · ${VERSION}`;
    document.title=`Бизнес с нуля ${VERSION}`;
    const energyCaption=document.querySelector('.stat-energy .stat-caption');if(energyCaption)energyCaption.textContent='+1 ⚡ каждые 20 сек';

    const hub=document.getElementById('quickHub37');
    if(hub){
      const xp=hub.querySelector('[data-open37="xp"]');
      if(xp){const b=xp.querySelector('b'),s=xp.querySelector('small');if(b)b.textContent='XP-тренажёр';if(s)s.textContent='Опыт без энергии';}
    }
  }

  const style=document.createElement('style');
  style.id='ui39Style';
  style.textContent=`
    html{-webkit-text-size-adjust:100%}body{font-size:15px}
    h1{font-size:26px!important}h2{font-size:23px!important}h3{font-size:18px}
    .eyebrow{font-size:11px!important;letter-spacing:1.7px!important}.muted,.hint{font-size:13px!important}
    .player-name{font-size:16px}.balance-label{font-size:13px!important}.level-badge{font-size:12px!important}
    .stat-label{font-size:11px!important}.premium-stats .stat .stat-value{font-size:20px!important}.premium-stats .stat .stat-caption{font-size:9.5px!important;line-height:1.25}

    .toast{z-index:12080!important;top:calc(env(safe-area-inset-top) + 18px)!important;bottom:auto!important;max-width:calc(100vw - 30px)!important;min-width:min(310px,calc(100vw - 30px));padding:13px 18px!important;border-radius:16px!important;font-size:14px!important;font-weight:850!important;line-height:1.3!important;box-shadow:0 18px 50px rgba(0,0,0,.45)!important;transform:translate(-50%,-18px)!important;background:rgba(15,25,43,.98)!important;border-color:rgba(132,158,220,.22)!important}.toast.show{transform:translate(-50%,0)!important}.toast.good39{border-color:rgba(72,221,157,.38)!important;background:rgba(13,45,39,.98)!important}.toast.bad39{border-color:rgba(255,103,126,.34)!important;background:rgba(48,23,31,.98)!important}

    .quick-hub37{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:9px!important;margin:14px 0 20px!important}.quick-hub37 button{min-height:68px!important;padding:13px 12px!important;border-radius:18px!important}.quick-hub37 button:nth-child(3){grid-column:1/-1}.quick-hub37 button>span{font-size:25px!important}.quick-hub37 b{font-size:14px!important;line-height:1.2}.quick-hub37 small{font-size:10.5px!important;line-height:1.3;margin-top:4px!important}.quick-hub37 i{font-size:22px!important}

    .q37-sheet{max-height:84dvh!important}.q37-head{height:76px!important;flex-basis:76px!important;padding:15px 18px!important}.q37-head span{font-size:9px!important}.q37-head h2{font-size:24px!important}.q37-head button{width:44px!important;height:44px!important;font-size:25px!important}
    .q37-body{padding:12px 12px calc(28px + env(safe-area-inset-bottom))!important}
    .q37-body .q37-filters{gap:8px!important;padding-bottom:12px!important}.q37-body .q37-filters button{height:42px!important;min-height:42px!important;max-height:42px!important;font-size:11.5px!important;border-radius:13px!important}
    .q37-body .q37-deal-list,.q37-body .q37-business-list{gap:10px!important}
    .q37-body .q37-deal,.q37-body .q37-business{grid-template-columns:52px minmax(0,1fr) 82px!important;gap:11px!important;min-height:88px!important;padding:12px!important;border-radius:18px!important}
    .q37-body .q37-icon{width:52px!important;height:52px!important;min-width:52px!important;font-size:25px!important;border-radius:15px!important}
    .q37-body .q37-main b{font-size:14px!important;line-height:1.25!important}.q37-body .q37-main span{font-size:8.5px!important;padding:4px 6px!important}.q37-body .q37-main small{font-size:11px!important;line-height:1.35!important;margin-top:4px!important}.q37-body .q37-main em{font-size:12px!important;line-height:1.3!important;margin-top:3px!important}
    .q37-body .q37-deal>button,.q37-body .q37-business>button{width:82px!important;min-width:82px!important;max-width:82px!important;height:44px!important;min-height:44px!important;font-size:11px!important;border-radius:13px!important}

    .quest-card{padding:15px!important;border-radius:19px!important}.quest-icon{width:48px!important;height:48px!important;font-size:24px!important}.quest-title{font-size:15px!important}.quest-reward{font-size:12px!important;line-height:1.35}.quest-progress-text{font-size:12px!important}.quest-btn{font-size:13px!important;padding:12px!important}.quest-summary{font-size:13px!important}

    .mini-game-copy h3{font-size:16px!important}.mini-game-copy p{font-size:12px!important;line-height:1.45!important}.mini-game-stats span{font-size:9.5px!important}.mini-game-stats strong{font-size:13px!important}.mini-game-start{font-size:14px!important;padding:14px!important}.mini-game-hint{font-size:10.5px!important;line-height:1.35!important}

    .store-card-v35,.store-card{font-size:14px}.store-card-v35 .main strong,.store-card .store-title{font-size:14px!important}.store-card-v35 .main span,.store-card .store-description{font-size:11px!important;line-height:1.4!important}.store-buy{font-size:12px!important;min-height:42px!important}

    .bottom-nav{grid-template-columns:repeat(5,1fr)!important;padding-top:9px!important}.nav-btn{min-height:57px!important}.nav-btn span{font-size:22px!important}.nav-btn small{font-size:11px!important;margin-top:4px!important}

    .login-head strong{font-size:16px!important}.login-head span{font-size:11px!important}.level-reward-main strong{font-size:14px!important}.level-reward-main span{font-size:11px!important}.achievement-main strong{font-size:14px!important}.achievement-main p,.achievement-reward,.achievement-progress{font-size:11px!important}

    @media(max-width:390px){
      h1{font-size:24px!important}h2{font-size:21px!important}.q37-body .q37-deal,.q37-body .q37-business{grid-template-columns:48px minmax(0,1fr) 74px!important;gap:9px!important;padding:11px!important}.q37-body .q37-icon{width:48px!important;height:48px!important;min-width:48px!important}.q37-body .q37-deal>button,.q37-body .q37-business>button{width:74px!important;min-width:74px!important;max-width:74px!important;font-size:10.5px!important}.q37-body .q37-main b{font-size:13px!important}.q37-body .q37-main small{font-size:10.5px!important}.quick-hub37 small{font-size:10px!important}
    }
  `;
  document.head.appendChild(style);
  setTimeout(polish,0);
  const oldRender=typeof render==='function'?render:null;
  if(oldRender){const wrapped=function(){const r=oldRender.apply(this,arguments);setTimeout(polish,0);return r;};try{window.render=wrapped}catch{}try{render=wrapped}catch{}}
})();