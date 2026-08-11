(()=>{
  if(window.__BZ_STORE_PERSONALIZATION_V45__)return;
  window.__BZ_STORE_PERSONALIZATION_V45__=true;

  const safe=s=>typeof escapeHtml==="function"?escapeHtml(s):String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  const money=n=>typeof fmt==="function"?fmt(n):Math.floor(Number(n)||0).toLocaleString("ru-RU");

  const TITLES={
    title_entrepreneur:"Предприниматель",title_businessman:"Бизнесмен",title_founder:"Основатель",title_developer:"Разработчик",
    title_investor:"Инвестор",title_ceo:"CEO",title_magnate:"Магнат",title_tycoon:"Бизнес-император"
  };
  const AVATARS={avatar_lion:"🦁",avatar_shark:"🦈",avatar_wolf:"🐺",avatar_eagle:"🦅",avatar_rocket:"🚀",avatar_diamond:"💎"};

  function isCosmetic(p){return ["cosmetic","title","avatar","glow"].includes(String(p?.tier||""));}
  function cosmeticKind(p){
    const id=String(p?.id||"");
    if(id.startsWith("rename_"))return "rename";
    if(String(p?.tier)==="title")return "title";
    if(String(p?.tier)==="avatar")return "avatar";
    if(id.startsWith("name_glow_"))return "nameGlow";
    if(id.startsWith("avatar_glow_"))return "avatarGlow";
    return "other";
  }
  function currentCosmeticId(kind){
    const p=state?.profileCustomization||{};
    if(kind==="title")return p.titleId;
    if(kind==="avatar")return p.avatarId;
    if(kind==="nameGlow")return p.nameGlowId;
    if(kind==="avatarGlow")return p.avatarGlowId;
    return null;
  }
  function previewFor(p){
    const id=String(p?.id||"");
    const kind=cosmeticKind(p);
    if(kind==="rename")return `<div class="v45-preview rename">Aa</div>`;
    if(kind==="title")return `<div class="v45-preview title">${safe(TITLES[id]||String(p.title||"").replace(/^Титул\s*·\s*/,""))}</div>`;
    if(kind==="avatar")return `<div class="v45-preview avatar">${safe(AVATARS[id]||p.icon||"👤")}</div>`;
    if(kind==="nameGlow"){
      const glow=id.replace("name_glow_","");
      return `<div class="v45-preview name bz-name-glow-${safe(glow)}">Имя</div>`;
    }
    if(kind==="avatarGlow"){
      const glow=id.replace("avatar_glow_","");
      return `<div class="v45-preview avatar aura bz-avatar-glow-${safe(glow)}">👤</div>`;
    }
    return `<div class="v45-preview avatar">${safe(p.icon||"⭐")}</div>`;
  }

  function normalIcon(p){return safe(p?.icon||"⭐")}
  function statusFor(p){
    const minLevel=Math.max(1,Number(p?.minLevel||1));
    const locked=Boolean(p?.locked)||Number(state?.level||1)<minLevel;
    const kind=cosmeticKind(p);
    const active=Boolean(p?.cosmeticId&&currentCosmeticId(kind)===p.cosmeticId);
    const owned=Boolean(p?.owned);
    if(active)return {locked:false,owned:true,active:true,label:"Используется",cls:"active"};
    if(owned)return {locked:false,owned:true,active:false,label:"Куплено",cls:"owned"};
    if(locked)return {locked:true,owned:false,active:false,label:"Недоступно",cls:"locked",minLevel};
    return {locked:false,owned:false,active:false,label:"Купить",cls:"buy"};
  }

  function actionHtml(p){
    const s=statusFor(p);
    const price=`<div class="v45-price"><span>${money(p.stars)}</span><b>⭐</b></div>`;
    if(s.active)return `<div class="v45-actions">${price}<button class="v45-buy active" disabled>✓ Используется</button></div>`;
    if(s.owned)return `<div class="v45-actions">${price}<button class="v45-buy owned" disabled>✓ Куплено</button></div>`;
    if(s.locked)return `<div class="v45-actions">${price}<button class="v45-buy locked" disabled>🔒 Недоступно</button>${s.minLevel>1?`<small>Нужен LVL ${s.minLevel}</small>`:""}</div>`;
    return `<div class="v45-actions">${price}<button class="v45-buy buy" data-buy-product="${safe(p.id)}">Купить</button></div>`;
  }

  function cosmeticCard(p){
    const s=statusFor(p);
    return `<article class="v45-cos-card ${s.cls}">
      <div class="v45-preview-wrap">${previewFor(p)}</div>
      <div class="v45-cos-main">
        <div class="v45-title-line"><strong>${safe(p.title||"Персонализация")}</strong><span>${safe(p.badge||"Стиль")}</span></div>
        <p>${safe(p.description||"Постоянное оформление профиля.")}</p>
        <div class="v45-status ${s.cls}">${s.active?"● Сейчас выбрано":s.owned?"✓ Навсегда открыто":s.locked?"🔒 Пока недоступно":"● Можно купить сейчас"}</div>
      </div>
      ${actionHtml(p)}
    </article>`;
  }

  function regularCard(p){
    const s=statusFor(p);
    return `<article class="store-card store-card-v35 v45-regular ${s.locked?"store-locked-v36":""}">
      <div class="store-icon-v35"><span>${normalIcon(p)}</span></div>
      <div class="store-main-v35">
        <div class="store-title-row-v35"><strong class="store-title-v35">${safe(p.title||"Покупка")}</strong><span class="store-tag-v35">${safe(p.badge||"Stars")}</span></div>
        <div class="store-desc-v35">${safe(p.description||"Игровой бонус")}</div>
        ${Number(p.minLevel||1)>1?`<div class="store-level-v36">Открывается с ${Number(p.minLevel)} уровня</div>`:""}
      </div>
      ${actionHtml(p)}
    </article>`;
  }

  function head(title,eyebrow,desc=""){
    return `<div class="v45-section-head"><div><span>${safe(eyebrow)}</span><h3>${safe(title)}</h3>${desc?`<p>${safe(desc)}</p>`:""}</div></div>`;
  }

  function renderPersonalization(products){
    if(!products.length)return"";
    const rename=products.filter(p=>cosmeticKind(p)==="rename");
    const titles=products.filter(p=>cosmeticKind(p)==="title");
    const avatars=products.filter(p=>cosmeticKind(p)==="avatar");
    const nameGlows=products.filter(p=>cosmeticKind(p)==="nameGlow");
    const avatarGlows=products.filter(p=>cosmeticKind(p)==="avatarGlow");
    return `<section class="v45-personalization">
      <div class="v45-personal-hero">
        <div class="v45-personal-icon">✨</div>
        <div><span>ПЕРСОНАЛИЗАЦИЯ</span><h3>Сделай профиль узнаваемым</h3><p>Имя, титулы, аватары и подсветки. Купленные оформления остаются навсегда.</p></div>
      </div>
      <div class="v45-legend"><span class="available">● Можно купить</span><span class="owned">✓ Куплено</span><span class="locked">🔒 Недоступно</span></div>
      ${rename.length?`${head("Имя игрока","ИМЯ","Жетоны расходуются только при смене игрового имени.")}<div class="v45-cos-grid">${rename.map(cosmeticCard).join("")}</div>`:""}
      ${titles.length?`${head("Титулы","СТАТУС","Начальный титул — Новичок. Купленные титулы можно менять в профиле.")}<div class="v45-cos-grid">${titles.map(cosmeticCard).join("")}</div>`:""}
      ${avatars.length?`${head("Аватары","ОБРАЗ") }<div class="v45-cos-grid">${avatars.map(cosmeticCard).join("")}</div>`:""}
      ${nameGlows.length?`${head("Подсветка имени","НЕОН") }<div class="v45-cos-grid">${nameGlows.map(cosmeticCard).join("")}</div>`:""}
      ${avatarGlows.length?`${head("Аура аватара","СВЕЧЕНИЕ") }<div class="v45-cos-grid">${avatarGlows.map(cosmeticCard).join("")}</div>`:""}
    </section>`;
  }

  renderStore=function(){
    const productsEl=document.getElementById("storeProducts");
    const historyEl=document.getElementById("purchaseHistory");
    if(!productsEl||!historyEl)return;
    const products=Array.isArray(state?.store?.products)?state.store.products:[];
    const cosmetics=products.filter(isCosmetic);
    const base=products.filter(p=>!isCosmetic(p)&&(p.tier||"base")==="base");
    const xp=products.filter(p=>!isCosmetic(p)&&p.tier==="xp");
    const premium=products.filter(p=>!isCosmetic(p)&&["high","elite"].includes(p.tier));
    const other=products.filter(p=>!isCosmetic(p)&&!base.includes(p)&&!xp.includes(p)&&!premium.includes(p));

    productsEl.innerHTML=products.length?`
      ${head("Основные покупки","TELEGRAM STARS","Игровые бонусы и VIP.")}
      ${base.map(regularCard).join("")}
      ${renderPersonalization(cosmetics)}
      ${xp.length?`${head("Опыт и уровни","XP","Пакеты опыта для ускорения прокачки.")}${xp.map(regularCard).join("")}`:""}
      ${premium.length?`${head("Инвестиции и VIP","ПРЕМИУМ","Крупные пакеты для развитого аккаунта.")}${premium.map(regularCard).join("")}`:""}
      ${other.length?`${head("Другие товары","ЕЩЁ")}${other.map(regularCard).join("")}`:""}
    `:'<div class="store-empty">Магазин загружается...</div>';

    productsEl.querySelectorAll("[data-buy-product]").forEach(btn=>btn.addEventListener("click",()=>buyStoreProduct(btn.dataset.buyProduct,btn)));

    const purchases=Array.isArray(state?.store?.purchases)?state.store.purchases:[];
    historyEl.innerHTML=purchases.length?purchases.map(o=>{
      const p=typeof storeProductById==="function"?storeProductById(o.product_id):null;
      const when=o.paid_at?new Date(o.paid_at).toLocaleString("ru-RU"):"";
      return `<div class="purchase-row purchase-row-v35"><div class="purchase-icon-v35">${safe(p?.icon||"⭐")}</div><div class="main"><strong>${safe(p?.title||o.product_id)}</strong><span>${safe(when)}</span></div><div class="purchase-stars-v35">${money(o.stars)} ⭐</div></div>`;
    }).join(""):'<div class="store-empty store-empty-v35">Покупок пока нет.</div>';
  };

  const style=document.createElement("style");
  style.textContent=`
    .v45-section-head{margin:24px 2px 11px}.v45-section-head span{display:block;color:#7185aa;font-size:9px;font-weight:950;letter-spacing:1.5px}.v45-section-head h3{margin:3px 0 0;color:#f5f8ff;font-size:19px;line-height:1.15}.v45-section-head p{margin:5px 0 0;color:#7f90ad;font-size:11px;line-height:1.45}
    .v45-personalization{margin:25px 0 8px;padding:14px;border:1px solid rgba(124,116,230,.20);border-radius:25px;background:radial-gradient(circle at 96% 0,rgba(126,86,230,.13),transparent 32%),radial-gradient(circle at 0 30%,rgba(54,150,220,.08),transparent 33%),linear-gradient(145deg,rgba(19,31,58,.96),rgba(13,24,43,.98));box-shadow:0 16px 36px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.03)}
    .v45-personal-hero{display:flex;gap:12px;align-items:center;padding:5px 3px 13px}.v45-personal-icon{width:52px;height:52px;display:grid;place-items:center;flex:0 0 auto;border-radius:17px;background:linear-gradient(145deg,rgba(108,132,255,.18),rgba(153,84,238,.14));border:1px solid rgba(132,146,231,.17);font-size:25px}.v45-personal-hero span{font-size:9px;letter-spacing:1.5px;color:#8497bb;font-weight:950}.v45-personal-hero h3{font-size:20px;margin:2px 0 3px;color:#f7f8ff}.v45-personal-hero p{font-size:11px;line-height:1.4;color:#8999b7;margin:0}
    .v45-legend{display:flex;gap:7px;flex-wrap:wrap;margin:0 2px 6px}.v45-legend span{font-size:9px;font-weight:850;padding:6px 8px;border-radius:999px;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.025)}.v45-legend .available{color:#8ee4bd}.v45-legend .owned{color:#9db8ff}.v45-legend .locked{color:#77869f}
    .v45-cos-grid{display:grid;grid-template-columns:1fr;gap:9px}.v45-cos-card{position:relative;display:grid;grid-template-columns:70px minmax(0,1fr) 104px;gap:12px;align-items:center;padding:12px;border:1px solid rgba(119,143,203,.14);border-radius:19px;background:linear-gradient(145deg,rgba(24,39,64,.96),rgba(15,28,48,.96));overflow:hidden}.v45-cos-card.buy{border-color:rgba(76,193,150,.17)}.v45-cos-card.owned,.v45-cos-card.active{border-color:rgba(103,139,239,.24);background:radial-gradient(circle at 100% 50%,rgba(93,114,224,.09),transparent 40%),linear-gradient(145deg,rgba(24,39,68,.98),rgba(16,29,50,.98))}.v45-cos-card.locked{opacity:.68;filter:saturate(.75)}
    .v45-preview-wrap{display:grid;place-items:center}.v45-preview{width:62px;height:62px;border-radius:18px;display:grid;place-items:center;text-align:center;background:linear-gradient(145deg,rgba(92,119,190,.16),rgba(82,72,154,.10));border:1px solid rgba(135,151,219,.13);color:#edf3ff;font-weight:950}.v45-preview.rename{font-size:22px}.v45-preview.title{font-size:10px;line-height:1.15;padding:6px}.v45-preview.avatar{font-size:29px}.v45-preview.name{font-size:15px}
    .v45-cos-main{min-width:0}.v45-title-line{display:flex;align-items:center;gap:6px;flex-wrap:wrap}.v45-title-line strong{font-size:14px;line-height:1.22;color:#f4f7ff}.v45-title-line span{font-size:8px;font-weight:900;color:#adbbeb;border:1px solid rgba(117,137,207,.15);background:rgba(104,124,192,.08);padding:4px 6px;border-radius:999px}.v45-cos-main p{font-size:10px;line-height:1.4;color:#8292ae;margin:5px 0}.v45-status{font-size:9px;font-weight:900;margin-top:6px}.v45-status.buy{color:#78dcb2}.v45-status.owned,.v45-status.active{color:#95b2ff}.v45-status.locked{color:#8490a5}
    .v45-actions{display:flex;flex-direction:column;align-items:stretch;gap:6px;min-width:0}.v45-price{display:flex;align-items:center;justify-content:center;gap:5px;color:#f3f6ff;font-size:16px;font-weight:950}.v45-price b{font-size:15px}.v45-buy{height:39px;border-radius:12px;border:1px solid rgba(126,146,218,.18);font-size:10px;font-weight:950;color:white}.v45-buy.buy{background:linear-gradient(135deg,#4f78ef,#7557dc);box-shadow:0 7px 16px rgba(66,78,180,.18)}.v45-buy.owned,.v45-buy.active{color:#9fb8ff;background:rgba(92,122,213,.10);box-shadow:none}.v45-buy.locked{color:#7f8ca2;background:rgba(55,67,88,.45);box-shadow:none}.v45-actions small{text-align:center;font-size:8px;color:#7887a0}
    .v45-regular{grid-template-columns:70px minmax(0,1fr) 104px!important}.v45-regular .v45-actions{position:relative;z-index:2}

    /* Крупнее и читабельнее новый блок профиля */
    #cosmeticsPanelV44{padding:18px!important;border-radius:22px!important}.bz-cos-head{margin-bottom:11px!important}.bz-cos-head span{font-size:10px!important;letter-spacing:1.6px!important}.bz-cos-head strong{font-size:21px!important;line-height:1.2!important}.bz-credit{font-size:13px!important;padding:8px 11px!important}.bz-current-role{font-size:13px!important;line-height:1.4!important;margin-bottom:13px!important}.bz-current-role strong{font-size:14px!important}.bz-rename-row input{font-size:14px!important;padding:12px!important}.bz-rename-row button,.bz-go-store{font-size:12px!important;padding:11px 12px!important}.bz-cos-group{margin-top:16px!important}.bz-cos-group-title{font-size:14px!important;font-weight:950!important;margin-bottom:9px!important}.bz-cos-choice{font-size:12px!important;min-height:44px!important;padding:9px 10px!important}.bz-choice-preview{font-size:18px!important}.bz-rank-avatar{font-size:18px!important}

    @media(max-width:430px){.v45-personalization{padding:11px;border-radius:21px}.v45-personal-hero h3{font-size:18px}.v45-personal-hero p{font-size:10px}.v45-cos-card{grid-template-columns:56px minmax(0,1fr) 88px;gap:9px;padding:10px}.v45-preview{width:52px;height:52px;border-radius:15px}.v45-preview.avatar{font-size:25px}.v45-preview.title{font-size:8px}.v45-title-line strong{font-size:12px}.v45-cos-main p{font-size:9px}.v45-price{font-size:14px}.v45-buy{height:37px;font-size:9px}.v45-regular{grid-template-columns:58px minmax(0,1fr) 88px!important}.bz-cos-head strong{font-size:19px!important}.bz-current-role{font-size:12px!important}.bz-cos-group-title{font-size:13px!important}.bz-cos-choice{font-size:11.5px!important}}
    @media(max-width:355px){.v45-cos-card{grid-template-columns:52px minmax(0,1fr)}.v45-actions{grid-column:2;display:grid;grid-template-columns:70px 1fr;align-items:center}.v45-actions small{grid-column:1/-1}.v45-preview{width:48px;height:48px}.v45-regular{grid-template-columns:50px minmax(0,1fr)!important}.v45-regular .v45-actions{grid-column:2}}
  `;
  document.head.appendChild(style);

  document.title="Бизнес с нуля 4.5";
  const version=document.querySelector(".topbar .eyebrow");
  if(version)version.textContent="BUSINESS GAME · 4.5";

  try{if(state?.store?.products?.length)renderStore();}catch(e){console.error("Store personalization v4.5",e);}
})();
