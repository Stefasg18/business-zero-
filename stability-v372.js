(() => {
  const VERSION = '3.7.2';

  function getSheet(){ return document.getElementById('quickSheet37'); }
  function getBody(){ return document.getElementById('q37Body'); }

  function ensureParking(){
    let parking = document.getElementById('q37Parking372');
    if(!parking){
      parking = document.createElement('div');
      parking.id = 'q37Parking372';
      parking.hidden = true;
      document.body.appendChild(parking);
    }
    return parking;
  }

  function parkNode(node){
    if(node && node.parentElement?.id === 'q37Body') ensureParking().appendChild(node);
  }

  function parkCurrent(){
    const body = getBody();
    if(!body) return;
    body.querySelectorAll(':scope > .q37-content-section, :scope > #xpPanel37').forEach(parkNode);
  }

  function findSection(type){
    const selector = type === 'deals' ? '[data-q37="deals"]' : '[data-q37="businesses"]';
    return document.querySelector(selector);
  }

  function openSafe(type){
    const shell = getSheet();
    const body = getBody();
    if(!shell || !body) return;

    parkCurrent();
    body.replaceChildren();

    const title = document.getElementById('q37Title');
    const eyebrow = document.getElementById('q37Eyebrow');

    if(type === 'deals'){
      if(title) title.textContent = 'Сделки';
      if(eyebrow) eyebrow.textContent = 'БЫСТРЫЕ ДЕНЬГИ';
      const section = findSection('deals');
      if(section){
        body.appendChild(section);
        try { window.renderDeals?.(); } catch(e) { console.error('renderDeals', e); }
      }
    } else if(type === 'businesses'){
      if(title) title.textContent = 'Мои бизнесы';
      if(eyebrow) eyebrow.textContent = 'ПАССИВНЫЙ ДОХОД';
      const section = findSection('businesses');
      if(section){
        body.appendChild(section);
        try { window.renderBusinesses?.(); } catch(e) { console.error('renderBusinesses', e); }
      }
    } else if(type === 'xp'){
      if(title) title.textContent = 'XP-тренажёр';
      if(eyebrow) eyebrow.textContent = 'ИГРА БЕЗ ЭНЕРГИИ';
      const xp = document.getElementById('xpPanel37');
      if(xp) body.appendChild(xp);
    }

    shell.classList.remove('hidden');
    document.body.classList.add('q37-lock');
  }

  function closeSafe(){
    parkCurrent();
    getSheet()?.classList.add('hidden');
    document.body.classList.remove('q37-lock');
  }

  function bind(){
    const parking = ensureParking();

    document.querySelectorAll('.q37-content-section').forEach(section => {
      if(section.parentElement?.id !== parking.id) parking.appendChild(section);
    });
    const xp = document.getElementById('xpPanel37');
    if(xp && xp.parentElement?.id !== parking.id) parking.appendChild(xp);

    document.addEventListener('click', (event) => {
      const opener = event.target.closest?.('[data-open37]');
      if(opener){
        event.preventDefault();
        event.stopImmediatePropagation();
        openSafe(opener.dataset.open37);
        return;
      }
      const closer = event.target.closest?.('[data-q37-close]');
      if(closer){
        event.preventDefault();
        event.stopImmediatePropagation();
        closeSafe();
      }
    }, true);

    const version = document.querySelector('.topbar .eyebrow');
    if(version) version.textContent = `BUSINESS GAME · ${VERSION}`;
    document.title = `Бизнес с нуля ${VERSION}`;

    const loginEyebrow = document.querySelector('#loginSection .section-head .eyebrow');
    if(loginEyebrow) loginEyebrow.textContent = '30 ДНЕЙ';

    const refStats = document.querySelector('.ref-stats');
    if(refStats){
      const blocks = refStats.querySelectorAll('div');
      const strong = blocks[1]?.querySelector('strong');
      if(strong) strong.textContent = '5 000 ₽';
    }
  }

  const style = document.createElement('style');
  style.id = 'stability372Styles';
  style.textContent = `
    #q37Parking372{display:none!important}
    .q37-shell.hidden{display:none!important}
    .q37-sheet{overflow:hidden!important}
    .q37-body{overscroll-behavior:contain;-webkit-overflow-scrolling:touch}
    .q37-body>.q37-content-section{display:block!important;width:100%!important;min-width:0!important}
    .q37-body .q37-deal-list,.q37-body .q37-business-list{padding-bottom:18px!important}
    .q37-body .q37-deal,.q37-body .q37-business{box-sizing:border-box!important}
    @media(max-width:430px){
      .q37-sheet{left:8px!important;right:8px!important;width:auto!important;max-width:none!important;border-radius:26px 26px 0 0!important}
      .q37-head{padding:14px 18px!important}
      .q37-body{padding:10px 10px calc(24px + env(safe-area-inset-bottom))!important}
    }
  `;
  document.head.appendChild(style);

  bind();
})();