(() => {
  const MAX_BUSINESS_LEVEL_V32 = 30;
  const UPGRADE_MULTIPLIER_V32 = 1.28;

  const DEALS_V32 = [
    {id:"delivery",icon:"📦",title:"Перепродажа",level:1,energy:2,min:250,max:850,fail:.14,failLoss:180,xp:28},
    {id:"content",icon:"🎬",title:"Монтаж",level:2,energy:3,min:500,max:1400,fail:.10,failLoss:250,xp:35},
    {id:"ads",icon:"📣",title:"Реклама",level:4,energy:4,min:800,max:2200,fail:.18,failLoss:450,xp:45},
    {id:"wholesale",icon:"📦",title:"Оптовая партия",level:7,energy:5,min:2500,max:8000,fail:.16,failLoss:1200,xp:70},
    {id:"marketplace",icon:"🛍️",title:"Маркетплейс",level:10,energy:6,min:7000,max:22000,fail:.20,failLoss:3500,xp:95},
    {id:"construction",icon:"🏗️",title:"Подряд",level:15,energy:8,min:20000,max:65000,fail:.22,failLoss:9000,xp:140},
    {id:"franchise",icon:"🏪",title:"Франшиза",level:22,energy:10,min:60000,max:180000,fail:.24,failLoss:25000,xp:220},
    {id:"export",icon:"🚢",title:"Экспорт",level:30,energy:12,min:180000,max:550000,fail:.25,failLoss:80000,xp:320},
    {id:"realestate",icon:"🏙️",title:"Недвижимость",level:45,energy:15,min:500000,max:1500000,fail:.28,failLoss:200000,xp:480},
    {id:"factorydeal",icon:"🏭",title:"Промышленный контракт",level:65,energy:18,min:1500000,max:5000000,fail:.30,failLoss:650000,xp:700},
    {id:"holdingdeal",icon:"🏢",title:"Сделка холдинга",level:90,energy:22,min:5000000,max:18000000,fail:.32,failLoss:2000000,xp:1000},
    {id:"megaproject",icon:"🌆",title:"Мегапроект",level:125,energy:28,min:18000000,max:70000000,fail:.35,failLoss:8000000,xp:1500},
    {id:"techdeal",icon:"💻",title:"Технологическое IPO",level:170,energy:34,min:60000000,max:220000000,fail:.36,failLoss:25000000,xp:2100},
    {id:"national",icon:"🌐",title:"Национальный контракт",level:220,energy:40,min:200000000,max:800000000,fail:.38,failLoss:90000000,xp:3000}
  ];

  const BUSINESSES_V32 = [
    {id:"coffee",icon:"☕",name:"Кофейный автомат",level:1,price:3500,income:18,xp:70},
    {id:"resale",icon:"📱",name:"Перепродажа техники",level:3,price:9000,income:55,xp:90},
    {id:"studio",icon:"🎥",name:"Студия монтажа",level:5,price:28000,income:165,xp:120},
    {id:"shop",icon:"🛒",name:"Интернет-магазин",level:8,price:80000,income:470,xp:160},
    {id:"agency",icon:"🏢",name:"Digital-агентство",level:12,price:240000,income:1450,xp:220},
    {id:"warehouse",icon:"📦",name:"Складской комплекс",level:18,price:800000,income:5000,xp:300},
    {id:"marketplace",icon:"🛍️",name:"Сеть маркетплейсов",level:25,price:3000000,income:19000,xp:420},
    {id:"restaurant",icon:"🍽️",name:"Сеть ресторанов",level:35,price:10000000,income:70000,xp:560},
    {id:"construction",icon:"🏗️",name:"Строительная компания",level:45,price:35000000,income:240000,xp:700},
    {id:"factory",icon:"🏭",name:"Производственный завод",level:60,price:120000000,income:850000,xp:900},
    {id:"logistics",icon:"🚚",name:"Логистическая сеть",level:80,price:450000000,income:3200000,xp:1200},
    {id:"bank",icon:"🏦",name:"Цифровой банк",level:105,price:1800000000,income:12000000,xp:1600},
    {id:"holding",icon:"🏙️",name:"Международный холдинг",level:135,price:7000000000,income:48000000,xp:2200},
    {id:"techcorp",icon:"💻",name:"Технологическая корпорация",level:170,price:25000000000,income:190000000,xp:3000},
    {id:"globalfund",icon:"🌐",name:"Глобальный инвестиционный фонд",level:220,price:100000000000,income:800000000,xp:4500}
  ];

  function businessPriceV32(b, currentLevel){
    if(currentLevel <= 0) return b.price;
    return Math.floor(b.price * Math.pow(UPGRADE_MULTIPLIER_V32, Math.min(currentLevel, MAX_BUSINESS_LEVEL_V32 - 1)));
  }

  try {
    totalIncomePerMin = function(){
      return BUSINESSES_V32.reduce((sum,b) => {
        const owned = state.businesses?.[b.id];
        return sum + (owned ? b.income * Number(owned.level||0) : 0);
      }, 0);
    };

    renderDeals = function(){
      const el=document.getElementById("deals");
      if(!el)return;
      el.innerHTML=DEALS_V32.map(d=>{
        const locked=Number(state.level||1)<d.level;
        const noEnergy=Number(state.energy||0)<d.energy;
        return `<article class="deal-card ${locked?"progress-locked":""}">
          <div class="tier-line"><div class="deal-icon">${d.icon}</div><span class="tier-badge">LVL ${d.level}+</span></div>
          <div class="deal-title">${d.title}</div>
          <div class="deal-sub">${d.energy} ⚡ • прибыль ${fmt(d.min)}–${fmt(d.max)} ₽<br>риск ${Math.round(d.fail*100)}% • +${fmt(d.xp)} XP</div>
          <button class="deal-btn" data-deal="${d.id}" ${locked||noEnergy?"disabled":""}>${locked?`Откроется на LVL ${d.level}`:noEnergy?"Не хватает энергии":"Сделать сделку"}</button>
        </article>`;
      }).join("");
      el.querySelectorAll("[data-deal]").forEach(btn=>btn.addEventListener("click",()=>runDeal(btn.dataset.deal)));
    };

    renderBusinesses = function(){
      const el=document.getElementById("businesses");
      if(!el)return;
      el.innerHTML=BUSINESSES_V32.map(b=>{
        const currentLevel=Number(state.businesses?.[b.id]?.level||0);
        const locked=Number(state.level||1)<b.level;
        const maxed=currentLevel>=MAX_BUSINESS_LEVEL_V32;
        const price=businessPriceV32(b,currentLevel);
        let label;
        if(locked)label=`Нужен LVL ${b.level}`;
        else if(maxed)label="MAX 30";
        else if(currentLevel)label=`Улучшить ${fmt(price)} ₽`;
        else label=`Купить ${fmt(price)} ₽`;
        return `<article class="business-card ${locked?"progress-locked":""}"><div class="business-row">
          <div class="business-icon">${b.icon}</div>
          <div class="business-main">
            <div class="business-title">${b.name}${currentLevel?` · ур. ${currentLevel}/${MAX_BUSINESS_LEVEL_V32}`:""}</div>
            <div class="business-meta">${currentLevel?`Доход: ${fmt(b.income*currentLevel)} ₽/мин`:`Базовый доход: ${fmt(b.income)} ₽/мин`} · доступ с LVL ${b.level}</div>
          </div>
          <button class="buy-btn ${currentLevel?"owned":""}" data-business="${b.id}" ${locked||maxed?"disabled":""}>${label}</button>
        </div></article>`;
      }).join("");
      el.querySelectorAll("[data-business]").forEach(btn=>btn.addEventListener("click",()=>buyOrUpgrade(btn.dataset.business)));
    };

    runDeal = async function(id){
      if(ONLINE_MODE){
        try{const d=await api("/api/deal",{method:"POST",body:JSON.stringify({dealId:id})});applyServerState(d.state);notify(d.success?"success":"error");showToast(d.message)}
        catch(e){showToast(e.message)}
        return;
      }
      const d=DEALS_V32.find(x=>x.id===id);if(!d)return;
      if(Number(state.level)<d.level){showToast(`Нужен ${d.level} уровень`);return}
      if(Number(state.energy)<d.energy){showToast("Не хватает энергии");return}
      state.energy-=d.energy;state.lastEnergyAt=Date.now();updateLocalQuest("deals",1);
      const failed=Math.random()<d.fail;
      if(failed){const loss=Math.min(state.cash,d.failLoss);state.cash-=loss;addXp(Math.max(8,Math.floor(d.xp*.25)));notify("error");showToast(`Неудача: −${fmt(loss)} ₽`)}
      else{const profit=Math.floor(d.min+Math.random()*(d.max-d.min+1));state.cash+=profit;updateLocalQuest("profit",profit);addXp(d.xp);notify("success");showToast(`Сделка успешна: +${fmt(profit)} ₽`)}
      saveLocal();render();
    };

    buyOrUpgrade = async function(id){
      if(ONLINE_MODE){
        try{const d=await api("/api/business",{method:"POST",body:JSON.stringify({businessId:id})});applyServerState(d.state);showToast(d.message);haptic("medium")}
        catch(e){showToast(e.message)}
        return;
      }
      const b=BUSINESSES_V32.find(x=>x.id===id);if(!b)return;
      if(Number(state.level)<b.level){showToast(`Нужен ${b.level} уровень`);return}
      const currentLevel=Number(state.businesses?.[id]?.level||0);
      if(currentLevel>=MAX_BUSINESS_LEVEL_V32){showToast("Максимальный уровень бизнеса — 30");return}
      const price=businessPriceV32(b,currentLevel);
      if(Number(state.cash)<price){showToast(`Не хватает ${fmt(price-state.cash)} ₽`);return}
      state.cash-=price;state.businesses[id]={level:currentLevel+1};updateLocalQuest("business",1);addXp(currentLevel===0?b.xp:Math.max(45,Math.floor(b.xp*.45)));saveLocal();haptic("medium");showToast(currentLevel===0?`${b.name} открыт!`:`${b.name}: уровень ${currentLevel+1}/30`);render();
    };

    renderLoginStreak = function(){
      const el=document.getElementById("loginStreak");if(!el)return;
      const ls=state.loginStreak;
      if(!ls){el.innerHTML='<div class="info-card">Серия входов доступна в ONLINE-режиме.</div>';return}
      const next=Number(ls.nextDay||1),completed=Number(ls.completedDays||0),rewards=Array.isArray(ls.rewards)?ls.rewards:[];
      el.innerHTML=`<div class="login-head"><div><strong>🔥 День ${next} из 30</strong><span>${ls.claimedToday?"Сегодняшняя награда уже получена":"30 дней — награды растут, крупные бонусы на 5/10/15/20/25/30 день"}</span></div></div>
        <div class="login-days login-days-30">${rewards.map(r=>`<div class="login-day ${r.day===next&&!ls.claimedToday?"current":""} ${r.day<=completed?"done":""} ${[5,10,15,20,25,30].includes(Number(r.day))?"milestone":""}"><strong>${r.day}</strong><span>${fmt(r.rewardCash)} ₽</span></div>`).join("")}</div>
        <div class="login-meta"><div><span>Текущая серия</span><strong>${fmt(ls.currentStreak||0)} 🔥</strong></div><div><span>Лучшая серия</span><strong>${fmt(ls.bestStreak||0)} дней</strong></div></div>
        <button id="claimLoginBtn" class="login-claim" ${ls.claimedToday?"disabled":""}>${ls.claimedToday?"✓ Сегодня получено":`Забрать ${fmt(ls.nextReward?.rewardCash||0)} ₽ + ${fmt(ls.nextReward?.rewardXp||0)} XP`}</button>`;
      document.getElementById("claimLoginBtn")?.addEventListener("click",claimLoginReward);
    };

    renderReferral = function(){
      const count=document.getElementById("refCount");if(count)count.textContent=state.referralCount||0;
      const link=referralLink();const linkEl=document.getElementById("refLink");if(linkEl)linkEl.textContent=link||"Открой приложение внутри Telegram";
      const rewardEl=document.querySelector(".ref-stats div:nth-child(2) strong");if(rewardEl)rewardEl.textContent="3 000 ₽";
      const text=document.querySelector(".ref-card > p");if(text)text.textContent="За каждого нового друга ты получаешь 3 000 игровых ₽, а приглашённый стартует с дополнительным бонусом 1 000 ₽.";
    };
  } catch(e) {
    console.error("Business Zero 3.2 progression init",e);
  }

  const style=document.createElement("style");
  style.textContent=`
    .store-hero{
      border-color:rgba(109,141,255,.18)!important;
      background:
        radial-gradient(circle at 8% 0%,rgba(66,213,255,.12),transparent 38%),
        radial-gradient(circle at 100% 100%,rgba(139,108,255,.13),transparent 42%),
        linear-gradient(145deg,rgba(35,52,88,.94),rgba(18,29,50,.96))!important;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.035),0 12px 30px rgba(0,0,0,.12);
    }
    .store-hero-icon{background:linear-gradient(145deg,rgba(109,141,255,.16),rgba(139,108,255,.12))!important;box-shadow:0 8px 20px rgba(76,96,180,.12)}
    .store-tag{color:#b8c8ff!important;background:rgba(109,141,255,.10)!important;border-color:rgba(109,141,255,.18)!important}
    .tier-line{display:flex;align-items:center;justify-content:space-between;gap:8px}
    .tier-badge{font-size:7px;font-weight:900;letter-spacing:.5px;color:#9eb6ff;padding:4px 6px;border-radius:999px;border:1px solid rgba(109,141,255,.18);background:rgba(109,141,255,.08)}
    .progress-locked{opacity:.68;filter:saturate(.72)}
    .progress-locked .deal-icon,.progress-locked .business-icon{filter:grayscale(.28)}
    .login-days-30{grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:6px!important}
    .login-days-30 .login-day{padding:8px 3px!important}
    .login-day.milestone{border-color:rgba(139,108,255,.28);background:linear-gradient(145deg,rgba(109,141,255,.09),rgba(139,108,255,.09))}
    .login-day.milestone strong{color:#c2cfff}
    .business-card{overflow:hidden}
    .business-title{line-height:1.25}
    .business-meta{line-height:1.45}
    @media(max-width:420px){
      .business-row{align-items:flex-start}.buy-btn{max-width:108px;white-space:normal;line-height:1.2;padding:8px}
      .deal-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
    }
  `;
  document.head.appendChild(style);

  document.title="Бизнес с нуля 3.2";
  const version=document.querySelector(".topbar .eyebrow");if(version)version.textContent="BUSINESS GAME · 3.2";
  const streakLabel=document.querySelector("#loginSection .eyebrow");if(streakLabel)streakLabel.textContent="30 ДНЕЙ";

  try { render(); } catch(e) { console.error(e); }
})();
