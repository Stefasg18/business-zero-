(() => {
  const STORE_VISUALS = {
    cash_10k:     { icon: "💵", badge: "Старт", cls: "cash" },
    cash_50k:     { icon: "💰", badge: "Выгодно", cls: "cash" },
    cash_150k:    { icon: "🏦", badge: "Капитал", cls: "cash" },
    energy_full:  { icon: "⚡", badge: "Энергия", cls: "energy" },
    vip_30d:      { icon: "👑", badge: "VIP", cls: "vip" },
    supporter:    { icon: "❤️", badge: "Supporter", cls: "supporter" },
    income_2h:    { icon: "📊", badge: "LVL 25+", cls: "invest" },
    income_8h:    { icon: "📈", badge: "LVL 50+", cls: "invest" },
    income_24h:   { icon: "🏙️", badge: "LVL 100+", cls: "invest" },
    income_72h:   { icon: "🌐", badge: "LVL 150+", cls: "elite" },
    vip_90d:      { icon: "💎", badge: "LVL 50+", cls: "vip" },
    vip_365d:     { icon: "👑", badge: "LVL 100+", cls: "elite" }
  };

  function storeVisual(product) {
    const fallback = STORE_VISUALS[product?.id] || { icon: "⭐", badge: "Stars", cls: "default" };
    return {
      icon: product?.icon && product.icon !== "undefined" ? product.icon : fallback.icon,
      badge: product?.badge || fallback.badge,
      cls: fallback.cls
    };
  }

  function sectionTitle(text, sub) {
    return `<div class="store-section-v36"><div><span>${sub}</span><h3>${text}</h3></div></div>`;
  }

  function card(p) {
    const v = storeVisual(p);
    const minLevel = Number(p.minLevel || 1);
    const locked = Boolean(p.locked) || Number(state.level || 1) < minLevel;
    return `<article class="store-card store-card-v35 store-${v.cls} ${locked ? "store-locked-v36" : ""}">
      <div class="store-icon-v35" aria-hidden="true"><span>${v.icon}</span></div>
      <div class="store-main-v35">
        <div class="store-title-row-v35">
          <strong class="store-title-v35">${escapeHtml(p.title || "Покупка")}</strong>
          <span class="store-tag-v35">${escapeHtml(v.badge)}</span>
        </div>
        <div class="store-desc-v35">${escapeHtml(p.description || "Игровой бонус")}</div>
        ${minLevel > 1 ? `<div class="store-level-v36">Открывается с ${minLevel} уровня</div>` : ""}
      </div>
      <button class="store-buy-v35 ${locked ? "locked" : ""}" ${locked ? "disabled" : `data-buy-product="${escapeHtml(p.id)}"`}>
        ${locked ? `<span>🔒 LVL ${minLevel}</span>` : `<span>${fmt(p.stars)}</span><span class="store-star-v35">⭐</span>`}
      </button>
    </article>`;
  }

  renderStore = function () {
    const productsEl = document.getElementById("storeProducts");
    const historyEl = document.getElementById("purchaseHistory");
    if (!productsEl || !historyEl) return;

    const products = state.store?.products || [];
    const base = products.filter(p => (p.tier || "base") === "base");
    const high = products.filter(p => ["high", "elite"].includes(p.tier));

    productsEl.innerHTML = products.length
      ? `${sectionTitle("Основные покупки", "МАГАЗИН")}${base.map(card).join("")}${high.length ? `${sectionTitle("Для высоких уровней", "ПРЕМИУМ · МАСШТАБИРУЕТСЯ С ДОХОДОМ")}${high.map(card).join("")}` : ""}`
      : '<div class="store-empty">Открой игру внутри Telegram, чтобы загрузить магазин.</div>';

    productsEl.querySelectorAll("[data-buy-product]").forEach(
      b => b.addEventListener("click", () => buyStoreProduct(b.dataset.buyProduct, b))
    );

    const purchases = state.store?.purchases || [];
    historyEl.innerHTML = purchases.length
      ? purchases.map(o => {
          const p = storeProductById(o.product_id) || { id: o.product_id };
          const v = storeVisual(p);
          const when = o.paid_at ? new Date(o.paid_at).toLocaleString("ru-RU") : "";
          return `<div class="purchase-row purchase-row-v35">
            <div class="purchase-icon-v35">${v.icon}</div>
            <div class="main">
              <strong>${escapeHtml(p?.title || o.product_id)}</strong>
              <span>${escapeHtml(when)}</span>
            </div>
            <div class="purchase-stars-v35">${fmt(o.stars)} ⭐</div>
          </div>`;
        }).join("")
      : '<div class="store-empty store-empty-v35">Покупок пока нет.</div>';
  };

  const style = document.createElement("style");
  style.textContent = `
    #tab-store{background:radial-gradient(circle at 50% 0,rgba(77,103,180,.10),transparent 30%),transparent!important}
    #tab-store .store-hero{position:relative;overflow:hidden;border:1px solid rgba(116,145,225,.20)!important;background:radial-gradient(circle at 92% 12%,rgba(139,108,255,.16),transparent 34%),radial-gradient(circle at 8% 90%,rgba(65,155,255,.09),transparent 36%),linear-gradient(145deg,#162746,#1a2341)!important;box-shadow:0 14px 34px rgba(0,0,0,.18)!important}
    #tab-store .store-hero-icon{background:linear-gradient(145deg,rgba(92,125,218,.25),rgba(111,83,187,.18))!important;border:1px solid rgba(144,162,230,.18)!important;box-shadow:none!important;text-shadow:0 4px 14px rgba(255,196,66,.16)}
    #storeProducts.store-grid{display:block!important}
    .store-section-v36{display:flex;align-items:end;justify-content:space-between;margin:22px 2px 10px}
    .store-section-v36 span{display:block;color:#6f83a5;font-size:8px;font-weight:900;letter-spacing:1.3px}
    .store-section-v36 h3{margin:3px 0 0;color:#f5f7ff;font-size:18px;line-height:1.1}
    .store-card-v35{position:relative;display:grid!important;grid-template-columns:70px minmax(0,1fr) auto!important;align-items:center!important;gap:13px!important;min-height:105px!important;padding:13px 14px!important;margin-bottom:11px;overflow:hidden;border-radius:22px!important;border:1px solid rgba(120,145,205,.16)!important;background:radial-gradient(circle at 100% 50%,rgba(96,119,185,.07),transparent 42%),linear-gradient(145deg,rgba(19,35,58,.98),rgba(14,27,46,.98))!important;box-shadow:0 12px 27px rgba(0,0,0,.13),inset 0 1px 0 rgba(255,255,255,.025)!important}
    .store-card-v35::after{content:"";position:absolute;inset:auto -25px -48px auto;width:105px;height:105px;border-radius:50%;background:rgba(105,128,202,.055);filter:blur(2px);pointer-events:none}
    .store-invest{border-color:rgba(81,169,188,.18)!important;background:radial-gradient(circle at 100% 50%,rgba(52,166,174,.075),transparent 42%),linear-gradient(145deg,rgba(17,38,56,.98),rgba(14,29,45,.98))!important}
    .store-elite{border-color:rgba(136,111,222,.22)!important;background:radial-gradient(circle at 100% 50%,rgba(134,93,226,.10),transparent 42%),linear-gradient(145deg,rgba(29,28,61,.98),rgba(18,26,48,.98))!important}
    .store-icon-v35{width:64px;height:64px;border-radius:18px;display:grid;place-items:center;background:linear-gradient(145deg,rgba(86,111,181,.17),rgba(68,83,138,.09));border:1px solid rgba(133,154,217,.12);font-size:30px;line-height:1;box-shadow:inset 0 1px 0 rgba(255,255,255,.035)}
    .store-energy .store-icon-v35{background:linear-gradient(145deg,rgba(207,153,72,.13),rgba(80,99,150,.10))}.store-vip .store-icon-v35{background:linear-gradient(145deg,rgba(139,105,220,.16),rgba(75,91,157,.10))}.store-supporter .store-icon-v35{background:linear-gradient(145deg,rgba(194,86,119,.13),rgba(72,91,151,.09))}.store-invest .store-icon-v35{background:linear-gradient(145deg,rgba(60,179,179,.16),rgba(67,94,145,.10))}.store-elite .store-icon-v35{background:linear-gradient(145deg,rgba(142,95,231,.18),rgba(83,75,156,.11))}
    .store-main-v35{min-width:0;position:relative;z-index:1}.store-title-row-v35{display:flex;align-items:center;gap:7px;min-width:0;margin-bottom:5px}.store-title-v35{min-width:0;color:#f5f7ff;font-size:16px;line-height:1.18;font-weight:900;overflow-wrap:anywhere}.store-tag-v35{flex:0 0 auto;padding:4px 7px;border-radius:999px;color:#aebdf0;background:rgba(98,122,196,.11);border:1px solid rgba(113,138,213,.13);font-size:8px;font-weight:900;letter-spacing:.3px}.store-desc-v35{color:#8291ac;font-size:11px;line-height:1.35;overflow-wrap:anywhere}.store-level-v36{margin-top:6px;color:#6f83a5;font-size:8.5px;font-weight:800}
    .store-buy-v35{position:relative;z-index:1;display:flex;align-items:center;justify-content:center;gap:6px;min-width:88px;height:48px;padding:0 14px;border:1px solid rgba(128,145,221,.18)!important;border-radius:16px!important;background:linear-gradient(145deg,#33477e,#463d7d)!important;color:#f5f7ff!important;font-size:15px;font-weight:950;box-shadow:0 8px 18px rgba(35,42,95,.20)!important}.store-buy-v35:active{transform:scale(.975)}.store-buy-v35:disabled{opacity:.66}.store-buy-v35.locked{min-width:96px;background:linear-gradient(145deg,#27354f,#303348)!important;color:#8997af!important;box-shadow:none!important}.store-star-v35{font-size:15px;filter:saturate(.85);text-shadow:0 0 10px rgba(255,204,92,.18)}
    .store-locked-v36{filter:saturate(.78)}.store-locked-v36 .store-icon-v35{opacity:.65}.store-locked-v36 .store-title-v35{color:#bdc6d8}
    .purchase-row-v35{border-color:rgba(120,145,205,.12)!important;background:rgba(17,31,51,.75)!important}.purchase-icon-v35{width:38px;height:38px;display:grid;place-items:center;border-radius:11px;background:rgba(99,123,190,.10);font-size:19px}.purchase-stars-v35{color:#c9d3f7;font-size:12px;font-weight:900}.store-empty-v35{border:1px dashed rgba(125,148,211,.12);background:rgba(16,28,46,.55)!important}
    @media(max-width:430px){.store-card-v35{grid-template-columns:58px minmax(0,1fr) 78px!important;gap:10px!important;padding:12px!important;min-height:96px!important}.store-icon-v35{width:54px;height:54px;border-radius:16px;font-size:26px}.store-title-v35{font-size:14px}.store-desc-v35{font-size:9.5px}.store-buy-v35{min-width:74px;height:44px;padding:0 9px;font-size:12px;border-radius:14px!important}.store-buy-v35.locked{min-width:76px;font-size:9px}.store-tag-v35{display:none}.store-section-v36 h3{font-size:17px}}
    @media(max-width:350px){.store-card-v35{grid-template-columns:50px minmax(0,1fr)!important}.store-icon-v35{width:48px;height:48px;font-size:23px}.store-buy-v35{grid-column:2;justify-self:start;min-width:82px;height:38px;margin-top:3px}}
  `;
  document.head.appendChild(style);

  document.title = "Бизнес с нуля 3.6";
  const version = document.querySelector(".topbar .eyebrow");
  if (version) version.textContent = "BUSINESS GAME · 3.6";

  try { renderStore(); } catch (e) { console.error("Store v3.6", e); }
})();