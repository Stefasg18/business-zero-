const tg = window.Telegram?.WebApp;
if (tg) { tg.ready(); tg.expand(); }

const CONFIG = window.BZ_CONFIG || {};
const API_BASE = String(CONFIG.API_BASE || "").replace(/\/$/, "");
const ONLINE_MODE = Boolean(API_BASE && !API_BASE.includes("YOUR-BACKEND") && tg?.initData);
const STORAGE_KEY = "business_zero_state_v2";

const DEALS = [
  {id:"delivery",icon:"📦",title:"Перепродажа",energy:2,min:250,max:850,fail:.14,failLoss:180},
  {id:"content",icon:"🎬",title:"Монтаж",energy:3,min:500,max:1400,fail:.10,failLoss:250},
  {id:"ads",icon:"📣",title:"Реклама",energy:4,min:800,max:2200,fail:.18,failLoss:450},
  {id:"startup",icon:"🚀",title:"Стартап",energy:6,min:1800,max:5200,fail:.32,failLoss:900},
];

const BUSINESS_CATALOG = [
  {id:"coffee",icon:"☕",name:"Кофейный автомат",price:3500,income:18},
  {id:"resale",icon:"📱",name:"Перепродажа техники",price:9000,income:55},
  {id:"studio",icon:"🎥",name:"Студия монтажа",price:28000,income:165},
  {id:"shop",icon:"🛒",name:"Интернет-магазин",price:80000,income:470},
  {id:"agency",icon:"🏢",name:"Digital-агентство",price:240000,income:1450},
];

const LOCAL_QUEST_DEFS = [
  {id:"deals",title:"Сделай 3 сделки",icon:"🤝",target:3,rewardCash:600,rewardXp:35},
  {id:"profit",title:"Заработай 2 000 ₽ на сделках",icon:"💸",target:2000,rewardCash:900,rewardXp:50},
  {id:"business",title:"Купи или улучши бизнес",icon:"🏪",target:1,rewardCash:1200,rewardXp:70}
];

const DEFAULT_STATE = {
  cash:5000,energy:10,maxEnergy:10,xp:0,level:1,businesses:{},
  lastCollectAt:Date.now(),lastEnergyAt:Date.now(),lastBonusDate:null,referralCount:0,
  questDate:null,quests:[],achievements:[],levelRewards:[],loginStreak:null,monetization:{vipActive:false,vipUntil:null,supporterTier:0},store:{products:[],purchases:[]}
};

let state = loadLocal();
let toastTimer = null;
let modalAction = null;

function fmt(n){return Math.floor(Number(n)||0).toLocaleString("ru-RU")}
function todayKey(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}
function loadLocal(){try{return {...DEFAULT_STATE,...JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}")}}catch{return {...DEFAULT_STATE}}}
function saveLocal(){if(!ONLINE_MODE)localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}
function haptic(type="light"){try{tg?.HapticFeedback?.impactOccurred(type)}catch{}}
function notify(type="success"){try{tg?.HapticFeedback?.notificationOccurred(type)}catch{}}
function showToast(text){const el=document.getElementById("toast");el.textContent=text;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),1900)}

async function api(path, options={}){
  const res = await fetch(`${API_BASE}${path}`,{
    ...options,
    headers:{
      "Content-Type":"application/json",
      "X-Telegram-Init-Data":tg?.initData||"",
      ...(options.headers||{})
    }
  });
  const data = await res.json().catch(()=>({}));
  if(!res.ok) throw new Error(data.error||`HTTP ${res.status}`);
  return data;
}


function ensureLocalQuests(){
  if(ONLINE_MODE)return;
  const today=todayKey();
  if(state.questDate!==today || !Array.isArray(state.quests) || state.quests.length!==LOCAL_QUEST_DEFS.length){
    state.questDate=today;
    state.quests=LOCAL_QUEST_DEFS.map(q=>({...q,progress:0,claimed:false,complete:false}));
    saveLocal();
  }
}
function updateLocalQuest(id,amount){
  ensureLocalQuests();
  const q=state.quests.find(x=>x.id===id);if(!q)return;
  q.progress=Math.max(0,Number(q.progress||0)+Number(amount||0));
  q.complete=q.progress>=q.target;
  saveLocal();
}

