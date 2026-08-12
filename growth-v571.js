(()=>{
  if(window.__BZ_GROWTH_V571__)return;
  window.__BZ_GROWTH_V571__=true;

  const tg=window.Telegram?.WebApp;
  const BOT=window.BZ_CONFIG?.BOT_USERNAME||'BusinessZeroGameBot';
  const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const num=n=>Math.max(0,Math.floor(Number(n)||0)).toLocaleString('ru-RU');
  const toast=t=>{try{showToast(t)}catch{console.log(t)}};
  const haptic=()=>{try{tg?.HapticFeedback?.selectionChanged?.()}catch{}};
  let statsLoaded=false,lastKnownLevel=null,promptShown=false;

  function userId(){return Number(tg?.initDataUnsafe?.user?.id||0)}
  function referralUrl(){
    try{if(typeof referralLink==='function')return referralLink();}catch{}
    const id=userId();return id?`https://t.me/${BOT}?startapp=ref_${id}`:`https://t.me/${BOT}`;
  }
  function campaignUrl(source){
    const slug=String(source||'campaign').toLowerCase().replace(/[^a-z0-9_-]/g,'').slice(0,40)||'campaign';
    return `https://t.me/${BOT}?startapp=src_${slug}`;
  }
  function shareText(){
    const cash=num(state?.cash||0),level=num(state?.level||1);
    return `Я уже дошёл до ${level} уровня и собрал ${cash} ₽ капитала в «Бизнес с нуля». Сможешь обогнать меня?`;
  }
  async function copy(text,label='Ссылка скопирована'){
    try{await navigator.clipboard.writeText(text);toast(label);haptic();return true}catch{}
    try{
      const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();toast(label);haptic();return true;
    }catch{return false}
  }
  async function shareResult(){
    const url=referralUrl(),text=shareText();
    try{
      if(navigator.share){await navigator.share({title:'Бизнес с нуля',text,url});haptic();return;}
    }catch(e){if(e?.name==='AbortError')return;}
    const share=`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    try{if(tg?.openTelegramLink)tg.openTelegramLink(share);else window.open(share,'_blank');haptic();}
    catch{await copy(`${text}\n${url}`,'Текст и ссылка скопированы')}
  }

  function makeResultCard(){
    const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1350;const c=canvas.getContext('2d');
    const g=c.createLinearGradient(0,0,0,1350);g.addColorStop(0,'#121f38');g.addColorStop(1,'#07111f');c.fillStyle=g;c.fillRect(0,0,1080,1350);
    const glow=c.createRadialGradient(860,180,0,860,180,420);glow.addColorStop(0,'rgba(112,92,255,.32)');glow.addColorStop(1,'rgba(112,92,255,0)');c.fillStyle=glow;c.fillRect(0,0,1080,620);
    c.fillStyle='#8193b5';c.font='700 28px system-ui';c.fillText('BUSINESS GAME',72,105);
    c.fillStyle='#ffffff';c.font='800 70px system-ui';c.fillText('Бизнес с нуля',72,205);
    c.fillStyle='#8fa1bf';c.font='500 30px system-ui';c.fillText('Мой результат',72,300);
    c.fillStyle='#72e2ad';c.font='800 106px system-ui';c.fillText(`${num(state?.cash||0)} ₽`,72,440);
    c.fillStyle='#aebbe0';c.font='700 44px system-ui';c.fillText(`Уровень ${num(state?.level||1)}`,72,535);
    c.fillStyle='rgba(255,255,255,.06)';c.beginPath();c.roundRect(72,640,936,350,42);c.fill();
    c.fillStyle='#8fa1bf';c.font='600 30px system-ui';c.fillText('В игре:',112,715);
    c.fillStyle='#fff';c.font='700 39px system-ui';c.fillText('сделки • бизнесы • XP',112,795);c.fillText('рейтинги • друзья • мини-игры',112,860);
    c.fillStyle='#899bb8';c.font='500 26px system-ui';c.fillText('Сможешь обогнать мой результат?',112,940);
    c.fillStyle='#ffffff';c.font='800 38px system-ui';c.fillText(`@${BOT}`,72,1195);
    c.fillStyle='#7587a6';c.font='500 24px system-ui';c.fillText('Играй в Telegram',72,1245);
    return canvas;
  }
  async function shareCard(){
    const canvas=makeResultCard();
    const blob=await new Promise(r=>canvas.toBlob(r,'image/png',0.94));
    if(blob){
      const file=new File([blob],'business-zero-result.png',{type:'image/png'});
      try{
        if(navigator.canShare?.({files:[file]})&&navigator.share){
          await navigator.share({files:[file],text:shareText(),url:referralUrl(),title:'Бизнес с нуля'});haptic();return;
        }
      }catch(e){if(e?.name==='AbortError')return;}
    }
    await shareResult();
  }

  function injectShare(){
    if(document.getElementById('growthShareV571'))return;
    const profile=document.getElementById('tab-profile');if(!profile)return;
    const first=profile.querySelector('.first-section');
    const sec=document.createElement('section');sec.id='growthShareV571';sec.className='section growth571-share';
    sec.innerHTML=`<div class="section-head"><div><div class="eyebrow">ПОДЕЛИТЬСЯ</div><h2>Покажи свой прогресс</h2></div><span class="growth571-hot">🔥 Вирусный бонус</span></div>
      <div class="growth571-card"><div class="growth571-copy"><div class="growth571-icon">📣</div><div><strong>Брось вызов друзьям</strong><p>Поделись капиталом и уровнем. В ссылке уже будет твоё приглашение.</p></div></div>
      <div class="growth571-metrics"><div><span>Капитал</span><b id="growth571Cash">${num(state?.cash||0)} ₽</b></div><div><span>Уровень</span><b id="growth571Level">LVL ${num(state?.level||1)}</b></div></div>
      <div class="growth571-actions"><button id="growth571Share">📤 Поделиться результатом</button><button id="growth571Card">🖼 Карточка результата</button><button id="growth571Copy">🔗 Скопировать ссылку</button></div></div>`;
    if(first)first.insertAdjacentElement('afterend',sec);else profile.prepend(sec);
    sec.querySelector('#growth571Share').onclick=shareResult;
    sec.querySelector('#growth571Card').onclick=shareCard;
    sec.querySelector('#growth571Copy').onclick=()=>copy(referralUrl());
  }
  function refreshShare(){
    const cash=document.getElementById('growth571Cash'),level=document.getElementById('growth571Level');
    if(cash)cash.textContent=`${num(state?.cash||0)} ₽`;if(level)level.textContent=`LVL ${num(state?.level||1)}`;
  }

  async function loadGrowthStats(){
    const box=document.getElementById('growth571AdminStats');if(!box||statsLoaded)return;
    try{
      const d=await api('/api/v58/growth/stats');const s=d?.stats||{};statsLoaded=true;
      const rows=(s.sources||[]).slice(0,8);
      box.innerHTML=`<div class="growth571-statgrid"><div><span>Отслежено</span><b>${num(s.totalUsers)}</b></div><div><span>Запусков</span><b>${num(s.totalLaunches)}</b></div><div><span>За 7 дней</span><b>${num(s.new7d)}</b></div><div><span>По меткам</span><b>${num(s.attributedUsers)}</b></div></div><div class="growth571-source-list">${rows.map(r=>`<div><strong>${safe(r.source)}</strong><span>${num(r.users)} игроков · ${num(r.launches)} запусков</span></div>`).join('')||'<p>Пока нет переходов по рекламным ссылкам.</p>'}</div>`;
    }catch(e){box.innerHTML='<div class="growth571-muted">Статистика появится после первых переходов.</div>';}
  }
  function injectAdminGrowth(){
    if(!state?.admin||document.getElementById('growthAdminV571'))return;
    const profile=document.getElementById('tab-profile');if(!profile)return;
    const sec=document.createElement('section');sec.id='growthAdminV571';sec.className='section growth571-admin';
    sec.innerHTML=`<div class="section-head"><div><div class="eyebrow">ПРИВЛЕЧЕНИЕ</div><h2>Ссылки и источники</h2></div><button id="growth571Refresh" class="small-btn">Обновить</button></div>
      <div class="growth571-admin-card"><p>Для каждого канала используй свою ссылку. Тогда увидишь, откуда реально приходят игроки.</p>
      <div class="growth571-channels"><button data-growth-source="tiktok">TikTok</button><button data-growth-source="shorts">YouTube Shorts</button><button data-growth-source="vk">VK Клипы</button><button data-growth-source="telegram">Telegram</button></div>
      <div class="growth571-custom"><input id="growth571Custom" maxlength="32" placeholder="blogger_ivan"><button id="growth571CustomBtn">Скопировать</button></div>
      <div id="growth571AdminStats"><div class="growth571-muted">Загрузка статистики…</div></div></div>`;
    profile.appendChild(sec);
    sec.querySelectorAll('[data-growth-source]').forEach(b=>b.onclick=()=>copy(campaignUrl(b.dataset.growthSource),`Ссылка ${b.textContent} скопирована`));
    sec.querySelector('#growth571CustomBtn').onclick=()=>{const v=sec.querySelector('#growth571Custom').value.trim();if(!v)return toast('Введи название источника');copy(campaignUrl(v),'Персональная ссылка скопирована')};
    sec.querySelector('#growth571Refresh').onclick=()=>{statsLoaded=false;document.getElementById('growth571AdminStats').innerHTML='<div class="growth571-muted">Обновляю…</div>';loadGrowthStats()};
    loadGrowthStats();
  }

  function milestoneFor(level){return [5,10,25,50,100,150,200,250].filter(x=>level>=x).pop()||0}
  function ensureMilestoneBaseline(){
    const key='bz_growth_level_v571';const current=Number(state?.level||1);const saved=Number(localStorage.getItem(key)||0);
    if(!saved){localStorage.setItem(key,String(current));lastKnownLevel=current;return;}
    lastKnownLevel=saved;
  }
  function checkMilestone(){
    if(promptShown||!state)return;
    if(lastKnownLevel===null)ensureMilestoneBaseline();
    const current=Number(state.level||1);if(current<=Number(lastKnownLevel||0))return;
    const before=milestoneFor(Number(lastKnownLevel||0)),after=milestoneFor(current);lastKnownLevel=current;localStorage.setItem('bz_growth_level_v571',String(current));
    if(after<=before)return;
    promptShown=true;showMilestone(after);
  }
  function showMilestone(level){
    let root=document.getElementById('growth571Milestone');if(!root){root=document.createElement('div');root.id='growth571Milestone';root.className='growth571-modal hidden';document.body.appendChild(root)}
    root.innerHTML=`<div class="growth571-backdrop" data-growth-close></div><div class="growth571-sheet"><div class="growth571-trophy">🏆</div><span>НОВЫЙ РЕЗУЛЬТАТ</span><h3>${level} уровень!</h3><p>Хороший момент бросить друзьям вызов и привести новых игроков.</p><button id="growth571MilestoneShare">📤 Поделиться достижением</button><button class="growth571-later" data-growth-close>Позже</button></div>`;
    root.classList.remove('hidden');root.querySelectorAll('[data-growth-close]').forEach(x=>x.onclick=()=>root.classList.add('hidden'));root.querySelector('#growth571MilestoneShare').onclick=async()=>{root.classList.add('hidden');await shareResult()};
  }

  function install(){injectShare();injectAdminGrowth();refreshShare();checkMilestone()}
  const oldRender=typeof render==='function'?render:null;
  if(oldRender){render=function(){const r=oldRender.apply(this,arguments);setTimeout(install,0);return r;}}
  document.addEventListener('click',e=>{if(e.target.closest?.('[data-tab="profile"]'))setTimeout(()=>{install();loadGrowthStats()},80)});
  setInterval(()=>{try{refreshShare();checkMilestone()}catch{}},2500);

  const style=document.createElement('style');style.id='growth571Style';style.textContent=`
    .growth571-hot{padding:6px 9px;border-radius:999px;background:rgba(77,206,145,.10);border:1px solid rgba(77,206,145,.16);color:#87e1b7;font-size:9px;font-weight:900}.growth571-card,.growth571-admin-card{padding:14px;border-radius:22px;border:1px solid rgba(126,149,215,.14);background:radial-gradient(circle at 100% 0,rgba(113,83,226,.12),transparent 35%),linear-gradient(145deg,#14243c,#0d1a2c)}.growth571-copy{display:flex;gap:11px;align-items:center}.growth571-icon{width:48px;height:48px;display:grid;place-items:center;flex:0 0 auto;border-radius:15px;background:rgba(100,126,239,.13);font-size:23px}.growth571-copy strong{font-size:16px}.growth571-copy p,.growth571-admin-card>p{margin:4px 0 0;color:#8293af;font-size:10px;line-height:1.45}.growth571-metrics{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}.growth571-metrics>div{padding:11px;border-radius:14px;background:rgba(4,11,21,.30);border:1px solid rgba(255,255,255,.055)}.growth571-metrics span{display:block;color:#7486a4;font-size:9px}.growth571-metrics b{display:block;margin-top:4px;font-size:16px}.growth571-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:11px}.growth571-actions button,.growth571-channels button,.growth571-custom button{min-height:42px;border:0;border-radius:12px;background:#315ca8;color:#fff;font-size:10px;font-weight:900}.growth571-actions button:first-child{grid-column:1/-1;background:linear-gradient(135deg,#537df1,#7759df)}.growth571-actions button:last-child{background:#1a2a43}.growth571-admin-card>p{margin:0 0 11px}.growth571-channels{display:grid;grid-template-columns:1fr 1fr;gap:7px}.growth571-channels button{background:#192d4b}.growth571-custom{display:flex;gap:7px;margin-top:8px}.growth571-custom input{flex:1;min-width:0;padding:11px;border:1px solid rgba(255,255,255,.08);border-radius:12px;background:#091421;color:#fff}.growth571-custom button{padding:0 13px}.growth571-statgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:12px}.growth571-statgrid>div{padding:9px 7px;border-radius:12px;background:rgba(4,11,21,.31)}.growth571-statgrid span{display:block;color:#7284a3;font-size:8px}.growth571-statgrid b{display:block;margin-top:3px;font-size:15px}.growth571-source-list{margin-top:9px}.growth571-source-list>div{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 2px;border-bottom:1px solid rgba(255,255,255,.05)}.growth571-source-list strong{font-size:10px}.growth571-source-list span,.growth571-source-list p,.growth571-muted{color:#7587a5;font-size:9px}.growth571-modal{position:fixed;inset:0;z-index:13000;display:grid;align-items:end}.growth571-modal.hidden{display:none}.growth571-backdrop{position:absolute;inset:0;background:rgba(2,7,16,.76);backdrop-filter:blur(8px)}.growth571-sheet{position:relative;padding:20px 18px calc(20px + env(safe-area-inset-bottom));border-radius:26px 26px 0 0;background:linear-gradient(180deg,#172740,#0e1a2c);border:1px solid rgba(126,149,215,.15);text-align:center}.growth571-trophy{font-size:48px}.growth571-sheet>span{display:block;color:#8296ba;font-size:9px;letter-spacing:1.4px;font-weight:900}.growth571-sheet h3{margin:5px 0;font-size:28px}.growth571-sheet p{max-width:420px;margin:0 auto 14px;color:#8fa0ba;font-size:11px;line-height:1.5}.growth571-sheet button{width:100%;padding:13px;border:0;border-radius:13px;background:linear-gradient(135deg,#527cf0,#7658df);color:#fff;font-weight:900}.growth571-sheet .growth571-later{margin-top:7px;background:#17263d;color:#94a5c0}@media(max-width:430px){.growth571-statgrid{grid-template-columns:1fr 1fr}.growth571-actions{grid-template-columns:1fr}.growth571-actions button:first-child{grid-column:auto}}
  `;document.head.appendChild(style);
  setTimeout(install,120);
})();
