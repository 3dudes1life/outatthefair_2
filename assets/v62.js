(() => {
  const script = document.currentScript;
  const root = script?.src ? script.src.split('/assets/v62.js')[0] + '/' : './';
  const fallback = {
    '557c37_d2cedccb28df4f01b130d0762620d9a9':'oatf-logo-fallback.svg',
    'd0a21d_62f3dc4d5f394edeba6f858dd2f947c5':'hero-fallback.svg',
    'd0a21d_998d94102a894f3ab6750dea8fc88e42':'riverside-fallback.svg',
    'd0a21d_c5f3b87131de4f418444cc50c8708d99':'sandiego-fallback.svg',
    'd0a21d_e2f09d6457a04399a806f43085739ecb':'orangecounty-fallback.svg',
    'd0a21d_2f3e324c92bd4eaa81ebdd3e774f200a':'mascot-fallback.svg'
  };

  // Loading indicator for internal navigation.
  const bar=document.createElement('div');
  bar.className='page-load-bar';
  document.body.appendChild(bar);
  addEventListener('pageshow',()=>{bar.style.opacity='0';bar.style.width='0'});
  document.addEventListener('click',e=>{
    const a=e.target.closest('a[href]');
    if(!a || a.target==='_blank' || a.hasAttribute('download')) return;
    const u=new URL(a.href,location.href);
    if(u.origin===location.origin && !u.hash){
      bar.style.opacity='1';bar.style.width='72%';
    }
  });

  // Image loading states and guaranteed local fallbacks.
  document.querySelectorAll('img').forEach(img=>{
    if(!img.hasAttribute('decoding')) img.decoding='async';
    const critical=img.closest('.brand,.page-hero,.hero,.footer-brand');
    if(!critical && !img.hasAttribute('loading')) img.loading='lazy';
    img.classList.add('is-loading');
    const done=()=>{img.classList.remove('is-loading');img.classList.add('is-loaded')};
    if(img.complete && img.naturalWidth) done(); else img.addEventListener('load',done,{once:true});
    img.addEventListener('error',()=>{
      const key=Object.keys(fallback).find(k=>img.src.includes(k));
      if(key && !img.dataset.fallbackApplied){
        img.dataset.fallbackApplied='1';
        img.classList.add('is-fallback');
        img.src=root+'assets/images/'+fallback[key];
      } else {
        img.classList.remove('is-loading');
        img.alt=img.alt || 'Out at the Fair visual';
      }
    });
  });

  // Mark current primary navigation destination.
  const here=location.pathname.replace(/index\.html$/,'');
  document.querySelectorAll('.nav-list a,.mobile-dock a').forEach(a=>{
    const target=new URL(a.href,location.href).pathname.replace(/index\.html$/,'');
    if(target===here) a.setAttribute('aria-current','page');
  });

  // Friendly offline/online status.
  const status=document.createElement('div');
  status.className='site-status';
  document.body.appendChild(status);
  let timer;
  function announce(text){
    status.textContent=text;status.classList.add('show');
    clearTimeout(timer);timer=setTimeout(()=>status.classList.remove('show'),2800);
  }
  addEventListener('offline',()=>announce('Offline mode — saved pages remain available'));
  addEventListener('online',()=>announce('Connection restored'));
})();