(()=>{
  if(window.__BZ_TITLE_PREVIEW_FIX_V451__) return;
  window.__BZ_TITLE_PREVIEW_FIX_V451__=true;

  const style=document.createElement("style");
  style.textContent=`
    /* Business Zero 4.5.1 — аккуратные длинные титулы */
    .v45-cos-card:has(.v45-preview.title){
      grid-template-columns:82px minmax(0,1fr) 104px!important;
    }

    .v45-preview.title{
      width:74px!important;
      min-width:74px!important;
      height:62px!important;
      padding:7px 5px!important;
      display:flex!important;
      align-items:center!important;
      justify-content:center!important;
      text-align:center!important;
      white-space:normal!important;
      overflow:hidden!important;
      overflow-wrap:anywhere!important;
      word-break:normal!important;
      hyphens:auto!important;
      font-size:8.2px!important;
      line-height:1.12!important;
      letter-spacing:-.18px!important;
      font-weight:950!important;
      box-sizing:border-box!important;
    }

    .v45-cos-card:has(.v45-preview.title) .v45-cos-main{
      min-width:0!important;
    }

    .v45-cos-card:has(.v45-preview.title) .v45-title-line strong{
      overflow-wrap:anywhere!important;
      word-break:normal!important;
      line-height:1.18!important;
    }

    /* Отдельно самые длинные русские названия */
    .v45-preview.title{
      text-wrap:balance;
    }

    @media(max-width:430px){
      .v45-cos-card:has(.v45-preview.title){
        grid-template-columns:64px minmax(0,1fr) 88px!important;
        gap:8px!important;
      }
      .v45-preview.title{
        width:60px!important;
        min-width:60px!important;
        height:52px!important;
        padding:5px 3px!important;
        font-size:6.9px!important;
        line-height:1.08!important;
        letter-spacing:-.28px!important;
      }
    }

    @media(max-width:355px){
      .v45-cos-card:has(.v45-preview.title){
        grid-template-columns:58px minmax(0,1fr)!important;
      }
      .v45-preview.title{
        width:54px!important;
        min-width:54px!important;
        height:50px!important;
        font-size:6.3px!important;
      }
      .v45-cos-card:has(.v45-preview.title) .v45-actions{
        grid-column:2!important;
      }
    }
  `;
  document.head.appendChild(style);

  document.title="Бизнес с нуля 4.5.1";
  const version=document.querySelector(".topbar .eyebrow");
  if(version) version.textContent="BUSINESS GAME · 4.5.1";
})();
