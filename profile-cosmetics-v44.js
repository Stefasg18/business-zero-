(()=>{
  if(window.__BZ_PROFILE_COSMETICS_V44__)return;
  window.__BZ_PROFILE_COSMETICS_V44__=true;

  let cosmeticData={profile:null,catalog:[]};
  const TITLE_FALLBACK={
    title_novice:"Новичок",title_entrepreneur:"Предприниматель",title_businessman:"Бизнесмен",title_founder:"Основатель",
    title_developer:"Разработчик",title_investor:"Инвестор",title_ceo:"CEO",title_magnate:"Магнат",title_tycoon:"Бизнес-император"
  };
  const AVATAR_FALLBACK={avatar_lion:"🦁",avatar_shark:"🦈",avatar_wolf:"🐺",avatar_eagle:"🦅",avatar_rocket:"🚀",avatar_diamond:"💎"};

  const safe=s=>typeof escapeHtml==="function"?escapeHtml(s):String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  const mapCatalog=()=>new Map((cosmeticData.catalog||[]).map(x=>[x.id,x]));
  const currentProfile=()=>cosmeticData.profile||state?.profileCustomization||null;
  const titleText=id=>mapCatalog().get(id)?.visual_value||TITLE_FALLBACK[id]||"Новичок";
  const avatarText=(id,name)=>id==="avatar_initial"||!id?(String(name||"И").trim().charAt(0).toUpperCase()||"И"):(mapCatalog().get(id)?.visual_value||AVATAR_FALLBACK[id]||"👤");
  const glowSuffix=(id,prefix)=>String(id||"").startsWith(prefix)?String(id).slice(prefix.length):"none";

  function removeGlowClasses(el,prefix){
    if(!el)return;
    [...el.classList].filter(x=>x.startsWith(prefix)).forEach(x=>el.classList.remove(x));
  }

  function applyProfileVisuals(){
    const p=currentProfile();
    const u=typeof telegramUser==="function"?telegramUser():{};
    const name=p?.displayName||u?.first_name||"Игрок";
    const title=titleText(p?.titleId||"title_novice");
    const avatar=avatarText(p?.avatarId||"avatar_initial",name);

    ["playerName","profileName"].forEach(id=>{
      const el=document.getElementById(id);if(!el)return;
      el.textContent=name;
      removeGlowClasses(el,"bz-name-glow-");
      const g=glowSuffix(p?.nameGlowId,"name_glow_");
      if(g&&g!=="none")el.classList.add(`bz-name-glow-${g}`);
    });

    ["avatar","profileAvatar"].forEach(id=>{
      const el=document.getElementById(id);if(!el)return;
      el.textContent=avatar;
      el.classList.toggle("bz-avatar-emoji",(p?.avatarId||"avatar_initial")!=="avatar_initial");
      removeGlowClasses(el,"bz-avatar-glow-");
      const g=glowSuffix(p?.avatarGlowId,"avatar_glow_");
      if(g&&g!=="none")el.classList.add(`bz-avatar-glow-${g}`);
    });

    const heroTitle=document.querySelector(".hero-card .profile-text .muted");
    if(heroTitle){heroTitle.textContent=title;heroTitle.classList.add("bz-role-title");}
    const profileTitle=document.getElementById("profileRoleV44");
    if(profileTitle)profileTitle.textContent=title;
    renderCustomizer();
  }

  async function loadCosmetics(){
    if(!ONLINE_MODE)return;
    try{
      const d=await api("/api/cosmetics");
      cosmeticData={profile:d.profile||null,catalog:Array.isArray(d.catalog)?d.catalog:[]};
      if(cosmeticData.profile)state.profileCustomization=cosmeticData.profile;
      applyProfileVisuals();
    }catch(e){console.error("cosmetics load",e);}
  }
  window.loadCosmeticsV44=loadCosmetics;

  function groupHtml(category,title,field,icon){
    const p=currentProfile();if(!p)return"";
    const unlocked=new Set(p.unlocked||[]);
    const active=p[field];
    const rows=(cosmeticData.catalog||[]).filter(x=>x.category===category&&(Number(x.stars||0)===0||unlocked.has(x.id)));
    if(!rows.length)return"";
    return `<div class="bz-cos-group"><div class="bz-cos-group-title">${icon} ${title}</div><div class="bz-cos-choices">${rows.map(x=>{
      const preview=category==="avatar"?`<span class="bz-choice-preview">${x.visual_value==="initial"?"Aa":safe(x.visual_value)}</span>`:"";
      return `<button class="bz-cos-choice ${active===x.id?"active":""}" data-equip-cosmetic="${safe(x.id)}">${preview}<span>${safe(x.label)}</span>${active===x.id?"<b>✓</b>":""}</button>`;
    }).join("")}</div></div>`;
  }

  function renderCustomizer(){
    const card=document.querySelector("#tab-profile .profile-card");
    const p=currentProfile();
    if(!card||!p||!cosmeticData.catalog?.length)return;
    let panel=document.getElementById("cosmeticsPanelV44");
    if(!panel){panel=document.createElement("div");panel.id="cosmeticsPanelV44";panel.className="bz-cos-panel";const grid=card.querySelector(".profile-grid");grid?.insertAdjacentElement("afterend",panel);}

    panel.innerHTML=`
      <div class="bz-cos-head"><div><span>ПЕРСОНАЛИЗАЦИЯ</span><strong>Стиль профиля</strong></div><div class="bz-credit">✏️ ${Number(p.renameCredits||0)}</div></div>
      <div class="bz-current-role">Текущий титул: <strong id="profileRoleV44">${safe(titleText(p.titleId))}</strong></div>
      <div class="bz-rename-row">
        <input id="bzRenameInput" maxlength="20" placeholder="Новое игровое имя" value="${safe(p.displayName||"")}">
        <button id="bzRenameBtn" ${Number(p.renameCredits||0)<=0?"disabled":""}>${Number(p.renameCredits||0)>0?"Сменить имя":"Нет жетона"}</button>
      </div>
      ${Number(p.renameCredits||0)<=0?'<button id="bzGoStore" class="bz-go-store">⭐ Купить смену имени в магазине</button>':''}
      ${groupHtml("title","Титулы","titleId","🏷️")}
      ${groupHtml("avatar","Аватары","avatarId","👤")}
      ${groupHtml("name_glow","Подсветка имени","nameGlowId","✨")}
      ${groupHtml("avatar_glow","Аура аватара","avatarGlowId","💫")}
    `;

    panel.querySelectorAll("[data-equip-cosmetic]").forEach(btn=>btn.addEventListener("click",async()=>{
      btn.disabled=true;
      try{
        const d=await api("/api/cosmetics/equip",{method:"POST",body:JSON.stringify({cosmeticId:btn.dataset.equipCosmetic})});
        cosmeticData.profile=d.profile;state.profileCustomization=d.profile;notify?.("success");showToast("Оформление применено");applyProfileVisuals();
      }catch(e){showToast(e.message);btn.disabled=false;}
    }));

    document.getElementById("bzRenameBtn")?.addEventListener("click",async()=>{
      const input=document.getElementById("bzRenameInput");const name=String(input?.value||"").trim();if(!name)return showToast("Введите имя");
      const btn=document.getElementById("bzRenameBtn");btn.disabled=true;
      try{
        const d=await api("/api/cosmetics/rename",{method:"POST",body:JSON.stringify({name})});
        cosmeticData.profile=d.profile;state.profileCustomization=d.profile;notify?.("success");showToast("Имя изменено");applyProfileVisuals();
      }catch(e){showToast(e.message);btn.disabled=false;}
    });
    document.getElementById("bzGoStore")?.addEventListener("click",()=>typeof openStorePanel==="function"?openStorePanel():document.querySelector('.nav-btn[data-tab="store"]')?.click());
  }

  if(typeof applyServerState==="function"){
    const baseApply=applyServerState;
    applyServerState=function(s){
      if(s?.profileCustomization){state.profileCustomization=s.profileCustomization;cosmeticData.profile=s.profileCustomization;}
      const r=baseApply(s);applyProfileVisuals();return r;
    };
  }
  if(typeof renderPlayer==="function"){
    const basePlayer=renderPlayer;
    renderPlayer=function(){basePlayer();applyProfileVisuals();};
  }
  if(typeof renderStore==="function"){
    const baseStore=renderStore;
    renderStore=function(){
      baseStore();
      const products=state.store?.products||[];
      let firstCosmetic=null;
      products.forEach(p=>{
        if(!["cosmetic","title","avatar","glow"].includes(p.tier))return;
        const btn=document.querySelector(`[data-buy-product="${p.id}"]`);if(!btn)return;
        if(!firstCosmetic)firstCosmetic=btn.closest("article");
        if(p.owned){btn.disabled=true;btn.textContent="✓ Куплено";btn.classList.add("bz-owned");}
      });
      const grid=document.getElementById("storeProducts");
      if(grid&&firstCosmetic&&!grid.querySelector(".bz-cos-store-head")){
        const h=document.createElement("div");h.className="bz-cos-store-head";h.innerHTML='<span>СТАТУС И СТИЛЬ</span><strong>Оформление профиля</strong><small>Титулы, аватары и подсветки не влияют на баланс — только на внешний вид.</small>';grid.insertBefore(h,firstCosmetic);
      }
    };
  }
  if(typeof loadStore==="function"){
    const baseLoadStore=loadStore;
    loadStore=async function(){const r=await baseLoadStore();await loadCosmetics();return r;};
  }
  if(typeof rankRow==="function"){
    rankRow=function(place,p){
      const medal=place===1?"🥇":place===2?"🥈":place===3?"🥉":place;
      const name=p.display_name||p.first_name||"Игрок";
      const title=TITLE_FALLBACK[p.profile_title]||"Новичок";
      const av=p.avatar_style&&p.avatar_style!=="avatar_initial"?(AVATAR_FALLBACK[p.avatar_style]||"👤"):(String(name).trim().charAt(0).toUpperCase()||"И");
      const ng=glowSuffix(p.name_glow,"name_glow_");const ag=glowSuffix(p.avatar_glow,"avatar_glow_");
      return `<div class="rank-row"><div class="rank-place">${medal}</div><div class="bz-rank-avatar ${ag!=="none"?`bz-avatar-glow-${ag}`:""}">${safe(av)}</div><div class="rank-person"><strong class="${ng!=="none"?`bz-name-glow-${ng}`:""}">${safe(name)}</strong><span>${safe(title)} · LVL ${Number(p.level||1)}</span></div><div class="rank-money">${fmt(p.cash)} ₽</div></div>`;
    };
  }

  const style=document.createElement("style");
  style.textContent=`
    .bz-role-title{font-weight:800!important;color:#93a5c5!important;letter-spacing:.15px}
    .bz-avatar-emoji{font-size:23px!important}.big-avatar.bz-avatar-emoji{font-size:38px!important}
    .bz-name-glow-blue{color:#c8e7ff!important;text-shadow:0 0 5px #3aa7ff,0 0 14px rgba(58,167,255,.75)}
    .bz-name-glow-purple{color:#eadcff!important;text-shadow:0 0 5px #a855f7,0 0 15px rgba(168,85,247,.75)}
    .bz-name-glow-gold{color:#fff0b0!important;text-shadow:0 0 5px #ffbf3f,0 0 16px rgba(255,191,63,.72)}
    .bz-name-glow-neon{animation:bzNeonName 2.4s linear infinite;text-shadow:0 0 8px currentColor,0 0 18px currentColor}
    @keyframes bzNeonName{0%{color:#6ee7ff}33%{color:#c084fc}66%{color:#fb7185}100%{color:#6ee7ff}}
    .bz-avatar-glow-blue{box-shadow:0 0 0 2px rgba(80,170,255,.28),0 0 18px rgba(70,160,255,.75),inset 0 1px 0 rgba(255,255,255,.16)!important}
    .bz-avatar-glow-purple{box-shadow:0 0 0 2px rgba(168,85,247,.25),0 0 20px rgba(168,85,247,.78),inset 0 1px 0 rgba(255,255,255,.16)!important}
    .bz-avatar-glow-gold{box-shadow:0 0 0 2px rgba(255,191,63,.28),0 0 22px rgba(255,191,63,.78),inset 0 1px 0 rgba(255,255,255,.16)!important}
    .bz-avatar-glow-neon{animation:bzAvatarAura 2.5s linear infinite!important}
    @keyframes bzAvatarAura{0%{box-shadow:0 0 0 2px #67e8f9,0 0 19px #22d3ee}33%{box-shadow:0 0 0 2px #c084fc,0 0 22px #a855f7}66%{box-shadow:0 0 0 2px #fb7185,0 0 22px #f43f5e}100%{box-shadow:0 0 0 2px #67e8f9,0 0 19px #22d3ee}}
    .bz-cos-panel{margin-top:16px;padding:15px;border:1px solid rgba(120,145,200,.14);border-radius:20px;background:linear-gradient(145deg,rgba(104,126,210,.08),rgba(15,26,45,.62));text-align:left}
    .bz-cos-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:8px}.bz-cos-head div:first-child{display:flex;flex-direction:column}.bz-cos-head span{font-size:8px;letter-spacing:1.4px;color:#7184a6;font-weight:900}.bz-cos-head strong{font-size:16px}.bz-credit{padding:6px 9px;border-radius:10px;background:rgba(109,141,255,.10);border:1px solid rgba(109,141,255,.16);font-size:11px;font-weight:900}.bz-current-role{font-size:10px;color:#8190aa;margin-bottom:10px}.bz-current-role strong{color:#c8d5ec}
    .bz-rename-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:7px}.bz-rename-row input{min-width:0;border:1px solid rgba(140,160,200,.17);border-radius:12px;background:#0c1728;color:#eef5ff;padding:10px 11px;outline:none}.bz-rename-row input:focus{border-color:rgba(109,141,255,.55)}.bz-rename-row button,.bz-go-store{border:0;border-radius:12px;padding:9px 11px;font-size:10px;font-weight:900;color:white;background:linear-gradient(135deg,#6388ff,#806cff)}.bz-rename-row button:disabled{opacity:.45}.bz-go-store{width:100%;margin-top:7px;background:rgba(109,141,255,.10);border:1px solid rgba(109,141,255,.16);color:#b8c8ff}
    .bz-cos-group{margin-top:14px}.bz-cos-group-title{font-size:10px;font-weight:900;color:#a9b8d1;margin-bottom:7px}.bz-cos-choices{display:flex;gap:6px;overflow-x:auto;padding-bottom:2px;scrollbar-width:none}.bz-cos-choices::-webkit-scrollbar{display:none}.bz-cos-choice{flex:0 0 auto;display:flex;align-items:center;gap:6px;border:1px solid rgba(120,145,190,.13);border-radius:12px;background:rgba(255,255,255,.025);color:#aebbd0;padding:8px 9px;font-size:9px;font-weight:800}.bz-cos-choice.active{border-color:rgba(101,137,255,.52);background:rgba(101,137,255,.12);color:#eff4ff}.bz-cos-choice b{color:#6ee7b7}.bz-choice-preview{font-size:16px}
    .bz-cos-store-head{grid-column:1/-1;margin:16px 0 2px;padding:14px;border-radius:17px;border:1px solid rgba(109,141,255,.14);background:linear-gradient(145deg,rgba(67,95,170,.11),rgba(132,82,180,.07));display:flex;flex-direction:column}.bz-cos-store-head span{font-size:8px;font-weight:900;letter-spacing:1.5px;color:#8298c4}.bz-cos-store-head strong{font-size:18px;margin-top:2px}.bz-cos-store-head small{font-size:9px;color:#7c8ba4;margin-top:4px;line-height:1.4}.store-buy.bz-owned{background:rgba(58,200,130,.10)!important;color:#69dfa8!important;border:1px solid rgba(58,200,130,.16)!important;box-shadow:none!important}
    .bz-rank-avatar{width:32px;height:32px;flex:0 0 32px;border-radius:11px;display:grid;place-items:center;background:linear-gradient(145deg,#263755,#1a2840);font-size:17px;font-weight:900;color:#eaf1ff}
    @media(max-width:380px){.bz-rename-row{grid-template-columns:1fr}.bz-cos-panel{padding:12px}.bz-cos-choice{padding:7px 8px}}
  `;
  document.head.appendChild(style);

  document.title="Бизнес с нуля 4.4";
  const version=document.querySelector(".topbar .eyebrow");if(version)version.textContent="BUSINESS GAME · 4.4";

  setTimeout(loadCosmetics,350);
})();
