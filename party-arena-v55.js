(()=>{
  if(window.__BZ_PARTY_ARENA_V55__)return;
  window.__BZ_PARTY_ARENA_V55__=true;

  const VERSION='5.5';
  const tg=window.Telegram?.WebApp;
  const myId=()=>Number(tg?.initDataUnsafe?.user?.id||0);
  const fmt=n=>Number(n||0).toLocaleString('ru-RU');
  const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const toast=t=>{try{showToast(t)}catch{console.log(t)}};

  let stats=null,party=null,poll=null,raf=null,local=null,localTicker=null,lastRemoteAction=0,finishedHandled=false;

  function enforceVersion(){
    window.BZ_APP_VERSION=VERSION;
    const top=document.querySelector('.topbar .eyebrow');
    if(top)top.textContent=`BUSINESS GAME · ${VERSION}`;
    document.title=`Бизнес с нуля ${VERSION}`;
  }

  function inject(){
    const tab=document.getElementById('tab-friends');
    if(!tab||document.getElementById('v55PartyCard'))return;
    const sec=document.createElement('section');
    sec.id='v55PartyCard';sec.className='section v55-party-card';
    sec.innerHTML=`<div class="v55-party-hero"><div class="v55-party-logo">🎉</div><div class="v55-party-copy"><span>PARTY ARENA · 5.5</span><h2>Играй вместе</h2><p>2 игрока, 2×2 или онлайн-команда с разных телефонов. Три уровня сложности и общие награды.</p></div><button id="v55PartyOpen">Играть</button></div><div id="v55PartyMiniStats" class="v55-party-mini"><span>Party LVL —</span><span>Локально —</span><span>Онлайн —</span></div>`;
    const anchor=document.getElementById('v53Social')||tab.querySelector('.first-section');
    anchor?.insertAdjacentElement('afterend',sec);
    sec.querySelector('#v55PartyOpen').onclick=openHome;
    injectOverlay();
    loadStats().catch(()=>{});
  }

  function injectOverlay(){
    if(document.getElementById('v55PartyOverlay'))return;
    const o=document.createElement('div');o.id='v55PartyOverlay';o.className='v55-overlay hidden';
    o.innerHTML=`<div class="v55-back" data-v55-close></div><section class="v55-sheet"><header><div><span>BUSINESS GAME · 5.5</span><h2>🎉 Party Arena</h2></div><button data-v55-close>×</button></header><main id="v55PartyContent"></main></section>`;
    document.body.appendChild(o);
    o.querySelectorAll('[data-v55-close]').forEach(x=>x.onclick=closeParty);
  }

  async function loadStats(){
    const d=await api('/api/v55/party/stats');stats=d.stats;renderMiniStats();return stats;
  }
  function renderMiniStats(){
    const el=document.getElementById('v55PartyMiniStats');if(!el||!stats)return;
    el.innerHTML=`<span>🎮 Party LVL ${stats.partyLevel}</span><span>📱 Наград локально ${stats.localRewardRunsLeft}/3</span><span>🌐 Наград онлайн ${stats.remoteRewardRunsLeft}/5</span>`;
  }

  async function openHome(){
    injectOverlay();stopAll();party=null;local=null;finishedHandled=false;
    document.getElementById('v55PartyOverlay').classList.remove('hidden');document.body.classList.add('v55-lock');
    try{await loadStats();renderHome()}catch(e){toast(e.message)}
  }
  function closeParty(){stopAll();document.getElementById('v55PartyOverlay')?.classList.add('hidden');document.body.classList.remove('v55-lock')}

  function renderHome(){
    const c=document.getElementById('v55PartyContent');
    c.innerHTML=`<div class="v55-level-card"><div><span>PARTY LEVEL</span><b>${stats?.partyLevel||1}</b></div><div><span>Party XP</span><b>${fmt(stats?.partyXp||0)}</b></div><div><span>Лучший онлайн</span><b>${fmt(stats?.bestRemoteScore||0)}</b></div></div>
      <div class="v55-mode-grid">
        <article class="v55-mode local"><div class="v55-mode-icon">📱</div><span>ОДИН ТЕЛЕФОН</span><h3>Party рядом</h3><p>Положите телефон между собой. Экран делится на зоны, каждый играет своей рукой.</p><div class="v55-mode-buttons"><button data-local="2">👥 2 игрока</button><button data-local="4">⚔️ 2×2</button></div><small>Денежная награда владельцу телефона · осталось ${stats?.localRewardRunsLeft??3}/3</small></article>
        <article class="v55-mode remote"><div class="v55-mode-icon">🌐</div><span>РАЗНЫЕ ТЕЛЕФОНЫ</span><h3>Командный онлайн</h3><p>Каждый заходит со своего Telegram. Общий результат — отдельная награда каждому.</p><div class="v55-mode-buttons"><button data-create="2">Создать на 2</button><button data-create="4">Создать на 4</button></div><div class="v55-join"><input id="v55JoinCode" maxlength="6" placeholder="Код комнаты"><button id="v55JoinBtn">Войти</button></div><small>До 4 500 ₽ каждому вдвоём / до 7 500 ₽ каждому вчетвером · осталось ${stats?.remoteRewardRunsLeft??5}/5</small></article>
      </div>
      <div class="v55-rules"><b>3 уровня в одной игре</b><span>1. Реакция — широкая зона</span><span>2. Турбо — быстрее</span><span>3. Финал — самая узкая зона и максимум очков</span></div>`;
    c.querySelectorAll('[data-local]').forEach(b=>b.onclick=()=>startLocal(Number(b.dataset.local)));
    c.querySelectorAll('[data-create]').forEach(b=>b.onclick=()=>createRoom(Number(b.dataset.create)));
    c.querySelector('#v55JoinBtn').onclick=()=>joinRoom(c.querySelector('#v55JoinCode').value);
  }

  async function startLocal(count){
    try{
      const d=await api('/api/v55/party/local/start',{method:'POST',body:JSON.stringify({playerCount:count})});
      local={sessionId:d.session.sessionId,count,scores:Array(count).fill(0),startedAt:0,stage:0,done:false};
      renderLocalCountdown();
    }catch(e){toast(e.message)}
  }

  function renderLocalCountdown(){
    const c=document.getElementById('v55PartyContent');let n=3;
    c.innerHTML=`<div class="v55-countdown"><span>Передайте телефон друзьям</span><b id="v55Count">3</b><p>${local.count===4?'Игроки 1–2 = команда A · игроки 3–4 = команда B':'Каждый играет своей половиной экрана'}</p></div>`;
    const t=setInterval(()=>{n--;const el=document.getElementById('v55Count');if(el)el.textContent=n>0?n:'GO!';if(n<=0){clearInterval(t);setTimeout(beginLocal,450)}},850);
    localTicker=t;
  }

  function beginLocal(){
    clearInterval(localTicker);local.startedAt=performance.now();local.stage=1;
    const c=document.getElementById('v55PartyContent');
    c.innerHTML=`<div class="v55-local-top"><div><span id="v55LocalStage">УРОВЕНЬ 1 · РЕАКЦИЯ</span><b id="v55LocalTime">36</b></div><div id="v55TeamScore"></div></div><div id="v55LocalPads" class="v55-pads p${local.count}">${Array.from({length:local.count},(_,i)=>`<button class="v55-pad" data-player="${i}"><span>${local.count===4?(i<2?'КОМАНДА A':'КОМАНДА B'):'ИГРОК'}</span><b>${i+1}</b><em id="v55PS${i}">0</em><small id="v55Hint${i}">Жди зелёный</small></button>`).join('')}</div><div class="v55-local-tip" id="v55LocalTip">Нажимай только когда твоя зона вспыхивает зелёным.</div>`;
    c.querySelectorAll('.v55-pad').forEach(b=>b.addEventListener('pointerdown',e=>{e.preventDefault();localTap(Number(b.dataset.player),b)}));
    localTicker=setInterval(updateLocal,80);updateLocal();
  }

  function localTap(i,pad){
    if(!local||local.done)return;
    const elapsed=(performance.now()-local.startedAt)/1000;let pts=0;
    if(local.stage===1){
      const phase=((elapsed*1000+i*331)%1450);const hot=phase>500&&phase<880;pts=hot?70:5;
    }else if(local.stage===2){
      const green=(Math.floor(elapsed*2.3+i*1.7)%3)!==0;pts=green?85:-20;
    }else{
      const phase=((elapsed*1000+i*190)%1050)/1050;const dist=Math.abs(phase-.5);pts=dist<.10?110:dist<.20?65:10;
    }
    local.scores[i]=Math.max(0,local.scores[i]+pts);
    const s=document.getElementById(`v55PS${i}`);if(s)s.textContent=local.scores[i];
    pad.classList.remove('pop');void pad.offsetWidth;pad.classList.add('pop');
    try{tg?.HapticFeedback?.impactOccurred(pts>=70?'medium':'light')}catch{}
    updateTeamScore();
  }

  function updateLocal(){
    if(!local||local.done)return;
    const elapsed=(performance.now()-local.startedAt)/1000,remain=Math.max(0,36-elapsed);
    const stage=elapsed<12?1:elapsed<24?2:3;
    if(stage!==local.stage){local.stage=stage;try{tg?.HapticFeedback?.notificationOccurred('success')}catch{}}
    const st=document.getElementById('v55LocalStage');if(st)st.textContent=stage===1?'УРОВЕНЬ 1 · РЕАКЦИЯ':stage===2?'УРОВЕНЬ 2 · НЕ ЖМИ КРАСНОЕ':'УРОВЕНЬ 3 · КОМАНДНЫЙ ФИНАЛ';
    const tm=document.getElementById('v55LocalTime');if(tm)tm.textContent=Math.ceil(remain);
    const tip=document.getElementById('v55LocalTip');if(tip)tip.textContent=stage===1?'Нажимай, когда твоя зона зелёная.':stage===2?'Зелёный = жми. Красный = штраф.':'Попадай в короткую яркую вспышку — здесь больше всего очков.';
    document.querySelectorAll('.v55-pad').forEach((pad,i)=>{
      let hot=false,bad=false;
      if(stage===1){const ph=((elapsed*1000+i*331)%1450);hot=ph>500&&ph<880;}
      else if(stage===2){hot=(Math.floor(elapsed*2.3+i*1.7)%3)!==0;bad=!hot;}
      else {const ph=((elapsed*1000+i*190)%1050)/1050;hot=Math.abs(ph-.5)<.10;}
      pad.classList.toggle('hot',hot);pad.classList.toggle('bad',bad);
      const h=document.getElementById(`v55Hint${i}`);if(h)h.textContent=bad?'НЕ ЖМИ':hot?'ЖМИ!':'ГОТОВЬСЯ';
    });
    updateTeamScore();
    if(remain<=0)finishLocal();
  }

  function updateTeamScore(){
    const el=document.getElementById('v55TeamScore');if(!el||!local)return;
    if(local.count===4){const a=local.scores[0]+local.scores[1],b=local.scores[2]+local.scores[3];el.innerHTML=`<span>A <b>${a}</b></span><span>B <b>${b}</b></span>`;}
    else el.innerHTML=`<span>P1 <b>${local.scores[0]}</b></span><span>P2 <b>${local.scores[1]}</b></span>`;
  }

  async function finishLocal(){
    if(local.done)return;local.done=true;clearInterval(localTicker);
    const total=local.scores.reduce((a,b)=>a+b,0);
    const c=document.getElementById('v55PartyContent');c.innerHTML=`<div class="v55-finish"><div>🏆</div><span>PARTY ЗАВЕРШЕНА</span><h2>${fmt(total)} очков</h2><p>Считаю награду…</p></div>`;
    try{
      const d=await api('/api/v55/party/local/claim',{method:'POST',body:JSON.stringify({sessionId:local.sessionId,score:total})});
      stats=d.result.stats;renderMiniStats();
      let winner='';
      if(local.count===4){const a=local.scores[0]+local.scores[1],b=local.scores[2]+local.scores[3];winner=a===b?'Ничья!':a>b?'Победила команда A':'Победила команда B';}
      else winner=local.scores[0]===local.scores[1]?'Ничья!':local.scores[0]>local.scores[1]?'Победил игрок 1':'Победил игрок 2';
      c.innerHTML=`<div class="v55-finish"><div>🎊</div><span>${safe(winner)}</span><h2>+${fmt(d.result.rewardCash)} ₽</h2><p>${d.result.rewarded?'Награда владельцу телефона начислена.':'Сегодня денежные локальные награды закончились — играть дальше можно для веселья.'}</p><div class="v55-xp">+${fmt(d.result.partyXpGain)} Party XP · Party LVL ${d.result.partyLevel}</div><button id="v55Again" class="v55-primary">Ещё раз</button><button id="v55Home">К выбору режима</button></div>`;
      c.querySelector('#v55Again').onclick=()=>startLocal(local.count);c.querySelector('#v55Home').onclick=renderHome;
      refreshCore();
    }catch(e){c.innerHTML=`<div class="v55-finish"><div>⚠️</div><h2>Не удалось начислить награду</h2><p>${safe(e.message)}</p><button id="v55Home">Назад</button></div>`;c.querySelector('#v55Home').onclick=renderHome;}
  }

  async function createRoom(capacity){
    try{const d=await api('/api/v55/party/room/create',{method:'POST',body:JSON.stringify({capacity})});party=d.party;finishedHandled=false;renderParty();startPoll();}
    catch(e){toast(e.message)}
  }
  async function joinRoom(code){
    code=String(code||'').trim().toUpperCase();if(!code)return;
    try{const d=await api('/api/v55/party/room/join',{method:'POST',body:JSON.stringify({code})});party=d.party;finishedHandled=false;renderParty();startPoll();}
    catch(e){toast(e.message)}
  }
  async function setReady(ready){try{const d=await api('/api/v55/party/room/ready',{method:'POST',body:JSON.stringify({roomId:party.room.id,ready})});party=d.party;renderParty()}catch(e){toast(e.message)}}
  async function startRemote(){try{const d=await api('/api/v55/party/room/start',{method:'POST',body:JSON.stringify({roomId:party.room.id})});party=d.party;renderParty()}catch(e){toast(e.message)}}
  async function cancelRemote(){try{await api('/api/v55/party/room/cancel',{method:'POST',body:JSON.stringify({roomId:party.room.id})});stopAll();await loadStats();renderHome()}catch(e){toast(e.message)}}

  function renderParty(){
    if(!party)return;const status=party.room.status;
    if(status==='waiting')renderLobby();else if(status==='running')renderRemoteGame();else renderRemoteFinish();
  }

  function renderLobby(){
    cancelAnimationFrame(raf);const c=document.getElementById('v55PartyContent'),r=party.room,ps=party.participants||[],me=ps.find(x=>x.telegramId===myId()),host=r.hostId===myId();
    c.innerHTML=`<div class="v55-room"><span>КОД КОМНАТЫ</span><h2>${safe(r.code)}</h2><p>${r.capacity===2?'2 игрока':'4 игрока · командный режим'} · без ставок</p><div><button id="v55CopyCode">Копировать</button><button id="v55ShareCode">Отправить другу</button></div></div><div class="v55-players">${ps.map(p=>`<div class="v55-player"><i class="${p.online?'on':''}"></i><div><b>${safe(p.displayName)}</b><small>${safe(p.gameId||'')}</small></div><span>${p.ready?'✓ готов':'ожидает'}</span></div>`).join('')}${Array.from({length:Math.max(0,r.capacity-ps.length)},()=>'<div class="v55-player empty">Ожидание игрока…</div>').join('')}</div><div class="v55-lobby-actions">${!host?`<button id="v55Ready" class="${me?.ready?'ready':''}">${me?.ready?'✓ Я готов':'Я готов'}</button>`:''}${host?'<button id="v55StartRemote" class="v55-primary">Начать игру</button><button id="v55CancelRemote">Отменить комнату</button>':''}</div><div class="v55-note">Все участники должны быть в комнате и нажать «Готов». После старта будет 4 секунды на подготовку.</div>`;
    c.querySelector('#v55CopyCode').onclick=()=>copyCode(r.code);c.querySelector('#v55ShareCode').onclick=()=>shareCode(r.code);
    c.querySelector('#v55Ready')?.addEventListener('click',()=>setReady(!me?.ready));c.querySelector('#v55StartRemote')?.addEventListener('click',startRemote);c.querySelector('#v55CancelRemote')?.addEventListener('click',cancelRemote);
  }

  function copyCode(code){navigator.clipboard?.writeText(code).then(()=>toast('Код скопирован')).catch(()=>toast(code))}
  function shareCode(code){
    const text=`Заходи в Business Zero → Друзья → Party Arena. Код комнаты: ${code}`;
    if(navigator.share){navigator.share({text}).catch(()=>copyCode(code));return;}
    try{tg?.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent('https://t.me/BusinessZeroGameBot')}&text=${encodeURIComponent(text)}`)}catch{copyCode(code)}
  }

  function renderRemoteGame(){
    const c=document.getElementById('v55PartyContent');
    if(document.getElementById('v55RemoteGame')){updateRemoteScores();return;}
    const ps=party.participants||[];
    c.innerHTML=`<div id="v55RemoteGame"><div class="v55-remote-top"><div><span id="v55RemoteStage">ПОДГОТОВКА</span><b id="v55RemoteTime">—</b></div><div><span>Команда</span><b id="v55RemoteTotal">0</b></div></div><div id="v55RemotePlayers" class="v55-score-list">${ps.map(p=>`<div data-rp="${p.telegramId}"><span>${safe(p.displayName)}</span><b>${fmt(p.score)}</b></div>`).join('')}</div><div class="v55-pulse-wrap"><p id="v55PulseHint">Жди старта…</p><div class="v55-pulse"><span id="v55GreenZone"></span><i id="v55PulseNeedle"></i></div><button id="v55PulseBtn" disabled>ЖМИ В ЗЕЛЁНОМ</button><div id="v55LastPoints" class="v55-last-points"></div></div><div class="v55-note">Это кооператив: здесь нет проигравшего. Чем точнее играет вся команда, тем больше ₽ получает каждый.</div></div>`;
    c.querySelector('#v55PulseBtn').onclick=remoteAction;updateRemoteScores();animateRemote();
  }

  function currentStage(elapsedMs){return elapsedMs<12000?{id:1,name:'УРОВЕНЬ 1 · РЕАКЦИЯ',period:1700,green:.18}:elapsedMs<26000?{id:2,name:'УРОВЕНЬ 2 · ТУРБО',period:1350,green:.14}:{id:3,name:'УРОВЕНЬ 3 · ФИНАЛ',period:1050,green:.105}}
  function animateRemote(){
    cancelAnimationFrame(raf);
    const tick=()=>{
      if(!party||party.room.status!=='running')return;
      const now=Date.now(),start=new Date(party.room.startAt).getTime(),end=new Date(party.room.endsAt).getTime(),elapsed=now-start;
      const tm=document.getElementById('v55RemoteTime'),stageEl=document.getElementById('v55RemoteStage'),btn=document.getElementById('v55PulseBtn'),needle=document.getElementById('v55PulseNeedle'),zone=document.getElementById('v55GreenZone'),hint=document.getElementById('v55PulseHint');
      if(elapsed<0){if(tm)tm.textContent=Math.max(1,Math.ceil(-elapsed/1000));if(stageEl)stageEl.textContent='СТАРТ ЧЕРЕЗ';if(btn)btn.disabled=true;if(hint)hint.textContent='Приготовься…';raf=requestAnimationFrame(tick);return;}
      const st=currentStage(elapsed),me=party.participants.find(x=>x.telegramId===myId()),slot=me?.slot||1,offset=((Math.abs(Number(party.room.seed||0))%st.period)+slot*277),phase=((elapsed+offset)%st.period)/st.period;
      if(needle)needle.style.left=`${Math.max(0,Math.min(100,phase*100))}%`;
      if(zone){zone.style.left=`${50-st.green*100}%`;zone.style.width=`${st.green*200}%`;}
      if(stageEl)stageEl.textContent=st.name;if(tm)tm.textContent=`${Math.max(0,Math.ceil((end-now)/1000))} сек`;
      const hot=Math.abs(phase-.5)<=st.green;if(btn){btn.disabled=now>=end;btn.classList.toggle('hot',hot)}if(hint)hint.textContent=hot?'СЕЙЧАС!':'Лови зелёную область';
      raf=requestAnimationFrame(tick);
    };tick();
  }

  async function remoteAction(){
    if(Date.now()-lastRemoteAction<560)return;lastRemoteAction=Date.now();
    const btn=document.getElementById('v55PulseBtn');if(btn)btn.disabled=true;
    try{
      const d=await api('/api/v55/party/room/action',{method:'POST',body:JSON.stringify({roomId:party.room.id})});
      const box=document.getElementById('v55LastPoints');if(box){box.textContent=`+${d.action.points}${d.action.hit?' ✨':''}`;box.classList.remove('show');void box.offsetWidth;box.classList.add('show')}
      const me=party.participants.find(x=>x.telegramId===myId());if(me){me.score=Number(me.score||0)+Number(d.action.points||0);me.actions=Number(me.actions||0)+1;if(d.action.hit)me.hits=Number(me.hits||0)+1;}updateRemoteScores();
      try{tg?.HapticFeedback?.impactOccurred(d.action.hit?'medium':'light')}catch{}
    }catch(e){if(!String(e.message).includes('Слишком быстро'))toast(e.message)}finally{setTimeout(()=>{const b=document.getElementById('v55PulseBtn');if(b)b.disabled=false},560)}
  }

  function updateRemoteScores(){
    if(!party)return;let total=0;(party.participants||[]).forEach(p=>{total+=Number(p.score||0);const row=document.querySelector(`[data-rp="${p.telegramId}"] b`);if(row)row.textContent=fmt(p.score)});const el=document.getElementById('v55RemoteTotal');if(el)el.textContent=fmt(total);
  }

  function renderRemoteFinish(){
    stopPoll();cancelAnimationFrame(raf);const c=document.getElementById('v55PartyContent'),ps=party.participants||[],mine=ps.find(x=>x.telegramId===myId()),total=party.room.totalScore||ps.reduce((a,p)=>a+Number(p.score||0),0);
    c.innerHTML=`<div class="v55-finish"><div>🤝</div><span>КОМАНДНАЯ ИГРА ЗАВЕРШЕНА</span><h2>${fmt(total)} очков</h2><p>Награда начисляется каждому активному участнику отдельно.</p><div class="v55-results">${ps.map(p=>`<div><span>${safe(p.displayName)}</span><b>${fmt(p.score)} очк.</b><em>+${fmt(p.rewardCash)} ₽</em></div>`).join('')}</div><div class="v55-xp">Твоя награда: +${fmt(mine?.rewardCash||0)} ₽ · +${fmt(mine?.partyXpGain||0)} Party XP</div><button id="v55NewParty" class="v55-primary">Новая Party</button><button id="v55PartyHome">К выбору режима</button></div>`;
    c.querySelector('#v55NewParty').onclick=()=>createRoom(party.room.capacity);c.querySelector('#v55PartyHome').onclick=async()=>{await loadStats();renderHome()};
    if(!finishedHandled){finishedHandled=true;stats=party.stats||stats;renderMiniStats();refreshCore();}
  }

  function startPoll(){stopPoll();poll=setInterval(async()=>{if(!party?.room?.id||document.visibilityState==='hidden')return;try{const d=await api(`/api/v55/party/room/${party.room.id}`);party=d.party;renderParty()}catch{}},1450)}
  function stopPoll(){if(poll){clearInterval(poll);poll=null}}
  function stopAll(){stopPoll();cancelAnimationFrame(raf);if(localTicker){clearInterval(localTicker);localTicker=null}}
  async function refreshCore(){try{const d=await api('/api/state');if(d?.state&&typeof applyServerState==='function')applyServerState(d.state)}catch{}}

  const style=document.createElement('style');style.id='v55PartyStyle';style.textContent=`
  .v55-party-card{margin-top:14px}.v55-party-hero{display:flex;align-items:center;gap:12px;padding:16px;border:1px solid #284676;border-radius:20px;background:radial-gradient(circle at 15% 15%,#1e4f7a88,transparent 35%),linear-gradient(145deg,#101f39,#11172b)}.v55-party-logo{font-size:38px}.v55-party-copy{flex:1}.v55-party-copy>span,.v55-mode>span,.v55-room>span,.v55-finish>span,.v55-level-card span,.v55-remote-top span{font-size:9px;letter-spacing:1.3px;font-weight:900;color:#83a0c9}.v55-party-copy h2{margin:2px 0 4px}.v55-party-copy p{margin:0;color:#8fa1bd;font-size:12px}.v55-party-hero>button,.v55-sheet button{border:0;border-radius:13px;padding:11px 13px;background:#1a2b47;color:#f2f7ff;font-weight:900}.v55-party-hero>button{background:linear-gradient(135deg,#4f6fe9,#8e55db)}.v55-party-mini{display:flex;gap:6px;overflow:auto;margin-top:8px}.v55-party-mini span{white-space:nowrap;background:#101c30;border-radius:999px;padding:7px 10px;font-size:10px;color:#91a3bf}
  .v55-overlay{position:fixed;inset:0;z-index:12000}.v55-overlay.hidden{display:none}.v55-back{position:absolute;inset:0;background:#020711d9;backdrop-filter:blur(10px)}.v55-sheet{position:absolute;inset:2% 0 0;background:#07111e;border-radius:26px 26px 0 0;overflow:auto;padding:16px;box-shadow:0 -20px 80px #000a}.v55-sheet header{display:flex;align-items:center;justify-content:space-between;position:sticky;top:-16px;z-index:5;padding:12px 0;background:#07111ef2}.v55-sheet header span{font-size:9px;letter-spacing:1.4px;color:#7185a6;font-weight:900}.v55-sheet header h2{margin:3px 0}.v55-lock{overflow:hidden}.v55-level-card{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin:8px 0 14px}.v55-level-card>div{background:#0f1d31;border-radius:16px;padding:11px}.v55-level-card span{display:block}.v55-level-card b{display:block;font-size:18px;margin-top:4px}.v55-mode-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.v55-mode{padding:16px;border-radius:20px;border:1px solid #203653;background:#0d192b}.v55-mode.local{background:radial-gradient(circle at 90% 0,#5a49b744,transparent 35%),#0d192b}.v55-mode.remote{background:radial-gradient(circle at 90% 0,#168d7a44,transparent 35%),#0d192b}.v55-mode-icon{font-size:34px}.v55-mode h3{margin:4px 0}.v55-mode p{color:#8da0bc;min-height:58px}.v55-mode small{display:block;margin-top:9px;color:#71839f;line-height:1.35}.v55-mode-buttons{display:grid;grid-template-columns:1fr 1fr;gap:7px}.v55-mode-buttons button,.v55-primary{background:linear-gradient(135deg,#466de4,#8056d9)!important}.v55-join{display:flex;gap:7px;margin-top:8px}.v55-join input{min-width:0;flex:1;background:#081321;border:1px solid #263b59;color:white;border-radius:12px;padding:11px;font-size:16px;text-transform:uppercase}.v55-rules,.v55-note{margin-top:12px;padding:13px;border-radius:16px;background:#0b1728;color:#8395b0}.v55-rules{display:grid;gap:5px}.v55-rules b{color:#e8f0ff}.v55-countdown{text-align:center;padding:14vh 12px}.v55-countdown span{color:#8da0bd}.v55-countdown b{display:block;font-size:88px;line-height:1;margin:18px}.v55-countdown p{color:#798ba8}
  .v55-local-top,.v55-remote-top{display:flex;justify-content:space-between;align-items:center;padding:8px 4px 12px}.v55-local-top>div,.v55-remote-top>div{display:flex;gap:8px;align-items:center}.v55-local-top span,.v55-remote-top span{font-size:10px;color:#8499ba}.v55-local-top b,.v55-remote-top b{font-size:20px}.v55-local-top #v55TeamScore{display:flex;gap:6px}.v55-local-top #v55TeamScore span{background:#12223a;padding:7px 9px;border-radius:10px}.v55-pads{display:grid;gap:8px;height:min(62vh,560px)}.v55-pads.p2{grid-template-rows:1fr 1fr}.v55-pads.p4{grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr}.v55-pad{position:relative;display:flex!important;flex-direction:column;align-items:center;justify-content:center;touch-action:none;user-select:none;border:1px solid #263957!important;background:linear-gradient(145deg,#111f34,#0c1727)!important;overflow:hidden}.v55-pad:before{content:'';position:absolute;inset:0;background:#24ce8177;opacity:0;transition:.08s}.v55-pad.hot:before{opacity:1}.v55-pad.bad:before{background:#df3f5077;opacity:1}.v55-pad span,.v55-pad small{z-index:1;color:#91a4c1}.v55-pad b{z-index:1;font-size:42px}.v55-pad em{z-index:1;font-size:22px;font-style:normal;font-weight:900}.v55-pad.pop{transform:scale(.985)}.v55-local-tip{text-align:center;color:#8ea1bd;padding:10px}
  .v55-room{text-align:center;padding:16px;border-radius:20px;background:linear-gradient(145deg,#102a4d,#191b3d)}.v55-room h2{font-size:36px;letter-spacing:5px;margin:4px}.v55-room p{color:#96a8c4}.v55-room>div{display:flex;justify-content:center;gap:7px}.v55-players{margin-top:12px}.v55-player{display:flex;align-items:center;gap:9px;padding:11px;margin:6px 0;border-radius:14px;background:#0e1b2e}.v55-player i{width:8px;height:8px;border-radius:50%;background:#59677b}.v55-player i.on{background:#39d98a;box-shadow:0 0 10px #39d98a}.v55-player>div{flex:1}.v55-player small{display:block;color:#7588a6}.v55-player>span{font-size:10px;color:#8da0bc}.v55-player.empty{color:#63738e;border:1px dashed #2a405f;background:transparent}.v55-lobby-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}.v55-lobby-actions .ready{background:#177653}.v55-score-list{display:grid;gap:6px}.v55-score-list>div{display:flex;justify-content:space-between;padding:9px 11px;border-radius:12px;background:#0e1b2e}.v55-pulse-wrap{text-align:center;margin-top:18px}.v55-pulse-wrap p{color:#91a3bf}.v55-pulse{height:28px;border-radius:14px;background:#742f3b;position:relative;overflow:visible}.v55-pulse>span{position:absolute;top:0;height:100%;background:#28a86d;border-radius:12px;box-shadow:0 0 22px #28a86d88}.v55-pulse>i{position:absolute;top:-6px;width:5px;height:40px;background:white;transform:translateX(-2px);border-radius:4px;box-shadow:0 0 12px white}.v55-pulse-wrap>button{width:100%;height:78px;margin-top:18px;font-size:18px;background:linear-gradient(135deg,#d94a47,#f39a38)}.v55-pulse-wrap>button.hot{background:linear-gradient(135deg,#21a768,#48dc95)}.v55-last-points{height:28px;font-size:22px;font-weight:900;opacity:0}.v55-last-points.show{animation:v55pts .55s ease}@keyframes v55pts{0%{opacity:0;transform:translateY(8px)}30%{opacity:1}100%{opacity:0;transform:translateY(-8px)}}
  .v55-finish{text-align:center;padding:24px 8px}.v55-finish>div:first-child{font-size:58px}.v55-finish h2{font-size:30px;margin:7px}.v55-finish p{color:#8da0bc}.v55-xp{margin:12px 0;padding:11px;border-radius:13px;background:#13233b;color:#a7c1ff;font-weight:800}.v55-finish>button{width:100%;margin-top:7px}.v55-results{display:grid;gap:6px;text-align:left;margin:14px 0}.v55-results>div{display:grid;grid-template-columns:1fr auto auto;gap:8px;padding:10px;border-radius:12px;background:#0f1d31}.v55-results em{font-style:normal;color:#4edb93;font-weight:900}
  @media(max-width:700px){.v55-mode-grid{grid-template-columns:1fr}.v55-mode p{min-height:0}.v55-level-card{grid-template-columns:1fr 1fr}.v55-level-card>div:first-child{grid-column:1/-1}.v55-sheet{inset:1% 0 0}.v55-pads{height:58vh}.v55-pads.p4{gap:6px}.v55-pad b{font-size:34px}.v55-results>div{grid-template-columns:1fr auto}.v55-results em{grid-column:1/-1}}
  `;document.head.appendChild(style);

  const observer=new MutationObserver(()=>enforceVersion());observer.observe(document.documentElement,{subtree:true,childList:true,characterData:true});
  setTimeout(inject,350);setTimeout(inject,1200);enforceVersion();
})();
