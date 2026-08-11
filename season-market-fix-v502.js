(()=>{
  if(window.__BZ_SEASON_MARKET_FIX_V502__) return;
  window.__BZ_SEASON_MARKET_FIX_V502__=true;

  const VERSION='5.0.2';
  const quantities=[1,2,5,10];

  function haptic(){
    try{window.Telegram?.WebApp?.HapticFeedback?.selectionChanged?.();}catch{}
  }

  function enhanceMarket(root=document){
    root.querySelectorAll?.('.v50-trade input[type="number"]:not([data-v502-picker])').forEach(input=>{
      input.dataset.v502Picker='1';
      const locked=input.disabled || Boolean(input.closest('.v50-asset')?.classList.contains('locked'));
      input.type='hidden';
      input.value='1';

      const picker=document.createElement('div');
      picker.className='v502-qty-block';
      picker.innerHTML=`<span>Количество</span><div class="v502-qty-picker">${quantities.map(q=>`<button type="button" data-v502-qty="${q}" class="${q===1?'active':''}" ${locked?'disabled':''}>${q}</button>`).join('')}</div>`;
      input.insertAdjacentElement('afterend',picker);

      picker.querySelectorAll('[data-v502-qty]').forEach(btn=>{
        btn.addEventListener('click',()=>{
          if(btn.disabled)return;
          input.value=btn.dataset.v502Qty;
          picker.querySelectorAll('[data-v502-qty]').forEach(x=>x.classList.toggle('active',x===btn));
          haptic();
        });
      });
    });

    root.querySelectorAll?.('.v50-market-note:not([data-v502-note])').forEach(note=>{
      note.dataset.v502Note='1';
      note.textContent='Выбери количество 1, 2, 5 или 10 и нажми «Купить» или «Продать». Никакого ручного ввода — клавиатура больше не открывается.';
    });
  }

  function enhanceSeason(root=document){
    root.querySelectorAll?.('.v50-season-hero:not([data-v502-season])').forEach(hero=>{
      hero.dataset.v502Season='1';
      const p=hero.querySelector('p');
      if(p)p.textContent='Сезон длится 7 дней. Каждый новый сезон начинается с 0 — старые сделки и прошлый прогресс не переносятся.';

      const progress=hero.parentElement?.querySelector('.v50-progress-meta');
      if(progress && !hero.parentElement.querySelector('.v502-season-rules')){
        const rules=document.createElement('div');
        rules.className='v502-season-rules';
        rules.innerHTML='<div><b>7 дней</b><span>длительность сезона</span></div><div><b>12</b><span>уровней наград</span></div><div><b>0 → 12</b><span>каждый сезон заново</span></div>';
        progress.insertAdjacentElement('afterend',rules);
      }
    });
  }

  function enhanceMissions(root=document){
    root.querySelectorAll?.('.v50-mission:not([data-v502-mission])').forEach(card=>{
      card.dataset.v502Mission='1';
      const title=card.querySelector('.v50-mission-top strong')?.textContent||'';
      if(/бирж/i.test(title)) card.classList.add('v502-market-mission');
    });
  }

  function enhanceVersion(){
    document.title=`Бизнес с нуля ${VERSION}`;
    const version=document.querySelector('.topbar .eyebrow');
    if(version)version.textContent=`BUSINESS GAME · ${VERSION}`;
    document.querySelectorAll('.v50-sheet-head span').forEach(x=>x.textContent=`BUSINESS GAME · ${VERSION}`);
    document.querySelectorAll('.v50-launch-top > div > span').forEach(x=>x.textContent=`BUSINESS GAME ${VERSION}`);
  }

  function apply(root=document){
    enhanceMarket(root);
    enhanceSeason(root);
    enhanceMissions(root);
    enhanceVersion();
  }

  const style=document.createElement('style');
  style.textContent=`
    .v502-qty-block{grid-column:1/-1;display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:8px;padding-top:9px;border-top:1px solid rgba(255,255,255,.065)}
    .v502-qty-block>span{color:#8797b5;font-size:10px;font-weight:850;letter-spacing:.2px}
    .v502-qty-picker{display:grid;grid-template-columns:repeat(4,44px);gap:6px}
    .v502-qty-picker button{height:38px;min-width:44px;padding:0;border:1px solid rgba(119,145,220,.16);border-radius:11px;background:rgba(75,95,145,.10);color:#aebbd3;font-size:13px;font-weight:950;cursor:pointer;-webkit-tap-highlight-color:transparent;touch-action:manipulation}
    .v502-qty-picker button.active{color:#fff;border-color:rgba(100,136,255,.55);background:linear-gradient(145deg,#496edb,#6751c7);box-shadow:0 6px 15px rgba(62,76,180,.18)}
    .v502-qty-picker button:disabled{opacity:.35;cursor:default}
    .v502-season-rules{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin:11px 0 15px}
    .v502-season-rules>div{min-width:0;padding:10px 7px;border:1px solid rgba(111,137,213,.13);border-radius:14px;background:rgba(20,34,57,.72);text-align:center}
    .v502-season-rules b{display:block;color:#f2f6ff;font-size:13px;line-height:1.15}
    .v502-season-rules span{display:block;margin-top:4px;color:#7f8fa9;font-size:8px;line-height:1.25}
    .v502-market-mission{border-color:rgba(71,170,211,.18)!important;background:radial-gradient(circle at 100% 50%,rgba(45,154,211,.07),transparent 42%),rgba(17,30,51,.9)!important}
    @media(max-width:430px){
      .v502-qty-block{align-items:flex-start;flex-direction:column;gap:7px}
      .v502-qty-picker{width:100%;grid-template-columns:repeat(4,1fr);gap:6px}
      .v502-qty-picker button{width:100%;min-width:0;height:42px;font-size:14px}
      .v502-season-rules{gap:5px}.v502-season-rules>div{padding:9px 4px}.v502-season-rules b{font-size:12px}.v502-season-rules span{font-size:7.5px}
    }
  `;
  document.head.appendChild(style);

  const observer=new MutationObserver(records=>{
    for(const r of records){
      r.addedNodes.forEach(n=>{if(n.nodeType===1)apply(n);});
    }
  });
  observer.observe(document.body,{subtree:true,childList:true});
  apply();
})();
