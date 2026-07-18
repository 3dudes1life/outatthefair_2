(() => {
  // Remove carousel semantics now that every current fair is visible.
  document.querySelectorAll('.network-grid').forEach(grid=>{
    grid.removeAttribute('aria-roledescription');
    grid.removeAttribute('tabindex');
  });

  // Add accessible labels to icon-only links/buttons if needed.
  document.querySelectorAll('button,a').forEach(el=>{
    const text=(el.textContent||'').trim();
    if(!text && !el.getAttribute('aria-label')){
      const title=el.getAttribute('title');
      if(title) el.setAttribute('aria-label',title);
    }
  });

  // Ensure external links communicate new-tab behavior.
  document.querySelectorAll('a[target="_blank"]').forEach(a=>{
    if(!a.rel.includes('noopener')) a.rel=(a.rel+' noopener').trim();
    if(!a.rel.includes('noreferrer')) a.rel=(a.rel+' noreferrer').trim();
  });

  // Add width/height to fallback images to reduce layout shift.
  document.querySelectorAll('img[src*="fallback.svg"]').forEach(img=>{
    if(!img.hasAttribute('width')) img.width=600;
    if(!img.hasAttribute('height')) img.height=720;
  });

  // Provide descriptive page landmark label.
  const main=document.querySelector('main');
  const h1=document.querySelector('h1');
  if(main && h1 && !main.getAttribute('aria-label')){
    main.setAttribute('aria-label',h1.textContent.trim());
  }

  // Avoid old stale SW state after upgrades.
  if('serviceWorker' in navigator){
    navigator.serviceWorker.ready.then(reg=>{
      reg.update().catch(()=>{});
    });
  }
})();