function totalIncomePerMin(){
  return BUSINESS_CATALOG.reduce((sum,b)=>{
    const owned=state.businesses?.[b.id];
    return sum+(owned?b.income*owned.level:0)
  },0)
}
function levelFromXp(xp){return Math.max(1,Math.floor(Math.sqrt(xp/120))+1)}
function addXp(amount){
  const before=state.level;state.xp+=amount;state.level=levelFromXp(state.xp);
  if(state.level>before){state.maxEnergy+=1;state.energy=state.maxEnergy;notify("success");showToast(`Новый уровень ${state.level}!`)}
}
function regenEnergy(){
  if(ONLINE_MODE)return;
  const now=Date.now(),interval=60000,elapsed=now-state.lastEnergyAt,ticks=Math.floor(elapsed/interval);
  if(ticks>0&&state.energy<state.maxEnergy){
    state.energy=Math.min(state.maxEnergy,state.energy+ticks);
    state.lastEnergyAt+=ticks*interval;
    if(state.energy===state.maxEnergy)state.lastEnergyAt=now;
    saveLocal();
  }else if(state.energy>=state.maxEnergy){state.lastEnergyAt=now}
}

function telegramUser(){
  return tg?.initDataUnsafe?.user || {first_name:"Игрок",username:""};
}

function renderPlayer(){
  const user=telegramUser(),name=user.first_name||"Игрок",letter=name.trim().charAt(0).toUpperCase()||"Б";
  for(const id of ["playerName","profileName"])document.getElementById(id).textContent=name;
  for(const id of ["avatar","profileAvatar"])document.getElementById(id).textContent=letter;
  document.getElementById("profileUsername").textContent=user.username?`@${user.username}`:"Telegram-пользователь";
}

function renderDeals(){
  const el=document.getElementById("deals");
  el.innerHTML=DEALS.map(d=>`<article class="deal-card">
    <div class="deal-icon">${d.icon}</div>
    <div class="deal-title">${d.title}</div>
    <div class="deal-sub">${d.energy} ⚡ • прибыль ${fmt(d.min)}–${fmt(d.max)} ₽<br>риск провала ${Math.round(d.fail*100)}%</div>
    <button class="deal-btn" data-deal="${d.id}" ${state.energy<d.energy?"disabled":""}>Сделать сделку</button>
  </article>`).join("");
  el.querySelectorAll("[data-deal]").forEach(btn=>btn.addEventListener("click",()=>runDeal(btn.dataset.deal)));
}

function renderBusinesses(){
  const el=document.getElementById("businesses");
  el.innerHTML=BUSINESS_CATALOG.map(b=>{
    const level=state.businesses?.[b.id]?.level||0;
    const price=level===0?b.price:Math.floor(b.price*Math.pow(1.65,level));
    return `<article class="business-card"><div class="business-row">
      <div class="business-icon">${b.icon}</div>
      <div class="business-main"><div class="business-title">${b.name}${level?` · ур. ${level}`:""}</div>
      <div class="business-meta">${level?`Доход: ${fmt(b.income*level)} ₽/мин`:`Базовый доход: ${fmt(b.income)} ₽/мин`}</div></div>
      <button class="buy-btn ${level?"owned":""}" data-business="${b.id}">${level?`Улучшить ${fmt(price)} ₽`:`Купить ${fmt(price)} ₽`}</button>
    </div></article>`
  }).join("");
  el.querySelectorAll("[data-business]").forEach(btn=>btn.addEventListener("click",()=>buyOrUpgrade(btn.dataset.business)));
}


