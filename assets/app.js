(() => {
  'use strict';

  const CONFIG = {
    ONESIGNAL_ENABLED: false,
    ONESIGNAL_APP_ID: '58afac42-f259-4105-8bc6-c9ff2414f2e7',
    WIX_SIGNUP_URL: '',
    // Add the production GA4 Measurement ID only after the GA4 property is ready.
    // Keep blank to leave Google Analytics completely inactive.
    GA4_MEASUREMENT_ID: ''
  };

  document.documentElement.classList.add('js');

  const body = document.body;
  const html = document.documentElement;
  const nav = document.querySelector('.main-nav');
  const toggle = document.querySelector('.nav-toggle');
  const mobileMQ = window.matchMedia('(max-width: 900px)');
  const appScript = [...document.scripts].find(script => script.src.includes('/assets/app.js'));
  // Resolve from the script rather than from the page so this works both at a
  // custom domain and in a GitHub Pages project subdirectory.
  const siteRoot = appScript ? new URL('../', appScript.src) : new URL('./', window.location.href);
  const currentPath = window.location.pathname.replace(/\/index\.html$/, '/');
  const navURL = path => new URL(path, siteRoot);
  const navActive = path => {
    const target = navURL(path).pathname.replace(/\/index\.html$/, '/');
    return path === '' ? currentPath === target : currentPath.startsWith(target);
  };

  // --------------------------
  // Single navigation system
  // --------------------------
  if (nav && toggle) {
    // Keep the primary navigation intentionally small. Older routes remain
    // available by direct link and in the footer, so existing URLs are not
    // broken during the Wix-to-GitHub Pages transition.
    const navList = nav.querySelector('.nav-list');
    if (navList) {
      const link = (label, path) => {
        const active = navActive(path) ? ' aria-current="page"' : '';
        return `<li><a href="${navURL(path).href}"${active}>${label}</a></li>`;
      };
      const fairsActive = [
        'locations/',
        'riversidecountyfair/',
        'sdfair/',
        'orangecountyfair/'
      ].some(navActive);
      navList.innerHTML = [
        link('Home', ''),
        `<li class="has-dropdown${fairsActive ? ' is-current-section' : ''}"><button type="button">Fairs <span aria-hidden="true">⌄</span></button><div class="dropdown"><a href="${navURL('locations/').href}">All locations</a><a href="${navURL('riversidecountyfair/').href}">Riverside County</a><a href="${navURL('sdfair/').href}">San Diego County</a><a href="${navURL('orangecountyfair/').href}">Orange County</a></div></li>`,
        link('Our Story', 'history/'),
        link('Contact', 'contact/')
      ].join('');
    }
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

    document.addEventListener('click', event => {
      if (!nav.contains(event.target) && !toggle.contains(event.target)) closeSubmenus();
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
  // Optional, consent-gated GA4
  // --------------------------
  // This is deliberately basic consent mode: no Google request is made until
  // a visitor explicitly enables optional analytics. It also honors GPC/DNT.
  const analyticsOverride = window.OATF_ANALYTICS_CONFIG || {};
  const analytics = {
    measurementId: analyticsOverride.measurementId ?? CONFIG.GA4_MEASUREMENT_ID,
    testMode: analyticsOverride.testMode === true,
    consentKey: 'oatf_optional_analytics_v1',
    pageKeys: new Set(),
    scrollThresholds: new Set()
  };
  const analyticsEvents = window.__OATF_ANALYTICS_EVENTS__ = window.__OATF_ANALYTICS_EVENTS__ || [];
  const privacySignal = () => navigator.globalPrivacyControl === true
    || navigator.doNotTrack === '1' || window.doNotTrack === '1';
  const getStoredConsent = () => {
    try { return localStorage.getItem(analytics.consentKey); } catch (_) { return null; }
  };
  const setStoredConsent = value => {
    try { localStorage.setItem(analytics.consentKey, value); } catch (_) {}
  };
  const hasMeasurementId = () => /^G-[A-Z0-9]+$/i.test(analytics.measurementId || '');
  const hasAnalyticsConsent = () => !privacySignal() && getStoredConsent() === 'granted';
  const fairForPath = path => {
    if (path.includes('/riversidecountyfair/')) return 'riverside';
    if (path.includes('/sdfair/')) return 'san_diego';
    if (path.includes('/orangecountyfair/')) return 'orange_county';
    return null;
  };
  const safePath = url => `${url.pathname}${url.search}`;
  const emitAnalyticsEvent = (name, parameters = {}) => {
    const event = { name, parameters };
    if (analytics.testMode) analyticsEvents.push(event);
    if (analytics.active && typeof window.gtag === 'function') window.gtag('event', name, parameters);
  };
  const trackPage = () => {
    const pageKey = `${location.pathname}${location.search}`;
    if (!analytics.active || analytics.pageKeys.has(pageKey)) return;
    analytics.pageKeys.add(pageKey);
    emitAnalyticsEvent('page_view', {
      page_title: document.title,
      page_location: location.href
    });
    const fairLocation = fairForPath(location.pathname);
    if (fairLocation) emitAnalyticsEvent('fair_page_view', { fair_location: fairLocation });
    if (location.pathname.includes('/participate/')) emitAnalyticsEvent('participate_view');
  };
  const initializeAnalytics = () => {
    if (analytics.active || !hasMeasurementId() || !hasAnalyticsConsent()) return;
    analytics.active = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag(){ window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    window.gtag('js', new Date());
    // Manually send one view so `config` can never produce a duplicate.
    window.gtag('config', analytics.measurementId, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
    if (!analytics.testMode) {
      const tag = document.createElement('script');
      tag.async = true;
      tag.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(analytics.measurementId)}`;
      tag.onerror = () => { analytics.active = false; };
      document.head.appendChild(tag);
    }
    trackPage();
  };
  const revokeAnalytics = () => {
    setStoredConsent('denied');
    analytics.active = false;
    analytics.pageKeys.clear();
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied', ad_storage: 'denied',
        ad_user_data: 'denied', ad_personalization: 'denied'
      });
    }
  };
  const grantAnalytics = () => {
    if (privacySignal()) return;
    setStoredConsent('granted');
    initializeAnalytics();
  };
  window.OATFAnalytics = Object.freeze({ grant: grantAnalytics, revoke: revokeAnalytics, enabled: hasAnalyticsConsent });

  const analyticsModal = document.createElement('div');
  analyticsModal.className = 'analytics-preferences-modal';
  analyticsModal.setAttribute('role', 'dialog');
  analyticsModal.setAttribute('aria-modal', 'true');
  analyticsModal.setAttribute('aria-labelledby', 'analytics-preferences-title');
  analyticsModal.innerHTML = `
    <div class="analytics-preferences-card">
      <button class="analytics-preferences-close" type="button" aria-label="Close privacy and analytics preferences">×</button>
      <p class="eyebrow">Privacy choices</p>
      <h2 id="analytics-preferences-title">Optional analytics</h2>
      <p>OATF only loads Google Analytics after you choose to allow it. It measures page use and engagement without sending names, email addresses, phone numbers or form contents as event data.</p>
      <p class="analytics-preferences-status" aria-live="polite"></p>
      <div class="analytics-preferences-actions">
        <button class="button button-primary analytics-preferences-allow" type="button">Allow optional analytics</button>
        <button class="button button-ghost analytics-preferences-deny" type="button">Keep analytics off</button>
      </div>
    </div>`;
  document.body.appendChild(analyticsModal);
  const analyticsStatus = analyticsModal.querySelector('.analytics-preferences-status');
  const updateAnalyticsPreferences = () => {
    const blocked = privacySignal();
    analyticsStatus.textContent = blocked
      ? 'A browser privacy signal is active, so optional analytics remains off.'
      : hasAnalyticsConsent()
        ? 'Optional analytics is enabled. You can turn it off at any time.'
        : 'Optional analytics is off.';
    analyticsModal.querySelector('.analytics-preferences-allow').disabled = blocked;
  };
  const closeAnalyticsPreferences = () => analyticsModal.classList.remove('is-open');
  const openAnalyticsPreferences = () => {
    updateAnalyticsPreferences();
    analyticsModal.classList.add('is-open');
    analyticsModal.querySelector('.analytics-preferences-close')?.focus();
  };
  analyticsModal.querySelector('.analytics-preferences-close')?.addEventListener('click', closeAnalyticsPreferences);
  analyticsModal.querySelector('.analytics-preferences-allow')?.addEventListener('click', () => {
    grantAnalytics(); updateAnalyticsPreferences();
  });
  analyticsModal.querySelector('.analytics-preferences-deny')?.addEventListener('click', () => {
    revokeAnalytics(); updateAnalyticsPreferences();
  });
  analyticsModal.addEventListener('click', event => { if (event.target === analyticsModal) closeAnalyticsPreferences(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && analyticsModal.classList.contains('is-open')) closeAnalyticsPreferences();
  });
  document.querySelectorAll('.footer-bottom').forEach(footer => {
    const control = document.createElement('button');
    control.type = 'button';
    control.className = 'footer-privacy-control';
    control.textContent = 'Privacy & analytics';
    control.addEventListener('click', openAnalyticsPreferences);
    footer.appendChild(control);
  });

  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || !analytics.active) return;
    const url = new URL(link.href, location.href);
    if (link.closest('.main-nav, .mobile-dock')) {
      emitAnalyticsEvent('navigation_click', { navigation_label: link.textContent.trim().slice(0, 80), destination_path: safePath(url) });
    }
    const fairLocation = fairForPath(url.pathname);
    if (fairLocation && link.matches('.v61-fair-card, .network-card, .fair-card')) {
      emitAnalyticsEvent('fair_card_click', { fair_location: fairLocation });
    }
    if (url.protocol === 'mailto:') {
      emitAnalyticsEvent('email_link_click');
      emitAnalyticsEvent('contact_click', { contact_method: 'email' });
    } else if (url.protocol === 'tel:') {
      emitAnalyticsEvent('contact_click', { contact_method: 'phone' });
    } else if (/^https?:$/.test(url.protocol) && url.origin !== location.origin) {
      emitAnalyticsEvent('outbound_link_click', { link_domain: url.hostname });
    }
    const interest = link.dataset.analyticsInterest;
    if (interest === 'entertainment' || interest === 'nonprofit') {
      emitAnalyticsEvent(`${interest}_interest_click`);
    }
  });
  window.addEventListener('scroll', () => {
    if (!analytics.active) return;
    const available = document.documentElement.scrollHeight - window.innerHeight;
    const percentage = available > 0 ? Math.round((window.scrollY / available) * 100) : 100;
    [25, 50, 75, 90].forEach(threshold => {
      if (percentage >= threshold && !analytics.scrollThresholds.has(threshold)) {
        analytics.scrollThresholds.add(threshold);
        emitAnalyticsEvent('scroll_depth', { percent_scrolled: threshold });
      }
    });
  }, { passive: true });
  ['pushState', 'replaceState'].forEach(method => {
    const original = history[method];
    history[method] = function trackedHistoryChange(...args) {
      const result = original.apply(this, args);
      queueMicrotask(trackPage);
      return result;
    };
  });
  window.addEventListener('popstate', trackPage);
  window.addEventListener('oatf:navigation', trackPage);
  initializeAnalytics();

  // --------------------------
  // Email signup modal
  // --------------------------
  const signupEnabled = Boolean(CONFIG.WIX_SIGNUP_URL.trim());
  if (signupEnabled) body.classList.add('signup-ready');
  else document.querySelectorAll('[data-email-signup]').forEach(button => button.remove());

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

  const dockItems = [
    { icon:'⌂', label:'Home', path:'' },
    { icon:'🎡', label:'Fairs', path:'locations/' },
    { icon:'✦', label:'Story', path:'history/' },
    { icon:'✉', label:'Contact', path:'contact/' }
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
