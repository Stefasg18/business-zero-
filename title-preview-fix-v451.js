(()=>{
  if(window.__BZ_TITLE_PREVIEW_FIX_V452__) return;
  window.__BZ_TITLE_PREVIEW_FIX_V452__=true;

  function removeTextPreviews(){
    document.querySelectorAll('.v45-cos-card .v45-preview.title').forEach(preview=>{
      const card=preview.closest('.v45-cos-card');
      const wrap=preview.closest('.v45-preview-wrap');
      if(card) card.classList.add('v452-title-clean');
      if(wrap) wrap.remove();
    });
  }

  if(typeof renderStore==='function'){
    const baseRenderStore=renderStore;
    renderStore=function(){
      const result=baseRenderStore();
      removeTextPreviews();
      return result;
    };
  }

  const style=document.createElement('style');
  style.textContent=`
    /* Business Zero 4.5.2 — у титулов убраны бессмысленные левые плашки с повтором названия */
    .v45-cos-card.v452-title-clean{
      grid-template-columns:minmax(0,1fr) 104px!important;
      gap:14px!important;
      padding-left:16px!important;
    }

    .v45-cos-card.v452-title-clean .v45-cos-main{
      min-width:0!important;
      padding-left:0!important;
    }

    .v45-cos-card.v452-title-clean .v45-title-line{
      align-items:center!important;
      gap:7px!important;
    }

    .v45-cos-card.v452-title-clean .v45-title-line strong{
      font-size:15px!important;
      line-height:1.22!important;
      overflow-wrap:anywhere!important;
      word-break:normal!important;
    }

    .v45-cos-card.v452-title-clean .v45-cos-main p{
      font-size:10.5px!important;
      line-height:1.42!important;
      margin-top:6px!important;
    }

    .v45-cos-card.v452-title-clean .v45-actions{
      align-self:center!important;
    }

    @media(max-width:430px){
      .v45-cos-card.v452-title-clean{
        grid-template-columns:minmax(0,1fr) 88px!important;
        gap:10px!important;
        padding:12px!important;
      }
      .v45-cos-card.v452-title-clean .v45-title-line strong{
        font-size:13px!important;
      }
      .v45-cos-card.v452-title-clean .v45-cos-main p{
        font-size:9.5px!important;
      }
    }

    @media(max-width:355px){
      .v45-cos-card.v452-title-clean{
        grid-template-columns:minmax(0,1fr)!important;
      }
      .v45-cos-card.v452-title-clean .v45-actions{
        grid-column:1!important;
        display:grid!important;
        grid-template-columns:72px minmax(0,1fr)!important;
        align-items:center!important;
        max-width:190px!important;
      }
    }
  `;
  document.head.appendChild(style);

  removeTextPreviews();

  document.title='Бизнес с нуля 4.5.2';
  const version=document.querySelector('.topbar .eyebrow');
  if(version) version.textContent='BUSINESS GAME · 4.5.2';
})();
