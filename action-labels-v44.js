(() => {
  function applyActionLabels(root = document) {
    root.querySelectorAll?.('[data-deal]').forEach(btn => {
      const text = String(btn.textContent || '').trim();
      if (text === 'Играть' || text === 'Сделать сделку') {
        btn.textContent = 'Заработать';
        btn.setAttribute('aria-label', 'Заработать на сделке');
      }
    });

    root.querySelectorAll?.('[data-business]').forEach(btn => {
      const text = String(btn.textContent || '').trim();
      if (text === '↑' || text === 'Улучшить ↑') {
        btn.textContent = 'Улучшить';
        btn.setAttribute('aria-label', 'Улучшить бизнес');
      }
    });
  }

  const oldDeals = typeof renderDeals === 'function' ? renderDeals : null;
  if (oldDeals) {
    const wrappedDeals = function () {
      const result = oldDeals.apply(this, arguments);
      applyActionLabels(document.getElementById('deals') || document);
      return result;
    };
    try { renderDeals = wrappedDeals; } catch {}
    try { window.renderDeals = wrappedDeals; } catch {}
  }

  const oldBusinesses = typeof renderBusinesses === 'function' ? renderBusinesses : null;
  if (oldBusinesses) {
    const wrappedBusinesses = function () {
      const result = oldBusinesses.apply(this, arguments);
      applyActionLabels(document.getElementById('businesses') || document);
      return result;
    };
    try { renderBusinesses = wrappedBusinesses; } catch {}
    try { window.renderBusinesses = wrappedBusinesses; } catch {}
  }

  let scheduled = false;
  const observer = new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      applyActionLabels();
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });

  const style = document.createElement('style');
  style.id = 'actionLabelsV44Style';
  style.textContent = `
    .q37-deal > button[data-deal]{min-width:82px!important;padding:0 10px!important;font-size:10px!important}
    .q37-business > button[data-business]{min-width:82px!important;padding:0 9px!important;font-size:9.5px!important}
    @media(max-width:390px){
      .q37-deal > button[data-deal],.q37-business > button[data-business]{min-width:76px!important;padding-left:7px!important;padding-right:7px!important;font-size:9px!important}
    }
  `;
  document.head.appendChild(style);

  applyActionLabels();
})();
