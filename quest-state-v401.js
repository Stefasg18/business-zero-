(() => {
  const VERSION='4.0.1';

  function money(n){return Math.floor(Number(n)||0).toLocaleString('ru-RU');}

  renderQuests=function(){
    const el=document.getElementById('dailyQuests');
    if(!el)return;
    const quests=Array.isArray(state.quests)?state.quests:[];
    if(!quests.length){el.innerHTML='<div class="info-card">Задания загружаются...</div>';return;}

    const done=quests.filter(q=>q.claimed).length;
    el.innerHTML=quests.map(q=>{
      const target=Math.max(1,Number(q.target||1));
      const progress=Math.min(Number(q.progress||0),target);
      const pct=Math.max(0,Math.min(100,Math.round(progress/target*100)));
      const progressLabel=q.id==='profit'?`${money(progress)} / ${money(target)} ₽`:`${money(progress)} / ${money(target)}`;
      const claimed=Boolean(q.claimed);
      const complete=Boolean(q.complete)||progress>=target;
      const action=claimed
        ? '<button class="quest-btn quest-claimed-v401" disabled><span>✓</span> Награда получена</button>'
        : complete
          ? `<button class="quest-btn ready" data-claim-quest="${q.id}">Забрать +${money(q.rewardCash)} ₽</button>`
          : '<button class="quest-btn" disabled>Продолжай выполнять</button>';
      return `<article class="quest-card ${claimed?'quest-card-claimed-v401':''}">
        <div class="quest-top">
          <div class="quest-icon">${q.icon}</div>
          <div class="quest-main">
            <div class="quest-title">${escapeHtml(q.title)}</div>
            <div class="quest-reward">Награда: ${money(q.rewardCash)} ₽ + ${money(q.rewardXp)} XP</div>
          </div>
          ${claimed?'<div class="quest-check-v401">✓</div>':''}
        </div>
        <div class="quest-progress-text"><span>Прогресс</span><strong>${progressLabel}</strong></div>
        <div class="quest-bar ${claimed?'claimed-v401':''}"><span style="width:${pct}%"></span></div>
        <div class="quest-actions">${action}</div>
      </article>`;
    }).join('')+(done===quests.length?'<div class="quest-summary">✅ Все задания на сегодня выполнены. Новые появятся завтра.</div>':'');

    el.querySelectorAll('[data-claim-quest]').forEach(btn=>btn.addEventListener('click',()=>claimQuest(btn.dataset.claimQuest,btn)));
  };

  claimQuest=async function(id,button){
    if(!ONLINE_MODE)return;
    if(button){button.disabled=true;button.textContent='Получаем награду…';}
    try{
      const d=await api('/api/quest/claim',{method:'POST',body:JSON.stringify({questId:id})});
      if(d.state)applyServerState(d.state);
      notify?.('success');
      showToast(`✅ ${d.message||'Награда получена'}`);
    }catch(e){
      const text=String(e?.message||'');
      if(text.toLowerCase().includes('уже получена')){
        try{
          const fresh=await api('/api/state');
          if(fresh.state)applyServerState(fresh.state);
        }catch{}
        showToast('✓ Награда уже получена');
      }else{
        showToast(text||'Не удалось получить награду');
        renderQuests();
      }
    }
  };

  const style=document.createElement('style');
  style.id='questStateV401Styles';
  style.textContent=`
    .quest-card-claimed-v401{border-color:rgba(62,211,139,.22)!important;background:linear-gradient(145deg,rgba(26,49,64,.96),rgba(17,31,47,.98))!important}
    .quest-check-v401{width:30px;height:30px;display:grid;place-items:center;border-radius:50%;color:#68e2a6;background:rgba(55,205,138,.12);border:1px solid rgba(74,222,153,.28);font-weight:950;flex:0 0 auto}
    .quest-claimed-v401{background:rgba(42,179,117,.10)!important;color:#6fe0a8!important;border:1px solid rgba(74,222,153,.24)!important;opacity:1!important}
    .quest-claimed-v401 span{font-size:16px;margin-right:5px}
    .quest-bar.claimed-v401>span{background:linear-gradient(90deg,#43c98b,#62dfa7)!important}
  `;
  document.head.appendChild(style);

  const version=document.querySelector('.topbar .eyebrow');
  if(version)version.textContent=`BUSINESS GAME · ${VERSION}`;
  document.title=`Бизнес с нуля ${VERSION}`;
  try{renderQuests();}catch(e){console.error('quest v4.0.1',e);}
})();