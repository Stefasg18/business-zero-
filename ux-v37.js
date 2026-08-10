(() => {
  const DEALS37=[
    {id:'delivery',icon:'📦',title:'Перепродажа',level:1,energy:2,min:250,max:850,fail:14,xp:32},
    {id:'content',icon:'🎬',title:'Монтаж',level:2,energy:2,min:500,max:1400,fail:10,xp:42},
    {id:'ads',icon:'📣',title:'Реклама',level:4,energy:3,min:800,max:2200,fail:18,xp:55},
    {id:'wholesale',icon:'📦',title:'Оптовая партия',level:7,energy:4,min:2500,max:8000,fail:16,xp:82},
    {id:'marketplace',icon:'🛍️',title:'Маркетплейс',level:10,energy:5,min:7000,max:22000,fail:20,xp:115},
    {id:'construction',icon:'🏗️',title:'Подряд',level:15,energy:6,min:20000,max:65000,fail:22,xp:165},
    {id:'franchise',icon:'🏪',title:'Франшиза',level:22,energy:7,min:60000,max:180000,fail:24,xp:250},
    {id:'export',icon:'🚢',title:'Экспорт',level:30,energy:9,min:180000,max:550000,fail:25,xp:360},
    {id:'realestate',icon:'🏙️',title:'Недвижимость',level:45,energy:11,min:500000,max:1500000,fail:28,xp:520},
    {id:'factorydeal',icon:'🏭',title:'Промышленный контракт',level:65,energy:14,min:1500000,max:5000000,fail:30,xp:760},
    {id:'holdingdeal',icon:'🏢',title:'Сделка холдинга',level:90,energy:17,min:5000000,max:18000000,fail:32,xp:1080},
    {id:'megaproject',icon:'🌆',title:'Мегапроект',level:125,energy:21,min:18000000,max:70000000,fail:35,xp:1600},
    {id:'techdeal',icon:'💻',title:'Технологическое IPO',level:170,energy:26,min:60000000,max:220000000,fail:36,xp:2250},
    {id:'national',icon:'🌐',title:'Национальный контракт',level:220,energy:30,min:200000000,max:800000000,fail:38,xp:3200}
  ];
  const BUS37=[
    {id:'coffee',icon:'☕',name:'Кофейный автомат',level:1,price:3500,income:18},
    {id:'resale',icon:'📱',name:'Перепродажа техники',level:3,price:9000,income:55},
    {id:'studio',icon:'🎥',name:'Студия монтажа',level:5,price:28000,income:165},
    {id:'shop',icon:'🛒',name:'Интернет-магазин',level:8,price:80000,income:470},
    {id:'agency',icon:'🏢',name:'Digital-агентство',level:12,price:240000,income:1450},
    {id:'warehouse',icon:'📦',name:'Складской комплекс',level:18,price:800000,income:5000},
    {id:'marketplace',icon:'🛍️',name:'Сеть маркетплейсов',level:25,price:3000000,income:19000},
    {id:'restaurant',icon:'🍽️',name:'Сеть ресторанов',level:35,price:10000000,income:70000},
    {id:'construction',icon:'🏗️',name:'Строительная компания',level:45,price:35000000,income:240000},
    {id:'factory',icon:'🏭',name:'Производственный завод',level:60,price:120000000,income:850000},
    {id:'logistics',icon:'🚚',name:'Логистическая сеть',level:80,price:450000000,income:3200000},
    {id:'bank',icon:'🏦',name:'Цифровой банк',level:105,price:1800000000,income:12000000},
    {id:'holding',icon:'🏙️',name:'Международный холдинг',level:135,price:7000000000,income:48000000},
    {id:'techcorp',icon:'💻',name:'Технологическая корпорация',level:170,price:25000000000,income:190000000},
    {id:'globalfund',icon:'🌐',name:'Глобальный инвестиционный фонд',level:220,price:100000000000,income:800000000}
  ];
  let dealFilter='available',busFilter='owned';
  let xpSession=null,xpTimer=null,xpDeadline=0;

  const xpNeededForLevel=l=>120*Math.pow(Math.max(0,l-1),2);
  const nextLevelXp=l=>xpNeededForLevel(Number(l)+1);
  const businessPrice=(b,l)=>l<=0?b.price:Math.floor(b.price*Math.pow(1.28,Math.min(l,29)));

  function installQuickHub(){
    if(document.getElementById('quickHub37'))return;
    const hero=document.querySelector('#tab-home .hero-card');if(!hero)return;
    const hub=document.createElement('section');hub.id='quickHub37';hub.className='quick-hub37';
    hub.innerHTML=`<button data-open37="deals"><span>🤝</span><div><b>Сделки</b><small>Заработок + XP</small></div><i>›</i></button>
      <button data-open37="businesses"><span>🏢</span><div><b>Бизнесы</b><small>${fmt(totalIncomePerMin())} ₽ / мин</small></div><i>›</i></button>
      <button data-open37="xp"><span>🧠</span><div><b>XP-тренажёр</b><small>Играй без энергии</small></div><i>›</i></button>`;
    hero.insertAdjacentElement('afterend',hub);
    hub.querySelectorAll('[data-open37]').forEach(b=>b.onclick=()=>openSheet(b.dataset.open37));

    const dealSection=document.getElementById('deals')?.closest('.section');
    const busSection=document.getElementById('businesses')?.closest('.section');
    const shell=document.createElement('div');shell.id='quickSheet37';shell.className='q37-shell hidden';
    shell.innerHTML=`<div class="q37-backdrop" data-q37-close></div><div class="q37-sheet"><div class="q37-head"><div><span id="q37Eyebrow">БЫСТРЫЙ ДОСТУП</span><h2 id="q37Title">Сделки</h2></div><button data-q37-close>×</button></div><div id="q37Body" class="q37-body"></div></div>`;
    document.body.appendChild(shell);shell.querySelectorAll('[data-q37-close]').forEach(x=>x.onclick=closeSheet);
    if(dealSection){dealSection.dataset.q37='deals';dealSection.classList.add('q37-content-section');}
    if(busSection){busSection.dataset.q37='businesses';busSection.classList.add('q37-content-section');}

    const xpPanel=document.createElement('section');xpPanel.id='xpPanel37';xpPanel.className='q37-xp-panel';xpPanel.innerHTML=xpPanelHtml();document.body.appendChild(xpPanel);
    bindXpPanel();
  }

  function openSheet(type){
    const shell=document.getElementById('quickSheet37'),body=document.getElementById('q37Body');if(!shell||!body)return;
    body.innerHTML='';
    if(type==='deals'){
      document.getElementById('q37Title').textContent='Сделки';document.getElementById('q37Eyebrow').textContent='БЫСТРЫЕ ДЕНЬГИ';
      const s=document.querySelector('[data-q37="deals"]');if(s)body.appendChild(s);renderDeals();
    }else if(type==='businesses'){
      document.getElementById('q37Title').textContent='Мои бизнесы';document.getElementById('q37Eyebrow').textContent='ПАССИВНЫЙ ДОХОД';
      const s=document.querySelector('[data-q37="businesses"]');if(s)body.appendChild(s);renderBusinesses();
    }else{
      document.getElementById('q37Title').textContent='XP-тренажёр';document.getElementById('q37Eyebrow').textContent='ИГРА БЕЗ ЭНЕРГИИ';body.appendChild(document.getElementById('xpPanel37'));updateXpPanel();
    }
    shell.classList.remove('hidden');document.body.classList.add('q37-lock');
  }
  function closeSheet(){document.getElementById('quickSheet37')?.classList.add('hidden');document.body.classList.remove('q37-lock');}

  renderDeals=function(){
    const el=document.getElementById('deals');if(!el)return;
    let rows=DEALS37;
    if(dealFilter==='available')rows=rows.filter(d=>Number(state.level)>=d.level);
    if(dealFilter==='next')rows=rows.filter(d=>Number(state.level)<d.level).slice(0,4);
    el.innerHTML=`<div class="q37-filters"><button data-df="available" class="${dealFilter==='available'?'active':''}">Доступные</button><button data-df="next" class="${dealFilter==='next'?'active':''}">Следующие</button><button data-df="all" class="${dealFilter==='all'?'active':''}">Все</button></div><div class="q37-deal-list">${rows.map(d=>{const locked=Number(state.level)<d.level,noEnergy=Number(state.energy)<d.energy;return `<article class="q37-deal ${locked?'locked':''}"><div class="q37-icon">${d.icon}</div><div class="q37-main"><div><b>${d.title}</b><span>LVL ${d.level}+</span></div><small>${d.energy} ⚡ · +${fmt(d.xp)} XP · риск ${d.fail}%</small><em>${fmt(d.min)}–${fmt(d.max)} ₽</em></div><button data-deal="${d.id}" ${locked||noEnergy?'disabled':''}>${locked?'🔒':noEnergy?'⚡':'Играть'}</button></article>`}).join('')}</div>`;
    el.querySelectorAll('[data-df]').forEach(b=>b.onclick=()=>{dealFilter=b.dataset.df;renderDeals()});
    el.querySelectorAll('[data-deal]').forEach(b=>b.onclick=()=>runDeal(b.dataset.deal));
  };

  renderBusinesses=function(){
    const el=document.getElementById('businesses');if(!el)return;
    let rows=BUS37;
    if(busFilter==='owned')rows=rows.filter(b=>Number(state.businesses?.[b.id]?.level||0)>0);
    if(busFilter==='available')rows=rows.filter(b=>Number(state.level)>=b.level);
    if(!rows.length&&busFilter==='owned')rows=BUS37.filter(b=>Number(state.level)>=b.level).slice(0,3);
    el.innerHTML=`<div class="q37-filters"><button data-bf="owned" class="${busFilter==='owned'?'active':''}">Мои</button><button data-bf="available" class="${busFilter==='available'?'active':''}">Доступные</button><button data-bf="all" class="${busFilter==='all'?'active':''}">Все</button></div><div class="q37-business-list">${rows.map(b=>{const l=Number(state.businesses?.[b.id]?.level||0),locked=Number(state.level)<b.level,maxed=l>=30,price=businessPrice(b,l);return `<article class="q37-business ${locked?'locked':''}"><div class="q37-icon">${b.icon}</div><div class="q37-main"><div><b>${b.name}</b><span>${l?`LVL ${l}/30`:`от LVL ${b.level}`}</span></div><small>${l?`${fmt(b.income*l)} ₽/мин`:`База ${fmt(b.income)} ₽/мин`}</small><em>${l?`Улучшение ${fmt(price)} ₽`:`Покупка ${fmt(price)} ₽`}</em></div><button data-business="${b.id}" ${locked||maxed?'disabled':''}>${locked?'🔒':maxed?'MAX':l?'↑':'Купить'}</button></article>`}).join('')}</div>`;
    el.querySelectorAll('[data-bf]').forEach(b=>b.onclick=()=>{busFilter=b.dataset.bf;renderBusinesses()});
    el.querySelectorAll('[data-business]').forEach(b=>b.onclick=()=>buyOrUpgrade(b.dataset.business));
  };

  function xpPanelHtml(){return `<div class="xp37-hero"><div class="xp37-orb">🧠</div><div><span>XP-ТРЕНАЖЁР</span><h3>Считай прибыль — получай опыт</h3><p>Не требует энергии. Один короткий раунд занимает несколько секунд.</p></div></div><div id="xp37Progress" class="xp37-progress"></div><div id="xp37Game" class="xp37-game"><button id="xp37Start" class="xp37-start">Начать раунд</button></div>`;}
  function bindXpPanel(){document.getElementById('xp37Start')?.addEventListener('click',startXpRound);}
  function updateXpPanel(){
    const p=document.getElementById('xp37Progress');if(!p)return;const cur=Number(state.xp||0),lvl=Number(state.level||1),start=xpNeededForLevel(lvl),next=nextLevelXp(lvl),span=Math.max(1,next-start),pct=Math.max(0,Math.min(100,(cur-start)/span*100));
    p.innerHTML=`<div><span>Уровень ${lvl}</span><strong>${fmt(cur-start)} / ${fmt(span)} XP</strong></div><div class="xp37-bar"><i style="width:${pct}%"></i></div><small>До LVL ${lvl+1}: ${fmt(Math.max(0,next-cur))} XP</small>`;
    const stat=document.querySelector('.stat-xp .stat-caption');if(stat)stat.textContent=`До LVL ${lvl+1}: ${fmt(Math.max(0,next-cur))} XP`;
    const hub=document.querySelector('[data-open37="businesses"] small');if(hub)hub.textContent=`${fmt(totalIncomePerMin())} ₽ / мин`;
  }
  async function startXpRound(){
    if(!ONLINE_MODE){showToast('XP-тренажёр работает в ONLINE');return}
    const game=document.getElementById('xp37Game');if(!game)return;
    game.innerHTML='<div class="xp37-loading">Готовим раунд…</div>';
    try{
      const d=await api('/api/xp-game/start',{method:'POST',body:'{}'});xpSession=d.sessionId;xpDeadline=new Date(d.expiresAt).getTime();
      game.innerHTML=`<div class="xp37-reward">Награда за правильный ответ <b>+${fmt(d.rewardXp)} XP</b></div><div class="xp37-question">${escapeHtml(d.question)}</div><div class="xp37-options">${d.options.map((o,i)=>`<button data-xp-answer="${i}"><span>${String.fromCharCode(65+i)}</span><b>${fmt(o.revenue)} ₽</b><small>Расходы ${fmt(o.cost)} ₽</small></button>`).join('')}</div><div class="xp37-timer"><i id="xp37Timer"></i></div><div id="xp37Result"></div>`;
      game.querySelectorAll('[data-xp-answer]').forEach(b=>b.onclick=()=>answerXp(Number(b.dataset.xpAnswer),b));runXpTimer();
    }catch(e){game.innerHTML=`<button id="xp37Start" class="xp37-start">Попробовать снова</button><small class="xp37-error">${escapeHtml(e.message)}</small>`;bindXpPanel();}
  }
  function runXpTimer(){clearInterval(xpTimer);const bar=document.getElementById('xp37Timer');xpTimer=setInterval(()=>{const left=Math.max(0,xpDeadline-Date.now()),pct=left/20000*100;if(bar)bar.style.width=`${pct}%`;if(left<=0){clearInterval(xpTimer);const r=document.getElementById('xp37Result');if(r)r.innerHTML='<div class="xp37-bad">Время вышло. Начни новый раунд.</div><button class="xp37-start" id="xp37Again">Новый раунд</button>';document.getElementById('xp37Again')?.addEventListener('click',startXpRound)}},100);}
  async function answerXp(index,btn){
    if(!xpSession)return;clearInterval(xpTimer);document.querySelectorAll('[data-xp-answer]').forEach(x=>x.disabled=true);btn.classList.add('chosen');
    const out=document.getElementById('xp37Result');if(out)out.innerHTML='<div class="xp37-loading">Проверяем…</div>';
    try{
      const d=await api('/api/xp-game/answer',{method:'POST',body:JSON.stringify({sessionId:xpSession,selectedIndex:index})});
      const s=await api('/api/state');applyServerState(s.state);updateXpPanel();
      const r=d.result||{};if(out)out.innerHTML=`<div class="${r.correct?'xp37-good':'xp37-bad'}">${r.correct?'✓ Верно':'✕ Ошибка'} · +${fmt(r.xp)} XP ${r.streak?`· серия ${r.streak} 🔥`:''}</div><button class="xp37-start" id="xp37Again">Следующий раунд</button>`;
      document.getElementById('xp37Again')?.addEventListener('click',startXpRound);notify(r.correct?'success':'error');
    }catch(e){if(out)out.innerHTML=`<div class="xp37-bad">${escapeHtml(e.message)}</div><button class="xp37-start" id="xp37Again">Новый раунд</button>`;document.getElementById('xp37Again')?.addEventListener('click',startXpRound);}
  }

  const oldRender=render;
  render=function(){oldRender();installQuickHub();updateXpPanel();if(!document.getElementById('quickSheet37')?.classList.contains('hidden')){const title=document.getElementById('q37Title')?.textContent;if(title==='Сделки')renderDeals();if(title==='Мои бизнесы')renderBusinesses();}};

  const oldStore=renderStore;
  renderStore=function(){
    const productsEl=document.getElementById('storeProducts'),historyEl=document.getElementById('purchaseHistory');if(!productsEl||!historyEl)return oldStore?.();
    const ps=state.store?.products||[],groups=[['Основные покупки','МАГАЗИН',ps.filter(p=>(p.tier||'base')==='base')],['Опыт','ПРОКАЧКА XP',ps.filter(p=>p.tier==='xp')],['Для высоких уровней','ПРЕМИУМ',ps.filter(p=>['high','elite'].includes(p.tier))]];
    const icon=p=>p.icon&&p.icon!=='undefined'?p.icon:'⭐';
    const card=p=>{const locked=Boolean(p.locked)||Number(state.level)<Number(p.minLevel||1);return `<article class="store-card store-card-v35 ${p.tier==='xp'?'store-xp37':''} ${locked?'store-locked-v36':''}"><div class="store-icon-v35"><span>${icon(p)}</span></div><div class="store-main-v35"><div class="store-title-row-v35"><strong class="store-title-v35">${escapeHtml(p.title)}</strong><span class="store-tag-v35">${escapeHtml(p.badge||'Stars')}</span></div><div class="store-desc-v35">${escapeHtml(p.description||'')}</div>${Number(p.minLevel||1)>1?`<div class="store-level-v36">Открывается с ${p.minLevel} уровня</div>`:''}</div><button class="store-buy-v35 ${locked?'locked':''}" ${locked?'disabled':`data-buy-product="${escapeHtml(p.id)}"`}>${locked?`🔒 LVL ${p.minLevel}`:`${fmt(p.stars)} <span class="store-star-v35">⭐</span>`}</button></article>`};
    productsEl.innerHTML=groups.filter(g=>g[2].length).map(g=>`<div class="store-section-v36"><div><span>${g[1]}</span><h3>${g[0]}</h3></div></div>${g[2].map(card).join('')}`).join('');productsEl.querySelectorAll('[data-buy-product]').forEach(b=>b.onclick=()=>buyStoreProduct(b.dataset.buyProduct,b));
    const purchases=state.store?.purchases||[];historyEl.innerHTML=purchases.length?purchases.map(o=>{const p=storeProductById(o.product_id)||{title:o.product_id,icon:'⭐'};return `<div class="purchase-row purchase-row-v35"><div class="purchase-icon-v35">${icon(p)}</div><div class="main"><strong>${escapeHtml(p.title||o.product_id)}</strong><span>${o.paid_at?new Date(o.paid_at).toLocaleString('ru-RU'):''}</span></div><div class="purchase-stars-v35">${fmt(o.stars)} ⭐</div></div>`}).join(''):'<div class="store-empty store-empty-v35">Покупок пока нет.</div>';
  };

  const style=document.createElement('style');style.textContent=`
    .quick-hub37{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:12px 0 18px}.quick-hub37 button{min-width:0;padding:12px 9px;border-radius:17px;border:1px solid rgba(117,143,211,.14);background:linear-gradient(145deg,#12233b,#101d31);color:#fff;text-align:left;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:7px}.quick-hub37 button>span{font-size:22px}.quick-hub37 b,.quick-hub37 small{display:block}.quick-hub37 b{font-size:11px}.quick-hub37 small{margin-top:2px;font-size:7.5px;color:#7184a5}.quick-hub37 i{font-style:normal;color:#62789e;font-size:18px}.q37-shell{position:fixed;inset:0;z-index:9800}.q37-shell.hidden{display:none}.q37-backdrop{position:absolute;inset:0;background:rgba(3,8,17,.75);backdrop-filter:blur(8px)}.q37-sheet{position:absolute;left:0;right:0;bottom:0;max-height:88vh;background:#091525;border:1px solid rgba(126,149,211,.14);border-radius:26px 26px 0 0;overflow:hidden;box-shadow:0 -18px 50px rgba(0,0,0,.35)}.q37-head{height:70px;padding:14px 17px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.06);background:rgba(10,22,38,.97)}.q37-head span{font-size:7px;letter-spacing:1.3px;color:#7185a9}.q37-head h2{margin:3px 0 0;font-size:20px}.q37-head button{width:38px;height:38px;border-radius:13px;border:1px solid rgba(255,255,255,.08);background:#13243c;color:#fff;font-size:22px}.q37-body{max-height:calc(88vh - 70px);overflow:auto;padding:13px 14px 80px}.q37-body>.section{margin:0!important;padding:0!important}.q37-body .section-head{margin-bottom:8px}.q37-lock{overflow:hidden}.q37-filters{display:flex;gap:6px;position:sticky;top:-1px;z-index:2;padding:4px 0 10px;background:#091525}.q37-filters button{padding:8px 11px;border-radius:999px;border:1px solid rgba(120,145,205,.13);background:#111f34;color:#788aa9;font-size:9px;font-weight:900}.q37-filters button.active{background:#294a83;color:#fff}.q37-deal-list,.q37-business-list{display:grid;gap:8px}.q37-deal,.q37-business{display:grid;grid-template-columns:46px minmax(0,1fr) auto;gap:10px;align-items:center;padding:10px;border-radius:16px;background:#102037;border:1px solid rgba(117,143,211,.10)}.q37-icon{width:46px;height:46px;border-radius:13px;display:grid;place-items:center;background:#182b48;font-size:22px}.q37-main{min-width:0}.q37-main>div{display:flex;align-items:center;gap:6px}.q37-main b{font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.q37-main span{font-size:7px;padding:3px 5px;border-radius:7px;background:#1c3150;color:#8aa2c8;white-space:nowrap}.q37-main small,.q37-main em{display:block}.q37-main small{font-size:8px;color:#7285a5;margin-top:3px}.q37-main em{font-style:normal;font-size:9px;color:#b9c8e1;margin-top:2px}.q37-deal>button,.q37-business>button{min-width:58px;height:38px;border:0;border-radius:11px;background:#3969ad;color:#fff;font-weight:900;font-size:9px}.q37-deal>button:disabled,.q37-business>button:disabled{background:#23344e;color:#6f809a}.q37-deal.locked,.q37-business.locked{opacity:.65}.q37-xp-panel{padding:2px}.xp37-hero{display:flex;gap:12px;padding:14px;border-radius:18px;background:linear-gradient(145deg,#152a49,#17233c);border:1px solid rgba(122,151,224,.15)}.xp37-orb{width:56px;height:56px;flex:0 0 56px;border-radius:17px;display:grid;place-items:center;background:linear-gradient(145deg,#314f87,#4b3f83);font-size:27px}.xp37-hero span{font-size:7px;letter-spacing:1.2px;color:#7891b8}.xp37-hero h3{font-size:15px;margin:4px 0}.xp37-hero p{margin:0;color:#7d8fae;font-size:9px;line-height:1.4}.xp37-progress{margin:10px 0;padding:12px;border-radius:16px;background:#101f35;border:1px solid rgba(120,145,205,.10)}.xp37-progress>div:first-child{display:flex;justify-content:space-between;font-size:9px;color:#8293b0}.xp37-progress strong{color:#dce5f8}.xp37-bar{height:7px!important;margin:8px 0;background:#192c48;border-radius:999px;overflow:hidden}.xp37-bar i{display:block;height:100%;background:linear-gradient(90deg,#5c7cff,#986eff);border-radius:inherit}.xp37-progress small{font-size:8px;color:#7184a3}.xp37-game{padding:12px;border-radius:18px;background:#0f1d31;border:1px solid rgba(120,145,205,.10)}.xp37-start{width:100%;min-height:44px;border:0;border-radius:13px;background:linear-gradient(145deg,#426fba,#6451a6);color:#fff;font-weight:900}.xp37-reward{text-align:center;color:#8496b4;font-size:9px;margin-bottom:10px}.xp37-reward b{color:#cfdcff}.xp37-question{text-align:center;font-size:14px;font-weight:900;margin-bottom:10px}.xp37-options{display:grid;grid-template-columns:1fr 1fr;gap:8px}.xp37-options button{position:relative;padding:12px 8px;border-radius:14px;border:1px solid rgba(121,148,213,.12);background:#152742;color:#fff;text-align:left}.xp37-options button>span{position:absolute;right:8px;top:7px;color:#7086aa;font-size:8px;font-weight:900}.xp37-options b,.xp37-options small{display:block}.xp37-options b{font-size:13px}.xp37-options small{font-size:8px;color:#788ba8;margin-top:3px}.xp37-options button.chosen{border-color:#718cff;background:#1d3156}.xp37-timer{height:5px;margin:11px 0 4px;background:#1a2c47;border-radius:99px;overflow:hidden}.xp37-timer i{display:block;height:100%;width:100%;background:#718cff}.xp37-good,.xp37-bad{padding:10px;margin:8px 0;border-radius:12px;text-align:center;font-size:10px;font-weight:900}.xp37-good{background:rgba(55,205,138,.11);color:#62dfa7}.xp37-bad{background:rgba(246,91,112,.10);color:#ff8a9b}.xp37-loading,.xp37-error{text-align:center;display:block;padding:12px;color:#8092af;font-size:9px}.store-xp37{border-color:rgba(124,111,224,.20)!important;background:radial-gradient(circle at 100% 50%,rgba(125,94,225,.10),transparent 44%),linear-gradient(145deg,#17233d,#122037)!important}.store-xp37 .store-icon-v35{background:linear-gradient(145deg,rgba(128,93,225,.18),rgba(71,88,157,.10))!important}@media(max-width:390px){.quick-hub37{gap:6px}.quick-hub37 button{grid-template-columns:auto 1fr;padding:10px 8px}.quick-hub37 i{display:none}.quick-hub37 button>span{font-size:19px}.quick-hub37 b{font-size:9px}.quick-hub37 small{font-size:6.8px}}
  `;document.head.appendChild(style);
  document.title='Бизнес с нуля 3.7';const v=document.querySelector('.topbar .eyebrow');if(v)v.textContent='BUSINESS GAME · 3.7';
  setTimeout(()=>{installQuickHub();try{render()}catch(e){console.error('v3.7 render',e)}},80);
})();