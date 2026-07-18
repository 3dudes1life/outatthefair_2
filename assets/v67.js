(() => {
  const body = document.body;
  const html = document.documentElement;
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');

  if (!toggle || !nav) return;

  let backdrop = document.querySelector('.mobile-nav-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'mobile-nav-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.appendChild(backdrop);
  }

  const setOpen = (open) => {
    body.classList.toggle('nav-open', open);
    html.classList.toggle('nav-open', open);
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    nav.setAttribute('aria-hidden', open ? 'false' : 'true');
    backdrop.setAttribute('aria-hidden', open ? 'false' : 'true');

    if (open) {
      requestAnimationFrame(() => {
        const first = nav.querySelector('a,button');
        if (first && window.matchMedia('(max-width: 900px)').matches) {
          first.focus({preventScroll:true});
        }
      });
    }
  };

  const isOpen = () => body.classList.contains('nav-open');

  // Replace any older click behavior by normalizing state after click.
  toggle.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    setOpen(!isOpen());
  }, true);

  backdrop.addEventListener('click', () => setOpen(false));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });

  // Close after choosing a normal link.
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.matchMedia('(max-width: 900px)').matches) {
        setOpen(false);
      }
    });
  });

  // Convert dropdown parents into usable mobile accordion controls.
  nav.querySelectorAll('li').forEach(li => {
    const submenu = li.querySelector(':scope > .dropdown, :scope > .sub-menu, :scope > .submenu');
    if (!submenu) return;

    let control = li.querySelector(':scope > button, :scope > a');
    if (!control) return;

    control.setAttribute('aria-haspopup', 'true');
    control.setAttribute('aria-expanded', 'false');

    control.addEventListener('click', event => {
      if (!window.matchMedia('(max-width: 900px)').matches) return;

      const href = control.getAttribute('href');
      const isRealDestination = href && href !== '#' && !href.startsWith('javascript:');

      // First tap opens submenu; second tap may follow a real destination.
      if (!li.classList.contains('submenu-open')) {
        event.preventDefault();
        event.stopPropagation();

        nav.querySelectorAll('li.submenu-open').forEach(other => {
          if (other !== li) {
            other.classList.remove('submenu-open');
            const otherControl = other.querySelector(':scope > button, :scope > a');
            if (otherControl) otherControl.setAttribute('aria-expanded', 'false');
          }
        });

        li.classList.add('submenu-open');
        control.setAttribute('aria-expanded', 'true');
        submenu.classList.add('is-open');
      } else if (!isRealDestination) {
        event.preventDefault();
        li.classList.remove('submenu-open');
        control.setAttribute('aria-expanded', 'false');
        submenu.classList.remove('is-open');
      }
    }, true);
  });

  // Reset on desktop so the regular nav behaves normally.
  const media = window.matchMedia('(min-width: 901px)');
  const resetForDesktop = () => {
    if (media.matches) {
      setOpen(false);
      nav.removeAttribute('aria-hidden');
      nav.querySelectorAll('.submenu-open').forEach(li => li.classList.remove('submenu-open'));
      nav.querySelectorAll('.is-open').forEach(el => el.classList.remove('is-open'));
    } else if (!isOpen()) {
      nav.setAttribute('aria-hidden','true');
    }
  };

  if (media.addEventListener) media.addEventListener('change', resetForDesktop);
  else media.addListener(resetForDesktop);

  setOpen(false);
  resetForDesktop();
})();