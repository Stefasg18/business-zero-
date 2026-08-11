(()=>{
  if(window.__BZ_NAV_BADGES_V568__)return;
  window.__BZ_NAV_BADGES_V568__=true;

  const style=document.createElement('style');
  style.id='navBadges568Style';
  style.textContent=`
    .bottom-nav .nav-btn{position:relative!important;overflow:visible!important}
    .bz-nav-badge{position:absolute;top:3px;right:calc(50% - 23px);min-width:18px;height:18px;padding:0 5px;border-radius:999px;display:none;align-items:center;justify-content:center;background:#ff405d;color:#fff;font-size:10px;font-weight:950;line-height:18px;border:2px solid #0b1020;box-shadow:0 4px 14px rgba(255,64,93,.38);z-index:5;pointer-events:none}
    .bz-nav-badge.show{display:flex}
    .bz-nav-badge.hot{animation:bzBadgePulse 1.9s ease-in-out infinite}
    @keyframes bzBadgePulse{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}
  `;
  document.head.appendChild(style);

  const tabs=['home','rating','friends','store','profile'];
  function ensure(){
    document.querySelectorAll('.bottom-nav .nav-btn[data-tab]').forEach(btn=>{
      const tab=btn.dataset.tab;
      if(!tabs.includes(tab)||btn.querySelector('.bz-nav-badge'))return;
      const badge=document.createElement('i');badge.className='bz-nav-badge';badge.dataset.badgeTab=tab;badge.setAttribute('aria-hidden','true');btn.appendChild(badge);
    });
  }

  function visible(el){
    if(!el||el.disabled)return false;
    if(el.closest('.hidden'))return false;
    try{const s=getComputedStyle(el);return s.display!=='none'&&s.visibility!=='hidden'}catch{return true}
  }
  function isClaimButton(el){
    if(!visible(el))return false;
    const t=String(el.textContent||'').trim().toLowerCase();
    return /(забрать|получить|заявить|claim|награда готова)/i.test(t)&&!/(получено|забрано|уже получ)/i.test(t);
  }
  function countClaimables(root){
    if(!root)return 0;
    const set=new Set();
    root.querySelectorAll('button,a,[role="button"]').forEach(el=>{if(isClaimButton(el))set.add(el)});
    root.querySelectorAll('.ready,.complete,.completed,.claimable,[data-ready="true"]').forEach(box=>{
      const b=box.querySelector('button:not(:disabled),a,[role="button"]');if(b&&isClaimButton(b))set.add(b);
    });
    return set.size;
  }

  function stateCounts(){
    const out={home:0,rating:0,friends:0,store:0,profile:0};
    try{
      const qs=Array.isArray(window.state?.quests)?window.state.quests:[];
      out.home+=qs.filter(q=>(q.complete||Number(q.progress)>=Number(q.target||Infinity))&&!q.claimed).length;
      const ls=window.state?.loginStreak;if(ls&&!ls.claimedToday)out.profile+=1;
    }catch{}
    return out;
  }

  function domCounts(){
    const out={home:0,rating:0,friends:0,store:0,profile:0};
    for(const tab of tabs)out[tab]=countClaimables(document.getElementById(`tab-${tab}`));
    const bell=document.getElementById('v50BellCount');
    if(bell){const n=parseInt(String(bell.textContent||'').replace(/\D/g,''),10);if(Number.isFinite(n))out.home+=n}
    return out;
  }

  function render(){
    ensure();
    const a=stateCounts(),b=domCounts();
    for(const tab of tabs){
      const n=Math.max(a[tab]||0,b[tab]||0);
      const el=document.querySelector(`.bz-nav-badge[data-badge-tab="${tab}"]`);if(!el)continue;
      el.textContent=n>99?'99+':String(n);
      el.classList.toggle('show',n>0);el.classList.toggle('hot',n>0);
      el.parentElement?.setAttribute('aria-label',n>0?`${el.parentElement.textContent.trim()}, доступно: ${n}`:el.parentElement.textContent.trim());
    }
  }

  let scheduled=false;
  function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;render()})}
  ensure();render();
  const obs=new MutationObserver(schedule);if(document.body)obs.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class','disabled']});
  document.addEventListener('click',()=>setTimeout(render,120),true);
  window.addEventListener('pageshow',render);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')render()});
  setInterval(render,5000);
})();