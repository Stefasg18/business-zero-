(() => {
  function isMoneyAchievement(a){
    return String(a?.id||"").startsWith("profit_") || String(a?.id||"").startsWith("cash_");
  }

  renderReferral = function(){
    const count=document.getElementById("refCount");
    if(count)count.textContent=state.referralCount||0;
    const link=referralLink();
    const linkEl=document.getElementById("refLink");
    if(linkEl)linkEl.textContent=link||"Открой приложение внутри Telegram";
    const rewardEl=document.querySelector(".ref-stats div:nth-child(2) strong");
    if(rewardEl)rewardEl.textContent="5 000 ₽";
    const labelEl=document.querySelector(".ref-stats div:nth-child(1) span");
    if(labelEl)labelEl.textContent="Активных друзей";
    const text=document.querySelector(".ref-card > p");
    if(text)text.textContent="За активного приглашённого друга ты получаешь 5 000 игровых ₽. Награда начисляется, когда друг достигнет 5 уровня и сделает 10 сделок. Приглашённый получает +1 000 ₽ на старте.";
  };

  renderAchievements = function(){
    const el=document.getElementById("achievements");if(!el)return;
    const rows=Array.isArray(state.achievements)?state.achievements:[];
    if(!rows.length){el.innerHTML='<div class="info-card">Достижения появятся после загрузки профиля.</div>';return}
    const claimedCount=rows.filter(a=>a.claimed).length;
    el.innerHTML=`<div class="achievement-summary"><span>Получено</span><strong>${claimedCount} / ${rows.length}</strong></div>`+rows.map(a=>{
      const progress=Math.min(Number(a.progress||0),Number(a.target||1));
      const pct=Math.max(0,Math.min(100,Math.round(progress/Number(a.target||1)*100)));
      const label=isMoneyAchievement(a)?`${fmt(progress)} / ${fmt(a.target)} ₽`:`${fmt(progress)} / ${fmt(a.target)}`;
      const btn=a.claimed
        ?'<button class="claimed" disabled>✓ Награда получена</button>'
        :a.unlocked
          ?`<button class="ready" data-achievement="${a.id}">Забрать награду</button>`
          :'<button disabled>Ещё не выполнено</button>';
      return `<article class="achievement-card ${a.unlocked?"achievement-unlocked":""}">
        <div class="achievement-top"><div class="achievement-icon">${a.icon}</div><div class="achievement-main"><strong>${escapeHtml(a.title)}</strong><p>${escapeHtml(a.description)}</p></div></div>
        <div class="achievement-reward">Награда: ${fmt(a.rewardCash)} ₽ + ${fmt(a.rewardXp)} XP</div>
        <div class="achievement-progress"><span>Прогресс</span><strong>${label}</strong></div>
        <div class="achievement-bar"><span style="width:${pct}%"></span></div>${btn}
      </article>`;
    }).join("");
    el.querySelectorAll("[data-achievement]").forEach(b=>b.addEventListener("click",()=>claimAchievement(b.dataset.achievement)));
  };

  const style=document.createElement("style");
  style.textContent=`
    .achievement-summary{display:flex;align-items:center;justify-content:space-between;margin-bottom:9px;padding:11px 13px;border-radius:14px;background:linear-gradient(145deg,rgba(99,136,255,.10),rgba(139,108,255,.07));border:1px solid rgba(109,141,255,.15)}
    .achievement-summary span{font-size:10px;color:var(--muted)}.achievement-summary strong{font-size:13px;color:#c8d4ff}
    .achievement-unlocked{border-color:rgba(71,223,157,.20)!important;box-shadow:0 10px 28px rgba(71,223,157,.04),inset 0 1px 0 rgba(255,255,255,.025)!important}
  `;
  document.head.appendChild(style);

  document.title="Бизнес с нуля 3.3";
  const version=document.querySelector(".topbar .eyebrow");if(version)version.textContent="BUSINESS GAME · 3.3";
  try{render();}catch(e){console.error("Business Zero 3.3 UI",e)}
})();