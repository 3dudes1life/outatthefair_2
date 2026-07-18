document.documentElement.classList.add('js');
const navToggle=document.querySelector('.nav-toggle');
const nav=document.querySelector('.main-nav');
if(navToggle&&nav){navToggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');navToggle.setAttribute('aria-expanded',String(open));navToggle.textContent=open?'×':'☰'})}
const observer='IntersectionObserver'in window?new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}})},{threshold:.08,rootMargin:'0px 0px -25px'}):null;
document.querySelectorAll('.reveal').forEach(el=>observer?observer.observe(el):el.classList.add('visible'));
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
const hero=document.querySelector('.hero');
if(hero&&!matchMedia('(prefers-reduced-motion: reduce)').matches){hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();hero.style.setProperty('--mx',`${((e.clientX-r.left)/r.width)*100}%`);hero.style.setProperty('--my',`${((e.clientY-r.top)/r.height)*100}%`)})}
document.querySelectorAll('.fair-card').forEach(card=>{card.addEventListener('pointermove',e=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const r=card.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;card.style.transform=`translateY(-10px) perspective(900px) rotateY(${x*5}deg) rotateX(${-y*5}deg)`});card.addEventListener('pointerleave',()=>card.style.transform='')});
