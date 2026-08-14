(()=>{
  if(window.__BZ_BUSINESS_SPEND_V575__)return;
  window.__BZ_BUSINESS_SPEND_V575__=1;

  const money=n=>Math.max(0,Math.floor(Number(n)||0)).toLocaleString('ru-RU');
  const levelOf=id=>{try{return Number(state?.businesses?.[id]?.level||0)}catch{return 0}};
  const cashOf=()=>{try{return Number(state?.cash||0)}catch{return 0}};

  function businessUi(id){
    const esc=window.CSS?.escape?CSS.escape(String(id)):String(id).replace(/["\\]/g,'\\$&');
    const btn=document.querySelector(`[data-business="${esc}"]`);
    const card=btn?.closest('.business-card,.q37-business,article,section,div');
    const name=card?.querySelector('.business-title,strong,h3')?.textContent?.trim()||'Бизнес';
    const text=String(card?.innerText||card?.textContent||'');
    const m=text.match(/(?:Улучшение|Улучшить|Купить)\s*([\d\s\u00a0]+)\s*₽/i);
    const price=m?Number(m[1].replace(/[^\d]/g,''))||0:0;
    return {btn,card,name,price};
  }

  function ensureStyle(){
    if(document.getElementById('bzSpend575Style'))return;
    const s=document.createElement('style');s.id='bzSpend575Style';s.textContent=`
      .bz575-flash{position:fixed;inset:0;z-index:2147482998;background:rgba(2,7,16,.28);backdrop-filter:blur(1.5px);opacity:0;pointer-events:none;transition:opacity .16s ease}
      .bz575-flash.show{opacity:1}
      .bz575-spend{position:fixed;z-index:2147483000;left:50%;top:50%;transform:translate(-50%,-50%) scale(.82);width:min(390px,calc(100% - 34px));padding:20px 18px 18px;border-radius:24px;border:1px solid rgba(255,125,132,.32);background:radial-gradient(circle at 50% 0,rgba(255,85,100,.15),transparent 44%),linear-gradient(160deg,rgba(48,19,31,.99),rgba(13,25,43,.99));box-shadow:0 28px 80px rgba(0,0,0,.58),0 0 34px rgba(255,94,111,.09);opacity:0;pointer-events:none;text-align:center;transition:opacity .18s ease,transform .22s cubic-bezier(.2,.9,.2,1.2)}
      .bz575-spend.show{opacity:1;transform:translate(-50%,-50%) scale(1)}
      .bz575-spend .icon{display:grid;place-items:center;width:50px;height:50px;margin:0 auto 8px;border-radius:16px;background:rgba(255,94,111,.11);font-size:25px}
      .bz575-spend .caption{display:block;color:#9eabc1;font-size:9px;font-weight:900;letter-spacing:1.5px;text-transform:uppercase}
      .bz575-spend .sum{display:block;margin-top:3px;color:#ff969e;font-size:34px;font-weight:950;letter-spacing:-1px}
      .bz575-spend .label{display:block;margin-top:5px;color:#f4f7ff;font-size:14px;font-weight:900;line-height:1.35}
      .bz575-spend .cash{display:inline-block;margin-top:10px;padding:7px 10px;border-radius:999px;background:rgba(93,123,183,.12);color:#aebddb;font-size:10px;font-weight:800}
      #u572body [data-business].bz575-paid{animation:bz575paid .42s ease}
      @keyframes bz575paid{0%{transform:scale(1)}45%{transform:scale(.95);filter:brightness(1.25)}100%{transform:scale(1)}}
      @media(max-width:390px){.bz575-spend{width:calc(100% - 28px);padding:18px 14px}.bz575-spend .sum{font-size:30px}.bz575-spend .label{font-size:13px}}
    `;document.head.appendChild(s);
  }

  let timer=0;
  function showSpend({spent,name,level,cash,button}){
    ensureStyle();
    let flash=document.getElementById('bzSpend575Flash');
    if(!flash){flash=document.createElement('div');flash.id='bzSpend575Flash';flash.className='bz575-flash';document.body.appendChild(flash)}
    let el=document.getElementById('bzSpend575');
    if(!el){el=document.createElement('div');el.id='bzSpend575';el.className='bz575-spend';document.body.appendChild(el)}
    el.innerHTML=`<span class="icon">💸</span><span class="caption">Потрачено на улучшение</span><span class="sum">−${money(spent)} ₽</span><span class="label">${name}${level?` · теперь LVL ${level}`:''}</span><span class="cash">Осталось ${money(cash)} ₽</span>`;
    flash.classList.remove('show');el.classList.remove('show');void el.offsetWidth;
    flash.classList.add('show');el.classList.add('show');
    if(button){button.classList.remove('bz575-paid');void button.offsetWidth;button.classList.add('bz575-paid')}
    clearTimeout(timer);timer=setTimeout(()=>{el.classList.remove('show');flash.classList.remove('show')},2200);
    try{window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred?.('success')}catch{}
  }

  function install(){
    let original=null;
    try{original=typeof buyOrUpgrade==='function'?buyOrUpgrade:null}catch{}
    if(!original||original.__bz575)return false;

    const wrapped=async function(id){
      const ui=businessUi(id);
      const beforeCash=cashOf(),beforeLevel=levelOf(id);
      const result=await original.apply(this,arguments);
      const afterCash=cashOf(),afterLevel=levelOf(id);
      const success=afterLevel>beforeLevel || afterCash<beforeCash;
      if(success){
        const delta=Math.max(0,Math.round(beforeCash-afterCash));
        const spent=delta>0?delta:ui.price;
        if(spent>0){
          showSpend({spent,name:ui.name.replace(/\s*LVL.*$/i,'').replace(/\s*·\s*ур\.\s*\d+.*$/i,''),level:afterLevel,cash:afterCash,button:ui.btn});
        }
      }
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
