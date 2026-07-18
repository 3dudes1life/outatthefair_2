(() => {
  const eras=[...document.querySelectorAll('.legacy-era')];
  const links=[...document.querySelectorAll('.legacy-nav a')];
  if(!eras.length) return;

  const progress=document.createElement('div');
  progress.className='legacy-progress';
  document.body.appendChild(progress);

  const updateProgress=()=>{
    const doc=document.documentElement;
    const max=doc.scrollHeight-innerHeight;
    progress.style.width=(max>0 ? (scrollY/max)*100 : 0)+'%';
  };
  addEventListener('scroll',updateProgress,{passive:true});
  updateProgress();

  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting) return;
      links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+entry.target.id));
    });
  },{rootMargin:'-28% 0px -58% 0px',threshold:.01});
  eras.forEach(era=>observer.observe(era));

  links.forEach(a=>a.addEventListener('click',e=>{
    const target=document.querySelector(a.getAttribute('href'));
    if(target){
      e.preventDefault();
      target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
      history.replaceState(null,'',a.getAttribute('href'));
    }
  }));
})();