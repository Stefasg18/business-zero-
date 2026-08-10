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
  questDate:null,quests:[]
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
  renderDeals();renderBusinesses();renderReferral();renderQuests();
}

function applyServerState(s){
  state={
    ...state,
    cash:Number(s.cash),energy:Number(s.energy),maxEnergy:Number(s.maxEnergy),
    xp:Number(s.xp),level:Number(s.level),businesses:s.businesses||{},
    referralCount:Number(s.referralCount||0),
    quests:Array.isArray(s.quests)?s.quests:state.quests,
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

async function openDailyBonus(){
  if(ONLINE_MODE){
    try{const d=await api("/api/bonus",{method:"POST"});applyServerState(d.state);showToast(d.message)}
    catch(e){showToast(e.message)};return;
  }
  if(state.lastBonusDate===todayKey()){openModal({icon:"✅",title:"Бонус уже получен",text:"Возвращайся завтра — будет новый бонус."});return}
  const bonus=1200+state.level*250;
  openModal({icon:"🎁",title:"Ежедневный бонус",text:`Сегодня тебе доступно ${fmt(bonus)} ₽ и 2 энергии.`,actionText:`Забрать ${fmt(bonus)} ₽`,onAction:()=>{
    state.cash+=bonus;state.energy=Math.min(state.maxEnergy,state.energy+2);state.lastBonusDate=todayKey();addXp(25);saveLocal();closeModal();showToast(`Бонус +${fmt(bonus)} ₽`);render()
  }});
}

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
    document.getElementById("onlineNote").textContent="Онлайн-режим: баланс, бизнесы, рейтинг и ежедневные задания хранятся на сервере.";
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
  window.scrollTo({top:0,behavior:"smooth"});
}));
document.getElementById("collectBtn").addEventListener("click",collectIncome);
document.getElementById("bonusBtn").addEventListener("click",openDailyBonus);
document.getElementById("refreshRatingBtn").addEventListener("click",loadLeaderboard);
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
