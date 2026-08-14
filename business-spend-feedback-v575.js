(()=>{
  if(window.__BZ_BUSINESS_SPEND_V575__)return;
  window.__BZ_BUSINESS_SPEND_V575__=1;

  const money=n=>Math.max(0,Math.floor(Number(n)||0)).toLocaleString('ru-RU');
  const levelOf=id=>Number(window.state?.businesses?.[id]?.level||0);
  const cashOf=()=>Number(window.state?.cash||0);

  function businessUi(id){
    const btn=document.querySelector(`[data-business="${CSS.escape(String(id))}"]`);
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
      .bz575-spend{position:fixed;z-index:12980;left:50%;top:calc(88px + env(safe-area-inset-top));transform:translate(-50%,-14px) scale(.97);width:min(440px,calc(100% - 28px));padding:12px 14px;border-radius:17px;border:1px solid rgba(255,117,117,.22);background:linear-gradient(145deg,rgba(62,24,34,.97),rgba(19,28,45,.98));box-shadow:0 18px 48px rgba(0,0,0,.38);opacity:0;pointer-events:none;transition:.2s ease}
      .bz575-spend.show{opacity:1;transform:translate(-50%,0) scale(1)}
      .bz575-spend .sum{display:block;color:#ff9a9f;font-size:22px;font-weight:950;letter-spacing:-.3px}
      .bz575-spend .label{display:block;margin-top:2px;color:#eef3ff;font-size:11px;font-weight:800;line-height:1.35}
      .bz575-spend .cash{display:block;margin-top:4px;color:#899bb8;font-size:9px}
      #u572body [data-business].bz575-paid{animation:bz575paid .42s ease}
      @keyframes bz575paid{0%{transform:scale(1)}45%{transform:scale(.96);filter:brightness(1.28)}100%{transform:scale(1)}}
    `;document.head.appendChild(s);
  }

  let timer=0;
  function showSpend({spent,name,level,cash,button}){
    ensureStyle();
    let el=document.getElementById('bzSpend575');
    if(!el){el=document.createElement('div');el.id='bzSpend575';el.className='bz575-spend';document.body.appendChild(el)}
    el.innerHTML=`<span class="sum">−${money(spent)} ₽</span><span class="label">${name}${level?` · теперь LVL ${level}`:''}</span><span class="cash">Осталось: ${money(cash)} ₽</span>`;
    el.classList.remove('show');void el.offsetWidth;el.classList.add('show');
    if(button){button.classList.remove('bz575-paid');void button.offsetWidth;button.classList.add('bz575-paid')}
    clearTimeout(timer);timer=setTimeout(()=>el.classList.remove('show'),2800);
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
        const spent=ui.price>0?ui.price:delta;
        if(spent>0){
          showSpend({spent,name:ui.name.replace(/\s*LVL.*$/i,'').replace(/\s*·\s*ур\.\s*\d+.*$/i,''),level:afterLevel,cash:afterCash,button:ui.btn});
          try{if(typeof showToast==='function')showToast(`Потрачено ${money(spent)} ₽`)}catch{}
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
  let tries=0;const t=setInterval(()=>{if(install()||++tries>40)clearInterval(t)},250);
})();
