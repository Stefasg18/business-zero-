(()=>{
  if(window.__BZ_LATE_LOAD_SHIM_V531__) return;
  window.__BZ_LATE_LOAD_SHIM_V531__=true;

  const originalAdd=window.addEventListener.bind(window);
  window.addEventListener=function(type,listener,options){
    const result=originalAdd(type,listener,options);
    if(type==='load' && document.readyState==='complete'){
      setTimeout(()=>{
        try{
          if(typeof listener==='function') listener.call(window,new Event('load'));
          else if(listener&&typeof listener.handleEvent==='function') listener.handleEvent(new Event('load'));
        }catch(e){console.error('late load listener',e);}
      },0);
    }
    return result;
  };
})();
