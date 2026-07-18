(() => {
  const toggle=document.querySelector('.nav-toggle');
  const nav=document.querySelector('.main-nav');
  if(!toggle || !nav) return;

  const sync=()=>{
    const expanded=toggle.getAttribute('aria-expanded')==='true';
    document.body.classList.toggle('nav-open',expanded);
    nav.classList.toggle('is-open',expanded);
    nav.setAttribute('aria-hidden',expanded?'false':'true');
  };

  toggle.addEventListener('click',()=>setTimeout(sync,0));

  document.addEventListener('click',e=>{
    if(document.body.classList.contains('nav-open') &&
       !e.target.closest('.main-nav') &&
       !e.target.closest('.nav-toggle')){
      toggle.click();
    }
  });

  document.addEventListener('keydown',e=>{
    if(e.key==='Escape' && document.body.classList.contains('nav-open')){
      toggle.click();
      toggle.focus();
    }
  });

  sync();
})();