function renderQuests(){
  const el=document.getElementById("dailyQuests");if(!el)return;
  if(!ONLINE_MODE)ensureLocalQuests();
  const quests=Array.isArray(state.quests)?state.quests:[];
  if(!quests.length){
    el.innerHTML='<div class="info-card">Задания загружаются...</div>';
    return;
  }
  const done=quests.filter(q=>q.claimed).length;
  el.innerHTML=quests.map(q=>{
    const progress=Math.min(Number(q.progress||0),Number(q.target||1));
    const pct=Math.max(0,Math.min(100,Math.round(progress/Number(q.target||1)*100)));
    const progressLabel=q.id==="profit"?`${fmt(progress)} / ${fmt(q.target)} ₽`:`${fmt(progress)} / ${fmt(q.target)}`;
    const btn=q.claimed
      ? '<button class="quest-btn claimed" disabled>✓ Награда получена</button>'
      : q.complete
        ? `<button class="quest-btn ready" data-claim-quest="${q.id}">Забрать +${fmt(q.rewardCash)} ₽</button>`
        : '<button class="quest-btn" disabled>Продолжай выполнять</button>';
    return `<article class="quest-card">
      <div class="quest-top">
        <div class="quest-icon">${q.icon}</div>
        <div class="quest-main">
          <div class="quest-title">${escapeHtml(q.title)}</div>
          <div class="quest-reward">Награда: ${fmt(q.rewardCash)} ₽ + ${fmt(q.rewardXp)} XP</div>
        </div>
      </div>
      <div class="quest-progress-text"><span>Прогресс</span><strong>${progressLabel}</strong></div>
      <div class="quest-bar"><span style="width:${pct}%"></span></div>
      <div class="quest-actions">${btn}</div>
    </article>`;
  }).join("") + (done===quests.length?'<div class="quest-summary">🔥 Все задания на сегодня выполнены. Новые появятся завтра.</div>':'');
  el.querySelectorAll("[data-claim-quest]").forEach(btn=>btn.addEventListener("click",()=>claimQuest(btn.dataset.claimQuest)));
}

async function claimQuest(id){
  if(ONLINE_MODE){
    try{
      const d=await api("/api/quest/claim",{method:"POST",body:JSON.stringify({questId:id})});
      applyServerState(d.state);notify("success");showToast(d.message);
    }catch(e){showToast(e.message)}
    return;
  }
  ensureLocalQuests();
  const q=state.quests.find(x=>x.id===id);
  if(!q||!q.complete||q.claimed)return;
  q.claimed=true;state.cash+=q.rewardCash;addXp(q.rewardXp);saveLocal();notify("success");showToast(`Награда +${fmt(q.rewardCash)} ₽`);render();
}


function renderLoginStreak(){
  const el=document.getElementById("loginStreak");if(!el)return;
  const ls=state.loginStreak;
  if(!ls){
    el.innerHTML='<div class="info-card">Серия входов доступна в ONLINE-режиме.</div>';
    return;
  }
  const next=Number(ls.nextDay||1);
  const completed=Number(ls.completedDays||0);
  const rewards=Array.isArray(ls.rewards)?ls.rewards:[];
  el.innerHTML=`<div class="login-head">
      <div>
        <strong>🔥 День ${next} из 7</strong>
        <span>${ls.claimedToday?"Сегодняшняя награда уже получена":"Заходи каждый день без пропусков"}</span>
      </div>
    </div>
    <div class="login-days">
      ${rewards.map(r=>`<div class="login-day ${r.day===next&&!ls.claimedToday?"current":""} ${r.day<=completed?"done":""}">
        <strong>${r.day}</strong><span>${fmt(r.rewardCash)} ₽</span>
      </div>`).join("")}
    </div>
    <div class="login-meta">
      <div><span>Текущая серия</span><strong>${fmt(ls.currentStreak||0)} 🔥</strong></div>
      <div><span>Лучшая серия</span><strong>${fmt(ls.bestStreak||0)} дней</strong></div>
    </div>
    <button id="claimLoginBtn" class="login-claim" ${ls.claimedToday?"disabled":""}>
      ${ls.claimedToday
        ?"✓ Сегодня получено"
        :`Забрать ${fmt(ls.nextReward?.rewardCash||0)} ₽ + ${fmt(ls.nextReward?.rewardXp||0)} XP`}
    </button>`;
  document.getElementById("claimLoginBtn")?.addEventListener("click",claimLoginReward);
}

function renderLevelRewards(){
  const el=document.getElementById("levelRewards");if(!el)return;
  const rows=Array.isArray(state.levelRewards)?state.levelRewards:[];
  if(!rows.length){
    el.innerHTML='<div class="info-card">Награды появятся после загрузки профиля.</div>';
    return;
  }
  el.innerHTML=rows.map(r=>{
    const btn=r.claimed
      ?'<button class="claimed" disabled>✓ Получено</button>'
      :r.unlocked
        ?`<button class="ready" data-level-reward="${r.level}">Забрать</button>`
        :'<button disabled>Закрыто</button>';
    return `<div class="level-reward">
      <div class="level-reward-icon">🎁</div>
      <div class="level-reward-main">
        <strong>Уровень ${r.level}</strong>
        <span>Награда ${fmt(r.rewardCash)} ₽</span>
      </div>
      ${btn}
    </div>`;
  }).join("");
  el.querySelectorAll("[data-level-reward]").forEach(
    b=>b.addEventListener("click",()=>claimLevelReward(Number(b.dataset.levelReward)))
  );
}

