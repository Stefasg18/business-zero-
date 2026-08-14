(()=>{
  if(window.__BZ_RESPONSIVE_V574__)return;window.__BZ_RESPONSIVE_V574__=1;
  const $=s=>document.querySelector(s);
  const style=document.createElement('style');style.id='bzResponsive574';style.textContent=`
    #u572overlay,#u572overlay *{box-sizing:border-box}
    #u572body{width:100%;max-width:100%;min-width:0;overflow-x:hidden!important}
    #u572body>*{width:100%;max-width:100%;min-width:0}
    #u572body .section{width:100%!important;max-width:100%!important;min-width:0!important;overflow:visible!important}
    #u572body #deals,#u572body .deal-grid{width:100%!important;max-width:100%!important;min-width:0!important;display:grid!important;grid-template-columns:minmax(0,1fr)!important;gap:10px!important}
    #u572body #businesses,#u572body .business-list{width:100%!important;max-width:100%!important;min-width:0!important}
    #u572body .deal-card,#u572body .business-card,#u572body .quest-card,#u572body .level-reward,#u572body .achievement-card{width:100%!important;max-width:100%!important;min-width:0!important}
    #u572body .deal-card{min-height:0!important}
    #u572body .business-row,#u572body .quest-top,#u572body .level-reward,#u572body .achievement-top{min-width:0!important;max-width:100%!important}
    #u572body .business-main,#u572body .quest-main,#u572body .level-reward-main,#u572body .achievement-main{min-width:0!important;overflow:hidden}
    #u572body .deal-sub,#u572body .business-meta,#u572body .quest-reward,#u572body .achievement-main p{overflow-wrap:anywhere;word-break:normal}
    #u572body .u574-tabs{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:7px!important;width:100%!important;max-width:100%!important;height:auto!important;min-height:0!important;margin:0 0 11px!important;padding:0!important;overflow:visible!important;align-items:stretch!important}
    #u572body .u574-tabs>button{display:flex!important;align-items:center!important;justify-content:center!important;width:100%!important;min-width:0!important;max-width:none!important;height:44px!important;min-height:44px!important;padding:0 8px!important;margin:0!important;border-radius:13px!important;white-space:nowrap!important;font-size:11px!important;line-height:1!important}
    #u572body .u574-action-card{width:100%!important;max-width:100%!important;min-width:0!important;overflow:hidden!important}
    #u572body .u574-action-card button{flex:0 0 auto!important;max-width:132px!important;white-space:nowrap!important}
    #u572body .u574-full{width:100%!important;max-width:100%!important;min-width:0!important;left:auto!important;right:auto!important;transform:none!important}
    #u572body img,#u572body canvas,#u572body svg{max-width:100%!important}
    .u572-sheet{max-width:720px!important;overflow:hidden!important}.u572-body{overscroll-behavior:contain}
    @media(max-width:430px){
      #u572body{padding-left:10px!important;padding-right:10px!important}
      #u572body .u574-tabs{gap:6px!important}
      #u572body .u574-tabs>button{height:42px!important;min-height:42px!important;padding:0 5px!important;font-size:10px!important}
      #u572body .deal-card{padding:12px!important}
      #u572body .business-card{padding:12px!important}
      #u572body .business-row{gap:8px!important}
      #u572body .business-icon{width:42px!important;height:42px!important;font-size:21px!important}
      #u572body .buy-btn,#u572body .deal-btn{font-size:10px!important;padding:9px 9px!important}
      #u572body .u574-action-card button{max-width:112px!important}
    }
    @media(max-width:350px){
      #u572body .u574-tabs>button{font-size:9px!important;padding:0 3px!important}
      #u572body .business-row{flex-wrap:wrap!important}
      #u572body .business-row .buy-btn{width:100%!important;max-width:none!important}
    }
  `;document.head.appendChild(style);

  const norm=s=>String(s||'').replace(/\s+/g,' ').trim().toLowerCase();
  function commonParent(items,root){
    if(!items.length)return null;let p=items[0].parentElement;
    while(p&&p!==root){if(items.every(x=>p.contains(x)))return p;p=p.parentElement}
    return null;
  }
  function fixTabs(root){
    const buttons=[...root.querySelectorAll('button')];
    const sets=[['доступные','следующие','все'],['мои','доступные','все']];
    for(const labels of sets){
      const items=labels.map(label=>buttons.find(b=>norm(b.textContent)===label)).filter(Boolean);
      if(items.length<2)continue;
      const p=commonParent(items,root);if(p){p.classList.add('u574-tabs');items.forEach(b=>b.classList.add('u574-tab'))}
    }
  }
  function fixActionCards(root){
    const actions=[...root.querySelectorAll('button')].filter(b=>/^(заработать|улучшить|купить|забрать|получить|открыть)$/i.test(String(b.textContent||'').trim()));
    for(const b of actions){
      let p=b.parentElement,best=null;
      for(let i=0;p&&p!==root&&i<6;i++,p=p.parentElement){
        const text=norm(p.textContent);
        if(p.children.length>=2&&(/₽|xp|риск|lvl|уров/.test(text))){best=p;break}
      }
      if(best)best.classList.add('u574-action-card');
    }
  }
  function fixOverflow(root){
    const w=root.clientWidth||window.innerWidth;
    [...root.querySelectorAll('*')].forEach(el=>{
      if(el.classList.contains('u574-tabs'))return;
      const cs=getComputedStyle(el);if(cs.position==='fixed'||cs.position==='absolute')return;
      const r=el.getBoundingClientRect();
      if(r.width>w+12||el.scrollWidth>w+18){
        if(!/^(CANVAS|SVG)$/.test(el.tagName))el.classList.add('u574-full');
      }
    });
  }
  function fix(){
    const root=$('#u572body');if(!root)return;
    fixTabs(root);fixActionCards(root);fixOverflow(root);
  }
  let raf=0;function schedule(){cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{fix();setTimeout(fix,90)})}
  const obs=new MutationObserver(schedule);
  function install(){const root=$('#u572body');if(!root)return false;obs.observe(root,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style']});schedule();return true}
  let tries=0,t=setInterval(()=>{if(install()||++tries>40)clearInterval(t)},300);
  window.addEventListener('resize',schedule,{passive:true});
  document.addEventListener('click',e=>{if(e.target.closest?.('[data-u572-open],#u572overlay button'))setTimeout(schedule,40)});
})();
