(() => {
  const fmtN=n=>Math.floor(Number(n)||0).toLocaleString('ru-RU');
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let adminOpen=false,adminPlayers=[];

  function install(){
    if(!state?.admin)return;
    if(document.getElementById('adminPanelBtn'))return;
    const profile=document.querySelector('#tab-profile .profile-card');
    if(!profile)return;
    const btn=document.createElement('button');
    btn.id='adminPanelBtn';btn.className='admin-open-btn';btn.innerHTML='🛡️ Панель владельца';
    btn.onclick=openAdmin;profile.appendChild(btn);
    const modal=document.createElement('div');modal.id='adminPanel';modal.className='admin-shell hidden';
    modal.innerHTML=`<div class="admin-backdrop"></div><div class="admin-sheet"><div class="admin-head"><div><span>BUSINESS ZERO · SECURITY</span><h2>Панель владельца</h2></div><button id="adminClose">×</button></div><div id="adminBody"><div class="admin-loading">Загрузка…</div></div></div>`;
    document.body.appendChild(modal);
    modal.querySelector('.admin-backdrop').onclick=closeAdmin;modal.querySelector('#adminClose').onclick=closeAdmin;
  }
  async function openAdmin(){adminOpen=true;document.getElementById('adminPanel')?.classList.remove('hidden');await refreshAdmin();}
  function closeAdmin(){adminOpen=false;document.getElementById('adminPanel')?.classList.add('hidden');}
  async function refreshAdmin(){
    const body=document.getElementById('adminBody');if(!body)return;
    try{
      const [o,p,e]=await Promise.all([api('/api/admin/overview'),api('/api/admin/players'),api('/api/admin/events')]);
      adminPlayers=p.players||[];
      body.innerHTML=`<div class="admin-stats"><div><span>Игроков</span><strong>${fmtN(o.totalPlayers)}</strong></div><div><span>Под риском</span><strong>${fmtN(o.flagged)}</strong></div><div><span>Заблокировано</span><strong>${fmtN(o.blocked)}</strong></div><div><span>Событий</span><strong>${fmtN(o.events)}</strong></div></div>
      <div class="admin-toolbar"><input id="adminSearch" placeholder="Имя, @username или Telegram ID"><button id="adminRefresh">Обновить</button></div>
      <div class="admin-section-title">Игроки</div><div id="adminPlayers">${renderPlayers(adminPlayers)}</div>
      <div class="admin-section-title">Последние события безопасности</div><div class="admin-events">${(e.events||[]).slice(0,30).map(x=>`<div><b>${esc(x.event_type)}</b><span>ID ${esc(x.telegram_id||'—')} · риск ${esc(x.severity)} · ${new Date(x.created_at).toLocaleString('ru-RU')}</span></div>`).join('')||'<p>Подозрительных событий пока нет.</p>'}</div>`;
      document.getElementById('adminRefresh').onclick=refreshAdmin;
      document.getElementById('adminSearch').oninput=ev=>{const q=ev.target.value.toLowerCase().trim();const rows=adminPlayers.filter(x=>`${x.telegram_id} ${x.first_name||''} ${x.username||''}`.toLowerCase().includes(q));document.getElementById('adminPlayers').innerHTML=renderPlayers(rows);bindRows();};
      bindRows();
    }catch(err){body.innerHTML=`<div class="admin-error">${esc(err.message||'Ошибка загрузки')}</div>`;}
  }
  function renderPlayers(rows){return rows.map(p=>{const s=p.security||{},risk=Number(s.risk_score||0),blocked=Boolean(s.is_blocked);return `<article class="admin-player ${blocked?'blocked':''}"><div class="admin-player-main"><strong>${esc(p.first_name||'Игрок')} ${p.username?'@'+esc(p.username):''}</strong><span>ID ${p.telegram_id} · LVL ${fmtN(p.level)} · ${fmtN(p.cash)} ₽</span></div><div class="admin-risk risk-${risk>=50?'high':risk>=15?'mid':'low'}">Риск ${fmtN(risk)}</div><button data-block="${p.telegram_id}" data-state="${blocked?'1':'0'}">${blocked?'Разблокировать':'Заблокировать'}</button>${risk>0?`<button class="clear-risk" data-risk="${p.telegram_id}">Сбросить риск</button>`:''}</article>`}).join('')||'<div class="admin-empty">Игроки не найдены</div>';}
  function bindRows(){
    document.querySelectorAll('[data-block]').forEach(b=>b.onclick=async()=>{const id=Number(b.dataset.block),blocked=b.dataset.state==='1';let reason='';if(!blocked)reason=prompt('Причина блокировки:','Подозрительная активность')||'Проверка безопасности';try{await api('/api/admin/block',{method:'POST',body:JSON.stringify({telegramId:id,blocked:!blocked,reason})});await refreshAdmin();}catch(e){alert(e.message)}});
    document.querySelectorAll('[data-risk]').forEach(b=>b.onclick=async()=>{const id=Number(b.dataset.risk),p=adminPlayers.find(x=>Number(x.telegram_id)===id),risk=Number(p?.security?.risk_score||0);try{await api('/api/admin/risk',{method:'POST',body:JSON.stringify({telegramId:id,delta:-risk})});await refreshAdmin();}catch(e){alert(e.message)}});
  }

  const style=document.createElement('style');style.textContent=`
  .admin-open-btn{width:100%;margin-top:12px;padding:12px;border:1px solid rgba(105,139,255,.25);border-radius:14px;background:linear-gradient(135deg,rgba(75,105,200,.18),rgba(124,82,190,.13));color:#dbe5ff;font-weight:900}.admin-shell{position:fixed;inset:0;z-index:9999}.admin-shell.hidden{display:none}.admin-backdrop{position:absolute;inset:0;background:rgba(3,8,17,.78);backdrop-filter:blur(8px)}.admin-sheet{position:absolute;inset:4% 3% 3%;max-width:720px;margin:auto;background:#0c1626;border:1px solid rgba(150,170,220,.16);border-radius:24px;overflow:auto;box-shadow:0 30px 80px rgba(0,0,0,.45)}.admin-head{position:sticky;top:0;z-index:3;display:flex;justify-content:space-between;align-items:center;padding:18px;background:rgba(12,22,38,.95);backdrop-filter:blur(12px);border-bottom:1px solid rgba(255,255,255,.07)}.admin-head span{font-size:8px;letter-spacing:1.5px;color:#7890b5}.admin-head h2{margin:4px 0 0;font-size:21px}.admin-head button{width:38px;height:38px;border-radius:12px;border:1px solid rgba(255,255,255,.09);background:#142137;color:#fff;font-size:22px}#adminBody{padding:14px}.admin-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:7px}.admin-stats div{padding:11px 8px;border-radius:14px;background:#111f34;border:1px solid rgba(255,255,255,.06)}.admin-stats span{display:block;font-size:8px;color:#72829d}.admin-stats strong{font-size:18px}.admin-toolbar{display:flex;gap:8px;margin:14px 0}.admin-toolbar input{flex:1;min-width:0;padding:11px;border-radius:12px;border:1px solid rgba(255,255,255,.09);background:#0a1322;color:#fff}.admin-toolbar button,.admin-player button{padding:9px 10px;border:0;border-radius:10px;background:#385fae;color:#fff;font-weight:800}.admin-section-title{margin:18px 0 8px;color:#8295b7;font-size:10px;font-weight:900;letter-spacing:1px}.admin-player{display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:7px;align-items:center;padding:10px;margin-bottom:7px;border-radius:14px;background:#101d31;border:1px solid rgba(255,255,255,.06)}.admin-player.blocked{border-color:rgba(255,91,113,.28)}.admin-player-main strong,.admin-player-main span{display:block}.admin-player-main span{font-size:8px;color:#71819c;margin-top:3px}.admin-risk{font-size:9px;font-weight:900;padding:6px 8px;border-radius:999px}.risk-low{background:rgba(59,208,139,.10);color:#5ee1a4}.risk-mid{background:rgba(255,190,80,.12);color:#ffd070}.risk-high{background:rgba(255,80,105,.13);color:#ff8094}.admin-player .clear-risk{background:#283952}.admin-events div{padding:9px 0;border-bottom:1px solid rgba(255,255,255,.05)}.admin-events b,.admin-events span{display:block}.admin-events span{font-size:8px;color:#75859e;margin-top:2px}.admin-error{padding:18px;color:#ff8a9d}.admin-empty{padding:14px;color:#75859e}@media(max-width:520px){.admin-stats{grid-template-columns:repeat(2,1fr)}.admin-player{grid-template-columns:1fr auto}.admin-player button{font-size:8px}.admin-risk{grid-column:2}.admin-player .clear-risk{grid-column:1/-1}}
  `;document.head.appendChild(style);
  const oldRender=render;render=function(){oldRender();setTimeout(install,0)};
  document.title='Бизнес с нуля 3.4';const v=document.querySelector('.topbar .eyebrow');if(v)v.textContent='BUSINESS GAME · 3.4';
  setTimeout(()=>{try{render()}catch(e){console.error(e)}},50);
})();