function renderAchievements(){
  const el=document.getElementById("achievements");if(!el)return;
  const rows=Array.isArray(state.achievements)?state.achievements:[];
  if(!rows.length){
    el.innerHTML='<div class="info-card">Достижения появятся после загрузки профиля.</div>';
    return;
  }
  el.innerHTML=rows.map(a=>{
    const progress=Math.min(Number(a.progress||0),Number(a.target||1));
    const pct=Math.max(0,Math.min(100,Math.round(progress/Number(a.target||1)*100)));
    const moneyMetric=["profit_20000","capital_25000"].includes(a.id);
    const label=moneyMetric
      ?`${fmt(progress)} / ${fmt(a.target)} ₽`
      :`${fmt(progress)} / ${fmt(a.target)}`;
    const btn=a.claimed
      ?'<button class="claimed" disabled>✓ Награда получена</button>'
      :a.unlocked
        ?`<button class="ready" data-achievement="${a.id}">Забрать награду</button>`
        :'<button disabled>Ещё не выполнено</button>';
    return `<article class="achievement-card">
      <div class="achievement-top">
        <div class="achievement-icon">${a.icon}</div>
        <div class="achievement-main">
          <strong>${escapeHtml(a.title)}</strong>
          <p>${escapeHtml(a.description)}</p>
        </div>
      </div>
      <div class="achievement-reward">
        Награда: ${fmt(a.rewardCash)} ₽ + ${fmt(a.rewardXp)} XP
      </div>
      <div class="achievement-progress">
        <span>Прогресс</span><strong>${label}</strong>
      </div>
      <div class="achievement-bar"><span style="width:${pct}%"></span></div>
      ${btn}
    </article>`;
  }).join("");
  el.querySelectorAll("[data-achievement]").forEach(
    b=>b.addEventListener("click",()=>claimAchievement(b.dataset.achievement))
  );
}

async function claimLoginReward(){
  if(!ONLINE_MODE){
    showToast("Серия входов работает в ONLINE-режиме");
    return;
  }
  try{
    const d=await api("/api/bonus",{method:"POST"});
    applyServerState(d.state);notify("success");showToast(d.message);
  }catch(e){showToast(e.message)}
}

async function claimAchievement(id){
  if(!ONLINE_MODE)return;
  try{
    const d=await api("/api/achievement/claim",{
      method:"POST",
      body:JSON.stringify({achievementId:id})
    });
    applyServerState(d.state);notify("success");showToast(d.message);
  }catch(e){showToast(e.message)}
}

async function claimLevelReward(level){
  if(!ONLINE_MODE)return;
  try{
    const d=await api("/api/level-reward/claim",{
      method:"POST",
      body:JSON.stringify({level})
    });
    applyServerState(d.state);notify("success");showToast(d.message);
  }catch(e){showToast(e.message)}
}

function openLoginPanel(){
  const btn=document.querySelector('.nav-btn[data-tab="profile"]');
  if(btn)btn.click();
  setTimeout(
    ()=>document.getElementById("loginSection")?.scrollIntoView({behavior:"smooth",block:"start"}),
    120
  );
}


function storeProductById(id){
  return (state.store?.products||[]).find(x=>x.id===id)||null;
}

function renderProfileBadges(){
  const el=document.getElementById("profileBadges");if(!el)return;
  const m=state.monetization||{};
  const badges=[];
  if(m.vipActive){
    const date=m.vipUntil?new Date(m.vipUntil).toLocaleDateString("ru-RU"):"";
    badges.push(`<span class="profile-badge vip">👑 VIP${date?` до ${date}`:""}</span>`);
  }
  if(Number(m.supporterTier||0)>0){
    badges.push(`<span class="profile-badge supporter">❤️ Supporter ×${Number(m.supporterTier)}</span>`);
  }
  el.innerHTML=badges.join("");
}

