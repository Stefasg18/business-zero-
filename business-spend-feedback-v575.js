(()=>{
  if(window.__BZ_BUSINESS_SPEND_V575__)return;
  window.__BZ_BUSINESS_SPEND_V575__=1;

  const money=n=>Math.max(0,Math.floor(Number(n)||0)).toLocaleString('ru-RU');
  const levelOf=id=>{try{return Number(state?.businesses?.[id]?.level||0)}catch{return 0}};
  const cashOf=()=>{try{return Number(state?.cash||0)}catch{return 0}};
  const cashDom=()=>Number(String(document.getElementById('cash')?.textContent||'').replace(/[^\d]/g,''))||0;
  let lastShownAt=0,lastSignature='';

  function businessUi(id,btn){
    const esc=window.CSS?.escape?CSS.escape(String(id)):String(id).replace(/["\\]/g,'\\$&');
    btn=btn||document.querySelector(`[data-business="${esc}"]`);
    const card=btn?.closest('.business-card,.q37-business,article,section,div');
    const name=card?.querySelector('.business-title,strong,h3')?.textContent?.trim()||'Бизнес';
    const text=String(card?.innerText||card?.textContent||'');
    const m=text.match(/(?:Улучшение|Улучшить|Купить)\s*([\d\s\u00a0]+)\s*₽/i);
    const price=m?Number(m[1].replace(/[^\d]/g,''))||0:0;
    return {btn,card,name,price};
  }

  function cleanName(name){
    return String(name||'Бизнес').replace(/\s*LVL\s*\d+(?:\/\d+)?/ig,'').replace(/\s*·\s*ур\.\s*\d+.*$/i,'').trim();
  }

  function ensureStyle(){
    if(document.getElementById('bzSpend575Style'))return;
    const s=document.createElement('style');s.id='bzSpend575Style';s.textContent=`
      #bzSpend575Flash{position:fixed!important;inset:0!important;z-index:2147483645!important;background:rgba(2,7,16,.40)!important;backdrop-filter:blur(2px)!important;-webkit-backdrop-filter:blur(2px)!important;opacity:0;pointer-events:none!important;transition:opacity .14s ease!important}
      #bzSpend575Flash.show{opacity:1!important}
      #bzSpend575{position:fixed!important;z-index:2147483646!important;left:50%!important;top:50%!important;right:auto!important;bottom:auto!important;transform:translate(-50%,-50%) scale(.84)!important;width:min(390px,calc(100vw - 34px))!important;max-width:calc(100vw - 34px)!important;margin:0!important;padding:20px 18px 18px!important;border-radius:24px!important;border:1px solid rgba(255,125,132,.36)!important;background:radial-gradient(circle at 50% 0,rgba(255,85,100,.18),transparent 44%),linear-gradient(160deg,#321724,#0d192b)!important;box-shadow:0 30px 90px rgba(0,0,0,.70),0 0 36px rgba(255,94,111,.12)!important;opacity:0!important;visibility:hidden!important;pointer-events:none!important;text-align:center!important;transition:opacity .16s ease,transform .20s cubic-bezier(.2,.9,.2,1.2)!important}
      #bzSpend575.show{opacity:1!important;visibility:visible!important;transform:translate(-50%,-50%) scale(1)!important}
      #bzSpend575 .icon{display:grid!important;place-items:center!important;width:52px!important;height:52px!important;margin:0 auto 8px!important;border-radius:17px!important;background:rgba(255,94,111,.13)!important;font-size:26px!important}
      #bzSpend575 .caption{display:block!important;color:#a7b3c9!important;font-size:10px!important;font-weight:900!important;letter-spacing:1.25px!important;text-transform:uppercase!important}
      #bzSpend575 .sum{display:block!important;margin-top:4px!important;color:#ff9aa2!important;font-size:36px!important;font-weight:950!important;letter-spacing:-1px!important;line-height:1.05!important}
      #bzSpend575 .label{display:block!important;margin-top:7px!important;color:#f5f8ff!important;font-size:14px!important;font-weight:900!important;line-height:1.35!important}
      #bzSpend575 .cash{display:inline-block!important;margin-top:11px!important;padding:7px 11px!important;border-radius:999px!important;background:rgba(93,123,183,.15)!important;color:#b9c7e1!important;font-size:10px!important;font-weight:800!important}
      #u572body [data-business].bz575-paid{animation:bz575paid .42s ease!important}
      @keyframes bz575paid{0%{transform:scale(1)}45%{transform:scale(.95);filter:brightness(1.28)}100%{transform:scale(1)}}
      @media(max-width:390px){#bzSpend575{width:calc(100vw - 26px)!important;max-width:calc(100vw - 26px)!important;padding:18px 14px!important}#bzSpend575 .sum{font-size:31px!important}#bzSpend575 .label{font-size:13px!important}}
    `;document.head.appendChild(s);
  }

  let timer=0;
  function showSpend({spent,name,level,cash,button,isPurchase=false}){
    spent=Math.max(0,Math.round(Number(spent)||0));if(!spent)return;
    const sig=`${spent}:${name}:${level}:${cash}`;
    if(sig===lastSignature&&Date.now()-lastShownAt<1300)return;
    lastSignature=sig;lastShownAt=Date.now();
    ensureStyle();
    let flash=document.getElementById('bzSpend575Flash');
    if(!flash){flash=document.createElement('div');flash.id='bzSpend575Flash';document.documentElement.appendChild(flash)}
    let el=document.getElementById('bzSpend575');
    if(!el){el=document.createElement('div');el.id='bzSpend575';document.documentElement.appendChild(el)}
    el.innerHTML=`<span class="icon">💸</span><span class="caption">${isPurchase?'Потрачено на покупку':'Потрачено на улучшение'}</span><span class="sum">−${money(spent)} ₽</span><span class="label">${cleanName(name)}${level?` · теперь LVL ${level}`:''}</span><span class="cash">Осталось ${money(cash)} ₽</span>`;
    flash.classList.remove('show');el.classList.remove('show');void el.offsetWidth;
    flash.classList.add('show');el.classList.add('show');
    if(button){button.classList.remove('bz575-paid');void button.offsetWidth;button.classList.add('bz575-paid')}
    clearTimeout(timer);timer=setTimeout(()=>{el.classList.remove('show');flash.classList.remove('show')},2400);
    try{window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred?.('success')}catch{}
  }

  function snapshot(id,btn){
    const ui=businessUi(id,btn);
    return {id,ui,beforeCash:cashOf()||cashDom(),beforeLevel:levelOf(id),at:Date.now()};
  }

  function detectSuccess(snap){
    const afterCash=cashOf()||cashDom(),afterLevel=levelOf(snap.id);
    const delta=Math.max(0,Math.round(snap.beforeCash-afterCash));
    const success=afterLevel>snap.beforeLevel||delta>0;
    if(!success)return false;
    const spent=delta>0?delta:snap.ui.price;
    if(spent>0)showSpend({spent,name:snap.ui.name,level:afterLevel,cash:afterCash,button:snap.ui.btn,isPurchase:snap.beforeLevel===0});
    return true;
  }

  // Capture the business button independently of app internals. This remains reliable even
  // when another module re-wraps buyOrUpgrade or re-renders the business list.
  document.addEventListener('click',e=>{
    const btn=e.target.closest?.('[data-business]');if(!btn)return;
    const id=btn.dataset.business;if(!id)return;
    const snap=snapshot(id,btn);
    let tries=0;const poll=setInterval(()=>{
      tries++;
      if(detectSuccess(snap)||tries>=10)clearInterval(poll);
    },180);
  },true);

  // Keep a direct wrapper too, so successful server actions can trigger immediately.
  function install(){
    let original=null;try{original=typeof buyOrUpgrade==='function'?buyOrUpgrade:null}catch{}
    if(!original||original.__bz575)return false;
    const wrapped=async function(id){
      const snap=snapshot(id);
      const result=await original.apply(this,arguments);
      detectSuccess(snap);
      return result;
    };
    wrapped.__bz575=1;
    try{buyOrUpgrade=wrapped}catch{}
    try{window.buyOrUpgrade=wrapped}catch{}
    return true;
  }

  ensureStyle();
  let tries=0;const t=setInterval(()=>{if(install()||++tries>60)clearInterval(t)},250);
})();
