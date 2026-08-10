const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand();
}

const STORAGE_KEY = "business_zero_state_v1";

const DEALS = [
  { id: "delivery", icon: "📦", title: "Перепродажа", energy: 2, min: 250, max: 850, fail: 0.14, failLoss: 180 },
  { id: "content", icon: "🎬", title: "Монтаж", energy: 3, min: 500, max: 1400, fail: 0.10, failLoss: 250 },
  { id: "ads", icon: "📣", title: "Реклама", energy: 4, min: 800, max: 2200, fail: 0.18, failLoss: 450 },
  { id: "startup", icon: "🚀", title: "Стартап", energy: 6, min: 1800, max: 5200, fail: 0.32, failLoss: 900 },
];

const BUSINESS_CATALOG = [
  { id: "coffee", icon: "☕", name: "Кофейный автомат", price: 3500, income: 18 },
  { id: "resale", icon: "📱", name: "Перепродажа техники", price: 9000, income: 55 },
  { id: "studio", icon: "🎥", name: "Студия монтажа", price: 28000, income: 165 },
  { id: "shop", icon: "🛒", name: "Интернет-магазин", price: 80000, income: 470 },
  { id: "agency", icon: "🏢", name: "Digital-агентство", price: 240000, income: 1450 },
];

const DEFAULT_STATE = {
  cash: 5000,
  energy: 10,
  maxEnergy: 10,
  xp: 0,
  level: 1,
  businesses: {},
  lastCollectAt: Date.now(),
  lastEnergyAt: Date.now(),
  lastBonusDate: null,
};

let state = loadState();
let modalAction = null;
let toastTimer = null;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_STATE, ...JSON.parse(raw) } : { ...DEFAULT_STATE };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function fmt(n) {
  return Math.floor(n).toLocaleString("ru-RU");
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function haptic(type = "light") {
  try { tg?.HapticFeedback?.impactOccurred(type); } catch {}
}

function notify(type = "success") {
  try { tg?.HapticFeedback?.notificationOccurred(type); } catch {}
}

function showToast(text) {
  const el = document.getElementById("toast");
  el.textContent = text;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 1800);
}

function totalIncomePerMin() {
  return BUSINESS_CATALOG.reduce((sum, b) => {
    const owned = state.businesses[b.id];
    if (!owned) return sum;
    return sum + b.income * owned.level;
  }, 0);
}

function regenEnergy() {
  const now = Date.now();
  const interval = 60_000; // +1 energy per minute
  const elapsed = now - state.lastEnergyAt;
  const ticks = Math.floor(elapsed / interval);
  if (ticks > 0 && state.energy < state.maxEnergy) {
    state.energy = Math.min(state.maxEnergy, state.energy + ticks);
    state.lastEnergyAt += ticks * interval;
    if (state.energy === state.maxEnergy) state.lastEnergyAt = now;
    saveState();
  } else if (state.energy >= state.maxEnergy) {
    state.lastEnergyAt = now;
  }
}

function levelFromXp(xp) {
  return Math.max(1, Math.floor(Math.sqrt(xp / 120)) + 1);
}

function addXp(amount) {
  const before = state.level;
  state.xp += amount;
  state.level = levelFromXp(state.xp);
  if (state.level > before) {
    state.maxEnergy += 1;
    state.energy = state.maxEnergy;
    notify("success");
    showToast(`Новый уровень ${state.level}! Максимум энергии +1`);
  }
}

function renderPlayer() {
  const user = tg?.initDataUnsafe?.user;
  const name = user?.first_name || "Игрок";
  document.getElementById("playerName").textContent = name;
  document.getElementById("avatar").textContent = name.trim().charAt(0).toUpperCase() || "Б";
}

function renderDeals() {
  const el = document.getElementById("deals");
  el.innerHTML = DEALS.map(d => `
    <article class="deal-card">
      <div class="deal-icon">${d.icon}</div>
      <div class="deal-title">${d.title}</div>
      <div class="deal-sub">
        ${d.energy} ⚡ • прибыль ${fmt(d.min)}–${fmt(d.max)} ₽<br>
        риск провала ${Math.round(d.fail*100)}%
      </div>
      <button class="deal-btn" data-deal="${d.id}" ${state.energy < d.energy ? "disabled" : ""}>
        Сделать сделку
      </button>
    </article>
  `).join("");

  el.querySelectorAll("[data-deal]").forEach(btn => {
    btn.addEventListener("click", () => runDeal(btn.dataset.deal));
  });
}

function renderBusinesses() {
  const el = document.getElementById("businesses");
  el.innerHTML = BUSINESS_CATALOG.map(b => {
    const owned = state.businesses[b.id];
    const level = owned?.level || 0;
    const nextPrice = level === 0 ? b.price : Math.floor(b.price * Math.pow(1.65, level));
    const income = b.income * Math.max(1, level);
    return `
      <article class="business-card">
        <div class="business-row">
          <div class="business-icon">${b.icon}</div>
          <div class="business-main">
            <div class="business-title">${b.name}${level ? ` · ур. ${level}` : ""}</div>
            <div class="business-meta">
              ${level ? `Доход: ${fmt(b.income * level)} ₽/мин` : `Базовый доход: ${fmt(b.income)} ₽/мин`}
            </div>
          </div>
          <button class="buy-btn ${level ? "owned" : ""}" data-business="${b.id}">
            ${level ? `Улучшить ${fmt(nextPrice)} ₽` : `Купить ${fmt(nextPrice)} ₽`}
          </button>
        </div>
      </article>
    `;
  }).join("");

  el.querySelectorAll("[data-business]").forEach(btn => {
    btn.addEventListener("click", () => buyOrUpgrade(btn.dataset.business));
  });
}

