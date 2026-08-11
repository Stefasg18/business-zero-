(()=>{
  if(window.__BZ_PROFILE_POLISH_V453__)return;
  window.__BZ_PROFILE_POLISH_V453__=true;

  const style=document.createElement("style");
  style.textContent=`
    /* Business Zero 4.5.3 — premium profile personalization */
    #tab-profile .profile-card{
      overflow:visible!important;
    }

    #cosmeticsPanelV44{
      position:relative!important;
      margin-top:22px!important;
      padding:20px!important;
      border-radius:26px!important;
      border:1px solid rgba(116,137,220,.24)!important;
      background:
        radial-gradient(circle at 92% 0%,rgba(129,91,238,.18),transparent 34%),
        radial-gradient(circle at 0% 100%,rgba(52,144,220,.10),transparent 35%),
        linear-gradient(155deg,rgba(26,43,72,.98),rgba(15,29,50,.99))!important;
      box-shadow:
        0 18px 38px rgba(0,0,0,.20),
        inset 0 1px 0 rgba(255,255,255,.045)!important;
      text-align:left!important;
    }

    #cosmeticsPanelV44::before{
      content:"";
      position:absolute;
      left:20px;
      right:20px;
      top:72px;
      height:1px;
      background:linear-gradient(90deg,transparent,rgba(153,169,226,.16),transparent);
      pointer-events:none;
    }

    #cosmeticsPanelV44 .bz-cos-head{
      display:grid!important;
      grid-template-columns:minmax(0,1fr) auto!important;
      align-items:center!important;
      gap:14px!important;
      margin:0 0 20px!important;
      padding:0 1px 4px!important;
    }

    #cosmeticsPanelV44 .bz-cos-head>div:first-child{
      min-width:0!important;
    }

    #cosmeticsPanelV44 .bz-cos-head span{
      display:block!important;
      margin-bottom:4px!important;
      color:#8799bd!important;
      font-size:10px!important;
      line-height:1!important;
      font-weight:950!important;
      letter-spacing:1.8px!important;
    }

    #cosmeticsPanelV44 .bz-cos-head strong{
      display:block!important;
      color:#f7f9ff!important;
      font-size:25px!important;
      line-height:1.08!important;
      font-weight:950!important;
      letter-spacing:-.5px!important;
    }

    #cosmeticsPanelV44 .bz-credit{
      min-width:66px!important;
      height:48px!important;
      display:flex!important;
      align-items:center!important;
      justify-content:center!important;
      gap:6px!important;
      padding:0 12px!important;
      border-radius:16px!important;
      border:1px solid rgba(110,135,224,.28)!important;
      background:linear-gradient(145deg,rgba(86,112,199,.21),rgba(84,73,172,.20))!important;
      color:#f7f9ff!important;
      font-size:16px!important;
      font-weight:950!important;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.05)!important;
    }

    #cosmeticsPanelV44 .bz-current-role{
      display:flex!important;
      align-items:center!important;
      justify-content:space-between!important;
      gap:12px!important;
      margin:0 0 14px!important;
      padding:13px 14px!important;
      border-radius:16px!important;
      border:1px solid rgba(125,148,207,.12)!important;
      background:rgba(7,17,31,.34)!important;
      color:#8293af!important;
      font-size:12px!important;
      line-height:1.25!important;
    }

    #cosmeticsPanelV44 .bz-current-role strong{
      flex:0 0 auto!important;
      max-width:58%!important;
      padding:6px 10px!important;
      border-radius:999px!important;
      background:linear-gradient(135deg,rgba(97,127,227,.17),rgba(125,82,210,.16))!important;
      border:1px solid rgba(124,145,226,.18)!important;
      color:#dce6ff!important;
      font-size:12px!important;
      font-weight:950!important;
      text-align:right!important;
      overflow-wrap:anywhere!important;
    }

    #cosmeticsPanelV44 .bz-rename-row{
      display:grid!important;
      grid-template-columns:minmax(0,1fr) 132px!important;
      gap:9px!important;
      margin:0!important;
      padding:10px!important;
      border-radius:18px!important;
      border:1px solid rgba(122,145,210,.13)!important;
      background:rgba(7,16,30,.40)!important;
    }

    #cosmeticsPanelV44 .bz-rename-row input{
      width:100%!important;
      min-width:0!important;
      height:48px!important;
      padding:0 14px!important;
      border-radius:14px!important;
      border:1px solid rgba(128,150,211,.16)!important;
      outline:none!important;
      background:#0a1729!important;
      color:#f4f7ff!important;
      font-size:15px!important;
      font-weight:700!important;
      box-sizing:border-box!important;
    }

    #cosmeticsPanelV44 .bz-rename-row input::placeholder{color:#65748e!important}
    #cosmeticsPanelV44 .bz-rename-row input:focus{
      border-color:rgba(100,133,241,.58)!important;
      box-shadow:0 0 0 3px rgba(91,116,226,.10)!important;
    }

    #cosmeticsPanelV44 .bz-rename-row button{
      min-width:0!important;
      height:48px!important;
      padding:0 12px!important;
      border-radius:14px!important;
      border:1px solid rgba(123,137,229,.18)!important;
      background:linear-gradient(135deg,#5b7cf0,#7254d9)!important;
      color:white!important;
      font-size:12px!important;
      line-height:1.15!important;
      font-weight:950!important;
      box-shadow:0 8px 17px rgba(68,72,176,.18)!important;
    }

    #cosmeticsPanelV44 .bz-rename-row button:disabled{
      background:linear-gradient(145deg,#42558f,#51499a)!important;
      color:#9da8c1!important;
      box-shadow:none!important;
      opacity:.72!important;
    }

    #cosmeticsPanelV44 .bz-go-store{
      width:100%!important;
      min-height:50px!important;
      margin:10px 0 4px!important;
      padding:10px 14px!important;
      border-radius:15px!important;
      border:1px solid rgba(118,142,230,.23)!important;
      background:
        radial-gradient(circle at 15% 50%,rgba(114,153,255,.14),transparent 32%),
        linear-gradient(135deg,rgba(55,76,132,.82),rgba(70,61,139,.86))!important;
      color:#c8d5ff!important;
      font-size:13px!important;
      line-height:1.25!important;
      font-weight:950!important;
      letter-spacing:.05px!important;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.04)!important;
    }

    #cosmeticsPanelV44 .bz-cos-group{
      margin-top:18px!important;
      padding:14px!important;
      border-radius:18px!important;
      border:1px solid rgba(119,143,203,.11)!important;
      background:rgba(7,17,31,.28)!important;
    }

    #cosmeticsPanelV44 .bz-cos-group-title{
      display:flex!important;
      align-items:center!important;
      gap:7px!important;
      margin:0 0 11px!important;
      color:#dce5f8!important;
      font-size:14px!important;
      line-height:1.2!important;
      font-weight:950!important;
      letter-spacing:-.1px!important;
    }

    #cosmeticsPanelV44 .bz-cos-choices{
      display:grid!important;
      grid-template-columns:repeat(2,minmax(0,1fr))!important;
      gap:8px!important;
    }

    #cosmeticsPanelV44 .bz-cos-choice{
      width:100%!important;
      min-width:0!important;
      min-height:48px!important;
      display:flex!important;
      align-items:center!important;
      justify-content:flex-start!important;
      gap:8px!important;
      padding:9px 10px!important;
      border-radius:14px!important;
      border:1px solid rgba(119,142,203,.13)!important;
      background:linear-gradient(145deg,rgba(24,39,63,.92),rgba(13,27,46,.92))!important;
      color:#aebbd1!important;
      font-size:12px!important;
      line-height:1.18!important;
      font-weight:850!important;
      text-align:left!important;
      overflow:hidden!important;
    }

    #cosmeticsPanelV44 .bz-cos-choice>span:not(.bz-choice-preview){
      min-width:0!important;
      overflow:hidden!important;
      text-overflow:ellipsis!important;
      white-space:nowrap!important;
    }

    #cosmeticsPanelV44 .bz-cos-choice.active{
      border-color:rgba(105,132,240,.36)!important;
      background:radial-gradient(circle at 100% 0,rgba(118,80,222,.14),transparent 45%),linear-gradient(145deg,rgba(37,57,101,.97),rgba(29,37,80,.96))!important;
      color:#eef3ff!important;
      box-shadow:0 7px 17px rgba(39,55,128,.14),inset 0 1px 0 rgba(255,255,255,.04)!important;
    }

    #cosmeticsPanelV44 .bz-cos-choice b{
      margin-left:auto!important;
      color:#7ea0ff!important;
      font-size:13px!important;
    }

    #cosmeticsPanelV44 .bz-choice-preview{
      width:31px!important;
      height:31px!important;
      flex:0 0 31px!important;
      display:grid!important;
      place-items:center!important;
      border-radius:10px!important;
      background:rgba(105,129,207,.10)!important;
      border:1px solid rgba(124,145,215,.11)!important;
      font-size:18px!important;
    }

    @media(max-width:430px){
      #cosmeticsPanelV44{padding:17px!important;border-radius:23px!important;margin-top:18px!important}
      #cosmeticsPanelV44::before{left:17px;right:17px;top:67px}
      #cosmeticsPanelV44 .bz-cos-head{margin-bottom:18px!important}
      #cosmeticsPanelV44 .bz-cos-head strong{font-size:23px!important}
      #cosmeticsPanelV44 .bz-credit{height:45px!important;min-width:62px!important;font-size:15px!important}
      #cosmeticsPanelV44 .bz-current-role{font-size:11.5px!important;padding:12px!important}
      #cosmeticsPanelV44 .bz-current-role strong{font-size:11.5px!important;max-width:62%!important}
      #cosmeticsPanelV44 .bz-rename-row{grid-template-columns:minmax(0,1fr) 118px!important;padding:8px!important;gap:7px!important}
      #cosmeticsPanelV44 .bz-rename-row input{height:46px!important;font-size:14px!important;padding:0 12px!important}
      #cosmeticsPanelV44 .bz-rename-row button{height:46px!important;font-size:11px!important;padding:0 9px!important}
      #cosmeticsPanelV44 .bz-go-store{font-size:12px!important;min-height:48px!important}
      #cosmeticsPanelV44 .bz-cos-group{padding:12px!important;margin-top:14px!important}
      #cosmeticsPanelV44 .bz-cos-group-title{font-size:13.5px!important}
      #cosmeticsPanelV44 .bz-cos-choice{font-size:11.5px!important;min-height:46px!important;padding:8px 9px!important}
    }

    @media(max-width:365px){
      #cosmeticsPanelV44 .bz-rename-row{grid-template-columns:1fr!important}
      #cosmeticsPanelV44 .bz-rename-row button{width:100%!important}
      #cosmeticsPanelV44 .bz-cos-choices{grid-template-columns:1fr!important}
      #cosmeticsPanelV44 .bz-current-role{align-items:flex-start!important;flex-direction:column!important}
      #cosmeticsPanelV44 .bz-current-role strong{max-width:100%!important;text-align:left!important}
    }
  `;
  document.head.appendChild(style);

  document.title="Бизнес с нуля 4.5.3";
  const version=document.querySelector(".topbar .eyebrow");
  if(version)version.textContent="BUSINESS GAME · 4.5.3";
})();
