(()=>{
  if(window.__BZ_STORE_FREE_V1__) return;
  window.__BZ_STORE_FREE_V1__=true;
  window.BZ_STORE_BUILD=true;
  window.BZ_STORE_FREE=true;

  function applyStoreMode(){
    const mode=document.getElementById('modeBadge');
    if(mode){mode.textContent='ЛОКАЛЬНО';mode.classList.remove('online');}

    const bonus=document.getElementById('bonusBtn');
    if(bonus) bonus.style.display='none';

    ['store','rating'].forEach(tab=>{
      const page=document.getElementById('tab-'+tab);
      if(page) page.style.display='none';
      const btn=document.querySelector(`.bottom-nav .nav-btn[data-tab="${tab}"]`);
      if(btn) btn.style.display='none';
    });

    const referral=document.querySelector('#tab-friends > .first-section');
    if(referral) referral.style.display='none';

    const note=document.getElementById('onlineNote');
    if(note) note.textContent='Бесплатная версия: прогресс хранится локально на этом устройстве.';

    const profileUser=document.getElementById('profileUsername');
    if(profileUser) profileUser.textContent='Локальный профиль';

    const login=document.getElementById('loginSection');
    if(login) login.style.display='none';

    const nav=document.querySelector('.bottom-nav');
    if(nav) nav.style.gridTemplateColumns='repeat(3,1fr)';
  }

  applyStoreMode();
  window.addEventListener('pageshow',()=>setTimeout(applyStoreMode,50));
  setTimeout(applyStoreMode,500);
})();