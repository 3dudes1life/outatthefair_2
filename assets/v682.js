(() => {
  const mq = window.matchMedia('(max-width: 900px)');
  const body = document.body;
  const html = document.documentElement;
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');

  if (!toggle || !nav) return;

  // Remove every legacy backdrop and stale menu state.
  document.querySelectorAll('.mobile-menu-backdrop, .mobile-nav-backdrop').forEach(el => el.remove());
  body.classList.remove('menu-open');
  nav.classList.remove('open');

  const backdrop = document.createElement('div');
  backdrop.className = 'mobile-nav-backdrop';
  backdrop.setAttribute('aria-hidden', 'true');
  document.body.appendChild(backdrop);

  const closeAllSubmenus = () => {
    nav.querySelectorAll('.submenu-open').forEach(li => {
      li.classList.remove('submenu-open');
      const control = li.querySelector(':scope > button, :scope > a');
      if (control) control.setAttribute('aria-expanded', 'false');
    });
  };

  const setOpen = (open) => {
    body.classList.toggle('nav-open', open);
    html.classList.toggle('nav-open', open);
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    toggle.textContent = open ? '×' : '☰';
    nav.setAttribute('aria-hidden', open ? 'false' : 'true');
    backdrop.setAttribute('aria-hidden', open ? 'false' : 'true');

    if (!open) closeAllSubmenus();
  };

  toggle.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    setOpen(!body.classList.contains('nav-open'));
  });

  backdrop.addEventListener('click', () => setOpen(false));

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && body.classList.contains('nav-open')) {
      setOpen(false);
      toggle.focus();
    }
  });

  nav.querySelectorAll('li').forEach((li, index) => {
    const submenu = li.querySelector(':scope > .dropdown, :scope > .sub-menu, :scope > .submenu');
    if (!submenu) return;

    li.classList.add('has-mobile-submenu');
    submenu.id = submenu.id || `mobile-submenu-${index}`;

    const control = li.querySelector(':scope > button, :scope > a');
    if (!control) return;

    control.setAttribute('aria-controls', submenu.id);
    control.setAttribute('aria-haspopup', 'true');
    control.setAttribute('aria-expanded', 'false');

    control.addEventListener('click', event => {
      if (!mq.matches) return;

      event.preventDefault();
      event.stopPropagation();

      const shouldOpen = !li.classList.contains('submenu-open');

      nav.querySelectorAll('.submenu-open').forEach(other => {
        if (other !== li) {
          other.classList.remove('submenu-open');
          const otherControl = other.querySelector(':scope > button, :scope > a');
          if (otherControl) otherControl.setAttribute('aria-expanded', 'false');
        }
      });

      li.classList.toggle('submenu-open', shouldOpen);
      control.setAttribute('aria-expanded', String(shouldOpen));
    });
  });

  // Only real destination links close the drawer.
  nav.querySelectorAll('.dropdown a, .sub-menu a, .submenu a').forEach(link => {
    link.addEventListener('click', () => setOpen(false));
  });

  nav.querySelectorAll('li:not(.has-mobile-submenu) > a').forEach(link => {
    link.addEventListener('click', () => setOpen(false));
  });

  const syncMode = () => {
    if (!mq.matches) {
      setOpen(false);
      nav.removeAttribute('aria-hidden');
    } else if (!body.classList.contains('nav-open')) {
      nav.setAttribute('aria-hidden', 'true');
    }
  };

  mq.addEventListener?.('change', syncMode);
  setOpen(false);
  syncMode();
})();