function render() {
  regenEnergy();
  document.getElementById("cash").textContent = fmt(state.cash);
  document.getElementById("energy").textContent = state.energy;
  document.getElementById("maxEnergy").textContent = state.maxEnergy;
  document.getElementById("xp").textContent = fmt(state.xp);
  document.getElementById("level").textContent = state.level;
  document.getElementById("incomePerMin").textContent = fmt(totalIncomePerMin());
  renderDeals();
  renderBusinesses();
}

function runDeal(id) {
  const d = DEALS.find(x => x.id === id);
  if (!d || state.energy < d.energy) return;

  state.energy -= d.energy;
  state.lastEnergyAt = Date.now();
  const failed = Math.random() < d.fail;

  if (failed) {
    const loss = Math.min(state.cash, d.failLoss);
    state.cash -= loss;
    addXp(8);
    notify("error");
    showToast(`Неудача: −${fmt(loss)} ₽`);
  } else {
    const profit = Math.floor(d.min + Math.random() * (d.max - d.min + 1));
    state.cash += profit;
    addXp(20 + d.energy * 4);
    notify("success");
    showToast(`Сделка успешна: +${fmt(profit)} ₽`);
  }

  saveState();
  render();
}

function buyOrUpgrade(id) {
  const b = BUSINESS_CATALOG.find(x => x.id === id);
  if (!b) return;

  const owned = state.businesses[id];
  const level = owned?.level || 0;
  const price = level === 0 ? b.price : Math.floor(b.price * Math.pow(1.65, level));

  if (state.cash < price) {
    notify("error");
    showToast(`Не хватает ${fmt(price - state.cash)} ₽`);
    return;
  }

  state.cash -= price;
  state.businesses[id] = { level: level + 1 };
  addXp(level === 0 ? 70 : 45);
  saveState();
  haptic("medium");
  showToast(level === 0 ? `${b.name} открыт!` : `${b.name}: уровень ${level + 1}`);
  render();
}

function collectIncome() {
  const perMin = totalIncomePerMin();
  if (perMin <= 0) {
    showToast("Сначала купи хотя бы один бизнес");
    return;
  }

  const now = Date.now();
  const elapsedMin = Math.max(0, (now - state.lastCollectAt) / 60_000);
  const cappedMin = Math.min(elapsedMin, 8 * 60); // максимум 8 часов офлайна
  const earned = Math.floor(perMin * cappedMin);

  if (earned < 1) {
    showToast("Доход ещё не накопился");
    return;
  }

  state.cash += earned;
  state.lastCollectAt = now;
  addXp(Math.min(50, Math.floor(earned / 1000) + 2));
  saveState();
  notify("success");
  showToast(`Пассивный доход: +${fmt(earned)} ₽`);
  render();
}

function openModal({icon="🎁", title, text, actionText="Забрать", onAction=null}) {
  document.getElementById("modalIcon").textContent = icon;
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalText").textContent = text;
  const btn = document.getElementById("modalAction");
  btn.textContent = actionText;
  btn.style.display = onAction ? "block" : "none";
  modalAction = onAction;
  document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
  modalAction = null;
}

function openDailyBonus() {
  const today = todayKey();
  if (state.lastBonusDate === today) {
    openModal({
      icon: "✅",
      title: "Бонус уже получен",
      text: "Возвращайся завтра — будет новый бонус.",
      onAction: null
    });
    return;
  }

  const bonus = 1200 + state.level * 250;
  openModal({
    icon: "🎁",
    title: "Ежедневный бонус",
    text: `Сегодня тебе доступно ${fmt(bonus)} ₽ и 2 единицы энергии.`,
    actionText: `Забрать ${fmt(bonus)} ₽`,
    onAction: () => {
      state.cash += bonus;
      state.energy = Math.min(state.maxEnergy, state.energy + 2);
      state.lastBonusDate = today;
      addXp(25);
      saveState();
      closeModal();
      notify("success");
      showToast(`Бонус +${fmt(bonus)} ₽`);
      render();
    }
  });
}

document.getElementById("collectBtn").addEventListener("click", collectIncome);
document.getElementById("bonusBtn").addEventListener("click", openDailyBonus);
document.getElementById("premiumBtn").addEventListener("click", () => {
  openModal({
    icon: "⭐",
    title: "Premium появится следующим",
    text: "В MVP реальные платежи отключены. Следующим этапом можно подключить Telegram Stars и серверную проверку платежей.",
    onAction: null
  });
});

document.getElementById("resetBtn").addEventListener("click", () => {
  openModal({
    icon: "⚠️",
    title: "Сбросить прогресс?",
    text: "Баланс, бизнесы и уровень будут удалены на этом устройстве.",
    actionText: "Сбросить",
    onAction: () => {
      state = { ...DEFAULT_STATE, lastCollectAt: Date.now(), lastEnergyAt: Date.now() };
      saveState();
      closeModal();
      render();
      showToast("Прогресс сброшен");
    }
  });
});

document.querySelectorAll("[data-close-modal]").forEach(el => el.addEventListener("click", closeModal));
document.getElementById("modalAction").addEventListener("click", () => modalAction?.());

renderPlayer();
render();

setInterval(() => {
  regenEnergy();
  render();
}, 30_000);
