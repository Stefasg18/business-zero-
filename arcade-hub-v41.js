(() => {
  const VERSION='4.1';
  const GAME_META={
    cashflow:{icon:'💸',title:'Денежный поток',short:'Лови прибыль',desc:'Собирай деньги и бонусы, избегай расходов.'},
    market:{icon:'📈',title:'Биржевой импульс',short:'Поймай момент',desc:'Фиксируй сделку, когда индикатор попадает в прибыльную зону.'},
    logistics:{icon:'📦',title:'Логистический спринт',short:'Сортируй заказы',desc:'Быстро отправляй заказы в правильное направление.'}
  };
  const stats={
    cashflow:{gameXp:0,gameLevel:1,highScore:0,runsToday:0},
    market:{gameXp:0,gameLevel:1,highScore:0,runsToday:0},
    logistics:{gameXp:0,gameLevel:1,highScore:0,runsToday:0}
  };

  let activeGame=null,sessionId=null,gameLevel=1,score=0,running=false,endAt=0,raf=0,timer=0,spawnTimer=0,orderTimer=0,combo=0;

  const money=n=>Math.max(0,Math.floor(Number(n)||0)).toLocaleString('ru-RU');
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  const rand=(a,b)=>a+Math.random()*(b-a);

  const section=document.querySelector('.mini-game-section');
  if(!section)return;

  function xpTarget(level){return level>=20?Math.max(1,stats[activeGame||'cashflow']?.gameXp||1):180*level*level;}
  function levelProgress(s){
    if(Number(s.gameLevel)>=20)return 100;
    const prev=180*Math.pow(Math.max(0,Number(s.gameLevel)-1),2);
    const next=180*Math.pow(Number(s.gameLevel),2);
    return clamp(Math.round((Number(s.gameXp)-prev)/Math.max(1,next-prev)*100),0,100);
  }

  function renderHub(){
    section.innerHTML=`
      <div class="mg41-heading">
        <div><div class="eyebrow">ИГРОВОЙ ЦЕНТР · БЕЗ ЭНЕРГИИ</div><h2>Мини-игры</h2></div>
        <span class="mg41-badge">3 режима</span>
      </div>
      <div class="mg41-grid">
        ${Object.entries(GAME_META).map(([id,g])=>{
          const s=stats[id];
          return `<button class="mg41-tile" data-mg41-game="${id}">
            <span class="mg41-icon">${g.icon}</span>
            <strong>${g.title}</strong>
            <small>LVL ${s.gameLevel} · рекорд ${money(s.highScore)}</small>
            <div class="mg41-mini-bar"><i style="width:${levelProgress(s)}%"></i></div>
            <em>Играть</em>
          </button>`;
        }).join('')}
      </div>
      <div class="mg41-note">У каждой игры свой LVL 1–20. Сложность растёт быстрее награды, поэтому мини-игры помогают прокачке, но не заменяют бизнесы и сделки.</div>`;
    section.querySelectorAll('[data-mg41-game]').forEach(b=>b.addEventListener('click',()=>openGame(b.dataset.mg41Game)));
  }

  let modal=document.getElementById('mg41Modal');
  if(!modal){
    modal=document.createElement('div');modal.id='mg41Modal';modal.className='mg41-modal hidden';
    modal.innerHTML=`<div class="mg41-backdrop" data-mg41-close></div><section class="mg41-sheet">
      <header class="mg41-head"><div><span id="mg41Eyebrow">МИНИ-ИГРА</span><h3 id="mg41Title">Игра</h3></div><button data-mg41-close>×</button></header>
      <div class="mg41-levelrow"><div><span>Уровень игры</span><strong id="mg41Level">LVL 1</strong></div><div class="mg41-levelbar"><i id="mg41LevelBar"></i></div><small id="mg41LevelXp">0 XP</small></div>
      <div class="mg41-hud"><div><span>Счёт</span><strong id="mg41Score">0</strong></div><div><span>Комбо</span><strong id="mg41Combo">×1</strong></div><div><span>Время</span><strong id="mg41Time">30.0</strong></div></div>
      <div id="mg41Arena" class="mg41-arena"></div>
      <div class="mg41-timebar"><i id="mg41TimeBar"></i></div>
      <div id="mg41Status" class="mg41-status">Без энергии · награда рассчитывается сервером</div>
    </section>`;
    document.body.appendChild(modal);
    modal.querySelectorAll('[data-mg41-close]').forEach(x=>x.addEventListener('click',closeGame));
  }

  const arena=document.getElementById('mg41Arena'),scoreEl=document.getElementById('mg41Score'),comboEl=document.getElementById('mg41Combo'),timeEl=document.getElementById('mg41Time'),timeBar=document.getElementById('mg41TimeBar'),statusEl=document.getElementById('mg41Status');

  function paintLevel(){
    const s=stats[activeGame]||{gameXp:0,gameLevel:1};
    document.getElementById('mg41Level').textContent=`LVL ${s.gameLevel}`;
    document.getElementById('mg41LevelBar').style.width=`${levelProgress(s)}%`;
    document.getElementById('mg41LevelXp').textContent=s.gameLevel>=20?`${money(s.gameXp)} XP · MAX`:`${money(s.gameXp)} / ${money(180*s.gameLevel*s.gameLevel)} XP`;
  }

  function clearTimers(){cancelAnimationFrame(raf);raf=0;clearTimeout(spawnTimer);clearTimeout(orderTimer);clearInterval(timer);spawnTimer=0;orderTimer=0;timer=0;}
  function stopGame(){running=false;clearTimers();}
  function closeGame(){stopGame();modal.classList.add('hidden');document.body.classList.remove('mg41-lock');renderHub();}

  function openGame(game){
    activeGame=game;gameLevel=Number(stats[game]?.gameLevel||1);score=0;combo=0;sessionId=null;
    const m=GAME_META[game];document.getElementById('mg41Eyebrow').textContent='МИНИ-ИГРА · 30 СЕКУНД';document.getElementById('mg41Title').textContent=m.title;
    scoreEl.textContent='0';comboEl.textContent='×1';timeEl.textContent='30.0';timeBar.style.width='100%';paintLevel();showIntro();
    modal.classList.remove('hidden');document.body.classList.add('mg41-lock');
  }

  function difficultyText(){
    if(activeGame==='cashflow')return `LVL ${gameLevel}: предметы появляются ${gameLevel>=12?'быстро':'умеренно'}, расходов становится больше.`;
    if(activeGame==='market')return `LVL ${gameLevel}: прибыльная зона становится уже, индикатор движется быстрее.`;
    return `LVL ${gameLevel}: на сортировку заказа даётся меньше времени${gameLevel>=8?' и появляется 4 направления':' и доступно 3 направления'}.`;
  }

  function showIntro(){
    stopGame();
    const m=GAME_META[activeGame];
    const legend=activeGame==='cashflow'?'🪙 +1 · 💼 +2 · 💎 +3 · 🧾 штраф':activeGame==='market'?'🎯 центр зоны = больше очков · промах сбивает комбо':'Выбери правильное направление до окончания таймера';
    arena.innerHTML=`<div class="mg41-intro"><div class="mg41-bigicon">${m.icon}</div><h4>${m.short}</h4><p>${m.desc}</p><div class="mg41-difficulty">${difficultyText()}</div><small>${legend}</small><button id="mg41Start">Начать раунд</button></div>`;
    statusEl.textContent='Без энергии · награда: игровые ₽ + небольшой XP';
    document.getElementById('mg41Start').onclick=beginSession;
  }

  async function beginSession(){
    if(!ONLINE_MODE){showToast('Открой игру внутри Telegram');return;}
    const b=document.getElementById('mg41Start');if(b)b.disabled=true;statusEl.textContent='Запускаем защищённый раунд…';
    try{
      const d=await api('/api/minigame/start',{method:'POST',body:JSON.stringify({gameType:activeGame})});
      sessionId=d.sessionId;gameLevel=Number(d.gameLevel||1);stats[activeGame]={...stats[activeGame],gameLevel,gameXp:Number(d.gameXp||0),highScore:Number(d.highScore||0),runsToday:Number(d.runsToday||0)};
      score=0;combo=0;running=true;endAt=Date.now()+Number(d.durationMs||30000);scoreEl.textContent='0';comboEl.textContent='×1';timeBar.style.width='100%';paintLevel();
      if(activeGame==='cashflow')startCashflow();else if(activeGame==='market')startMarket();else startLogistics();
      tickClock();try{haptic('medium')}catch{}
    }catch(e){statusEl.textContent=e.message;showIntro();}
  }

  function updateHud(){scoreEl.textContent=money(score);comboEl.textContent=`×${Math.min(4,1+Math.floor(combo/5))}`;}
  function addFloat(x,y,text,bad=false){const f=document.createElement('span');f.className=`mg41-float ${bad?'bad':''}`;f.textContent=text;f.style.left=x;f.style.top=y;arena.appendChild(f);setTimeout(()=>f.remove(),550);}

  function startCashflow(){
    arena.innerHTML='';statusEl.textContent='🔥 Собирай полезное и держи серию';
    const badChance=Math.min(.24,.09+gameLevel*.0075),baseDelay=Math.max(300,560-gameLevel*11),life=Math.max(650,1280-gameLevel*26);
    const spawn=()=>{
      if(!running)return;
      const r=Math.random();let icon='🪙',pts=1,bad=false,cls='coin';
      if(r<badChance){icon='🧾';pts=-4;bad=true;cls='bad';}
      else if(r<badChance+.12){icon='💎';pts=3;cls='gem';}
      else if(r<badChance+.36){icon='💼';pts=2;cls='deal';}
      const el=document.createElement('button');el.className=`mg41-pop ${cls}`;el.textContent=icon;el.style.left=`${rand(5,82)}%`;el.style.top=`${rand(5,78)}%`;arena.appendChild(el);
      const kill=setTimeout(()=>{if(el.isConnected){if(!bad)combo=Math.max(0,combo-1);el.remove();updateHud();}},life*rand(.85,1.15));
      el.onpointerdown=ev=>{ev.preventDefault();if(!running||!el.isConnected)return;clearTimeout(kill);if(bad){score=Math.max(0,score-4);combo=0;addFloat(el.style.left,el.style.top,'−4',true);try{haptic('heavy')}catch{}}else{combo++;const mult=Math.min(4,1+Math.floor(combo/5)),gain=pts*mult;score+=gain;addFloat(el.style.left,el.style.top,`+${gain}`);try{haptic('light')}catch{}}el.remove();updateHud();};
      spawnTimer=setTimeout(spawn,baseDelay*rand(.72,1.16));
    };spawn();
  }

  function startMarket(){
    arena.innerHTML=`<div class="mg41-market"><div class="mg41-chart"><div class="mg41-gridlines"></div><div id="mg41Zone" class="mg41-zone"></div><div id="mg41Needle" class="mg41-needle"></div><div class="mg41-chartline">⌁⌁⌁⌁⌁</div></div><div class="mg41-market-copy"><strong>Зафиксируй прибыль в зелёной зоне</strong><span id="mg41MarketHint">Чем ближе к центру — тем больше очков</span></div><button id="mg41Trade" class="mg41-trade">ЗАФИКСИРОВАТЬ</button></div>`;
    statusEl.textContent='📈 Точность важнее скорости';
    const zone=document.getElementById('mg41Zone'),needle=document.getElementById('mg41Needle'),btn=document.getElementById('mg41Trade'),hint=document.getElementById('mg41MarketHint');
    let zoneCenter=50,zoneWidth=Math.max(12,29-gameLevel*.85),pos=0,dir=1,last=performance.now();
    const newZone=()=>{zoneCenter=rand(zoneWidth/2+4,96-zoneWidth/2);zone.style.left=`${zoneCenter-zoneWidth/2}%`;zone.style.width=`${zoneWidth}%`;};newZone();
    const animate=t=>{if(!running)return;const dt=Math.min(40,t-last);last=t;const speed=.055+gameLevel*.0032;pos+=dir*dt*speed;if(pos>=100){pos=100;dir=-1}else if(pos<=0){pos=0;dir=1}needle.style.left=`${pos}%`;raf=requestAnimationFrame(animate);};raf=requestAnimationFrame(animate);
    btn.onpointerdown=ev=>{ev.preventDefault();if(!running)return;const dist=Math.abs(pos-zoneCenter),half=zoneWidth/2;if(dist<=half){combo++;const accuracy=1-dist/half,gain=accuracy>.7?3:accuracy>.35?2:1;score+=gain;hint.textContent=gain===3?'🔥 Идеальный момент! +3':`✅ Прибыль +${gain}`;try{haptic(gain===3?'medium':'light')}catch{}}else{score=Math.max(0,score-1);combo=0;hint.textContent='❌ Рано или поздно — −1';try{haptic('heavy')}catch{}}updateHud();newZone();};
  }

  function startLogistics(){
    arena.innerHTML=`<div class="mg41-logi"><div id="mg41Order" class="mg41-order"></div><div id="mg41OrderTimer" class="mg41-order-timer"><i></i></div><div id="mg41Bins" class="mg41-bins"></div></div>`;
    statusEl.textContent='📦 Быстро сортируй заказы — серия увеличивает очки';
    const orderEl=document.getElementById('mg41Order'),bins=document.getElementById('mg41Bins'),mini=document.querySelector('#mg41OrderTimer i');
    const all=[{id:'food',icon:'🍔',name:'Еда'},{id:'tech',icon:'📱',name:'Техника'},{id:'fashion',icon:'👟',name:'Одежда'},{id:'office',icon:'📚',name:'Офис'}];
    const choices=all.slice(0,gameLevel>=8?4:3);let correct='',deadline=0,localRaf=0;
    const showOrder=()=>{
      if(!running)return;clearTimeout(orderTimer);cancelAnimationFrame(localRaf);const item=choices[Math.floor(Math.random()*choices.length)];correct=item.id;orderEl.innerHTML=`<span>${item.icon}</span><strong>Куда отправить заказ?</strong><small>Серия: ${combo}</small>`;
      bins.innerHTML=choices.map(c=>`<button data-bin="${c.id}"><span>${c.icon}</span>${c.name}</button>`).join('');
      const limit=Math.max(900,2350-gameLevel*70);deadline=Date.now()+limit;
      bins.querySelectorAll('[data-bin]').forEach(b=>b.onpointerdown=ev=>{ev.preventDefault();if(!running)return;if(b.dataset.bin===correct){combo++;const gain=Math.min(4,2+Math.floor(combo/6));score+=gain;orderEl.classList.add('good');try{haptic('light')}catch{}}else{score=Math.max(0,score-2);combo=0;orderEl.classList.add('bad');try{haptic('heavy')}catch{}}updateHud();setTimeout(showOrder,120);});
      const countdown=()=>{if(!running)return;const left=Math.max(0,deadline-Date.now());mini.style.width=`${left/limit*100}%`;if(left<=0){combo=0;score=Math.max(0,score-1);updateHud();showOrder();return;}localRaf=requestAnimationFrame(countdown);};localRaf=requestAnimationFrame(countdown);
      orderTimer=setTimeout(()=>{},limit+50);
    };showOrder();
  }

  function tickClock(){
    const tick=()=>{if(!running)return;const left=Math.max(0,endAt-Date.now());timeEl.textContent=(left/1000).toFixed(1);timeBar.style.width=`${left/30000*100}%`;if(left<=0){finishGame();return;}timer=setTimeout(tick,80);};tick();
  }

  async function finishGame(){
    if(!running)return;running=false;clearTimers();timeEl.textContent='0.0';timeBar.style.width='0%';statusEl.textContent='Сервер проверяет результат…';
    try{
      const d=await api('/api/minigame/finish',{method:'POST',body:JSON.stringify({sessionId,score})});if(d.state)applyServerState(d.state);const r=d.result||{};
      stats[activeGame]={gameXp:Number(r.gameXp||0),gameLevel:Number(r.gameLevel||1),highScore:Number(r.highScore||0),runsToday:Number(r.runsToday||0)};gameLevel=stats[activeGame].gameLevel;paintLevel();
      const reduced=Number(r.dailyMultiplier||1)<1;
      arena.innerHTML=`<div class="mg41-result"><div>${GAME_META[activeGame].icon}</div><h4>${money(r.score||0)} очков</h4><p>Раунд завершён</p><section><strong>+${money(r.rewardCash||0)} ₽</strong><strong>+${money(r.rewardXp||0)} XP</strong></section><div class="mg41-game-xp">+${money(r.gameXpGain||0)} XP игры · LVL ${r.gameLevel||1}</div>${reduced?'<small>Сегодня уже сыграно много раундов — денежная награда снижена. Уровень игры всё равно продолжает расти.</small>':''}<button id="mg41Again">Играть ещё</button></div>`;
      statusEl.textContent=`Рекорд: ${money(stats[activeGame].highScore)} · игр сегодня: ${money(stats[activeGame].runsToday)}`;document.getElementById('mg41Again').onclick=showIntro;try{notify('success')}catch{};renderHub();
    }catch(e){arena.innerHTML=`<div class="mg41-result"><div>⚠️</div><h4>Раунд завершён</h4><p>${e.message}</p><button id="mg41Again">Попробовать снова</button></div>`;document.getElementById('mg41Again').onclick=showIntro;statusEl.textContent='Награда не начислена';}
  }

  async function loadStats(){
    if(!ONLINE_MODE){renderHub();return;}
    try{const d=await api('/api/minigame/stats');for(const g of Object.keys(stats))stats[g]={...stats[g],...(d.games?.[g]||{})};renderHub();}catch(e){console.error('minigame stats',e);renderHub();}
  }

  const style=document.createElement('style');style.id='arcadeHub41Styles';style.textContent=`
    .mg41-heading{display:flex;align-items:end;justify-content:space-between;margin-bottom:12px}.mg41-heading h2{font-size:26px}.mg41-badge{padding:7px 9px;border-radius:999px;background:rgba(105,126,255,.11);border:1px solid rgba(118,137,255,.18);font-size:11px;font-weight:900;color:#a9b9ff}
    .mg41-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.mg41-tile{min-width:0;min-height:158px;padding:13px 9px;border-radius:19px;border:1px solid rgba(132,154,216,.14);background:linear-gradient(155deg,#152640,#0f1d31);color:#fff;text-align:left;display:flex;flex-direction:column;cursor:pointer}.mg41-icon{font-size:30px}.mg41-tile strong{font-size:13px;line-height:1.15;margin-top:9px;min-height:31px}.mg41-tile small{font-size:9px;color:#8da0bf;line-height:1.35;margin-top:5px}.mg41-mini-bar{height:5px;border-radius:99px;background:#23334c;overflow:hidden;margin-top:auto}.mg41-mini-bar i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#5c83ff,#9a69ff)}.mg41-tile em{font-style:normal;text-align:center;margin-top:9px;padding:7px;border-radius:10px;background:rgba(91,132,255,.13);color:#c9d6ff;font-size:10px;font-weight:900}.mg41-note{margin-top:9px;font-size:10px;line-height:1.45;color:#7486a2}
    .mg41-modal{position:fixed;inset:0;z-index:12050;display:grid;align-items:end;justify-items:center;padding:8px 8px max(8px,env(safe-area-inset-bottom))}.mg41-modal.hidden{display:none}.mg41-backdrop{position:absolute;inset:0;background:rgba(2,7,15,.86);backdrop-filter:blur(13px)}.mg41-sheet{position:relative;z-index:1;width:min(520px,100%);height:min(720px,91dvh);display:flex;flex-direction:column;border-radius:28px 28px 22px 22px;overflow:hidden;background:linear-gradient(180deg,#12233b,#081525);border:1px solid rgba(145,167,224,.18);box-shadow:0 30px 90px rgba(0,0,0,.55)}.mg41-head{height:70px;padding:13px 16px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.07)}.mg41-head span{font-size:9px;letter-spacing:1.2px;color:#8194b4;font-weight:900}.mg41-head h3{font-size:21px;margin-top:3px}.mg41-head button{width:42px;height:42px;border-radius:14px;border:1px solid rgba(255,255,255,.09);background:#172941;color:#fff;font-size:25px}
    .mg41-levelrow{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:9px;padding:9px 13px}.mg41-levelrow span{display:block;font-size:8px;color:#7e91ae}.mg41-levelrow strong{font-size:12px}.mg41-levelbar{height:6px;border-radius:99px;background:#1c2c44;overflow:hidden}.mg41-levelbar i{display:block;height:100%;background:linear-gradient(90deg,#56d99a,#6d8bff);border-radius:inherit}.mg41-levelrow>small{font-size:8px;color:#8293ad}.mg41-hud{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;padding:0 13px 10px}.mg41-hud>div{padding:8px 10px;border-radius:13px;background:#102039;border:1px solid rgba(255,255,255,.055)}.mg41-hud span{font-size:9px;color:#7f91ad}.mg41-hud strong{display:block;font-size:16px;margin-top:2px}
    .mg41-arena{position:relative;flex:1;min-height:330px;margin:0 13px;border-radius:22px;overflow:hidden;background:radial-gradient(circle at 50% 18%,rgba(78,112,190,.18),transparent 36%),linear-gradient(180deg,#0d1c31,#091728);border:1px solid rgba(115,145,211,.14);touch-action:manipulation;user-select:none}.mg41-intro,.mg41-result{position:absolute;inset:0;padding:22px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}.mg41-bigicon,.mg41-result>div:first-child{font-size:48px}.mg41-intro h4,.mg41-result h4{font-size:23px;margin:7px 0}.mg41-intro p,.mg41-result p{font-size:13px;line-height:1.45;color:#94a4bd;max-width:360px}.mg41-difficulty{margin:12px 0;padding:8px 10px;border-radius:12px;background:rgba(109,132,255,.09);font-size:10px;color:#a8b8da}.mg41-intro>small,.mg41-result>small{font-size:10px;line-height:1.45;color:#71839f;margin:6px 0 13px}.mg41-intro button,.mg41-result button{min-width:190px;border:0;border-radius:15px;padding:13px 18px;background:linear-gradient(135deg,#5d82ff,#8a67ff);color:#fff;font-size:14px;font-weight:950}.mg41-result section{display:flex;gap:8px;margin:13px 0}.mg41-result section strong{padding:10px 12px;border-radius:12px;background:rgba(67,208,145,.10);color:#77dfaD;font-size:14px}.mg41-game-xp{padding:7px 10px;border-radius:10px;background:rgba(111,129,255,.10);font-size:10px;color:#b8c5ff;margin-bottom:8px}
    .mg41-timebar{height:6px;margin:10px 13px 0;border-radius:99px;background:#1a2a43;overflow:hidden}.mg41-timebar i{display:block;height:100%;width:100%;background:linear-gradient(90deg,#55d59a,#6f8cff,#a46cff)}.mg41-status{padding:9px 14px 12px;text-align:center;font-size:10px;color:#7d90ad}.mg41-lock{overflow:hidden}.mg41-pop{position:absolute;width:58px;height:58px;border:0;border-radius:50%;display:grid;place-items:center;font-size:30px;background:rgba(61,105,178,.18);box-shadow:0 10px 25px rgba(0,0,0,.23);animation:mg41Pop .13s ease}.mg41-pop.gem{background:rgba(135,90,232,.18)}.mg41-pop.bad{background:rgba(239,73,97,.13)}.mg41-float{position:absolute;z-index:3;font-weight:950;color:#66e6a8;font-size:14px;pointer-events:none;animation:mg41Float .55s ease forwards}.mg41-float.bad{color:#ff8196}
    .mg41-market{position:absolute;inset:0;padding:20px 15px;display:flex;flex-direction:column;justify-content:center}.mg41-chart{height:190px;position:relative;border-radius:18px;background:linear-gradient(180deg,rgba(44,73,120,.22),rgba(13,28,48,.6));overflow:hidden;border:1px solid rgba(106,139,207,.13)}.mg41-gridlines{position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent 0 37px,rgba(255,255,255,.035) 38px),repeating-linear-gradient(90deg,transparent 0 52px,rgba(255,255,255,.025) 53px)}.mg41-zone{position:absolute;top:0;bottom:0;background:linear-gradient(90deg,rgba(54,211,140,.06),rgba(54,211,140,.24),rgba(54,211,140,.06));border-left:1px solid rgba(83,231,166,.45);border-right:1px solid rgba(83,231,166,.45)}.mg41-needle{position:absolute;top:18px;bottom:18px;width:3px;background:#fff;border-radius:99px;box-shadow:0 0 16px rgba(255,255,255,.8);transform:translateX(-50%)}.mg41-chartline{position:absolute;left:6%;right:6%;top:47%;font-size:44px;letter-spacing:3px;color:#6584d4;opacity:.42;white-space:nowrap;overflow:hidden}.mg41-market-copy{text-align:center;padding:13px 0}.mg41-market-copy strong{display:block;font-size:14px}.mg41-market-copy span{display:block;font-size:10px;color:#8395b1;margin-top:4px}.mg41-trade{width:100%;border:0;border-radius:15px;padding:14px;background:linear-gradient(135deg,#35bc82,#4e7ee7);color:#fff;font-weight:950;font-size:14px}
    .mg41-logi{position:absolute;inset:0;padding:16px;display:flex;flex-direction:column;justify-content:center}.mg41-order{text-align:center;padding:16px;border-radius:18px;background:#11233b;border:1px solid rgba(111,143,210,.12)}.mg41-order>span{font-size:45px}.mg41-order strong,.mg41-order small{display:block}.mg41-order strong{font-size:15px;margin-top:5px}.mg41-order small{font-size:9px;color:#8294af;margin-top:3px}.mg41-order.good{box-shadow:inset 0 0 0 1px rgba(69,220,151,.38)}.mg41-order.bad{box-shadow:inset 0 0 0 1px rgba(255,91,116,.4)}.mg41-order-timer{height:5px;background:#1b2b43;border-radius:99px;margin:9px 0 12px;overflow:hidden}.mg41-order-timer i{display:block;height:100%;background:#6e8cff}.mg41-bins{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}.mg41-bins button{min-height:68px;border-radius:15px;border:1px solid rgba(118,148,210,.12);background:#132641;color:#fff;font-size:12px;font-weight:900}.mg41-bins button span{display:block;font-size:25px;margin-bottom:3px}
    @keyframes mg41Pop{from{transform:scale(.65);opacity:.2}to{transform:scale(1);opacity:1}}@keyframes mg41Float{to{transform:translateY(-28px);opacity:0}}
    @media(max-width:390px){.mg41-grid{gap:6px}.mg41-tile{padding:11px 7px;min-height:150px}.mg41-tile strong{font-size:11px}.mg41-tile small{font-size:8px}.mg41-icon{font-size:27px}.mg41-sheet{height:min(700px,92dvh)}.mg41-arena{margin:0 10px}.mg41-heading h2{font-size:24px}}
  `;document.head.appendChild(style);

  document.title=`Бизнес с нуля ${VERSION}`;const v=document.querySelector('.topbar .eyebrow');if(v)v.textContent=`BUSINESS GAME · ${VERSION}`;
  renderHub();loadStats();
})();
