(() => {
  const style=document.createElement('style');
  style.textContent=`
    .q37-content-section{display:none!important}
    .q37-body .q37-content-section{display:block!important}
    .q37-xp-panel{display:none!important}
    .q37-body>.q37-xp-panel{display:block!important}
    #tab-home>.section:has(#deals),#tab-home>.section:has(#businesses){display:none!important}
  `;
  document.head.appendChild(style);

  function parkXpPanel(){
    const panel=document.getElementById('xpPanel37');
    if(panel && panel.parentElement?.id==='q37Body') document.body.appendChild(panel);
  }
  setTimeout(()=>{
    document.querySelectorAll('[data-q37-close]').forEach(el=>el.addEventListener('click',parkXpPanel,true));
    const energyCaption=document.querySelector('.stat-energy .stat-caption');
    if(energyCaption) energyCaption.textContent='1 ⚡ каждые 20 сек';
  },150);
})();