function renderStore(){
  const productsEl=document.getElementById("storeProducts");
  const historyEl=document.getElementById("purchaseHistory");
  if(!productsEl||!historyEl)return;

  const products=state.store?.products||[];
  productsEl.innerHTML=products.length
    ?products.map(p=>`<article class="store-card">
      <div class="store-icon">${p.icon}</div>
      <div class="store-main">
        <div class="store-title-row">
          <span class="store-title">${escapeHtml(p.title)}</span>
          ${p.badge?`<span class="store-tag">${escapeHtml(p.badge)}</span>`:""}
        </div>
        <div class="store-desc">${escapeHtml(p.description)}</div>
      </div>
      <button class="store-buy" data-buy-product="${p.id}">${fmt(p.stars)} ⭐</button>
    </article>`).join("")
    :'<div class="store-empty">Открой игру внутри Telegram, чтобы загрузить магазин.</div>';

  productsEl.querySelectorAll("[data-buy-product]").forEach(
    b=>b.addEventListener("click",()=>buyStoreProduct(b.dataset.buyProduct,b))
  );

  const purchases=state.store?.purchases||[];
  historyEl.innerHTML=purchases.length
    ?purchases.map(o=>{
      const p=storeProductById(o.product_id);
      const when=o.paid_at?new Date(o.paid_at).toLocaleString("ru-RU"):"";
      return `<div class="purchase-row">
        <div class="icon">${p?.icon||"⭐"}</div>
        <div class="main">
          <strong>${escapeHtml(p?.title||o.product_id)}</strong>
          <span>${escapeHtml(when)}</span>
        </div>
        <div class="purchase-stars">${fmt(o.stars)} ⭐</div>
      </div>`;
    }).join("")
    :'<div class="store-empty">Покупок пока нет.</div>';
}

async function loadStore(){
  if(!ONLINE_MODE){
    state.store={products:[],purchases:[]};
    renderStore();
    return;
  }
  try{
    const d=await api("/api/store");
    state.store={products:d.products||[],purchases:d.purchases||[]};
    state.monetization={
      vipActive:Boolean(d.vipActive),
      vipUntil:d.vipUntil||null,
      supporterTier:Number(d.supporterTier||0)
    };
    renderStore();renderProfileBadges();
  }catch(e){
    showToast(e.message);
  }
}

async function buyStoreProduct(productId,button){
  if(!ONLINE_MODE){
    showToast("Покупки доступны только в ONLINE-режиме");
    return;
  }
  if(!tg?.openInvoice){
    showToast("Открой магазин внутри Telegram");
    return;
  }

  const product=storeProductById(productId);
  if(!product)return;

  button.disabled=true;
  try{
    const d=await api("/api/store/invoice",{
      method:"POST",
      body:JSON.stringify({productId})
    });

    tg.openInvoice(d.invoiceUrl,async status=>{
      if(status==="paid"){
        showToast("Оплата принята. Начисляем покупку...");
        await waitForPaidOrder(d.orderId);
      }else if(status==="pending"){
        showToast("Платёж обрабатывается");
      }else if(status==="cancelled"){
        showToast("Оплата отменена");
      }else{
        showToast("Платёж не завершён");
      }
      button.disabled=false;
    });
  }catch(e){
    button.disabled=false;
    showToast(e.message);
  }
}

async function waitForPaidOrder(orderId){
  for(let i=0;i<8;i++){
    try{
      const d=await api(`/api/store/order/${encodeURIComponent(orderId)}`);
      if(d.order?.status==="paid"){
        if(d.state)applyServerState(d.state);
        await loadStore();
        notify("success");
        showToast("✅ Покупка начислена");
        return;
      }
    }catch{}
    await new Promise(r=>setTimeout(r,900));
  }
  await loadStore();
  showToast("Платёж принят. Если начисление задержалось — открой магазин ещё раз.");
}

function openStorePanel(){
  const btn=document.querySelector('.nav-btn[data-tab="store"]');
  if(btn)btn.click();
}

function render(){
  regenEnergy();
  document.getElementById("cash").textContent=fmt(state.cash);
  document.getElementById("energy").textContent=state.energy;
  document.getElementById("maxEnergy").textContent=state.maxEnergy;
  document.getElementById("xp").textContent=fmt(state.xp);
  document.getElementById("level").textContent=state.level;
  document.getElementById("incomePerMin").textContent=fmt(totalIncomePerMin());
  document.getElementById("profileLevel").textContent=state.level;
  document.getElementById("profileCash").textContent=fmt(state.cash);
  document.getElementById("profileXp").textContent=fmt(state.xp);
  document.getElementById("profileBusinesses").textContent=Object.keys(state.businesses||{}).length;
  renderDeals();renderBusinesses();renderReferral();renderQuests();renderLoginStreak();renderLevelRewards();renderAchievements();renderProfileBadges();
}

