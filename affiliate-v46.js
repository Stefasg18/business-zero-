(()=>{
  if(window.__BZ_AFFILIATE_V46__)return;
  window.__BZ_AFFILIATE_V46__=true;

  const CASH_REWARD=5000;
  const STAR_COMMISSION=5;
  const COMMISSION_MONTHS=6;
  const safe=s=>typeof escapeHtml==='function'?escapeHtml(s):String(s??'').replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));

  function getGameReferralLink(){
    try{return typeof referralLink==='function'?referralLink():'';}catch{return '';}
  }

  function shareGameLink(){
    const link=getGameReferralLink();
    if(!link){
      if(typeof showToast==='function')showToast('Открой игру внутри Telegram');
      return;
    }
    const text=`Начни бизнес с нуля. За активного друга — ${CASH_REWARD.toLocaleString('ru-RU')} игровых ₽.`;
    const share=`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`;
    try{
      if(window.Telegram?.WebApp?.openTelegramLink)window.Telegram.WebApp.openTelegramLink(share);
      else window.open(share,'_blank');
    }catch{
      navigator.clipboard?.writeText(link).then(()=>typeof showToast==='function'&&showToast('Ссылка скопирована'));
    }
  }

  function openAffiliateHelp(){
    let modal=document.getElementById('bzAffiliateModalV46');
    if(!modal){
      modal=document.createElement('div');
      modal.id='bzAffiliateModalV46';
      modal.className='bz-aff-modal hidden';
      modal.innerHTML=`
        <div class="bz-aff-backdrop" data-aff-close></div>
        <div class="bz-aff-sheet">
          <div class="bz-aff-sheet-handle"></div>
          <div class="bz-aff-sheet-icon">⭐</div>
          <div class="bz-aff-kicker">TELEGRAM STARS</div>
          <h3>Как получать ${STAR_COMMISSION}%</h3>
          <p>Это официальная партнёрская программа Telegram. После её запуска каждый игрок сможет получить собственную партнёрскую ссылку, а Telegram будет автоматически перечислять ему ${STAR_COMMISSION}% от покупок привлечённых пользователей в течение ${COMMISSION_MONTHS} месяцев.</p>
          <div class="bz-aff-steps">
            <div><b>1</b><span>Открой Telegram → <strong>Настройки</strong> → <strong>Мои звёзды</strong>.</span></div>
            <div><b>2</b><span>Открой <strong>Заработать звёзды</strong> и найди «Бизнес с нуля».</span></div>
            <div><b>3</b><span>Присоединись и скопируй свою уникальную партнёрскую ссылку.</span></div>
          </div>
          <div class="bz-aff-note">Игровая ссылка даёт ${CASH_REWARD.toLocaleString('ru-RU')} ₽ за активного друга. Партнёрская ссылка Telegram отвечает за реальные ⭐ с его покупок.</div>
          <button class="bz-aff-close-btn" data-aff-close>Понятно</button>
        </div>`;
      document.body.appendChild(modal);
      modal.querySelectorAll('[data-aff-close]').forEach(x=>x.addEventListener('click',()=>modal.classList.add('hidden')));
    }
    modal.classList.remove('hidden');
  }

  function renderAffiliate(){
    const section=document.querySelector('#tab-friends .first-section');
    if(!section)return;

    const oldText=document.querySelector('#tab-friends .ref-card > p');
    if(oldText)oldText.textContent=`Друг получает +1 000 ₽ на старте, а ты — ${CASH_REWARD.toLocaleString('ru-RU')} ₽ после того, как он достигнет 5 уровня и сделает 10 сделок.`;
    const reward=document.querySelector('#tab-friends .ref-stats div:nth-child(2) strong');
    if(reward)reward.textContent=`${CASH_REWARD.toLocaleString('ru-RU')} ₽`;

    let block=document.getElementById('affiliateProgramV46');
    if(!block){
      block=document.createElement('section');
      block.id='affiliateProgramV46';
      block.className='bz-aff-section';
      block.innerHTML=`
        <div class="bz-aff-head">
          <div><span>ПАРТНЁРСКАЯ ПРОГРАММА</span><h3>Зарабатывай вместе с друзьями</h3></div>
          <div class="bz-aff-star">⭐</div>
        </div>
        <p class="bz-aff-intro">Два бонуса за приглашение: игровая награда за активного друга и процент в Telegram Stars с его покупок.</p>
        <div class="bz-aff-grid">
          <div class="bz-aff-metric cash"><span>За активного друга</span><strong>${CASH_REWARD.toLocaleString('ru-RU')} ₽</strong><small>После LVL 5 и 10 сделок</small></div>
          <div class="bz-aff-metric stars"><span>С покупок друга</span><strong>${STAR_COMMISSION}% ⭐</strong><small>Официальная комиссия Telegram</small></div>
          <div class="bz-aff-metric months"><span>Период комиссии</span><strong>${COMMISSION_MONTHS} мес.</strong><small>С первого запуска по партнёрской ссылке</small></div>
        </div>
        <div class="bz-aff-how">
          <div class="bz-aff-how-icon">💡</div>
          <div><strong>Как это работает</strong><p>Приглашаешь игрока → он становится активным → получаешь ${CASH_REWARD.toLocaleString('ru-RU')} игровых ₽. Если он пришёл по официальной партнёрской ссылке Telegram и покупает что-то за Stars, Telegram начисляет тебе ${STAR_COMMISSION}% ⭐.</p></div>
        </div>
        <div class="bz-aff-actions">
          <button id="bzShareGameRefV46" class="bz-aff-primary">📨 Поделиться игровой ссылкой</button>
          <button id="bzAffiliateHelpV46" class="bz-aff-secondary">⭐ Как получать ${STAR_COMMISSION}% Stars</button>
        </div>
        <div class="bz-aff-foot">Без второго уровня рефералов: процент идёт только от пользователей, которых ты пригласил напрямую.</div>`;
      section.appendChild(block);
      document.getElementById('bzShareGameRefV46')?.addEventListener('click',shareGameLink);
      document.getElementById('bzAffiliateHelpV46')?.addEventListener('click',openAffiliateHelp);
    }
  }

  const style=document.createElement('style');
  style.textContent=`
    .bz-aff-section{margin-top:18px;padding:16px;border:1px solid rgba(110,134,219,.18);border-radius:23px;background:radial-gradient(circle at 100% 0,rgba(112,78,224,.13),transparent 34%),linear-gradient(145deg,rgba(20,34,59,.98),rgba(13,25,45,.98));box-shadow:0 16px 34px rgba(0,0,0,.14),inset 0 1px 0 rgba(255,255,255,.03)}
    .bz-aff-head{display:flex;align-items:center;justify-content:space-between;gap:12px}.bz-aff-head span{display:block;color:#7f92b8;font-size:9px;font-weight:950;letter-spacing:1.5px}.bz-aff-head h3{margin:3px 0 0;color:#f7f9ff;font-size:19px;line-height:1.15}.bz-aff-star{width:48px;height:48px;display:grid;place-items:center;flex:0 0 auto;border-radius:15px;background:linear-gradient(145deg,rgba(93,123,219,.18),rgba(131,83,210,.15));border:1px solid rgba(133,151,223,.15);font-size:23px}.bz-aff-intro{margin:9px 0 14px;color:#8b9ab6;font-size:11px;line-height:1.5}
    .bz-aff-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.bz-aff-metric{min-width:0;padding:12px 10px;border-radius:16px;border:1px solid rgba(255,255,255,.065);background:rgba(7,16,30,.28)}.bz-aff-metric span{display:block;color:#8292ae;font-size:9px;line-height:1.25}.bz-aff-metric strong{display:block;margin-top:6px;color:#f5f8ff;font-size:17px;line-height:1.05}.bz-aff-metric small{display:block;margin-top:6px;color:#677995;font-size:8px;line-height:1.3}.bz-aff-metric.cash strong{color:#88e7bb}.bz-aff-metric.stars strong{color:#d8d4ff}.bz-aff-metric.months strong{color:#a9c2ff}
    .bz-aff-how{display:flex;gap:10px;margin-top:11px;padding:12px;border:1px solid rgba(111,137,209,.10);border-radius:16px;background:rgba(82,105,174,.055)}.bz-aff-how-icon{width:34px;height:34px;display:grid;place-items:center;flex:0 0 auto;border-radius:10px;background:rgba(112,137,221,.10)}.bz-aff-how strong{display:block;color:#eef3ff;font-size:11px}.bz-aff-how p{margin:4px 0 0;color:#8393af;font-size:9px;line-height:1.45}
    .bz-aff-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}.bz-aff-actions button{min-height:44px;border-radius:13px;font-size:10px;font-weight:950;cursor:pointer}.bz-aff-primary{border:0;color:white;background:linear-gradient(135deg,#537cef,#7657df);box-shadow:0 8px 18px rgba(65,76,180,.18)}.bz-aff-secondary{color:#b8c6ef;border:1px solid rgba(111,137,218,.17);background:rgba(87,109,182,.09)}.bz-aff-foot{margin-top:10px;text-align:center;color:#667894;font-size:8px;line-height:1.4}
    .bz-aff-modal{position:fixed;inset:0;z-index:100;display:grid;align-items:end}.bz-aff-modal.hidden{display:none}.bz-aff-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.62);backdrop-filter:blur(7px)}.bz-aff-sheet{position:relative;width:min(720px,100%);margin:0 auto;padding:12px 18px calc(20px + env(safe-area-inset-bottom));border-radius:26px 26px 0 0;border:1px solid rgba(131,148,213,.15);background:linear-gradient(180deg,#17243b,#101a2c);box-shadow:0 -22px 50px rgba(0,0,0,.38)}.bz-aff-sheet-handle{width:44px;height:4px;border-radius:999px;background:rgba(255,255,255,.18);margin:0 auto 14px}.bz-aff-sheet-icon{width:56px;height:56px;display:grid;place-items:center;margin:0 auto 9px;border-radius:18px;background:linear-gradient(145deg,rgba(96,126,225,.19),rgba(133,81,220,.14));font-size:28px}.bz-aff-kicker{text-align:center;color:#8296bd;font-size:9px;letter-spacing:1.5px;font-weight:950}.bz-aff-sheet h3{text-align:center;margin:4px 0 7px;font-size:22px}.bz-aff-sheet>p{text-align:center;color:#8d9db8;font-size:11px;line-height:1.5;max-width:540px;margin:0 auto}.bz-aff-steps{display:grid;gap:8px;margin:15px 0}.bz-aff-steps>div{display:flex;align-items:flex-start;gap:10px;padding:11px;border-radius:14px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.055)}.bz-aff-steps b{width:26px;height:26px;display:grid;place-items:center;flex:0 0 auto;border-radius:9px;background:rgba(91,124,227,.14);color:#b9c9ff;font-size:11px}.bz-aff-steps span{color:#9aa9c2;font-size:10px;line-height:1.45}.bz-aff-steps strong{color:#e9efff}.bz-aff-note{padding:11px;border-radius:14px;background:rgba(77,158,126,.075);border:1px solid rgba(76,190,145,.11);color:#93cdb5;font-size:9px;line-height:1.45}.bz-aff-close-btn{width:100%;margin-top:12px;padding:13px;border:0;border-radius:13px;color:white;background:linear-gradient(135deg,#557def,#7658df);font-weight:950}
    @media(max-width:430px){.bz-aff-section{padding:13px}.bz-aff-head h3{font-size:17px}.bz-aff-intro{font-size:10px}.bz-aff-grid{grid-template-columns:1fr 1fr}.bz-aff-metric.months{grid-column:1/-1}.bz-aff-metric strong{font-size:15px}.bz-aff-actions{grid-template-columns:1fr}.bz-aff-how p{font-size:9px}.bz-aff-sheet{padding-left:14px;padding-right:14px}.bz-aff-sheet h3{font-size:20px}}
  `;
  document.head.appendChild(style);

  const baseRender=typeof renderReferral==='function'?renderReferral:null;
  if(baseRender){
    renderReferral=function(){const r=baseRender.apply(this,arguments);queueMicrotask(renderAffiliate);return r;};
  }

  renderAffiliate();
  document.title='Бизнес с нуля 4.6';
  const version=document.querySelector('.topbar .eyebrow');
  if(version)version.textContent='BUSINESS GAME · 4.6';
})();