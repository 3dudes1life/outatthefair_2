const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.main-nav');
if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.textContent = open ? '×' : '☰';
  });
}
const observer = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: .12 }) : null;
document.querySelectorAll('.reveal').forEach((el) => observer ? observer.observe(el) : el.classList.add('visible'));
document.querySelectorAll('[data-year]').forEach((el) => el.textContent = new Date().getFullYear());