function applyServerState(s){
  state={
    ...state,
    cash:Number(s.cash),energy:Number(s.energy),maxEnergy:Number(s.maxEnergy),
    xp:Number(s.xp),level:Number(s.level),businesses:s.businesses||{},
    referralCount:Number(s.referralCount||0),
    quests:Array.isArray(s.quests)?s.quests:state.quests,
    achievements:Array.isArray(s.achievements)?s.achievements:state.achievements,
    levelRewards:Array.isArray(s.levelRewards)?s.levelRewards:state.levelRewards,
    loginStreak:s.loginStreak||state.loginStreak,
    monetization:s.monetization||state.monetization,
    lastBonusDate:s.lastBonusDate||null,
    lastCollectAt:Date.now(),lastEnergyAt:Date.now()
  };
  render();
}

async function runDeal(id){
  if(ONLINE_MODE){
    try{const d=await api("/api/deal",{method:"POST",body:JSON.stringify({dealId:id})});applyServerState(d.state);notify(d.success?"success":"error");showToast(d.message)}
    catch(e){showToast(e.message)};return;
  }
  const d=DEALS.find(x=>x.id===id);if(!d||state.energy<d.energy)return;
  state.energy-=d.energy;state.lastEnergyAt=Date.now();
  const failed=Math.random()<d.fail;
  updateLocalQuest("deals",1);
  if(failed){const loss=Math.min(state.cash,d.failLoss);state.cash-=loss;addXp(8);notify("error");showToast(`Неудача: −${fmt(loss)} ₽`)}
  else{const profit=Math.floor(d.min+Math.random()*(d.max-d.min+1));state.cash+=profit;updateLocalQuest("profit",profit);addXp(20+d.energy*4);notify("success");showToast(`Сделка успешна: +${fmt(profit)} ₽`)}
  saveLocal();render();
}

async function buyOrUpgrade(id){
  if(ONLINE_MODE){
    try{const d=await api("/api/business",{method:"POST",body:JSON.stringify({businessId:id})});applyServerState(d.state);showToast(d.message);haptic("medium")}
    catch(e){showToast(e.message)};return;
  }
  const b=BUSINESS_CATALOG.find(x=>x.id===id);if(!b)return;
  const level=state.businesses?.[id]?.level||0,price=level===0?b.price:Math.floor(b.price*Math.pow(1.65,level));
  if(state.cash<price){showToast(`Не хватает ${fmt(price-state.cash)} ₽`);return}
  state.cash-=price;state.businesses[id]={level:level+1};updateLocalQuest("business",1);addXp(level===0?70:45);saveLocal();haptic("medium");showToast(level===0?`${b.name} открыт!`:`${b.name}: уровень ${level+1}`);render();
}

async function collectIncome(){
  if(ONLINE_MODE){
    try{const d=await api("/api/collect",{method:"POST"});applyServerState(d.state);showToast(d.message)}
    catch(e){showToast(e.message)};return;
  }
  const perMin=totalIncomePerMin();if(perMin<=0){showToast("Сначала купи бизнес");return}
  const now=Date.now(),mins=Math.min(Math.max(0,(now-state.lastCollectAt)/60000),480),earned=Math.floor(perMin*mins);
  if(earned<1){showToast("Доход ещё не накопился");return}
  state.cash+=earned;state.lastCollectAt=now;addXp(Math.min(50,Math.floor(earned/1000)+2));saveLocal();showToast(`Пассивный доход: +${fmt(earned)} ₽`);render();
}

function openDailyBonus(){openLoginPanel()}

async function loadLeaderboard(){
  const el=document.getElementById("leaderboard");
  el.innerHTML='<div class="info-card">Загрузка...</div>';
  if(ONLINE_MODE){
    try{
      const d=await api("/api/leaderboard");
      el.innerHTML=d.players.map((p,i)=>rankRow(i+1,p)).join("")||'<div class="info-card">Пока нет игроков.</div>';
    }catch(e){el.innerHTML=`<div class="info-card">${e.message}</div>`}
    return;
  }
  const u=telegramUser();
  const demo=[
    {first_name:u.first_name||"Ты",username:u.username||"",cash:state.cash,level:state.level},
    {first_name:"Алексей",username:"demo_alex",cash:38400,level:5},
    {first_name:"Мария",username:"demo_maria",cash:21900,level:4}
  ].sort((a,b)=>b.cash-a.cash);
  el.innerHTML=demo.map((p,i)=>rankRow(i+1,p)).join("");
}

