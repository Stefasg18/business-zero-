(() => {
  const VERSION = '4.0';
  let passivePerMinute = 0;
  let vipMultiplier = 1;
  let displayBaseCash = Number(state?.cash || 0);
  let displayBaseAt = Date.now();
  let syncBusy = false;
  let hiddenAt = 0;
  let firstEntrySyncDone = false;

  function money(n){
    return Math.max(0, Math.floor(Number(n) || 0)).toLocaleString('ru-RU');
  }

  function setDisplayBase(cash){
    displayBaseCash = Number(cash || 0);
    displayBaseAt = Date.now();
  }

  function paintProjectedCash(){
    if(!ONLINE_MODE || passivePerMinute <= 0) return;
    const elapsedMinutes = Math.max(0, (Date.now() - displayBaseAt) / 60000);
    const projected = displayBaseCash + passivePerMinute * vipMultiplier * elapsedMinutes;
    const cashEl = document.getElementById('cash');
    const profileEl = document.getElementById('profileCash');
    if(cashEl) cashEl.textContent = money(projected);
    if(profileEl) profileEl.textContent = money(projected);
  }

  function installAutoIncomeUi(){
    const collectBtn = document.getElementById('collectBtn');
    if(collectBtn){
      collectBtn.style.display = 'none';
      collectBtn.disabled = true;
    }

    const businessSection = document.getElementById('businesses')?.closest('.section');
    const head = businessSection?.querySelector('.section-head');
    if(head && !document.getElementById('passiveAutoBadge')){
      const badge = document.createElement('div');
      badge.id = 'passiveAutoBadge';
      badge.className = 'passive-auto-badge';
      badge.innerHTML = '<span class="passive-dot"></span><span id="passiveAutoText">Начисляется автоматически</span>';
      head.appendChild(badge);
    }

    const heroIncome = document.querySelector('.stat-income .stat-caption');
    if(heroIncome) heroIncome.textContent = 'Начисляется автоматически';

    const version = document.querySelector('.topbar .eyebrow');
    if(version) version.textContent = `BUSINESS GAME · ${VERSION}`;
    document.title = `Бизнес с нуля ${VERSION}`;
  }

  function updatePassiveLabel(){
    const text = document.getElementById('passiveAutoText');
    if(!text) return;
    if(passivePerMinute <= 0){
      text.textContent = 'Купи бизнес — доход пойдёт автоматически';
      return;
    }
    const vip = vipMultiplier > 1 ? ' · VIP +20%' : '';
    text.textContent = `+${money(passivePerMinute * vipMultiplier)} ₽/мин автоматически${vip}`;
  }

  async function syncPassive({showReturn = false} = {}){
    if(!ONLINE_MODE || syncBusy || document.visibilityState === 'hidden') return;
    syncBusy = true;
    try{
      const d = await api('/api/passive/sync');
      passivePerMinute = Number(d.perMinute || 0);
      vipMultiplier = Number(d.vipMultiplier || 1);

      if(d.state){
        applyServerState(d.state);
        setDisplayBase(Number(d.state.cash || 0));
      } else if(d.cash != null){
        setDisplayBase(Number(d.cash || 0));
      }

      updatePassiveLabel();

      const earned = Number(d.earned || 0);
      const elapsed = Number(d.elapsedSeconds || 0);
      if(showReturn && earned > 0 && elapsed >= 30){
        notify?.('success');
        openModal({
          icon:'💼',
          title:'Бизнесы работали без тебя',
          text:`Пока тебя не было, твои бизнесы заработали +${money(earned)} ₽. Деньги уже добавлены к капиталу.`
        });
      }
    } catch(e){
      console.error('passive sync', e);
    } finally {
      syncBusy = false;
    }
  }

  function waitForOnlineAndSync(){
    let tries = 0;
    const timer = setInterval(async () => {
      tries += 1;
      const online = document.getElementById('modeBadge')?.classList.contains('online');
      if(online || tries >= 24){
        clearInterval(timer);
        if(online){
          await syncPassive({showReturn:true});
          firstEntrySyncDone = true;
        }
      }
    }, 250);
  }

  // Любое серверное действие обновляет базу для плавного счётчика,
  // чтобы визуальная сумма не могла временно «откатываться» после покупки или сделки.
  const originalApplyServerState = applyServerState;
  applyServerState = function(s){
    originalApplyServerState(s);
    if(s?.cash != null) setDisplayBase(Number(s.cash));
    installAutoIncomeUi();
  };

  document.addEventListener('visibilitychange', () => {
    if(document.visibilityState === 'hidden'){
      hiddenAt = Date.now();
      return;
    }
    const awayFor = hiddenAt ? Date.now() - hiddenAt : 0;
    hiddenAt = 0;
    syncPassive({showReturn: awayFor >= 30000});
  });

  const style = document.createElement('style');
  style.id = 'passiveIncomeV40Styles';
  style.textContent = `
    .passive-auto-badge{
      display:flex;align-items:center;gap:7px;max-width:54%;
      padding:8px 10px;border-radius:999px;
      background:rgba(48,196,132,.10);border:1px solid rgba(75,220,154,.18);
      color:#8ce3ba;font-size:10px;font-weight:850;line-height:1.25;text-align:right
    }
    .passive-dot{width:7px;height:7px;border-radius:50%;background:#4ce49a;box-shadow:0 0 12px rgba(76,228,154,.8);flex:0 0 auto}
    .stat-income .stat-value{font-variant-numeric:tabular-nums}
    @media(max-width:430px){
      .passive-auto-badge{max-width:58%;font-size:9px;padding:7px 9px}
    }
  `;
  document.head.appendChild(style);

  installAutoIncomeUi();
  updatePassiveLabel();
  waitForOnlineAndSync();

  setInterval(paintProjectedCash, 1000);
  setInterval(() => {
    if(firstEntrySyncDone) syncPassive({showReturn:false});
  }, 15000);
})();