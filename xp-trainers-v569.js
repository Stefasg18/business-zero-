(()=>{
  if(window.__BZ_XP_TRAINERS_V569__)return;
  window.__BZ_XP_TRAINERS_V569__=true;

  const tg=window.Telegram?.WebApp;
  const TRAINERS={
    memory:{icon:'🧠',title:'Память',tag:'ПАМЯТЬ',desc:'Запоминай последовательность символов и повторяй её без ошибок.'},
    math:{icon:'➗',title:'Быстрый счёт',tag:'ЛОГИКА',desc:'Решай короткие примеры на скорость. Ошибка отнимает очки.'},
    route:{icon:'🧭',title:'Маршрут',tag:'СВАЙПЫ',desc:'Повторяй маршрут свайпами вверх, вниз, влево и вправо.'},
    focus:{icon:'🎨',title:'Фокус',tag:'ВНИМАНИЕ',desc:'Не читай слово — выбирай настоящий цвет текста.'},
    profit:{icon:'🧮',title:'Прибыль',tag:'БИЗНЕС',desc:'Посчитай чистую прибыль и введи ответ на цифровой клавиатуре.'},
    sequence:{icon:'🔢',title:'Порядок',tag:'СКОРОСТЬ',desc:'Нажимай числа по возрастанию. После каждого раунда сетка меняется.'}
  };
  const stats=Object.fromEntries(Object.keys(TRAINERS).map(k=>[k,{runsToday:0,totalRuns:0,highScore:0}]));
  let active=null,sessionId=null,score=0,running=false,endAt=0,clock=0,localTimers=[],modal=null;
  const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const n=x=>Math.max(0,Math.floor(Number(x)||0)).toLocaleString('ru-RU');
  const toast=t=>{try{showToast(t)}catch{console.log(t)}};
  const haptic=t=>{try{tg?.HapticFeedback?.impactOccurred(t||'light')}catch{}};
  const notify=t=>{try{tg?.HapticFeedback?.notificationOccurred(t||'success')}catch{}};

  const style=document.createElement('style');style.id='xpTrainer569Style';style.textContent=`
    .xp569-section{margin-top:16px}.xp569-head{display:flex;align-items:end;justify-content:space-between;gap:10px;margin-bottom:11px}.xp569-head h2{margin:3px 0 0;font-size:24px}.xp569-head p{margin:4px 0 0;color:#8293ad;font-size:11px}.xp569-badge{padding:7px 9px;border-radius:999px;background:rgba(104,229,176,.10);border:1px solid rgba(104,229,176,.18);color:#8ee5c1;font-size:10px;font-weight:900}
    .xp569-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.xp569-card{padding:14px;border-radius:19px;border:1px solid rgba(129,151,210,.14);background:linear-gradient(150deg,#14243c,#0e1b2e);color:#fff;text-align:left}.xp569-card .ico{font-size:30px}.xp569-card .tag{display:block;margin-top:8px;color:#79d8b2;font-size:8px;letter-spacing:1.2px;font-weight:950}.xp569-card strong{display:block;margin-top:4px;font-size:15px}.xp569-card p{min-height:45px;margin:5px 0 10px;color:#8798b2;font-size:10px;line-height:1.4}.xp569-card small{display:block;color:#71839f;font-size:9px}.xp569-card button{width:100%;margin-top:9px;border:0;border-radius:12px;padding:10px;color:#fff;background:linear-gradient(135deg,#4f7df1,#765bdd);font-weight:900}.xp569-note{margin-top:9px;color:#70819c;font-size:9px;line-height:1.45}
    .xp569-modal{position:fixed;inset:0;z-index:12650;display:grid;align-items:end;background:rgba(2,7,16,.78);backdrop-filter:blur(12px)}.xp569-modal.hidden{display:none}.xp569-sheet{width:100%;height:min(89dvh,760px);border-radius:27px 27px 0 0;background:linear-gradient(180deg,#11233b,#081522);border:1px solid rgba(128,151,211,.18);display:flex;flex-direction:column;overflow:hidden}.xp569-top{height:66px;flex:0 0 66px;padding:0 16px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.06)}.xp569-top span{font-size:8px;color:#7d91b1;letter-spacing:1.3px;font-weight:900}.xp569-top h3{margin:3px 0 0;font-size:20px}.xp569-close{width:42px;height:42px;border:1px solid rgba(255,255,255,.09);border-radius:14px;background:#172841;color:#fff;font-size:24px}.xp569-hud{display:grid;grid-template-columns:1fr 1fr 1fr;gap:7px;padding:10px 12px}.xp569-hud div{padding:8px 9px;border-radius:12px;background:#0f2036}.xp569-hud span{font-size:8px;color:#7f91ad}.xp569-hud b{display:block;margin-top:2px;font-size:15px}.xp569-arena{position:relative;flex:1;min-height:350px;margin:0 12px 12px;border-radius:21px;overflow:hidden;background:radial-gradient(circle at 50% 0,rgba(91,122,210,.14),transparent 40%),#0b192b;border:1px solid rgba(120,145,207,.12);touch-action:none}.xp569-intro,.xp569-result{position:absolute;inset:0;padding:24px;display:grid;place-items:center;text-align:center}.xp569-intro>div,.xp569-result>div{max-width:390px}.xp569-big{font-size:55px}.xp569-intro h4,.xp569-result h4{font-size:25px;margin:8px 0}.xp569-intro p,.xp569-result p{color:#91a1ba;font-size:12px;line-height:1.5}.xp569-primary{min-width:190px;border:0;border-radius:14px;padding:13px 17px;background:linear-gradient(135deg,#4f7df1,#765bdd);color:#fff;font-weight:950}.xp569-status{text-align:center;padding:0 14px 13px;color:#768aa7;font-size:9px}
    .xp569-memory{height:100%;display:grid;place-items:center;text-align:center}.xp569-memory .show{font-size:76px}.xp569-memory .keys{display:grid;grid-template-columns:1fr 1fr;gap:8px;width:min(290px,80vw);margin-top:16px}.xp569-memory .keys button{font-size:30px;padding:13px;border:1px solid rgba(255,255,255,.08);border-radius:15px;background:#182a45;color:white}
    .xp569-math{height:100%;display:grid;place-items:center;text-align:center;padding:18px}.xp569-question{font-size:38px;font-weight:950;margin-bottom:20px}.xp569-options{display:grid;grid-template-columns:1fr 1fr;gap:9px;width:min(330px,88vw)}.xp569-options button{padding:15px;border:1px solid rgba(255,255,255,.08);border-radius:15px;background:#172a45;color:#fff;font-size:18px;font-weight:900}
    .xp569-route{height:100%;display:grid;place-items:center;text-align:center;padding:20px}.xp569-path{font-size:40px;letter-spacing:10px;line-height:1.6}.xp569-route .hint{margin-top:16px;color:#8fa2bf;font-size:12px}.xp569-route .swipe{margin-top:18px;font-size:42px;opacity:.65}
    .xp569-focus{height:100%;display:grid;place-items:center;text-align:center;padding:18px}.xp569-focus-word{font-size:39px;font-weight:1000;margin-bottom:22px}.xp569-color-options{display:grid;grid-template-columns:1fr 1fr;gap:8px;width:min(340px,90vw)}.xp569-color-options button{padding:14px;border:1px solid rgba(255,255,255,.08);border-radius:14px;background:#172a45;color:#fff;font-weight:900}
    .xp569-profit{height:100%;display:grid;place-items:center;padding:18px}.xp569-profit-box{width:min(350px,92vw)}.xp569-profit-box h4{text-align:center;font-size:20px}.xp569-ledger{display:grid;gap:8px;margin:14px 0}.xp569-ledger div{display:flex;justify-content:space-between;padding:10px 12px;border-radius:12px;background:#13243c;color:#9eb0ca}.xp569-ledger b{color:#fff}.xp569-input{min-height:48px;border-radius:13px;background:#071321;border:1px solid rgba(255,255,255,.08);display:grid;place-items:center;font-size:22px;font-weight:950}.xp569-pad{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:9px}.xp569-pad button{padding:11px;border:0;border-radius:11px;background:#1b2e4b;color:white;font-size:17px;font-weight:900}.xp569-pad .ok{background:#3c79d8}
    .xp569-seq{height:100%;display:grid;place-items:center;padding:18px}.xp569-seq-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;width:min(340px,88vw)}.xp569-seq-grid button{aspect-ratio:1;border:1px solid rgba(255,255,255,.08);border-radius:17px;background:#172b47;color:#fff;font-size:25px;font-weight:950}.xp569-seq-grid button.done{opacity:.2;transform:scale(.9)}
    @media(max-width:390px){.xp569-grid{grid-template-columns:1fr}.xp569-sheet{height:92dvh}}
  `;document.head.appendChild(style);

  function inject(){
    if(document.getElementById('xpTrainers569'))return;
    const home=document.getElementById('tab-home');if(!home)return;
    const sec=document.createElement('section');sec.id='xpTrainers569';sec.className='section xp569-section';
    sec.innerHTML=`<div class="xp569-head"><div><div class="eyebrow">XP ТРЕНАЖЁРЫ · БЕЗ ЭНЕРГИИ</div><h2>Прокачка опыта</h2><p>Короткие игры дают только XP. Результат проверяет сервер.</p></div><span class="xp569-badge">6 игр</span></div><div class="xp569-grid">${Object.entries(TRAINERS).map(([id,g])=>`<article class="xp569-card"><div class="ico">${g.icon}</div><span class="tag">${g.tag}</span><strong>${g.title}</strong><p>${g.desc}</p><small id="xp569Stat-${id}">Рекорд — · сегодня —</small><button data-xp569="${id}">Тренироваться</button></article>`).join('')}</div><div class="xp569-note">XP начисляется сервером после полного раунда. При большом количестве тренировок за день награда постепенно снижается, чтобы сохранить баланс.</div>`;
    const anchor=document.querySelector('.mini-game-section');
    if(anchor)anchor.insertAdjacentElement('afterend',sec);else home.appendChild(sec);
    sec.querySelectorAll('[data-xp569]').forEach(b=>b.onclick=()=>open(b.dataset.xp569));
    loadStats();
  }

  function ensureModal(){
    if(modal)return;
    modal=document.createElement('div');modal.id='xp569Modal';modal.className='xp569-modal hidden';
    modal.innerHTML=`<section class="xp569-sheet"><header class="xp569-top"><div><span>XP TRAINER</span><h3 id="xp569Title">Тренажёр</h3></div><button class="xp569-close">×</button></header><div class="xp569-hud"><div><span>СЧЁТ</span><b id="xp569Score">0</b></div><div><span>РЕКОРД</span><b id="xp569High">0</b></div><div><span>ВРЕМЯ</span><b id="xp569Time">25.0</b></div></div><main id="xp569Arena" class="xp569-arena"></main><div id="xp569Status" class="xp569-status">За раунд начисляется игровой XP</div></section>`;
    document.body.appendChild(modal);modal.querySelector('.xp569-close').onclick=close;
  }
  function clear(){running=false;clearInterval(clock);clock=0;for(const x of localTimers){clearTimeout(x);clearInterval(x)}localTimers=[];}
  function later(fn,ms){const t=setTimeout(fn,ms);localTimers.push(t);return t}
  function close(){clear();modal?.classList.add('hidden');document.body.style.removeProperty('overflow')}
  function arena(){return document.getElementById('xp569Arena')}
  function hud(){document.getElementById('xp569Score').textContent=n(score)}

  async function loadStats(){
    if(!ONLINE_MODE)return;
    try{const d=await api('/api/v57/xp/stats');for(const k of Object.keys(TRAINERS)){stats[k]={...stats[k],...(d.trainers?.[k]||{})};const el=document.getElementById(`xp569Stat-${k}`);if(el)el.textContent=`Рекорд ${n(stats[k].highScore)} · сегодня ${n(stats[k].runsToday)}`;}}catch(e){console.warn('xp trainer stats',e)}
  }

  function open(type){
    ensureModal();clear();active=type;score=0;sessionId=null;const g=TRAINERS[type];
    document.getElementById('xp569Title').textContent=`${g.icon} ${g.title}`;document.getElementById('xp569Score').textContent='0';document.getElementById('xp569High').textContent=n(stats[type]?.highScore||0);document.getElementById('xp569Time').textContent='25.0';
    arena().innerHTML=`<div class="xp569-intro"><div><div class="xp569-big">${g.icon}</div><h4>${g.title}</h4><p>${g.desc}</p><p><b>Награда: XP</b> · без энергии · 25 секунд</p><button id="xp569Start" class="xp569-primary">Начать тренировку</button></div></div>`;
    document.getElementById('xp569Status').textContent='Сервер защищает XP от накрутки';
    document.getElementById('xp569Start').onclick=start;
    modal.classList.remove('hidden');document.body.style.overflow='hidden';
  }

  async function start(){
    if(!ONLINE_MODE)return toast('XP-тренажёры доступны внутри Telegram');
    const b=document.getElementById('xp569Start');if(b)b.disabled=true;
    try{
      const d=await api('/api/v57/xp/start',{method:'POST',body:JSON.stringify({trainerType:active})});
      sessionId=d.sessionId;endAt=Date.now()+Number(d.durationMs||25000);running=true;score=0;hud();
      if(active==='memory')startMemory();else if(active==='math')startMath();else if(active==='route')startRoute();else if(active==='focus')startFocus();else if(active==='profit')startProfit();else startSequence();
      tick();haptic('medium');
    }catch(e){toast(e.message);open(active)}
  }
  function tick(){clearInterval(clock);clock=setInterval(()=>{if(!running)return;const left=Math.max(0,endAt-Date.now());const el=document.getElementById('xp569Time');if(el)el.textContent=(left/1000).toFixed(1);if(left<=0)finish()},80)}
  function add(v){score=Math.max(0,score+v);hud()}

  function startMemory(){
    const symbols=['◆','●','▲','★'];let seq=[],pos=0,locked=true;
    arena().innerHTML=`<div class="xp569-memory"><div><div id="xpMemShow" class="show">👀</div><p id="xpMemHint">Запоминай</p><div id="xpMemKeys" class="keys">${symbols.map((s,i)=>`<button data-k="${i}">${s}</button>`).join('')}</div></div></div>`;
    const keys=document.getElementById('xpMemKeys');keys.style.visibility='hidden';
    function round(){if(!running)return;locked=true;pos=0;seq=Array.from({length:Math.min(7,3+Math.floor(score/20))},()=>Math.floor(Math.random()*4));keys.style.visibility='hidden';let i=0;const show=document.getElementById('xpMemShow'),hint=document.getElementById('xpMemHint');
      const step=()=>{if(!running)return;if(i<seq.length){show.textContent=symbols[seq[i++]];later(step,520)}else{show.textContent='?';hint.textContent='Повтори последовательность';keys.style.visibility='visible';locked=false}};step();}
    keys.querySelectorAll('button').forEach(bt=>bt.onclick=()=>{if(!running||locked)return;const k=Number(bt.dataset.k);if(k===seq[pos]){pos++;add(4);haptic('light');if(pos===seq.length){add(6);locked=true;document.getElementById('xpMemHint').textContent='✅ Верно';later(round,400)}}else{add(-5);notify('error');locked=true;document.getElementById('xpMemHint').textContent='❌ Ошибка';later(round,500)}});round();
  }

  function startMath(){
    arena().innerHTML='<div class="xp569-math"><div><div id="xpMathQ" class="xp569-question"></div><div id="xpMathOpts" class="xp569-options"></div><p id="xpMathHint"></p></div></div>';
    function next(){if(!running)return;const a=2+Math.floor(Math.random()*18),b=2+Math.floor(Math.random()*15),mul=Math.random()<.28;const ans=mul?a*b:a+b;document.getElementById('xpMathQ').textContent=mul?`${a} × ${b} = ?`:`${a} + ${b} = ?`;const vals=[ans,ans+(1+Math.floor(Math.random()*5)),Math.max(0,ans-(1+Math.floor(Math.random()*5))),ans+(6+Math.floor(Math.random()*5))].sort(()=>Math.random()-.5);const box=document.getElementById('xpMathOpts');box.innerHTML=vals.map(v=>`<button data-v="${v}">${v}</button>`).join('');box.querySelectorAll('button').forEach(bt=>bt.onclick=()=>{if(Number(bt.dataset.v)===ans){add(8);document.getElementById('xpMathHint').textContent='✅ +8';haptic()}else{add(-3);document.getElementById('xpMathHint').textContent='❌ −3';notify('error')}later(next,140)})}next();
  }

  function startRoute(){
    const arrows=['↑','→','↓','←'],dirs=['up','right','down','left'];let seq=[],pos=0,sx=0,sy=0;
    arena().innerHTML='<div class="xp569-route"><div><div id="xpRoutePath" class="xp569-path"></div><div id="xpRouteHint" class="hint">Повтори маршрут свайпами</div><div class="swipe">☝️</div></div></div>';
    function round(){seq=Array.from({length:Math.min(6,3+Math.floor(score/25))},()=>Math.floor(Math.random()*4));pos=0;document.getElementById('xpRoutePath').textContent=seq.map(i=>arrows[i]).join(' ');document.getElementById('xpRouteHint').textContent='Свайпай по порядку'}round();
    const a=arena();a.onpointerdown=e=>{sx=e.clientX;sy=e.clientY};a.onpointerup=e=>{if(!running)return;const dx=e.clientX-sx,dy=e.clientY-sy;if(Math.max(Math.abs(dx),Math.abs(dy))<25)return;const dir=Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');if(dir===dirs[seq[pos]]){pos++;add(7);haptic();if(pos===seq.length){add(8);document.getElementById('xpRouteHint').textContent='✅ Маршрут пройден';later(round,350)}}else{add(-4);pos=0;notify('error');document.getElementById('xpRouteHint').textContent='❌ Не то направление · сначала'}};
  }

  function startFocus(){
    const colors=[{name:'КРАСНЫЙ',c:'#ff5a67'},{name:'СИНИЙ',c:'#5c8dff'},{name:'ЗЕЛЁНЫЙ',c:'#59d39b'},{name:'ЖЁЛТЫЙ',c:'#ffd15b'}];
    arena().innerHTML='<div class="xp569-focus"><div><div style="color:#8193af;font-size:11px">ВЫБЕРИ ЦВЕТ ТЕКСТА, А НЕ СЛОВО</div><div id="xpFocusWord" class="xp569-focus-word"></div><div id="xpFocusOpts" class="xp569-color-options"></div><p id="xpFocusHint"></p></div></div>';
    function next(){if(!running)return;const word=colors[Math.floor(Math.random()*colors.length)],ink=colors[Math.floor(Math.random()*colors.length)];const w=document.getElementById('xpFocusWord');w.textContent=word.name;w.style.color=ink.c;const o=document.getElementById('xpFocusOpts');o.innerHTML=colors.map(x=>`<button data-name="${x.name}">${x.name}</button>`).join('');o.querySelectorAll('button').forEach(bt=>bt.onclick=()=>{if(bt.dataset.name===ink.name){add(9);haptic();document.getElementById('xpFocusHint').textContent='✅ Верно'}else{add(-4);notify('error');document.getElementById('xpFocusHint').textContent='❌ Ты прочитал слово'}later(next,160)})}next();
  }

  function startProfit(){
    let answer=0,input='';arena().innerHTML=`<div class="xp569-profit"><div class="xp569-profit-box"><h4>Посчитай чистую прибыль</h4><div id="xpLedger" class="xp569-ledger"></div><div id="xpProfitInput" class="xp569-input">0</div><div class="xp569-pad">${[1,2,3,4,5,6,7,8,9].map(x=>`<button data-num="${x}">${x}</button>`).join('')}<button data-clear>⌫</button><button data-num="0">0</button><button class="ok" data-ok>OK</button></div><p id="xpProfitHint" style="text-align:center;color:#8fa0bb"></p></div></div>`;
    const inputEl=document.getElementById('xpProfitInput');function next(){const revenue=(8+Math.floor(Math.random()*18))*100,expenses=(2+Math.floor(Math.random()*7))*100,tax=(1+Math.floor(Math.random()*3))*100;answer=revenue-expenses-tax;input='';inputEl.textContent='0';document.getElementById('xpLedger').innerHTML=`<div><span>Выручка</span><b>${revenue} ₽</b></div><div><span>Расходы</span><b>−${expenses} ₽</b></div><div><span>Налоги</span><b>−${tax} ₽</b></div>`}next();
    arena().querySelectorAll('[data-num]').forEach(bt=>bt.onclick=()=>{if(input.length<6){input+=bt.dataset.num;inputEl.textContent=input}});arena().querySelector('[data-clear]').onclick=()=>{input=input.slice(0,-1);inputEl.textContent=input||'0'};arena().querySelector('[data-ok]').onclick=()=>{if(Number(input)===answer){add(10);document.getElementById('xpProfitHint').textContent='✅ Точно! +10';haptic()}else{add(-4);document.getElementById('xpProfitHint').textContent=`❌ Правильно: ${answer} ₽`;notify('error')}later(next,500)};
  }

  function startSequence(){
    arena().innerHTML='<div class="xp569-seq"><div><p id="xpSeqHint" style="text-align:center;color:#8fa0bb">Нажимай от меньшего к большему</p><div id="xpSeqGrid" class="xp569-seq-grid"></div></div></div>';
    function round(){if(!running)return;const start=1+Math.floor(Math.random()*20),vals=Array.from({length:9},(_,i)=>start+i),sh=[...vals].sort(()=>Math.random()-.5),box=document.getElementById('xpSeqGrid');let want=start;box.innerHTML=sh.map(v=>`<button data-v="${v}">${v}</button>`).join('');box.querySelectorAll('button').forEach(bt=>bt.onclick=()=>{const v=Number(bt.dataset.v);if(v===want){bt.classList.add('done');bt.disabled=true;want++;add(2);if(want===start+9){add(8);document.getElementById('xpSeqHint').textContent='✅ Раунд готов';later(round,250)}}else{add(-3);notify('error')}})}round();
  }

  async function finish(){
    if(!running)return;running=false;clearInterval(clock);clock=0;for(const x of localTimers){clearTimeout(x);clearInterval(x)}localTimers=[];document.getElementById('xp569Time').textContent='0.0';
    const a=arena();a.innerHTML='<div class="xp569-result"><div><div class="xp569-big">⏳</div><h4>Проверяю результат</h4><p>XP начисляет сервер.</p></div></div>';
    try{
      const d=await api('/api/v57/xp/finish',{method:'POST',body:JSON.stringify({sessionId,score})});const r=d.result||{};if(d.state&&typeof applyServerState==='function')applyServerState(d.state);stats[active]={...stats[active],highScore:Number(r.highScore||0),runsToday:Number(r.runsToday||0)};
      a.innerHTML=`<div class="xp569-result"><div><div class="xp569-big">🎓</div><h4>+${n(r.rewardXp||0)} XP</h4><p>Счёт: ${n(r.score||0)} · рекорд: ${n(r.highScore||0)}</p>${Number(r.dailyMultiplier||1)<1?'<p>Сегодня уже было много тренировок — XP за следующие раунды снижен.</p>':''}<button id="xp569Again" class="xp569-primary">Ещё раз</button></div></div>`;document.getElementById('xp569Again').onclick=()=>open(active);notify('success');loadStats();
    }catch(e){a.innerHTML=`<div class="xp569-result"><div><div class="xp569-big">⚠️</div><h4>Раунд завершён</h4><p>${safe(e.message)}</p><button id="xp569Again" class="xp569-primary">Повторить</button></div></div>`;document.getElementById('xp569Again').onclick=()=>open(active)}
  }

  setTimeout(inject,0);window.addEventListener('pageshow',()=>setTimeout(inject,50));
})();