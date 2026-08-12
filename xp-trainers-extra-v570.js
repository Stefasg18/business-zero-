(()=>{
  if(window.__BZ_XP_TRAINERS_EXTRA_V570__)return;
  window.__BZ_XP_TRAINERS_EXTRA_V570__=true;

  const tg=window.Telegram?.WebApp;
  const GAMES={
    reaction:{icon:'⚡',title:'Реакция',tag:'РЕАКЦИЯ',desc:'Жди зелёный сигнал и нажимай как можно быстрее. Фальстарт сбивает серию.'},
    oddone:{icon:'🔎',title:'Лишний элемент',tag:'ВНИМАНИЕ',desc:'Находи один отличающийся символ среди похожих. С каждым раундом сетка плотнее.'},
    change:{icon:'💵',title:'Сдача',tag:'СЧЁТ',desc:'Посчитай сдачу покупателю и выбери правильный ответ на скорость.'},
    balance:{icon:'⚖️',title:'Баланс',tag:'КОНТРОЛЬ',desc:'Удерживай индикатор в зелёной зоне, управляя кнопками влево и вправо.'},
    timer:{icon:'⏱️',title:'Чувство времени',tag:'ТАЙМИНГ',desc:'Останови невидимый таймер как можно ближе к заданному времени.'},
    classify:{icon:'🗂️',title:'Доход или расход',tag:'БИЗНЕС',desc:'Быстро сортируй операции: доход вправо, расход влево.'}
  };

  let active=null,sessionId=null,score=0,running=false,endAt=0,clockTimer=0,gameCleanup=()=>{},stats={};
  const $=s=>document.querySelector(s);
  const num=n=>Math.max(0,Math.floor(Number(n)||0)).toLocaleString('ru-RU');
  const toast=t=>{try{showToast(t)}catch{console.log(t)}};
  const haptic=t=>{try{tg?.HapticFeedback?.impactOccurred(t||'light')}catch{}};
  const notify=t=>{try{tg?.HapticFeedback?.notificationOccurred(t||'success')}catch{}};
  const rand=(a,b)=>a+Math.random()*(b-a);
  const rint=(a,b)=>Math.floor(rand(a,b+1));
  const shuffle=a=>a.map(x=>[Math.random(),x]).sort((x,y)=>x[0]-y[0]).map(x=>x[1]);

  const style=document.createElement('style');
  style.id='xp570Style';
  style.textContent=`
    .xp570-section{margin-top:12px}.xp570-head{display:flex;align-items:end;justify-content:space-between;gap:10px;margin-bottom:10px}.xp570-head h3{margin:3px 0 0;font-size:20px}.xp570-head p{margin:4px 0 0;color:#8293ad;font-size:10px}.xp570-badge{padding:7px 9px;border-radius:999px;background:rgba(116,131,255,.11);border:1px solid rgba(116,131,255,.18);color:#b8c3ff;font-size:10px;font-weight:900}
    .xp570-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.xp570-card{padding:13px;border-radius:18px;border:1px solid rgba(129,151,210,.14);background:linear-gradient(150deg,#15253d,#0d1b2e);color:#fff;text-align:left}.xp570-card .ico{font-size:29px}.xp570-card .tag{display:block;margin-top:7px;color:#a5b5ff;font-size:8px;letter-spacing:1.1px;font-weight:950}.xp570-card strong{display:block;margin-top:4px;font-size:14px}.xp570-card p{min-height:43px;margin:5px 0 9px;color:#8596b1;font-size:10px;line-height:1.4}.xp570-card small{display:block;color:#71839f;font-size:9px}.xp570-card button{width:100%;margin-top:9px;border:0;border-radius:12px;padding:10px;color:#fff;background:linear-gradient(135deg,#526ff0,#7c59dd);font-weight:900}.xp570-note{margin-top:9px;color:#70819c;font-size:9px;line-height:1.45}
    .xp570-modal{position:fixed;inset:0;z-index:12680;display:grid;align-items:end;background:rgba(2,7,16,.80);backdrop-filter:blur(12px)}.xp570-modal.hidden{display:none}.xp570-sheet{width:100%;height:min(89dvh,760px);border-radius:27px 27px 0 0;background:linear-gradient(180deg,#11233b,#081522);border:1px solid rgba(128,151,211,.18);display:flex;flex-direction:column;overflow:hidden}.xp570-top{height:66px;flex:0 0 66px;padding:0 16px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.06)}.xp570-top span{font-size:8px;color:#7d91b1;letter-spacing:1.3px;font-weight:900}.xp570-top h3{margin:3px 0 0;font-size:20px}.xp570-close{width:42px;height:42px;border:1px solid rgba(255,255,255,.09);border-radius:14px;background:#172841;color:#fff;font-size:24px}.xp570-hud{display:grid;grid-template-columns:1fr 1fr 1fr;gap:7px;padding:10px 12px}.xp570-hud div{padding:8px 9px;border-radius:12px;background:#0f2036}.xp570-hud span{font-size:8px;color:#7f91ad}.xp570-hud b{display:block;margin-top:2px;font-size:15px}.xp570-arena{position:relative;flex:1;min-height:350px;margin:0 12px 12px;border-radius:21px;overflow:hidden;background:radial-gradient(circle at 50% 0,rgba(91,122,210,.14),transparent 40%),#0b192b;border:1px solid rgba(120,145,207,.12);touch-action:none;user-select:none}.xp570-intro,.xp570-result{position:absolute;inset:0;padding:24px;display:grid;place-items:center;text-align:center}.xp570-intro>div,.xp570-result>div{max-width:390px}.xp570-big{font-size:55px}.xp570-intro h4,.xp570-result h4{font-size:25px;margin:8px 0}.xp570-intro p,.xp570-result p{color:#91a1ba;font-size:12px;line-height:1.5}.xp570-primary{min-width:190px;border:0;border-radius:14px;padding:13px 17px;background:linear-gradient(135deg,#4f7df1,#765bdd);color:#fff;font-weight:950}.xp570-status{text-align:center;padding:0 14px 13px;color:#768aa7;font-size:9px}
    .xp570-center{height:100%;display:grid;place-items:center;text-align:center;padding:18px}.xp570-react-pad{width:min(310px,80vw);aspect-ratio:1;border:0;border-radius:50%;background:#21324b;color:#9aabc5;font-size:24px;font-weight:950;box-shadow:inset 0 0 0 2px rgba(255,255,255,.06)}.xp570-react-pad.ready{background:#24513e;color:#b9ffd8;box-shadow:0 0 35px rgba(67,214,149,.22),inset 0 0 0 2px rgba(114,242,180,.22)}
    .xp570-odd{display:grid;grid-template-columns:repeat(5,1fr);gap:7px;width:min(350px,90vw)}.xp570-odd button{aspect-ratio:1;border:1px solid rgba(255,255,255,.08);border-radius:12px;background:#172a45;color:#fff;font-size:25px}.xp570-odd button:active{transform:scale(.93)}
    .xp570-change h4{font-size:20px;margin-bottom:14px}.xp570-receipt{width:min(340px,88vw);display:grid;gap:8px}.xp570-receipt div{display:flex;justify-content:space-between;padding:11px 12px;border-radius:12px;background:#13243c;color:#9eb0ca}.xp570-receipt b{color:#fff}.xp570-answers{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}.xp570-answers button{padding:14px;border:1px solid rgba(255,255,255,.08);border-radius:13px;background:#172a45;color:#fff;font-weight:900}
    .xp570-balance{width:min(350px,90vw)}.xp570-track{position:relative;height:54px;border-radius:18px;background:#12223a;border:1px solid rgba(255,255,255,.07);overflow:hidden}.xp570-zone{position:absolute;top:0;bottom:0;left:39%;width:22%;background:rgba(70,210,148,.15)}.xp570-needle{position:absolute;top:5px;bottom:5px;width:7px;border-radius:8px;background:#fff;left:50%;box-shadow:0 0 14px rgba(255,255,255,.28)}.xp570-controls{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:18px}.xp570-controls button{padding:18px;border:1px solid rgba(255,255,255,.08);border-radius:15px;background:#172a45;color:#fff;font-size:24px;font-weight:950}
    .xp570-timer-target{font-size:44px;font-weight:1000}.xp570-timer-hint{margin:10px 0 18px;color:#91a1ba;font-size:12px}.xp570-stop{min-width:220px;padding:18px;border:0;border-radius:18px;background:linear-gradient(135deg,#4f7df1,#765bdd);color:#fff;font-size:19px;font-weight:950}
    .xp570-classify{width:min(350px,88vw)}.xp570-op{padding:22px 16px;border-radius:19px;background:#152842;border:1px solid rgba(255,255,255,.07)}.xp570-op span{display:block;color:#8193af;font-size:9px}.xp570-op strong{display:block;margin-top:6px;font-size:20px}.xp570-op b{display:block;margin-top:8px;font-size:27px}.xp570-class-buttons{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:14px}.xp570-class-buttons button{padding:15px;border:1px solid rgba(255,255,255,.08);border-radius:14px;background:#172a45;color:#fff;font-weight:950}.xp570-class-buttons .income{background:rgba(62,180,126,.18)}.xp570-class-buttons .expense{background:rgba(210,83,95,.14)}
    @media(max-width:390px){.xp570-grid{grid-template-columns:1fr}.xp570-sheet{height:92dvh}.xp570-odd{gap:5px}}
  `;
  document.head.appendChild(style);

  function apiCall(path,options){
    if(typeof api!=='function')return Promise.reject(new Error('Сервер игры недоступен'));
    return api(path,options);
  }
  function online(){return typeof ONLINE_MODE==='boolean'?ONLINE_MODE:Boolean(tg?.initData);}

  function inject(){
    if(document.getElementById('xpTrainersExtra570'))return;
    const base=document.getElementById('xpTrainers569');
    const home=document.getElementById('tab-home');
    if(!home)return;
    const sec=document.createElement('section');
    sec.id='xpTrainersExtra570';sec.className='section xp570-section';
    sec.innerHTML=`<div class="xp570-head"><div><div class="eyebrow">ЕЩЁ БОЛЬШЕ XP</div><h3>Продвинутые тренажёры</h3><p>Шесть новых механик: реакция, контроль, внимание и бизнес-счёт.</p></div><span class="xp570-badge">+6 игр</span></div><div class="xp570-grid">${Object.entries(GAMES).map(([id,g])=>`<article class="xp570-card"><div class="ico">${g.icon}</div><span class="tag">${g.tag}</span><strong>${g.title}</strong><p>${g.desc}</p><small id="xp570Stat-${id}">Рекорд — · сегодня —</small><button data-xp570="${id}">Тренироваться</button></article>`).join('')}</div><div class="xp570-note">Все новые тренажёры дают только XP. Сервер ограничивает максимальный результат и уменьшает награду при очень частом фарме.</div>`;
    if(base)base.insertAdjacentElement('afterend',sec);else home.appendChild(sec);
    sec.querySelectorAll('[data-xp570]').forEach(b=>b.addEventListener('click',()=>openGame(b.dataset.xp570)));
    const badge=document.querySelector('#xpTrainers569 .xp569-badge');if(badge)badge.textContent='12 игр';
    const p=document.querySelector('#xpTrainers569 .xp569-head p');if(p)p.textContent='12 коротких игр на опыт. Выбирай механику и прокачивай уровень.';
    loadStats();
  }

  function ensureModal(){
    if(document.getElementById('xp570Modal'))return;
    const root=document.createElement('div');root.id='xp570Modal';root.className='xp570-modal hidden';
    root.innerHTML=`<section class="xp570-sheet"><header class="xp570-top"><div><span>XP ТРЕНАЖЁР · 25 СЕКУНД</span><h3 id="xp570Title">Тренировка</h3></div><button class="xp570-close" data-xp570-close>×</button></header><div class="xp570-hud"><div><span>Счёт</span><b id="xp570Score">0</b></div><div><span>Время</span><b id="xp570Time">25.0</b></div><div><span>Рекорд</span><b id="xp570Best">0</b></div></div><div id="xp570Arena" class="xp570-arena"></div><div id="xp570Status" class="xp570-status">XP начисляет сервер после полного раунда</div></section>`;
    document.body.appendChild(root);root.querySelector('[data-xp570-close]').addEventListener('click',closeGame);
  }
  function arena(){return document.getElementById('xp570Arena')}
  function setScore(v){score=Math.max(0,Math.floor(v));const el=document.getElementById('xp570Score');if(el)el.textContent=num(score)}
  function cleanup(){try{gameCleanup()}catch{}gameCleanup=()=>{};clearInterval(clockTimer);clockTimer=0;}
  function closeGame(){running=false;cleanup();document.getElementById('xp570Modal')?.classList.add('hidden');document.body.style.overflow=''}
  function openGame(id){
    active=id;sessionId=null;setScore(0);ensureModal();cleanup();
    document.getElementById('xp570Title').textContent=GAMES[id].title;
    document.getElementById('xp570Best').textContent=num(stats[id]?.highScore||0);
    document.getElementById('xp570Time').textContent='25.0';
    arena().innerHTML=`<div class="xp570-intro"><div><div class="xp570-big">${GAMES[id].icon}</div><h4>${GAMES[id].title}</h4><p>${GAMES[id].desc}</p><button id="xp570Start" class="xp570-primary">Начать тренировку</button></div></div>`;
    document.getElementById('xp570Status').textContent='Без энергии · награда только XP';
    document.getElementById('xp570Start').onclick=startSession;
    document.getElementById('xp570Modal').classList.remove('hidden');document.body.style.overflow='hidden';
  }
  async function startSession(){
    if(!online()){toast('Открой игру внутри Telegram');return;}
    const b=document.getElementById('xp570Start');if(b)b.disabled=true;
    document.getElementById('xp570Status').textContent='Запускаю защищённую тренировку…';
    try{
      const d=await apiCall('/api/v57/xp/start',{method:'POST',body:JSON.stringify({trainerType:active})});
      sessionId=d.sessionId;endAt=Date.now()+Number(d.durationMs||25000);running=true;setScore(0);startClock();startMechanic();
    }catch(e){toast(e.message);if(b)b.disabled=false;document.getElementById('xp570Status').textContent=e.message;}
  }
  function startClock(){
    clearInterval(clockTimer);clockTimer=setInterval(()=>{
      if(!running)return;const left=Math.max(0,endAt-Date.now());const el=document.getElementById('xp570Time');if(el)el.textContent=(left/1000).toFixed(1);if(left<=0)finish();
    },80);
  }
  function startMechanic(){
    if(active==='reaction')return startReaction();
    if(active==='oddone')return startOddOne();
    if(active==='change')return startChange();
    if(active==='balance')return startBalance();
    if(active==='timer')return startTimer();
    startClassify();
  }

  function startReaction(){
    arena().innerHTML='<div class="xp570-center"><div><button id="xp570React" class="xp570-react-pad">ЖДИ…</button><p id="xp570ReactInfo" style="color:#8293ad;font-size:11px;margin-top:16px">Не нажимай до зелёного сигнала</p></div></div>';
    const pad=document.getElementById('xp570React'),info=document.getElementById('xp570ReactInfo');
    let ready=false,goAt=0,timer=0,streak=0;
    const arm=()=>{if(!running)return;ready=false;pad.classList.remove('ready');pad.textContent='ЖДИ…';info.textContent='Не нажимай до зелёного сигнала';clearTimeout(timer);timer=setTimeout(()=>{if(!running)return;ready=true;goAt=performance.now();pad.classList.add('ready');pad.textContent='ЖМИ!';info.textContent='Сейчас!';},rint(650,1900));};
    pad.onpointerdown=e=>{e.preventDefault();if(!running)return;if(!ready){streak=0;setScore(score>2?score-3:0);info.textContent='Фальстарт −3';haptic('heavy');clearTimeout(timer);setTimeout(arm,450);return;}const rt=performance.now()-goAt;ready=false;streak++;const gain=rt<230?8:rt<300?6:rt<390?4:2;setScore(score+gain+Math.min(3,Math.floor(streak/3)));info.textContent=`${Math.round(rt)} мс · +${gain}`;haptic(rt<300?'medium':'light');setTimeout(arm,350);};
    arm();gameCleanup=()=>clearTimeout(timer);
  }

  function startOddOne(){
    arena().innerHTML='<div class="xp570-center"><div><div id="xp570Odd" class="xp570-odd"></div><p id="xp570OddInfo" style="color:#8293ad;font-size:11px;margin-top:14px">Найди отличающийся символ</p></div></div>';
    const grid=document.getElementById('xp570Odd'),info=document.getElementById('xp570OddInfo');let round=0;
    const pairs=[['●','○'],['■','□'],['▲','△'],['◆','◇'],['★','☆'],['⬆','⬇'],['C','G'],['8','3']];
    const next=()=>{if(!running)return;round++;const [base,odd]=pairs[rint(0,pairs.length-1)],count=round>6?30:25,idx=rint(0,count-1);grid.style.gridTemplateColumns=`repeat(${count===30?6:5},1fr)`;grid.innerHTML=Array.from({length:count},(_,i)=>`<button data-odd="${i===idx?1:0}">${i===idx?odd:base}</button>`).join('');grid.querySelectorAll('button').forEach(b=>b.onpointerdown=e=>{e.preventDefault();if(!running)return;if(b.dataset.odd==='1'){setScore(score+Math.min(9,4+Math.floor(round/3)));info.textContent='Верно';haptic('light');next();}else{setScore(Math.max(0,score-2));info.textContent='Не тот · −2';haptic('heavy');}});};next();
  }

  function startChange(){
    arena().innerHTML='<div class="xp570-center xp570-change"><div><h4>Посчитай сдачу</h4><div id="xp570Receipt" class="xp570-receipt"></div><div id="xp570Answers" class="xp570-answers"></div><p id="xp570ChangeInfo" style="color:#8293ad;font-size:11px;margin-top:12px"></p></div></div>';
    const rec=document.getElementById('xp570Receipt'),answers=document.getElementById('xp570Answers'),info=document.getElementById('xp570ChangeInfo');let combo=0;
    const next=()=>{if(!running)return;const price=rint(12,89)*10;const bills=[500,1000,2000,5000].filter(x=>x>price);const paid=bills[rint(0,bills.length-1)];const correct=paid-price;const opts=shuffle([correct,Math.max(0,correct+rint(1,5)*10),Math.max(0,correct-rint(1,5)*10),correct+rint(6,12)*10]);rec.innerHTML=`<div><span>Покупка</span><b>${num(price)} ₽</b></div><div><span>Покупатель дал</span><b>${num(paid)} ₽</b></div>`;answers.innerHTML=opts.map(x=>`<button data-answer="${x}">${num(x)} ₽</button>`).join('');answers.querySelectorAll('button').forEach(b=>b.onpointerdown=e=>{e.preventDefault();if(!running)return;if(Number(b.dataset.answer)===correct){combo++;const gain=4+Math.min(4,Math.floor(combo/3));setScore(score+gain);info.textContent=`Верно · +${gain}`;haptic('light');}else{combo=0;setScore(Math.max(0,score-2));info.textContent=`Правильно: ${num(correct)} ₽`;haptic('heavy');}setTimeout(next,180);});};next();
  }

  function startBalance(){
    arena().innerHTML='<div class="xp570-center"><div class="xp570-balance"><div class="xp570-track"><div class="xp570-zone"></div><div id="xp570Needle" class="xp570-needle"></div></div><p id="xp570BalanceInfo" style="color:#8293ad;font-size:11px;margin:14px 0">Держи стрелку в зелёной зоне</p><div class="xp570-controls"><button id="xp570Left">◀</button><button id="xp570Right">▶</button></div></div></div>';
    const needle=document.getElementById('xp570Needle');let pos=50,vel=rand(-.035,.035),left=false,right=false,last=performance.now(),acc=0,raf=0;
    const down=(side,v)=>{if(side==='l')left=v;else right=v};const L=document.getElementById('xp570Left'),R=document.getElementById('xp570Right');
    ['pointerdown','pointerup','pointercancel','pointerleave'].forEach(ev=>{L.addEventListener(ev,e=>{e.preventDefault();down('l',ev==='pointerdown')});R.addEventListener(ev,e=>{e.preventDefault();down('r',ev==='pointerdown')});});
    const tick=t=>{if(!running)return;const dt=Math.min(40,t-last);last=t;vel+=(right?0.00012:0)-(left?0.00012:0)+(Math.random()-.5)*0.000045*dt;vel*=0.994;pos+=vel*dt; if(pos<3){pos=3;vel=Math.abs(vel)*.6} if(pos>97){pos=97;vel=-Math.abs(vel)*.6} needle.style.left=`${pos}%`;if(pos>=39&&pos<=61){acc+=dt;if(acc>=430){acc=0;setScore(score+2);}}else acc=Math.max(0,acc-dt*.4);raf=requestAnimationFrame(tick);};raf=requestAnimationFrame(tick);gameCleanup=()=>cancelAnimationFrame(raf);
  }

  function startTimer(){
    arena().innerHTML='<div class="xp570-center"><div><div id="xp570TimerTarget" class="xp570-timer-target">3.0 сек</div><div class="xp570-timer-hint">После старта счётчик исчезнет. Останови по ощущениям.</div><button id="xp570Stop" class="xp570-stop">СТАРТ</button><p id="xp570TimerInfo" style="color:#8293ad;font-size:11px;margin-top:14px"></p></div></div>';
    const targetEl=document.getElementById('xp570TimerTarget'),btn=document.getElementById('xp570Stop'),info=document.getElementById('xp570TimerInfo');let started=0,target=3,activeTry=false;
    const setup=()=>{if(!running)return;target=[2.0,2.5,3.0,3.5,4.0][rint(0,4)];targetEl.textContent=`${target.toFixed(1)} сек`;targetEl.style.visibility='visible';btn.textContent='СТАРТ';activeTry=false;};
    btn.onpointerdown=e=>{e.preventDefault();if(!running)return;if(!activeTry){activeTry=true;started=performance.now();targetEl.style.visibility='hidden';btn.textContent='СТОП';info.textContent='';haptic('light');return;}const elapsed=(performance.now()-started)/1000,diff=Math.abs(elapsed-target);const gain=diff<.12?10:diff<.25?7:diff<.45?4:1;setScore(score+gain);info.textContent=`${elapsed.toFixed(2)} сек · ошибка ${diff.toFixed(2)} · +${gain}`;activeTry=false;btn.disabled=true;targetEl.style.visibility='visible';setTimeout(()=>{btn.disabled=false;setup();},650);};setup();
  }

  function startClassify(){
    arena().innerHTML='<div class="xp570-center"><div class="xp570-classify"><div id="xp570Operation" class="xp570-op"></div><div class="xp570-class-buttons"><button id="xp570Expense" class="expense">← РАСХОД</button><button id="xp570Income" class="income">ДОХОД →</button></div><p id="xp570ClassInfo" style="color:#8293ad;font-size:11px;margin-top:12px"></p></div></div>';
    const op=document.getElementById('xp570Operation'),info=document.getElementById('xp570ClassInfo');let correct='income',combo=0;
    const income=[['Продажа товара','💰'],['Оплата клиента','🧾'],['Процент по вкладу бизнеса','🏦'],['Доход от аренды','🏢'],['Выручка магазина','🛒']];
    const expense=[['Аренда офиса','🏢'],['Зарплата сотрудникам','👥'],['Реклама','📣'],['Закупка сырья','📦'],['Коммунальные услуги','💡']];
    const next=()=>{if(!running)return;correct=Math.random()<.5?'income':'expense';const arr=correct==='income'?income:expense,[title,icon]=arr[rint(0,arr.length-1)],amount=rint(5,160)*100;op.innerHTML=`<span>ОПЕРАЦИЯ</span><strong>${icon} ${title}</strong><b>${num(amount)} ₽</b>`;};
    const choose=type=>{if(!running)return;if(type===correct){combo++;const gain=3+Math.min(4,Math.floor(combo/4));setScore(score+gain);info.textContent=`Верно · +${gain}`;haptic('light');}else{combo=0;setScore(Math.max(0,score-2));info.textContent='Ошибка · −2';haptic('heavy');}setTimeout(next,120);};
    document.getElementById('xp570Income').onpointerdown=e=>{e.preventDefault();choose('income')};document.getElementById('xp570Expense').onpointerdown=e=>{e.preventDefault();choose('expense')};next();
  }

  async function finish(){
    if(!running)return;running=false;cleanup();document.getElementById('xp570Time').textContent='0.0';document.getElementById('xp570Status').textContent='Сервер проверяет результат…';
    try{
      const d=await apiCall('/api/v57/xp/finish',{method:'POST',body:JSON.stringify({sessionId,score})});
      if(d.state&&typeof applyServerState==='function')applyServerState(d.state);
      const r=d.result||{};stats[active]={...(stats[active]||{}),highScore:Number(r.highScore||0),runsToday:Number(r.runsToday||0)};
      const reduced=Number(r.dailyMultiplier||1)<1;
      arena().innerHTML=`<div class="xp570-result"><div><div class="xp570-big">${GAMES[active].icon}</div><h4>+${num(r.rewardXp||0)} XP</h4><p>Счёт: ${num(r.score||0)} · рекорд: ${num(r.highScore||0)}</p>${reduced?'<p style="font-size:10px">Сегодня уже было много тренировок, поэтому награда снижена.</p>':''}<button id="xp570Again" class="xp570-primary">Ещё раз</button></div></div>`;
      document.getElementById('xp570Again').onclick=()=>openGame(active);document.getElementById('xp570Status').textContent=`Тренировок сегодня: ${num(r.runsToday||0)}`;updateStats();notify('success');
    }catch(e){arena().innerHTML=`<div class="xp570-result"><div><div class="xp570-big">⚠️</div><h4>Раунд завершён</h4><p>${String(e.message||e)}</p><button id="xp570Again" class="xp570-primary">Повторить</button></div></div>`;document.getElementById('xp570Again').onclick=()=>openGame(active);document.getElementById('xp570Status').textContent='XP не начислен';}
  }

  function updateStats(){for(const id of Object.keys(GAMES)){const el=document.getElementById(`xp570Stat-${id}`),s=stats[id]||{};if(el)el.textContent=`Рекорд ${num(s.highScore||0)} · сегодня ${num(s.runsToday||0)}`;}}
  async function loadStats(){
    if(!online()){updateStats();return;}
    try{const d=await apiCall('/api/v57/xp/stats');for(const id of Object.keys(GAMES))stats[id]=d.trainers?.[id]||{runsToday:0,totalRuns:0,highScore:0};updateStats();}catch(e){console.error('xp extra stats',e);updateStats();}
  }

  const tryInject=()=>{inject();if(!document.getElementById('xpTrainersExtra570'))setTimeout(tryInject,350)};
  tryInject();
})();