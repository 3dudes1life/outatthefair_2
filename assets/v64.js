(() => {
  const nodes=[...document.querySelectorAll('.map-node')];
  if(nodes.length){
    nodes.forEach(node=>{
      const button=node.querySelector('button');
      button?.addEventListener('click',()=>{
        const open=node.classList.contains('active');
        nodes.forEach(n=>n.classList.remove('active'));
        if(!open) node.classList.add('active');
      });
    });
    document.addEventListener('click',e=>{
      if(!e.target.closest('.map-node')) nodes.forEach(n=>n.classList.remove('active'));
    });
  }

  const reveal=[...document.querySelectorAll('.network-card,.destination-panel,.network-stat')];
  if(reveal.length && 'IntersectionObserver' in window){
    reveal.forEach(el=>{
      el.style.opacity='0';
      el.style.transform='translateY(18px)';
      el.style.transition='opacity .55s ease,transform .55s ease';
    });
    const io=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.style.opacity='1';
          entry.target.style.transform='translateY(0)';
          io.unobserve(entry.target);
        }
      });
    },{threshold:.12});
    reveal.forEach(el=>io.observe(el));
  }
})();