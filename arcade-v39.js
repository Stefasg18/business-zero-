(() => {
  const VERSION='3.9';
  const modal=document.getElementById('miniGameModal');
  const oldBtn=document.getElementById('miniGameStartBtn');
  if(!modal||!oldBtn)return;

  const startBtn=oldBtn.cloneNode(true);
  oldBtn.replaceWith(startBtn);

  modal.innerHTML=`
    <div class="cash39-backdrop" data-cash39-close></div>
    <section class="cash39-card">
      <header class="cash39-head">
        <div><span>АРКАДА · 30 СЕКУНД</span><h3>Денежный поток</h3></div>
        <button class="cash39-close" data-cash39-close>×</button>
      </header>
      <div class="cash39-hud">
        <div><span>Счёт</span><strong id="cash39Score">0</strong></div>
        <div><span>Комбо</span><strong id="cash39Combo">x1</strong></div>
        <div><span>Время</span><strong id="cash39Time">30.0</strong></div>
      </div>
      <div id="cash39Arena" class="cash39-arena">
        <div id="cash39Intro" class="cash39-intro">
          <div class="cash39-logo">💸</div>
          <h4>Лови прибыль</h4>
          <p>Нажимай на деньги и выгодные сделки. Не трогай расходы 🧾. Серия точных нажатий увеличивает комбо.</p>
          <div class="cash39-legend"><span>🪙 +1</span><span>💼 +2</span><span>💎 +3</span><span class="bad">🧾 штраф</span></div>
          <button id="cash39Go">Начать</button>
        </div>
      </div>
      <div class="cash39-progress"><i id="cash39Bar"></i></div>
      <div id="cash39Status" class="cash39-status">Игра не требует энергии · награда: игровые ₽ + XP</div>
    </section>`;

  const arena=document.getElementById('cash39Arena');
  const scoreEl=document.getElementById('cash39Score');
  const comboEl=document.getElementById('cash39Combo');
  const timeEl=document.getElementById('cash39Time');
  const bar=document.getElementById('cash39Bar');
  const status=document.getElementById('cash39Status');

  let sessionId=null,endAt=0,running=false,finishing=false,score=0,combo=0,spawnTimer=null,raf=0;
  let best=Number(localStorage.getItem('bz_cashflow_best_v39')||0);

  const rand=(a,b)=>a+Math.random()*(b-a);
  const fmtLocal=n=>{try{return fmt(n)}catch{return Math.floor(Number(n)||0).toLocaleString('ru-RU')}};

  function updateHome(){
    const section=document.querySelector('.mini-game-section');
    if(section){
      const eyebrow=section.querySelector('.section-head .eyebrow');
      const title=section.querySelector('.section-head h2');
      const live=section.querySelector('.mini-live');
      const cardTitle=section.querySelector('.mini-game-copy h3');
      const cardP=section.querySelector('.mini-game-copy p');
      const icon=section.querySelector('.mini-game-icon');
      if(eyebrow)eyebrow.textContent='АРКАДА БЕЗ ЭНЕРГИИ';
      if(title)title.textContent='Денежный поток';
      if(live)live.textContent='🎮 30 секунд';
      if(cardTitle)cardTitle.textContent='Лови прибыль и собирай комбо';
      if(cardP)cardP.textContent='Быстрая аркада: деньги и сделки дают очки, расходы сбивают серию. За результат начисляются игровые ₽ и XP.';
      if(icon)icon.textContent='💸';
    }
    const a=document.getElementById('miniAttempts'),b=document.getElementById('miniBest'),c=document.getElementById('miniEarned'),hint=document.getElementById('miniGameVipHint');
    if(a)a.textContent='30 сек';
    if(b)b.textContent=best?`${fmtLocal(best)} очк.`:'—';
    if(c)c.textContent='₽ + XP';
    if(hint)hint.textContent='Без энергии · сервер проверяет результат и ограничивает накрутку';
    startBtn.disabled=!ONLINE_MODE;
    startBtn.textContent=ONLINE_MODE?'Играть сейчас':'Открой внутри Telegram';
  }

  const previousRender=typeof render==='function'?render:null;
  if(previousRender){
    const wrapped=function(){const r=previousRender.apply(this,arguments);setTimeout(updateHome,0);return r;};
    try{window.render=wrapped}catch{}
    try{render=wrapped}catch{}
  }

  function open(){modal.classList.remove('hidden');document.body.classList.add('modal-open');}
  function clearGame(){
    running=false;finishing=false;clearTimeout(spawnTimer);spawnTimer=null;cancelAnimationFrame(raf);raf=0;
    arena.querySelectorAll('.cash39-item,.cash39-float').forEach(x=>x.remove());
  }
  function close(){clearGame();modal.classList.add('hidden');document.body.classList.remove('modal-open');updateHome();}

  function showIntro(message='Лови прибыль'){
    clearGame();
    arena.innerHTML=`<div id="cash39Intro" class="cash39-intro"><div class="cash39-logo">💸</div><h4>${message}</h4><p>Нажимай на 🪙 💼 💎. Не трогай 🧾. Чем длиннее серия — тем больше очков за каждый полезный объект.</p><div class="cash39-legend"><span>🪙 +1</span><span>💼 +2</span><span>💎 +3</span><span class="bad">🧾 штраф</span></div><button id="cash39Go">Начать</button></div>`;
    document.getElementById('cash39Go').onclick=beginSession;
  }

  async function beginSession(){
    if(!ONLINE_MODE){showToast('Открой игру внутри Telegram');return;}
    status.textContent='Запускаем раунд…';
    const go=document.getElementById('cash39Go');if(go)go.disabled=true;
    try{
      const d=await api('/api/arcade/start',{method:'POST',body:'{}'});
      sessionId=d.sessionId;endAt=Date.now()+Number(d.durationMs||30000);score=0;combo=0;running=true;finishing=false;
      arena.innerHTML='';scoreEl.textContent='0';comboEl.textContent='x1';timeEl.textContent='30.0';bar.style.width='100%';
      status.textContent='🔥 Набирай комбо: каждые 5 точных нажатий усиливают очки';
      try{haptic('medium')}catch{}
      scheduleSpawn(180);tick();
    }catch(e){status.textContent=e.message;showIntro('Попробуй ещё раз');}
  }

  function scheduleSpawn(delay){clearTimeout(spawnTimer);if(!running)return;spawnTimer=setTimeout(()=>{spawn();const left=Math.max(0,endAt-Date.now());const progress=1-left/30000;const next=Math.max(280,520-progress*210);scheduleSpawn(next);},delay);}

  function spawn(){
    if(!running)return;
    const r=Math.random();let icon='🪙',points=1,bad=false,kind='coin';
    if(r<.54){icon='🪙';points=1;kind='coin';}
    else if(r<.78){icon='💼';points=2;kind='deal';}
    else if(r<.90){icon='💎';points=3;kind='gem';}
    else{icon='🧾';points=-4;bad=true;kind='bill';}
    const el=document.createElement('button');
    el.type='button';el.className=`cash39-item ${bad?'bad':kind}`;el.textContent=icon;el.dataset.points=String(points);el.dataset.bad=bad?'1':'0';
    el.style.left=`${rand(5,82)}%`;el.style.top=`${rand(6,77)}%`;el.style.setProperty('--rot',`${rand(-10,10)}deg`);
    arena.appendChild(el);
    const life=bad?rand(850,1250):rand(950,1450);
    const killer=setTimeout(()=>{
      if(!el.isConnected)return;
      if(!bad&&running){combo=Math.max(0,combo-2);updateHud();}
      el.classList.add('miss');setTimeout(()=>el.remove(),130);
    },life);
    el.addEventListener('pointerdown',ev=>{ev.preventDefault();ev.stopPropagation();if(!running||el.dataset.hit)return;el.dataset.hit='1';clearTimeout(killer);hit(el,points,bad);},{passive:false});
  }

  function hit(el,points,bad){
    if(bad){score=Math.max(0,score-4);combo=0;floatAt(el,'−4','bad');arena.classList.remove('shake');void arena.offsetWidth;arena.classList.add('shake');try{haptic('heavy')}catch{}}
    else{
      combo++;
      const mult=Math.min(4,1+Math.floor(combo/5));
      const gain=points*mult;score+=gain;floatAt(el,`+${gain}`,mult>=3?'hot':'good');
      try{haptic(mult>=3?'medium':'light')}catch{}
    }
    el.classList.add('hit');setTimeout(()=>el.remove(),120);updateHud();
  }

  function floatAt(el,text,cls){
    const f=document.createElement('span');f.className=`cash39-float ${cls}`;f.textContent=text;f.style.left=el.style.left;f.style.top=el.style.top;arena.appendChild(f);setTimeout(()=>f.remove(),650);
  }
  function updateHud(){scoreEl.textContent=fmtLocal(score);comboEl.textContent=`x${Math.min(4,1+Math.floor(combo/5))}`;}

  function tick(){
    if(!running)return;
    const left=Math.max(0,endAt-Date.now());
    timeEl.textContent=(left/1000).toFixed(1);bar.style.width=`${left/30000*100}%`;
    if(left<=0){finish();return;}
    raf=requestAnimationFrame(tick);
  }

  async function finish(){
    if(finishing)return;finishing=true;running=false;clearTimeout(spawnTimer);cancelAnimationFrame(raf);
    arena.querySelectorAll('.cash39-item').forEach(x=>x.disabled=true);
    timeEl.textContent='0.0';bar.style.width='0%';status.textContent='Считаем награду на сервере…';
    try{
      const d=await api('/api/arcade/finish',{method:'POST',body:JSON.stringify({sessionId,score})});
      if(d.state)applyServerState(d.state);
      const r=d.result||{};best=Math.max(best,Number(r.score||score));localStorage.setItem('bz_cashflow_best_v39',String(best));
      arena.innerHTML=`<div class="cash39-result"><div>🏆</div><h4>${fmtLocal(r.score||0)} очков</h4><p>За раунд начислено</p><section><strong>+${fmtLocal(r.rewardCash||0)} ₽</strong><strong>+${fmtLocal(r.rewardXp||0)} XP</strong></section>${Number(r.multiplier||1)<1?'<small>После большого числа игр награда немного снижается, но играть можно дальше.</small>':''}<button id="cash39Again">Играть ещё</button></div>`;
      status.textContent=`Лучший результат: ${fmtLocal(best)} очков`;
      document.getElementById('cash39Again').onclick=()=>showIntro('Ещё один раунд?');
      try{notify('success')}catch{}
      updateHome();
    }catch(e){arena.innerHTML=`<div class="cash39-result"><div>⚠️</div><h4>Награда не начислена</h4><p>${e.message}</p><button id="cash39Again">Попробовать снова</button></div>`;document.getElementById('cash39Again').onclick=()=>showIntro('Попробуй ещё раз');status.textContent='Раунд завершён';}
  }

  const style=document.createElement('style');
  style.id='cashflow39Style';
  style.textContent=`
    .mini-modal{z-index:11020!important}.cash39-backdrop{position:absolute;inset:0;background:rgba(2,7,15,.82);backdrop-filter:blur(13px)}
    .cash39-card{position:relative;z-index:1;width:min(520px,100%);height:min(690px,88dvh);display:flex;flex-direction:column;border-radius:28px 28px 22px 22px;overflow:hidden;background:linear-gradient(180deg,#12223a,#081525);border:1px solid rgba(145,167,224,.17);box-shadow:0 30px 90px rgba(0,0,0,.55)}
    .cash39-head{height:72px;flex:0 0 72px;padding:15px 16px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.07)}.cash39-head span{font-size:10px;letter-spacing:1.4px;color:#7f93b4;font-weight:900}.cash39-head h3{font-size:22px;margin-top:3px}.cash39-close{width:42px;height:42px;border-radius:14px;border:1px solid rgba(255,255,255,.09);background:#172941;color:#fff;font-size:25px}
    .cash39-hud{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:11px 13px}.cash39-hud>div{padding:8px 10px;border-radius:13px;background:#102039;border:1px solid rgba(255,255,255,.055)}.cash39-hud span{display:block;color:#7d90ad;font-size:10px}.cash39-hud strong{display:block;font-size:16px;margin-top:2px}
    .cash39-arena{position:relative;flex:1;min-height:320px;margin:0 13px;border-radius:22px;overflow:hidden;background:radial-gradient(circle at 50% 25%,rgba(78,112,190,.18),transparent 34%),linear-gradient(180deg,#0d1c31,#0a1729);border:1px solid rgba(115,145,211,.14);touch-action:manipulation;user-select:none}.cash39-arena.shake{animation:cash39Shake .18s ease}
    .cash39-intro,.cash39-result{position:absolute;inset:0;padding:24px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}.cash39-logo{font-size:54px}.cash39-intro h4,.cash39-result h4{font-size:24px;margin:8px 0}.cash39-intro p,.cash39-result p{max-width:360px;font-size:14px;line-height:1.5;color:#94a4bd}.cash39-legend{display:flex;flex-wrap:wrap;justify-content:center;gap:7px;margin:16px 0}.cash39-legend span{padding:7px 10px;border-radius:999px;background:rgba(82,125,209,.12);font-size:12px;font-weight:850}.cash39-legend .bad{background:rgba(247,90,112,.11);color:#ff9aad}.cash39-intro button,.cash39-result button{min-width:190px;border:0;border-radius:15px;padding:13px 18px;background:linear-gradient(135deg,#5d82ff,#8a67ff);color:#fff;font-size:14px;font-weight:950}.cash39-result section{display:flex;gap:8px;margin:14px 0}.cash39-result section strong{padding:10px 13px;border-radius:13px;background:rgba(73,210,149,.10);color:#7be2b0;font-size:15px}.cash39-result small{color:#7f90aa;font-size:11px;line-height:1.4;margin:-4px 0 13px}
    .cash39-item{position:absolute;width:58px;height:58px;display:grid;place-items:center;border:0;border-radius:19px;font-size:30px;background:linear-gradient(145deg,#19365d,#112640);box-shadow:0 10px 24px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.08);transform:scale(.35) rotate(var(--rot));animation:cash39Pop .18s forwards;touch-action:none}.cash39-item.gem{background:linear-gradient(145deg,#332d65,#18264a);box-shadow:0 0 24px rgba(139,103,255,.24)}.cash39-item.bad{background:linear-gradient(145deg,#4b2331,#241725);box-shadow:0 0 20px rgba(255,80,105,.13)}.cash39-item.hit{animation:cash39Hit .12s forwards}.cash39-item.miss{animation:cash39Miss .13s forwards}
    .cash39-float{position:absolute;z-index:4;font-size:17px;font-weight:950;pointer-events:none;animation:cash39Float .65s forwards}.cash39-float.good{color:#6ce5ad}.cash39-float.hot{color:#c49aff;text-shadow:0 0 12px rgba(160,111,255,.6)}.cash39-float.bad{color:#ff8296}
    .cash39-progress{height:7px;margin:12px 13px 0;background:#142743;border-radius:999px;overflow:hidden}.cash39-progress i{display:block;height:100%;width:100%;background:linear-gradient(90deg,#52d99e,#6f8cff,#9a6cff);border-radius:inherit}.cash39-status{padding:10px 15px calc(13px + env(safe-area-inset-bottom));text-align:center;color:#8193ae;font-size:11px;min-height:40px}
    @keyframes cash39Pop{to{transform:scale(1) rotate(var(--rot))}}@keyframes cash39Hit{to{transform:scale(1.5);opacity:0}}@keyframes cash39Miss{to{transform:scale(.55);opacity:0}}@keyframes cash39Float{0%{opacity:0;transform:translateY(8px)}20%{opacity:1}100%{opacity:0;transform:translateY(-34px)}}@keyframes cash39Shake{25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
    @media(max-width:390px){.cash39-card{height:87dvh}.cash39-arena{min-height:300px}.cash39-item{width:54px;height:54px;font-size:27px}.cash39-intro p,.cash39-result p{font-size:13px}.cash39-head h3{font-size:20px}}
  `;
  document.head.appendChild(style);

  startBtn.addEventListener('click',()=>{open();showIntro();});
  modal.querySelectorAll('[data-cash39-close]').forEach(x=>x.addEventListener('click',close));
  updateHome();
})();