(()=>{
  if(window.__BZ_RACING_DIRECTION_V532__)return;
  window.__BZ_RACING_DIRECTION_V532__=true;

  const VERSION='5.3.2';
  window.BZ_APP_VERSION=VERSION;

  const style=document.createElement('style');
  style.id='v532RaceDirectionStyle';
  style.textContent=`
    .v53-lane>div>i{
      transform:scaleX(-1)!important;
      transform-origin:center center!important;
      display:inline-block!important;
    }
  `;
  document.head.appendChild(style);

  function fixCars(){
    document.querySelectorAll('.v53-lane>div>i').forEach((car,index)=>{
      if(car.textContent==='🏁')car.textContent='🚕';
      car.setAttribute('aria-label',`Машина ${index+1}`);
    });
    const top=document.querySelector('.topbar .eyebrow');
    if(top)top.textContent=`BUSINESS GAME · ${VERSION}`;
    document.title=`Бизнес с нуля ${VERSION}`;
  }

  const observer=new MutationObserver(()=>fixCars());
  observer.observe(document.body,{subtree:true,childList:true});
  fixCars();
})();
