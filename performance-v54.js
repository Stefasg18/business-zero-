(()=>{
  if(window.__BZ_PERFORMANCE_V54__)return;
  window.__BZ_PERFORMANCE_V54__=true;

  const VERSION='5.4';
  window.BZ_APP_VERSION=VERSION;

  if(typeof api!=='function')return;
  const baseApi=api;
  const cache=new Map();
  const inFlight=new Map();
  let lastPresenceAt=0;
  let lastPresenceArea='';

  function raceTtl(data){
    const status=data?.race?.room?.status;
    if(status==='waiting')return 1800;
    if(status==='running')return 1700;
    return 5000;
  }

  function cacheRaceResponse(data){
    const roomId=String(data?.race?.room?.id||'');
    if(!roomId)return;
    cache.set(`race:${roomId}`,{at:Date.now(),ttl:raceTtl(data),data});
  }

  function clearRace(roomId){
    roomId=String(roomId||'');
    if(roomId)cache.delete(`race:${roomId}`);
  }

  async function optimizedApi(path,options={}){
    const method=String(options.method||'GET').toUpperCase();
    const now=Date.now();

    if(path==='/api/v53/presence'&&method==='POST'){
      let area='game';
      try{area=String(JSON.parse(options.body||'{}')?.area||'game')}catch{}
      if(area===lastPresenceArea&&now-lastPresenceAt<55000){
        return {ok:true,throttled:true};
      }
      lastPresenceAt=now;
      lastPresenceArea=area;
      return baseApi(path,options);
    }

    if(path==='/api/v53/social'&&method==='GET'){
      const key='social';
      const hit=cache.get(key);
      if(hit&&now-hit.at<3000)return hit.data;
      if(inFlight.has(key))return inFlight.get(key);
      const p=baseApi(path,options).then(data=>{
        cache.set(key,{at:Date.now(),ttl:3000,data});
        return data;
      }).finally(()=>inFlight.delete(key));
      inFlight.set(key,p);
      return p;
    }

    const match=method==='GET'&&String(path).match(/^\/api\/v53\/race\/([0-9a-f-]{20,})$/i);
    if(match){
      const roomId=match[1];
      const key=`race:${roomId}`;
      const hit=cache.get(key);

      // Telegram can keep timers alive while the Mini App is backgrounded.
      // Reuse the last snapshot instead of sending invisible traffic.
      if(document.visibilityState==='hidden'&&hit)return hit.data;
      if(hit&&now-hit.at<hit.ttl)return hit.data;
      if(inFlight.has(key))return inFlight.get(key);

      const p=baseApi(path,options).then(data=>{
        cache.set(key,{at:Date.now(),ttl:raceTtl(data),data});
        return data;
      }).finally(()=>inFlight.delete(key));
      inFlight.set(key,p);
      return p;
    }

    if(method==='POST'&&String(path).startsWith('/api/v53/race/')){
      const data=await baseApi(path,options);
      let body={};
      try{body=JSON.parse(options.body||'{}')}catch{}
      clearRace(body?.roomId);
      cache.delete('social');
      cacheRaceResponse(data);
      return data;
    }

    return baseApi(path,options);
  }

  try{api=optimizedApi}catch{}
  try{window.api=optimizedApi}catch{}

  function enforceVersion(){
    const badge=document.querySelector('.topbar .eyebrow');
    if(badge)badge.textContent=`BUSINESS GAME · ${VERSION}`;
    document.title=`Бизнес с нуля ${VERSION}`;
  }
  enforceVersion();
  document.addEventListener('visibilitychange',()=>{
    if(document.visibilityState==='visible'){
      cache.delete('social');
      enforceVersion();
    }
  });

  window.__BZ_PERFORMANCE_INFO__={
    version:VERSION,
    raceNetworkIntervalApproxMs:1800,
    presenceMinIntervalMs:55000,
    backgroundRaceRequests:false
  };
})();
