(()=>{
  if(window.__BZ_LOCAL_PARTY_V566__)return;
  window.__BZ_LOCAL_PARTY_V566__=true;

  const tg=window.Telegram?.WebApp;
  const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const money=n=>Math.max(0,Math.floor(Number(n)||0)).toLocaleString('ru-RU');
  const toast=t=>{try{showToast(t)}catch{console.log(t)}};
  let stats=null,game=null,ticker=null;

  const style=document.createElement('style');
  style.id='localParty566Style';
  style.textContent=`
    .lp566-card{margin-top:16px;padding:16px;border-radius:24px;background:linear-gradient(145deg,rgba(40,62,112,.96),rgba(24,34,65,.96));border:1px solid rgba(118,144,220,.24);box-shadow:0 16px 44px rgba(0,0,0,.28)}
    .lp566-top{display:flex;gap:13px;align-items:center}.lp566-icon{width:54px;height:54px;border-radius:18px;display:grid;place-items:center;font-size:27px;background:rgba(120,92,255,.18);border:1px solid rgba(134,113,255,.34)}
    .lp566-copy{min-width:0;flex:1}.lp566-copy span{font-size:10px;letter-spacing:1.6px;color:#90a5cf;font-weight:800}.lp566-copy h3{margin:4px 0 3px;font-size:20px}.lp566-copy p{margin:0;color:#9ca9c1;font-size:12px;line-height:1.4}.lp566-open{border:0;border-radius:15px;padding:11px 14px;font-weight:900;color:white;background:linear-gradient(135deg,#5f7cff,#835cff)}
    .lp566-mini{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.lp566-mini span{font-size:10px;padding:7px 9px;border-radius:999px;background:rgba(8,16,35,.45);color:#b7c5dc;border:1px solid rgba(132,153,202,.16)}
    .lp566-overlay{position:fixed;inset:0;z-index:12500;display:flex;align-items:flex-end;background:rgba(2,7,18,.7);backdrop-filter:blur(10px)}.lp566-overlay.hidden{display:none}
    .lp566-sheet{width:100%;height:min(88dvh,820px);background:#0a1427;border-radius:28px 28px 0 0;border:1px solid rgba(130,154,210,.2);display:flex;flex-direction:column;overflow:hidden}.lp566-head{height:70px;flex:0 0 70px;display:flex;align-items:center;justify-content:space-between;padding:0 18px;border-bottom:1px solid rgba(130,154,210,.12)}.lp566-head span{display:block;font-size:9px;letter-spacing:1.8px;color:#7990ba;font-weight:900}.lp566-head h2{margin:3px 0 0;font-size:23px}.lp566-close{width:42px;height:42px;border-radius:14px;border:1px solid rgba(139,157,201,.2);background:#111d34;color:white;font-size:26px}.lp566-body{flex:1;overflow:auto;padding:16px 14px calc(24px + env(safe-area-inset-bottom))}
    .lp566-hero{padding:18px;border-radius:22px;background:linear-gradient(145deg,rgba(40,63,116,.95),rgba(34,35,80,.95));border:1px solid rgba(116,140,220,.22)}.lp566-hero b{font-size:22px}.lp566-hero p{color:#a6b0c2;font-size:13px;line-height:1.5}.lp566-modes{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px}.lp566-mode{padding:15px;border-radius:20px;background:#101d33;border:1px solid rgba(130,153,204,.16)}.lp566-mode strong{display:block;font-size:16px}.lp566-mode small{display:block;color:#8fa0bc;font-size:11px;line-height:1.4;margin:6px 0 11px}.lp566-mode button,.lp566-primary{width:100%;border:0;border-radius:14px;min-height:46px;font-weight:900;color:#fff;background:linear-gradient(135deg,#5f7cff,#805cff)}.lp566-rules{margin-top:12px;padding:14px;border-radius:18px;background:rgba(14,25,45,.85);color:#93a2bd;font-size:11px;line-height:1.55}.lp566-rules b{color:#fff}
    .lp566-count{display:grid;place-items:center;text-align:center;min-height:55vh}.lp566-count b{font-size:76px}.lp566-count span{font-size:12px;letter-spacing:1.5px;color:#8fa2c3}.lp566-count p{color:#9aa9c2;max-width:300px}
    .lp566-gamehead{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}.lp566-gamehead span{font-size:10px;letter-spacing:1.4px;color:#8aa0c4;font-weight:900}.lp566-gamehead b{font-size:25px}.lp566-score{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap}.lp566-score span{padding:6px 9px;border-radius:11px;background:#111e35;font-size:11px}.lp566-pads{display:grid;gap:10px;height:58dvh;max-height:560px}.lp566-pads.p2{grid-template-rows:1fr 1fr}.lp566-pads.p4{grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr}.lp566-pad{touch-action:none;border:1px solid rgba(132,154,211,.22);border-radius:24px;background:linear-gradient(145deg,#14233d,#111b31);color:white;position:relative;overflow:hidden}.lp566-pad:after{content:'';position:absolute;inset:0;background:rgba(87,255,166,.0);transition:.08s}.lp566-pad.hot:after{background:rgba(70,235,151,.28)}.lp566-pad.bad:after{background:rgba(255,73,99,.24)}.lp566-pad .inner{position:relative;z-index:1;height:100%;display:grid;place-items:center;text-align:center}.lp566-pad em{font-style:normal;font-size:10px;letter-spacing:1.2px;color:#91a4c6}.lp566-pad b{font-size:33px}.lp566-pad strong{font-size:18px}.lp566-pad.pop{transform:scale(.985)}
    .lp566-finish{text-align:center;padding:28px 10px}.lp566-finish .cup{font-size:64px}.lp566-finish h2{font-size:30px;margin:8px 0}.lp566-finish p{color:#9ba9c0;line-height:1.5}.lp566-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:18px}.lp566-actions button{min-height:48px;border-radius:14px;border:1px solid rgba(135,154,200,.2);background:#111d34;color:white;font-weight:900}.lp566-actions button.primary{background:linear-gradient(135deg,#5f7cff,#805cff);border:0}
    @media(max-width:390px){.lp566-modes{grid-template-columns:1fr}.lp566-sheet{height:90dvh}.lp566-pads{height:60dvh}}
  `;
  document.head.appendChild(style);

  function inject(){
    if(document.getElementById('localParty566Card'))return;
    const tab=document.getElementById('tab-friends');if(!tab)return;
    const card=document.createElement('section');card.id='localParty566Card';card.className='section lp566-card';
    card.innerHTML=`<div class="lp566-top"><div class="lp566-icon">🎮</div><div class="lp566-copy"><span>ИГРАЙТЕ ВМЕСТЕ · ОДИН ТЕЛЕФОН</span><h3>Party Arena</h3><p>1 на 1 или 2 на 2. Три быстрых раунда, общий счёт и игровые ₽ за результат.</p></div><button class="lp566-open">Играть</button></div><div class="lp566-mini"><span>👥 1×1</span><span>⚔️ 2×2</span><span>💰 игровые ₽</span></div>`;
    const anchor=document.getElementById('v53Social')||tab.querySelector('.first-section');
    anchor?.insertAdjacentElement('afterend',card);
    card.querySelector('.lp566-open').onclick=open;
    createOverlay();
  }

  function createOverlay(){
    if(document.getElementById('localParty566Overlay'))return;
    const o=document.createElement('div');o.id='localParty566Overlay';o.className='lp566-overlay hidden';
    o.innerHTML=`<section class="lp566-sheet"><div class="lp566-head"><div><span>PARTY ARENA</span><h2>Играй вместе</h2></div><button class="lp566-close">×</button></div><main id="localParty566Body" class="lp566-body"></main></section>`;
    document.body.appendChild(o);o.querySelector('.lp566-close').onclick=close;
  }

  async function loadStats(){try{const d=await api('/api/v55/party/stats');stats=d.stats||null}catch{stats=null}}
  async function open(){createOverlay();document.getElementById('localParty566Overlay').classList.remove('hidden');document.body.style.overflow='hidden';await loadStats();renderHome()}
  function close(){stop();document.getElementById('localParty566Overlay')?.classList.add('hidden');document.body.style.removeProperty('overflow')}
  function stop(){if(ticker){clearInterval(ticker);ticker=null}}

  function renderHome(){
    const b=document.getElementById('localParty566Body');if(!b)return;
    const left=stats?.localRewardRunsLeft;
    b.innerHTML=`<div class="lp566-hero"><b>🔥 Соберите компанию вокруг одного телефона</b><p>Телефон лежит между игроками. У каждого своя зона. Побеждает тот, кто быстрее реагирует и меньше ошибается.</p><div class="lp566-mini"><span>Party LVL ${stats?.partyLevel||'—'}</span><span>Наград сегодня ${left==null?'—':left+'/3'}</span></div></div><div class="lp566-modes"><article class="lp566-mode"><strong>👥 1 на 1</strong><small>Два игрока. Экран делится пополам. Идеально для быстрого спора на реакцию.</small><button data-count="2">Начать дуэль</button></article><article class="lp566-mode"><strong>⚔️ 2 на 2</strong><small>Четыре зоны. Игроки 1–2 — команда A, 3–4 — команда B.</small><button data-count="4">Начать 2×2</button></article></div><div class="lp566-rules"><b>Как начисляются деньги:</b> это только игровые ₽ внутри Business Zero. Сервер проверяет результат и выдаёт награду владельцу телефона. Реальные деньги и вывод не используются.<br><br><b>3 раунда:</b> зелёный сигнал → не нажми красное → финальная вспышка с двойными очками.</div>`;
    b.querySelectorAll('[data-count]').forEach(x=>x.onclick=()=>prepare(Number(x.dataset.count)));
  }

  async function prepare(count){
    if(!ONLINE_MODE)return toast('Открой игру внутри Telegram');
    try{
      const d=await api('/api/v55/party/local/start',{method:'POST',body:JSON.stringify({playerCount:count})});
      game={count,sessionId:d.session?.sessionId,scores:Array(count).fill(0),started:0,round:1,done:false};
      countdown();
    }catch(e){toast(e.message)}
  }

  function countdown(){
    const b=document.getElementById('localParty566Body');let n=3;
    b.innerHTML=`<div class="lp566-count"><div><span>${game.count===4?'КОМАНДА A: 1–2 · КОМАНДА B: 3–4':'ИГРОК 1 СВЕРХУ · ИГРОК 2 СНИЗУ'}</span><b id="lp566Count">3</b><p>Положите телефон между собой и держите пальцы рядом со своей зоной.</p></div></div>`;
    const t=setInterval(()=>{n--;const el=document.getElementById('lp566Count');if(el)el.textContent=n>0?n:'GO!';if(n<=0){clearInterval(t);setTimeout(begin,350)}},700);
    ticker=t;
  }

  function begin(){
    stop();game.started=performance.now();game.round=1;
    const b=document.getElementById('localParty566Body');
    b.innerHTML=`<div class="lp566-gamehead"><div><span id="lp566Round">РАУНД 1 · РЕАКЦИЯ</span><b id="lp566Time">24</b></div><div id="lp566Score" class="lp566-score"></div></div><div class="lp566-pads p${game.count}">${Array.from({length:game.count},(_,i)=>`<button class="lp566-pad" data-i="${i}"><div class="inner"><div><em>${game.count===4?(i<2?'КОМАНДА A':'КОМАНДА B'):'ИГРОК'}</em><b>${i+1}</b><strong id="lp566S${i}">0</strong><small id="lp566Hint${i}">ГОТОВЬСЯ</small></div></div></button>`).join('')}</div>`;
    b.querySelectorAll('.lp566-pad').forEach(p=>p.addEventListener('pointerdown',e=>{e.preventDefault();tap(Number(p.dataset.i),p)}));
    ticker=setInterval(update,70);update();
  }

  function stateFor(i,elapsed,round){
    if(round===1){const ph=(elapsed*1000+i*287)%1250;return{hot:ph>430&&ph<760,bad:false}}
    if(round===2){const slot=Math.floor(elapsed*3.1+i*1.3)%4;return{hot:slot!==0,bad:slot===0}}
    const ph=((elapsed*1000+i*173)%920)/920;return{hot:Math.abs(ph-.5)<.09,bad:false};
  }
  function tap(i,pad){
    if(!game||game.done)return;
    const elapsed=(performance.now()-game.started)/1000,s=stateFor(i,elapsed,game.round);let pts;
    if(game.round===1)pts=s.hot?90:-12;else if(game.round===2)pts=s.bad?-45:75;else pts=s.hot?180:18;
    game.scores[i]=Math.max(0,game.scores[i]+pts);
    document.getElementById(`lp566S${i}`).textContent=game.scores[i];
    pad.classList.add('pop');setTimeout(()=>pad.classList.remove('pop'),90);
    try{tg?.HapticFeedback?.impactOccurred(pts>100?'medium':'light')}catch{}
    renderScore();
  }
  function renderScore(){
    const el=document.getElementById('lp566Score');if(!el)return;
    if(game.count===4){const a=game.scores[0]+game.scores[1],b=game.scores[2]+game.scores[3];el.innerHTML=`<span>A <b>${a}</b></span><span>B <b>${b}</b></span>`}
    else el.innerHTML=`<span>P1 <b>${game.scores[0]}</b></span><span>P2 <b>${game.scores[1]}</b></span>`;
  }
  function update(){
    if(!game||game.done)return;
    const elapsed=(performance.now()-game.started)/1000,remain=Math.max(0,24-elapsed),round=elapsed<8?1:elapsed<16?2:3;
    if(round!==game.round){game.round=round;try{tg?.HapticFeedback?.notificationOccurred('success')}catch{}}
    document.getElementById('lp566Time').textContent=Math.ceil(remain);
    document.getElementById('lp566Round').textContent=round===1?'РАУНД 1 · РЕАКЦИЯ':round===2?'РАУНД 2 · НЕ ЖМИ КРАСНОЕ':'РАУНД 3 · ФИНАЛ ×2';
    document.querySelectorAll('.lp566-pad').forEach((pad,i)=>{const s=stateFor(i,elapsed,round);pad.classList.toggle('hot',s.hot);pad.classList.toggle('bad',s.bad);const h=document.getElementById(`lp566Hint${i}`);if(h)h.textContent=s.bad?'НЕ ЖМИ':s.hot?'ЖМИ!':'ГОТОВЬСЯ'});
    renderScore();if(remain<=0)finish();
  }

  async function finish(){
    if(game.done)return;game.done=true;stop();
    const total=game.scores.reduce((a,b)=>a+b,0),b=document.getElementById('localParty566Body');
    let winner;if(game.count===4){const a=game.scores[0]+game.scores[1],c=game.scores[2]+game.scores[3];winner=a===c?'Ничья!':a>c?'Победила команда A':'Победила команда B'}else winner=game.scores[0]===game.scores[1]?'Ничья!':game.scores[0]>game.scores[1]?'Победил игрок 1':'Победил игрок 2';
    b.innerHTML=`<div class="lp566-finish"><div class="cup">🏆</div><span>${safe(winner)}</span><h2>${money(total)} очков</h2><p id="lp566Reward">Сервер проверяет результат и считает игровые ₽…</p></div>`;
    let rewardText='Награда не начислена';
    try{const d=await api('/api/v55/party/local/claim',{method:'POST',body:JSON.stringify({sessionId:game.sessionId,score:total})});const r=d.result||{};rewardText=r.rewarded?`+${money(r.rewardCash)} игровых ₽ владельцу телефона`:'Лимит денежных наград на сегодня закончился — реванши доступны без награды';stats=r.stats||stats;try{const s=await api('/api/state');if(s?.state&&typeof applyServerState==='function')applyServerState(s.state)}catch{}}catch(e){rewardText=`Не удалось начислить: ${safe(e.message)}`}
    const p=document.getElementById('lp566Reward');if(p)p.innerHTML=`<b>${rewardText}</b><br>Счёт матча сохранён локально только до реванша.`;
    const box=document.querySelector('.lp566-finish');const actions=document.createElement('div');actions.className='lp566-actions';actions.innerHTML=`<button id="lp566Home">Режимы</button><button id="lp566Again" class="primary">Реванш</button>`;box.appendChild(actions);document.getElementById('lp566Home').onclick=renderHome;document.getElementById('lp566Again').onclick=()=>prepare(game.count);
  }

  setTimeout(inject,0);
  window.addEventListener('pageshow',()=>setTimeout(inject,50));
})();