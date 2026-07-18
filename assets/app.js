(() => {
  'use strict';

  const CONFIG = {
    ONESIGNAL_ENABLED: false,
    ONESIGNAL_APP_ID: '58afac42-f259-4105-8bc6-c9ff2414f2e7',
    WIX_SIGNUP_URL: ''
  };

  document.documentElement.classList.add('js');

  const body = document.body;
  const html = document.documentElement;
  const nav = document.querySelector('.main-nav');
  const toggle = document.querySelector('.nav-toggle');
  const mobileMQ = window.matchMedia('(max-width: 900px)');

  // --------------------------
  // Single navigation system
  // --------------------------
  if (nav && toggle) {
    document.querySelectorAll('.mobile-menu-backdrop,.mobile-nav-backdrop,.oatf-nav-backdrop')
      .forEach(el => el.remove());

    const backdrop = document.createElement('div');
    backdrop.className = 'oatf-nav-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.appendChild(backdrop);

    const closeSubmenus = () => {
      nav.querySelectorAll('.submenu-open').forEach(li => {
        li.classList.remove('submenu-open');
        const control = li.querySelector(':scope > button, :scope > a');
        if (control) control.setAttribute('aria-expanded', 'false');
      });
    };

    const setNavOpen = open => {
      body.classList.toggle('nav-open', open);
      html.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      toggle.textContent = open ? '×' : '☰';
      nav.setAttribute('aria-hidden', mobileMQ.matches ? String(!open) : 'false');
      backdrop.setAttribute('aria-hidden', String(!open));
      if (!open) closeSubmenus();
    };

    toggle.addEventListener('click', event => {
      event.preventDefault();
      setNavOpen(!body.classList.contains('nav-open'));
    });

    backdrop.addEventListener('click', () => setNavOpen(false));

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && body.classList.contains('nav-open')) {
        setNavOpen(false);
        toggle.focus();
      }
    });

    nav.querySelectorAll('li.has-dropdown').forEach((li, index) => {
      const submenu = li.querySelector(':scope > .dropdown');
      const control = li.querySelector(':scope > button, :scope > a');
      if (!submenu || !control) return;

      submenu.id = submenu.id || `nav-submenu-${index}`;
      control.setAttribute('aria-controls', submenu.id);
      control.setAttribute('aria-haspopup', 'true');
      control.setAttribute('aria-expanded', 'false');

      control.addEventListener('click', event => {
        if (!mobileMQ.matches) return;
        event.preventDefault();

        const opening = !li.classList.contains('submenu-open');

        nav.querySelectorAll('li.submenu-open').forEach(other => {
          if (other !== li) {
            other.classList.remove('submenu-open');
            other.querySelector(':scope > button, :scope > a')
              ?.setAttribute('aria-expanded', 'false');
          }
        });

        li.classList.toggle('submenu-open', opening);
        control.setAttribute('aria-expanded', String(opening));
      });
    });

    nav.querySelectorAll('li:not(.has-dropdown) > a,.dropdown a').forEach(link => {
      link.addEventListener('click', () => setNavOpen(false));
    });

    const syncNavMode = () => {
      if (!mobileMQ.matches) {
        setNavOpen(false);
        nav.removeAttribute('aria-hidden');
      } else {
        setNavOpen(false);
      }
    };

    mobileMQ.addEventListener?.('change', syncNavMode);
    syncNavMode();
  }

  // --------------------------
  // Reveal animations
  // --------------------------
  const observer = 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: .08, rootMargin: '0px 0px -25px' })
    : null;

  document.querySelectorAll('.reveal').forEach(el =>
    observer ? observer.observe(el) : el.classList.add('visible')
  );

  // --------------------------
  // Current year
  // --------------------------
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // --------------------------
  // Map interaction
  // --------------------------
  document.querySelectorAll('.map-node button').forEach(button => {
    button.addEventListener('click', () => {
      const node = button.closest('.map-node');
      document.querySelectorAll('.map-node.is-active').forEach(other => {
        if (other !== node) other.classList.remove('is-active');
      });
      node?.classList.toggle('is-active');
    });
  });

  // --------------------------
  // Image fallbacks
  // --------------------------
  document.querySelectorAll('img[data-local-fallback]').forEach(img => {
    img.addEventListener('error', () => {
      const fallback = img.dataset.localFallback;
      if (fallback && img.src !== fallback) img.src = fallback;
    }, { once: true });
  });

  // --------------------------
  // Email signup modal
  // --------------------------
  const modal = document.createElement('div');
  modal.className = 'email-signup-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', 'Join the OutAt email community');
  modal.innerHTML = `
    <button class="email-signup-close" type="button" aria-label="Close email signup">×</button>
    <div class="email-signup-card">
      <p class="eyebrow">Stay connected</p>
      <h2>Get Out at the Fair® updates through OutAt.</h2>
      <p>Fair announcements, entertainment, giveaways and community news are moving into the broader OutAt email community.</p>
      <div class="email-signup-actions">
        <a class="button button-primary email-signup-primary" href="https://www.outatinc.com/" target="_blank" rel="noopener">Visit OutAt</a>
        <button class="button button-ghost email-signup-later" type="button">Maybe later</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const openEmailModal = () => {
    const primary = modal.querySelector('.email-signup-primary');
    if (CONFIG.WIX_SIGNUP_URL) primary.href = CONFIG.WIX_SIGNUP_URL;
    modal.classList.add('is-open');
    modal.querySelector('.email-signup-close')?.focus();
  };

  const closeEmailModal = () => modal.classList.remove('is-open');

  modal.querySelector('.email-signup-close')?.addEventListener('click', closeEmailModal);
  modal.querySelector('.email-signup-later')?.addEventListener('click', closeEmailModal);
  modal.addEventListener('click', event => {
    if (event.target === modal) closeEmailModal();
  });

  document.querySelectorAll('[data-email-signup]').forEach(button => {
    button.addEventListener('click', event => {
      event.preventDefault();
      openEmailModal();
    });
  });



  // --------------------------
  // Mobile floating dock
  // --------------------------
  const mobileDock = document.createElement('nav');
  mobileDock.className = 'mobile-dock';
  mobileDock.setAttribute('aria-label', 'Mobile quick navigation');

  const appScript = [...document.scripts].find(script => script.src.includes('/assets/app.js'));
  const siteRoot = appScript ? new URL('../', appScript.src) : new URL('./', window.location.href);
  const currentPath = window.location.pathname.replace(/\/index\.html$/, '/');

  const dockItems = [
    { icon:'⌂', label:'Home', path:'' },
    { icon:'🎡', label:'Fairs', path:'californiafairs/' },
    { icon:'✦', label:'Story', path:'history/' },
    { icon:'▧', label:'Photos', path:'photos/' },
    { icon:'＋', label:'Join', path:'participate/' }
  ];

  mobileDock.innerHTML = dockItems.map(item => {
    const url = new URL(item.path, siteRoot);
    const normalized = url.pathname.replace(/\/index\.html$/, '/');
    const isHome = item.path === '';
    const active = isHome
      ? currentPath === normalized
      : currentPath.startsWith(normalized);

    return `<a href="${url.href}" class="${active ? 'active' : ''}" ${active ? 'aria-current="page"' : ''}>
      <span aria-hidden="true">${item.icon}</span>
      <b>${item.label}</b>
    </a>`;
  }).join('');

  document.body.appendChild(mobileDock);

  // --------------------------
  // PWA service worker
  // --------------------------
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const appScript = [...document.scripts].find(script => script.src.includes('/assets/app.js'));
        const siteRoot = appScript
          ? new URL('../', appScript.src)
          : new URL('./', window.location.href);
        const registration = await navigator.serviceWorker.register(
          new URL('sw.js', siteRoot).pathname
        );
        registration.update().catch(() => {});
      } catch (_) {}
    });
  }

  // --------------------------
  // OneSignal feature flag
  // --------------------------
  if (CONFIG.ONESIGNAL_ENABLED) {
    const sdk = document.createElement('script');
    sdk.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js';
    sdk.defer = true;
    document.head.appendChild(sdk);

    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async OneSignal => {
      try {
        await OneSignal.init({
          appId: CONFIG.ONESIGNAL_APP_ID,
          serviceWorkerPath: 'push/onesignal/OneSignalSDKWorker.js',
          serviceWorkerParam: { scope: '/push/onesignal/' },
          notifyButton: { enable: false }
        });
      } catch (error) {
        console.warn('OneSignal initialization failed:', error);
      }
    });
  }
})();