(() => {
  const style=document.createElement('style');
  style.id='mobileFix371';
  style.textContent=`
    /* 3.7.1 — reset legacy layout inside quick sheets */
    .q37-sheet{height:min(86dvh,820px);max-height:86dvh!important;display:flex;flex-direction:column}
    .q37-head{flex:0 0 70px}
    .q37-body{flex:1 1 auto;min-height:0;max-height:none!important;overflow-y:auto!important;overflow-x:hidden!important;padding:12px 12px calc(26px + env(safe-area-inset-bottom))!important}

    .q37-body>.q37-content-section{display:block!important;width:100%!important;max-width:none!important;margin:0!important;padding:0!important;background:transparent!important;border:0!important;box-shadow:none!important}
    .q37-body>.q37-content-section>.section-head{display:none!important}

    .q37-body #deals.deal-grid,
    .q37-body #deals,
    .q37-body #businesses.business-list,
    .q37-body #businesses{
      display:block!important;
      width:100%!important;
      max-width:none!important;
      min-width:0!important;
      grid-template-columns:none!important;
      grid-auto-columns:unset!important;
      grid-auto-flow:row!important;
      gap:0!important;
      margin:0!important;
      padding:0!important;
    }

    .q37-body .q37-filters{
      display:grid!important;
      grid-template-columns:repeat(3,minmax(0,1fr))!important;
      gap:7px!important;
      width:100%!important;
      height:auto!important;
      min-height:0!important;
      padding:2px 0 10px!important;
      margin:0!important;
      align-items:stretch!important;
      position:sticky!important;
      top:-1px!important;
      z-index:4!important;
      background:#091525!important;
    }
    .q37-body .q37-filters button{
      display:flex!important;
      align-items:center!important;
      justify-content:center!important;
      width:100%!important;
      min-width:0!important;
      height:38px!important;
      min-height:38px!important;
      max-height:38px!important;
      margin:0!important;
      padding:0 8px!important;
      border-radius:12px!important;
      line-height:1!important;
      white-space:nowrap!important;
      font-size:9px!important;
    }

    .q37-body .q37-deal-list,
    .q37-body .q37-business-list{
      display:flex!important;
      flex-direction:column!important;
      width:100%!important;
      min-width:0!important;
      gap:8px!important;
    }
    .q37-body .q37-deal,
    .q37-body .q37-business{
      display:grid!important;
      grid-template-columns:44px minmax(0,1fr) 68px!important;
      align-items:center!important;
      gap:9px!important;
      width:100%!important;
      min-width:0!important;
      min-height:72px!important;
      margin:0!important;
      padding:10px!important;
      box-sizing:border-box!important;
      border-radius:16px!important;
    }
    .q37-body .q37-icon{width:44px!important;height:44px!important;min-width:44px!important;font-size:21px!important;border-radius:12px!important}
    .q37-body .q37-main{width:auto!important;min-width:0!important;overflow:hidden!important}
    .q37-body .q37-main>div{display:flex!important;align-items:center!important;gap:5px!important;min-width:0!important}
    .q37-body .q37-main b{min-width:0!important;max-width:100%!important;font-size:11px!important;line-height:1.2!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
    .q37-body .q37-main span{flex:0 0 auto!important;font-size:6.5px!important}
    .q37-body .q37-main small{font-size:8px!important;line-height:1.35!important;white-space:normal!important}
    .q37-body .q37-main em{font-size:9px!important;line-height:1.3!important;white-space:normal!important}
    .q37-body .q37-deal>button,
    .q37-body .q37-business>button{
      width:68px!important;
      min-width:68px!important;
      max-width:68px!important;
      height:40px!important;
      min-height:40px!important;
      padding:0 5px!important;
      margin:0!important;
      border-radius:11px!important;
      font-size:9px!important;
      line-height:1!important;
    }

    @media(max-width:390px){
      .q37-sheet{height:88dvh;max-height:88dvh!important}
      .q37-body{padding-left:10px!important;padding-right:10px!important}
      .q37-body .q37-deal,.q37-body .q37-business{grid-template-columns:40px minmax(0,1fr) 62px!important;gap:7px!important;padding:9px!important}
      .q37-body .q37-icon{width:40px!important;height:40px!important;min-width:40px!important;font-size:19px!important}
      .q37-body .q37-deal>button,.q37-body .q37-business>button{width:62px!important;min-width:62px!important;max-width:62px!important;height:38px!important;min-height:38px!important;font-size:8.5px!important}
      .q37-body .q37-main b{font-size:10.5px!important}
      .q37-body .q37-main small{font-size:7.5px!important}
      .q37-body .q37-filters button{font-size:8.5px!important;padding:0 4px!important}
    }
  `;
  document.head.appendChild(style);

  function cleanupSheet(){
    const body=document.getElementById('q37Body');
    if(!body)return;
    const section=body.querySelector('.q37-content-section');
    if(section){
      const head=section.querySelector(':scope > .section-head');
      if(head)head.style.display='none';
    }
  }

  const shell=document.getElementById('quickSheet37');
  if(shell){
    new MutationObserver(cleanupSheet).observe(shell,{childList:true,subtree:true});
    cleanupSheet();
  }

  document.title='Бизнес с нуля 3.7.1';
  const version=document.querySelector('.topbar .eyebrow');
  if(version)version.textContent='BUSINESS GAME · 3.7.1';
})();
