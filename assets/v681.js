(() => {
  if (!window.matchMedia('(max-width: 900px)').matches) return;

  const originalToggle = document.querySelector('.nav-toggle');
  const originalNav = document.querySelector('.main-nav');
  if (!originalToggle || !originalNav) return;

  // Clone elements to remove every previous click listener attached by older releases.
  const toggle = originalToggle.cloneNode(true);
  const nav = originalNav.cloneNode(true);

  originalToggle.replaceWith(toggle);
  originalNav.replaceWith(nav);

  let backdrop = document.querySelector('.mobile-nav-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'mobile-nav-backdrop';
    document.body.appendChild(backdrop);
  } else {
    const cleanBackdrop = backdrop.cloneNode(true);
    backdrop.replaceWith(cleanBackdrop);
    backdrop = cleanBackdrop;
  }

  const body = document.body;
  const html = document.documentElement;

  const setOpen = (open) => {
    body.classList.toggle('nav-open', open);
    html.classList.toggle('nav-open', open);
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    nav.setAttribute('aria-hidden', open ? 'false' : 'true');
    backdrop.setAttribute('aria-hidden', open ? 'false' : 'true');
  };

  toggle.setAttribute('aria-expanded', 'false');
  nav.setAttribute('aria-hidden', 'true');
  setOpen(false);

  toggle.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    setOpen(!body.classList.contains('nav-open'));
  });

  backdrop.addEventListener('click', () => setOpen(false));

  document.addEventListener('keydown', (event) => {
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

    const control = li.querySelector(':scope > a, :scope > button');
    if (!control) return;

    control.setAttribute('aria-haspopup', 'true');
    control.setAttribute('aria-controls', submenu.id);
    control.setAttribute('aria-expanded', 'false');

    control.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();

      const opening = !li.classList.contains('submenu-open');

      nav.querySelectorAll('li.submenu-open').forEach(other => {
        if (other !== li) {
          other.classList.remove('submenu-open');
          const otherControl = other.querySelector(':scope > a, :scope > button');
          if (otherControl) otherControl.setAttribute('aria-expanded', 'false');
        }
      });

      li.classList.toggle('submenu-open', opening);
      control.setAttribute('aria-expanded', opening ? 'true' : 'false');
    }, true);
  });

  // Only actual destination links close the drawer.
  nav.querySelectorAll('.dropdown a, .sub-menu a, .submenu a').forEach(link => {
    link.addEventListener('click', () => setOpen(false));
  });

  nav.querySelectorAll('li:not(.has-mobile-submenu) > a').forEach(link => {
    link.addEventListener('click', () => setOpen(false));
  });
})();