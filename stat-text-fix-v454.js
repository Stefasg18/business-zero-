(()=>{
  if(window.__BZ_STAT_TEXT_FIX_V454__) return;
  window.__BZ_STAT_TEXT_FIX_V454__=true;

  const style=document.createElement("style");
  style.textContent=`
    /* Business Zero 4.5.4 — полные подписи в Доход / Энергия / Опыт */
    .premium-stats{
      align-items:stretch!important;
    }

    .premium-stats .stat{
      min-height:128px!important;
      height:auto!important;
      padding:11px 9px 12px!important;
    }

    .premium-stats .stat-copy{
      width:100%!important;
      min-width:0!important;
      overflow:visible!important;
    }

    .premium-stats .stat .stat-label{
      white-space:normal!important;
      overflow:visible!important;
      text-overflow:clip!important;
      line-height:1.2!important;
      min-height:10px!important;
    }

    .premium-stats .stat .stat-caption{
      display:block!important;
      white-space:normal!important;
      overflow:visible!important;
      text-overflow:clip!important;
      overflow-wrap:break-word!important;
      word-break:normal!important;
      line-height:1.28!important;
      font-size:7.7px!important;
      min-height:29px!important;
      margin-top:6px!important;
      color:#71829d!important;
    }

    .premium-stats .stat .stat-value{
      white-space:nowrap!important;
      overflow:visible!important;
    }

    @media(max-width:430px){
      .premium-stats .stat{
        min-height:126px!important;
        padding:10px 8px 11px!important;
      }
      .premium-stats .stat .stat-caption{
        display:block!important;
        font-size:7.2px!important;
        line-height:1.24!important;
        min-height:27px!important;
      }
    }

    @media(max-width:380px){
      .premium-stats .stat{
        min-height:124px!important;
      }
      .premium-stats .stat .stat-caption{
        display:block!important;
        font-size:6.8px!important;
        line-height:1.22!important;
        min-height:25px!important;
      }
    }
  `;
  document.head.appendChild(style);

  document.title="Бизнес с нуля 4.5.4";
  const version=document.querySelector(".topbar .eyebrow");
  if(version) version.textContent="BUSINESS GAME · 4.5.4";
})();