function rankRow(place,p){
  const medal=place===1?"🥇":place===2?"🥈":place===3?"🥉":place;
  return `<div class="rank-row"><div class="rank-place">${medal}</div><div class="rank-person"><strong>${escapeHtml(p.first_name||"Игрок")}</strong><span>${p.username?"@"+escapeHtml(p.username):`LVL ${p.level||1}`}</span></div><div class="rank-money">${fmt(p.cash)} ₽</div></div>`
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}

function referralLink(){
  const id=tg?.initDataUnsafe?.user?.id;
  return id?`https://t.me/${CONFIG.BOT_USERNAME||"BusinessZeroGameBot"}?startapp=ref_${id}`:"";
}
function renderReferral(){
  document.getElementById("refCount").textContent=state.referralCount||0;
  const link=referralLink();
  document.getElementById("refLink").textContent=link||"Открой приложение внутри Telegram";
}

function openModal({icon="ℹ️",title,text,actionText="Продолжить",onAction=null}){
  document.getElementById("modalIcon").textContent=icon;document.getElementById("modalTitle").textContent=title;document.getElementById("modalText").textContent=text;
  const btn=document.getElementById("modalAction");btn.textContent=actionText;btn.style.display=onAction?"block":"none";modalAction=onAction;
  document.getElementById("modal").classList.remove("hidden");
}
function closeModal(){document.getElementById("modal").classList.add("hidden");modalAction=null}

async function bootOnline(){
  if(!ONLINE_MODE)return;
  try{
    const startParam=tg?.initDataUnsafe?.start_param||new URLSearchParams(location.search).get("tgWebAppStartParam")||"";
    await api("/api/session",{method:"POST",body:JSON.stringify({startParam})});
    const d=await api("/api/state");applyServerState(d.state);
    document.getElementById("modeBadge").textContent="ONLINE";document.getElementById("modeBadge").classList.add("online");
    document.getElementById("onlineNote").textContent="Онлайн-режим: прогресс, магазин Stars, задания, достижения и серия входов хранятся на сервере.";
    document.getElementById("onlineNote").classList.add("online");
    document.getElementById("resetBtn").style.display="none";
  }catch(e){
    document.getElementById("modeBadge").textContent="API ERROR";
    showToast(`Сервер: ${e.message}`);
  }
}

document.querySelectorAll(".nav-btn").forEach(btn=>btn.addEventListener("click",()=>{
  const tab=btn.dataset.tab;
  document.querySelectorAll(".nav-btn").forEach(x=>x.classList.toggle("active",x===btn));
  document.querySelectorAll(".tab-page").forEach(x=>x.classList.toggle("active",x.id===`tab-${tab}`));
  if(tab==="rating")loadLeaderboard();
  if(tab==="store")loadStore();
  window.scrollTo({top:0,behavior:"smooth"});
}));
document.getElementById("collectBtn").addEventListener("click",collectIncome);
document.getElementById("bonusBtn").addEventListener("click",openStorePanel);
document.getElementById("refreshRatingBtn").addEventListener("click",loadLeaderboard);
document.getElementById("refreshStoreBtn")?.addEventListener("click",loadStore);
document.getElementById("copyRefBtn").addEventListener("click",async()=>{
  const link=referralLink();if(!link){showToast("Открой игру внутри Telegram");return}
  try{await navigator.clipboard.writeText(link);showToast("Ссылка скопирована")}
  catch{tg?.openTelegramLink?.(link)}
});
document.getElementById("resetBtn").addEventListener("click",()=>openModal({
  icon:"⚠️",title:"Сбросить прогресс?",text:"Локальный баланс, бизнесы и уровень будут удалены.",actionText:"Сбросить",onAction:()=>{
    state={...DEFAULT_STATE,lastCollectAt:Date.now(),lastEnergyAt:Date.now()};saveLocal();closeModal();render();showToast("Прогресс сброшен")
  }
}));
document.querySelectorAll("[data-close-modal]").forEach(x=>x.addEventListener("click",closeModal));
document.getElementById("modalAction").addEventListener("click",()=>modalAction?.());

renderPlayer();render();loadLeaderboard();bootOnline();
setInterval(()=>{if(!ONLINE_MODE){regenEnergy();render()}},30000);
