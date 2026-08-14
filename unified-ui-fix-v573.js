(()=>{
  if(window.__BZ_UI573__)return;window.__BZ_UI573__=1;
  const style=document.createElement('style');
  style.id='u573Style';
  style.textContent=`
    .v50-overlay,.v51-overlay,.v50-notify-pop,.v50-gift-pop,.v50-profile-pop{z-index:12850!important}
    .v51-reveal{z-index:12870!important}
    #tab-home>:not(.hero-card):not(#u572menu){display:none!important}
    #u572menu{display:block!important}
  `;
  document.head.appendChild(style);

  function cleanHome(){
    const home=document.getElementById('tab-home'),store=document.getElementById('u572store'),menu=document.getElementById('u572menu');
    if(!home||!store||!menu)return;
    [...home.children].forEach(node=>{
      if(node.classList.contains('hero-card')||node===menu)return;
      node.dataset.u572='1';node.dataset.u572Home='1';store.appendChild(node);
    });
  }

  function cleanFriends(){
    const race=document.getElementById('v53RaceOpen');
    if(race)race.style.setProperty('display','none','important');
    const party=document.getElementById('localParty566Card'),store=document.getElementById('u572store');
    if(party&&store&&!document.getElementById('u572body')?.contains(party)){party.dataset.u572='1';party.dataset.u572Party='1';store.appendChild(party)}
  }

  function run(){try{cleanHome();cleanFriends()}catch{}}
  let n=0;const t=setInterval(()=>{run();if(++n>45)clearInterval(t)},350);
  setInterval(run,2200);
})();
