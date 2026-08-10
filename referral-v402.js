(() => {
  const VERSION='4.0.2';
  const REF_REWARD=5000;

  function applyReferralUi(){
    try{
      if(typeof renderReferral==='function'){
        const count=document.getElementById('refCount');
        if(count) count.textContent=state?.referralCount||0;
        const link=typeof referralLink==='function'?referralLink():'';
        const linkEl=document.getElementById('refLink');
        if(linkEl) linkEl.textContent=link||'Открой приложение внутри Telegram';
      }
    }catch{}

    const rewardEl=document.querySelector('.ref-stats div:nth-child(2) strong');
    if(rewardEl) rewardEl.textContent=`${REF_REWARD.toLocaleString('ru-RU')} ₽`;

    const text=document.querySelector('.ref-card > p');
    if(text) text.textContent=`Друг получает +1 000 ₽ на старте, а ты — ${REF_REWARD.toLocaleString('ru-RU')} ₽ после того, как он достигнет 5 уровня и сделает 10 сделок.`;

    const version=document.querySelector('.topbar .eyebrow');
    if(version) version.textContent=`BUSINESS GAME · ${VERSION}`;
    document.title=`Бизнес с нуля ${VERSION}`;
  }

  try{
    const original=typeof renderReferral==='function'?renderReferral:null;
    renderReferral=function(){
      try{ original?.(); }catch{}
      applyReferralUi();
    };
  }catch{}

  applyReferralUi();
})();