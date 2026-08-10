(() => {
  let fixingDeals=false,fixingBusinesses=false;

  function fixDeals(){
    const el=document.getElementById('deals');if(!el||fixingDeals)return;
    fixingDeals=true;
    try{
      const all=el.querySelector('[data-df="all"]');
      if(all&&!all.classList.contains('active')&&!el.dataset.v38All){
        el.dataset.v38All='1';all.click();return;
      }
      const filters=el.querySelector('.q37-filters');if(filters)filters.style.display='none';
      el.querySelectorAll('.q37-deal').forEach(card=>{
        card.classList.remove('locked');card.style.opacity='1';
        const gate=card.querySelector('.q37-main>div span');if(gate&&/^LVL\s*\d+\+?$/i.test(gate.textContent.trim()))gate.remove();
        const btn=card.querySelector('[data-deal]');if(!btn)return;
        const info=card.querySelector('.q37-main small')?.textContent||'';
        const energy=Number((info.match(/(\d+)\s*⚡/)||[])[1]||0);
        const enough=Number(typeof state!=='undefined'?state.energy:999999)>=energy;
        btn.disabled=!enough;btn.textContent=enough?'Играть':'⚡';
      });
    }finally{fixingDeals=false;}
  }

  function fixBusinesses(){
    const el=document.getElementById('businesses');if(!el||fixingBusinesses)return;
    fixingBusinesses=true;
    try{
      const all=el.querySelector('[data-bf="all"]');
      if(all&&!all.classList.contains('active')&&!el.dataset.v38All){
        el.dataset.v38All='1';all.click();return;
      }
      const avail=el.querySelector('[data-bf="available"]');if(avail)avail.style.display='none';
      const owned=el.querySelector('[data-bf="owned"]');if(owned)owned.textContent='Мои';
      if(all)all.textContent='Все';
      el.querySelectorAll('.q37-business').forEach(card=>{
        card.classList.remove('locked');card.style.opacity='1';
        const status=card.querySelector('.q37-main>div span');
        const txt=status?.textContent.trim()||'';
        const ownedMatch=txt.match(/^LVL\s*(\d+)\s*\/\s*(\d+)/i);
        if(status&&/^от\s+LVL/i.test(txt))status.textContent='Доступно';
        const btn=card.querySelector('[data-business]');if(!btn)return;
        if(ownedMatch){
          const cur=Number(ownedMatch[1]),max=Number(ownedMatch[2]);
          btn.disabled=cur>=max;btn.textContent=cur>=max?'MAX':'↑';
        }else{
          btn.disabled=false;btn.textContent='Купить';
        }
      });
    }finally{fixingBusinesses=false;}
  }

  function fixStore(){
    const root=document.getElementById('tab-store')||document;
    root.querySelectorAll('.store-section-v36 h3').forEach(h=>{
      if(/высоких уров/i.test(h.textContent))h.textContent='Премиум-пакеты';
    });
    root.querySelectorAll('[data-buy-product]').forEach(btn=>{
      btn.disabled=false;
      if(/LVL|уров/i.test(btn.textContent))btn.textContent=btn.dataset.price||btn.textContent.replace(/🔒.*$/,'Купить');
    });
    root.querySelectorAll('span,small,b').forEach(node=>{
      const t=node.textContent.trim();
      if(/^LVL\s*\d+\+$/i.test(t))node.textContent='Доступно';
      if(/откроется на \d+ уровне/i.test(t))node.textContent='Доступно сразу';
    });
  }

  if(typeof renderDeals==='function'){
    const old=renderDeals;renderDeals=function(){old();setTimeout(fixDeals,0)};
  }
  if(typeof renderBusinesses==='function'){
    const old=renderBusinesses;renderBusinesses=function(){old();setTimeout(fixBusinesses,0)};
  }
  if(typeof renderStore==='function'){
    const old=renderStore;renderStore=function(){const r=old.apply(this,arguments);setTimeout(fixStore,0);return r;};
  }
  if(typeof render==='function'){
    const old=render;render=function(){const r=old.apply(this,arguments);setTimeout(()=>{fixDeals();fixBusinesses();fixStore();},0);return r;};
  }

  const style=document.createElement('style');
  style.textContent=`
    .q37-deal.locked,.q37-business.locked{opacity:1!important}
    #deals .q37-filters{display:none!important}
    #businesses .q37-filters{grid-template-columns:1fr 1fr!important}
    #businesses [data-bf="available"]{display:none!important}
  `;
  document.head.appendChild(style);

  const obs=new MutationObserver(()=>setTimeout(()=>{fixDeals();fixBusinesses();fixStore();},0));
  obs.observe(document.body,{childList:true,subtree:true});

  document.title='Бизнес с нуля 3.8';
  const v=document.querySelector('.topbar .eyebrow');if(v)v.textContent='BUSINESS GAME · 3.8';
  setTimeout(()=>{fixDeals();fixBusinesses();fixStore();try{if(typeof render==='function')render();}catch(e){}},120);
})();