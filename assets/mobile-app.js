(() => {
  const body=document.body;
  const nav=document.querySelector('.main-nav');
  const toggle=document.querySelector('.nav-toggle');

  // Backdrop for the slide-in mobile navigation
  if(nav && toggle){
    const backdrop=document.createElement('div');
    backdrop.className='mobile-menu-backdrop';
    document.body.appendChild(backdrop);
    const sync=()=>{
      const open=nav.classList.contains('open');
      body.classList.toggle('menu-open',open);
      toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');
    };
    toggle.addEventListener('click',()=>requestAnimationFrame(sync));
    backdrop.addEventListener('click',()=>{
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded','false');
      toggle.textContent='☰';
      sync();
    });
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
      nav.classList.remove('open');
      body.classList.remove('menu-open');
    }));
  }

  // Add native-style tab bar on phone
  const path=location.pathname.replace(/\/index\.html$/,'/');
  const root = path.includes('/outatthefair_2/') ? '/outatthefair_2/' : (() => {
    const scripts=[...document.scripts].map(s=>s.src);
    const site=scripts.find(s=>s.includes('/assets/site.js'));
    return site ? site.split('/assets/site.js')[0]+'/' : '/';
  })();
  const tabs=[
    ['⌂','Home',''],
    ['🎡','Fairs','californiafairs/'],
    ['✦','Story','history/'],
    ['▧','Photos','photos/'],
    ['＋','Join','participate/']
  ];
  const dock=document.createElement('nav');
  dock.className='mobile-dock';
  dock.setAttribute('aria-label','Mobile navigation');
  dock.innerHTML=tabs.map(([icon,label,href])=>{
    const url=root+href;
    const active=href==='' ? (path===root || path.endsWith('/outatthefair_2/')) : path.includes('/'+href);
    return `<a href="${url}" class="${active?'active':''}"><span>${icon}</span>${label}</a>`;
  }).join('');
  document.body.appendChild(dock);

  // Register PWA service worker
  if('serviceWorker' in navigator){
    window.addEventListener('load',()=>navigator.serviceWorker.register(root+'sw.js').catch(()=>{}));
  }

  // Install experience
  let deferredPrompt=null;
  const install=document.createElement('div');
  install.className='install-card';
  install.innerHTML=`<img src="${root}assets/icons/apple-touch-icon.png" alt="">
    <div><strong>Add OATF to your Home Screen</strong><small>Open it full-screen like an app and return faster.</small></div>
    <button class="install-action">Add</button><button class="install-close" aria-label="Dismiss">×</button>`;
  document.body.appendChild(install);
  const dismissed=localStorage.getItem('oatf-install-dismissed');
  const standalone=matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  window.addEventListener('beforeinstallprompt',e=>{
    e.preventDefault(); deferredPrompt=e;
    if(!dismissed && !standalone) install.classList.add('show');
  });
  install.querySelector('.install-action').addEventListener('click',async()=>{
    if(deferredPrompt){
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt=null; install.classList.remove('show');
    }else if(/iPhone|iPad|iPod/.test(navigator.userAgent) && !standalone){
      install.querySelector('small').textContent='Tap Safari Share, then “Add to Home Screen.”';
    }
  });
  install.querySelector('.install-close').addEventListener('click',()=>{
    install.classList.remove('show');
    localStorage.setItem('oatf-install-dismissed','1');
  });

  // iOS hint only after a few seconds, once per device
  if(/iPhone|iPad|iPod/.test(navigator.userAgent) && !standalone && !dismissed){
    setTimeout(()=>install.classList.add('show'),4500);
  }

  // Remove 3D tilt behavior on coarse pointers
  if(matchMedia('(pointer:coarse)').matches){
    document.querySelectorAll('.fair-card').forEach(card=>{
      card.style.transform='';
      card.replaceWith(card.cloneNode(true));
    });
  }
})();