/**
 * WELDPRO Navigation & Fast Client-Side Router
 * Delivers instantaneous zero-reload transitions between public pages
 * while preserving native browser performance for dashboard and external routes.
 */
(function() {
  const ROOT_FILES = new Set([
    'index.html',
    'home-2.html',
    'about.html',
    'contact.html',
    'instructors.html',
    'programs.html',
    'facilities.html'
  ]);

  const PROGRAM_FILES = new Set([
    'mig-welding.html',
    'tig-welding.html',
    'smaw-welding.html',
    'pipe-welding.html',
    'structural-welding.html',
    'flux-cored-welding.html'
  ]);

  const FACILITY_FILES = new Set([
    'welding-lab.html',
    'equipment.html',
    'safety-training.html'
  ]);

  const DASHBOARD_FILES = new Set([
    'index.html',
    'my-profile.html',
    'my-programs.html',
    'lab-hours.html',
    'skill-assessments.html',
    'certifications.html',
    'attendance.html',
    'notifications.html'
  ]);

  const AUTH_FILES = new Set([
    'login.html',
    'register.html',
    'forgot-password.html',
    'reset-password.html'
  ]);

  let progressBar = null;

  // 1. Top Glowing Orange Progress Bar
  function getProgressBar() {
    if (!progressBar) {
      progressBar = document.getElementById('weldpro-progress-bar');
      if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.id = 'weldpro-progress-bar';
        progressBar.style.cssText = 'position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,#F28C28,#FFB067);z-index:99999;width:0%;opacity:0;transition:width 0.15s ease,opacity 0.15s ease;pointer-events:none;box-shadow:0 0 10px rgba(242,140,40,0.8);';
        document.body.appendChild(progressBar);
      }
    }
    return progressBar;
  }

  function startProgress() {
    const bar = getProgressBar();
    bar.style.opacity = '1';
    bar.style.width = '60%';
  }

  function finishProgress() {
    const bar = getProgressBar();
    bar.style.width = '100%';
    setTimeout(() => {
      bar.style.opacity = '0';
      setTimeout(() => {
        bar.style.width = '0%';
      }, 150);
    }, 100);
  }

  // 2. Compute Site Root Base URL (Works flawlessly on Vercel, cleanUrls, localhost, & file://)
  function getSiteRoot(currentHref) {
    try {
      const href = currentHref || (typeof window !== 'undefined' && window.location ? window.location.href : 'http://127.0.0.1:5500/');
      const url = new URL(href);
      if (url.protocol === 'file:') {
        let pathname = url.pathname.replace(/\\/g, '/');
        if (pathname.endsWith('.html')) {
          pathname = pathname.substring(0, pathname.lastIndexOf('/') + 1);
        } else if (!pathname.endsWith('/')) {
          pathname += '/';
        }
        const subfolders = ['programs/', 'facilities/', 'dashboard/', 'auth/'];
        for (const sub of subfolders) {
          if (pathname.endsWith(sub)) {
            pathname = pathname.substring(0, pathname.length - sub.length);
            break;
          }
        }
        return 'file://' + pathname;
      }

      // HTTP / HTTPS (Vercel, custom domain, localhost)
      let pathname = url.pathname.replace(/\\/g, '/');
      const segs = pathname.split('/').filter(Boolean);
      if (!segs.length) return url.origin + '/';

      const knownPages = new Set([
        'index', 'home-2', 'about', 'contact', 'instructors', 'programs', 'facilities',
        'mig-welding', 'tig-welding', 'smaw-welding', 'pipe-welding', 'structural-welding', 'flux-cored-welding',
        'welding-lab', 'equipment', 'safety-training',
        'login', 'register', 'forgot-password', 'reset-password',
        'my-profile', 'my-programs', 'lab-hours', 'skill-assessments', 'certifications', 'attendance', 'notifications'
      ]);

      const last = segs[segs.length - 1];
      const lastWithoutExt = last.replace(/\.html$/i, '');
      if (last.endsWith('.html') || knownPages.has(lastWithoutExt)) {
        segs.pop();
      }

      if (segs.length && ['programs', 'facilities', 'dashboard', 'auth'].includes(segs[segs.length - 1])) {
        segs.pop();
      }

      const basePath = segs.length ? '/' + segs.join('/') + '/' : '/';
      return url.origin + basePath;
    } catch (e) {
      return '/';
    }
  }

  // 3. Resolve Any URL or Href to Canonical Page Key
  function resolvePageKey(urlOrHref) {
    try {
      if (!urlOrHref) return 'index.html';
      let pathname = '';
      try {
        const base = typeof window !== 'undefined' && window.location ? window.location.href : 'http://127.0.0.1:5500/';
        const parsed = new URL(urlOrHref, base);
        pathname = parsed.pathname;
      } catch (e) {
        pathname = (urlOrHref || '').split('?')[0].split('#')[0];
      }

      const clean = pathname.replace(/\\/g, '/');
      const segs = clean.split('/').filter(Boolean);
      if (!segs.length) return 'index.html';

      const last = segs[segs.length - 1];
      let filename = last.endsWith('.html') ? last : (last === '' ? 'index.html' : last + '.html');
      const dirSegs = segs.slice(0, -1);

      // 1. Root-level pages MUST take priority so links like "about.html" clicked from
      // "/programs/smaw-welding.html" resolve to "about.html" at site root, NEVER "programs/about.html"!
      if (ROOT_FILES.has(filename)) {
        if (filename === 'index.html' && dirSegs.includes('dashboard')) {
          return 'dashboard/index.html';
        }
        return filename;
      }

      // 2. Specific domain set matching: guaranteed canonical routing regardless of origin directory
      if (AUTH_FILES.has(filename)) {
        return 'auth/' + filename;
      }

      if (FACILITY_FILES.has(filename)) {
        return 'facilities/' + filename;
      }

      if (PROGRAM_FILES.has(filename)) {
        return 'programs/' + filename;
      }

      if (DASHBOARD_FILES.has(filename)) {
        return 'dashboard/' + filename;
      }

      // 3. Directory segment fallbacks for unknown or dynamic routes
      if (dirSegs.includes('dashboard')) {
        return 'dashboard/' + filename;
      }
      if (dirSegs.includes('auth')) {
        return 'auth/' + filename;
      }
      if (dirSegs.includes('facilities')) {
        return 'facilities/' + filename;
      }
      if (dirSegs.includes('programs')) {
        return 'programs/' + filename;
      }

      return filename;
    } catch (e) {
      return 'index.html';
    }
  }

  function getCanonicalUrl(pageKey) {
    const root = getSiteRoot(window.location.href);
    return root + pageKey;
  }

  // 4. Active State & Dropdown Category Indicators
  function updateActiveNavState(customKey) {
    const key = customKey || resolvePageKey(window.location.href);

    const isHome = key === 'index.html' || key === 'home-2.html' || key === '';
    const isHome1 = key === 'index.html' || key === '';
    const isHome2 = key === 'home-2.html';
    const isPrograms = key.startsWith('programs') || key.includes('program');
    const isFacilities = key.startsWith('facilities') || key.includes('facilit');
    const isDashboard = key.startsWith('dashboard') || key.includes('dashboard');
    const isAbout = key === 'about.html';
    const isInstructors = key === 'instructors.html';
    const isContact = key === 'contact.html';

    // 1. Reset all previous indicators on Desktop
    document.querySelectorAll('.nav-item-dropdown').forEach(d => {
      d.classList.remove('is-current-category');
    });
    document.querySelectorAll('.dropdown-trigger').forEach(b => {
      b.classList.remove('text-orange', 'font-bold', 'is-active-nav');
    });
    document.querySelectorAll('.nav-link-item').forEach(l => {
      l.classList.remove('text-orange', 'text-orange-500', 'font-bold', 'is-active-nav');
    });
    document.querySelectorAll('.mega-dropdown-menu a').forEach(a => {
      a.classList.remove('is-active-link');
    });

    // 2. Desktop Direct Nav Links
    if (isAbout) {
      document.querySelectorAll('a[href*="about.html"].nav-link-item').forEach(a => {
        a.classList.add('text-orange', 'font-bold', 'is-active-nav');
      });
    }
    if (isInstructors) {
      document.querySelectorAll('a[href*="instructors.html"].nav-link-item').forEach(a => {
        a.classList.add('text-orange', 'font-bold', 'is-active-nav');
      });
    }
    if (isContact) {
      document.querySelectorAll('a[href*="contact.html"].nav-link-item').forEach(a => {
        a.classList.add('text-orange', 'font-bold', 'is-active-nav');
      });
    }

    // 3. Desktop Dropdowns (Home, Programs, Facilities, Dashboard)
    const homeDropdown = document.querySelector('.nav-item-dropdown[data-dropdown="home"]');
    const progDropdown = document.querySelector('.nav-item-dropdown[data-dropdown="programs"]');
    const facDropdown = document.querySelector('.nav-item-dropdown[data-dropdown="facilities"]');
    const dashDropdown = document.querySelector('.nav-item-dropdown[data-dropdown="dashboard"]');

    if (isHome && homeDropdown) {
      homeDropdown.classList.add('is-current-category');
      const trigger = homeDropdown.querySelector('.dropdown-trigger');
      if (trigger) trigger.classList.add('text-orange', 'font-bold', 'is-active-nav');
    } else if (isPrograms && progDropdown) {
      progDropdown.classList.add('is-current-category');
      const trigger = progDropdown.querySelector('.dropdown-trigger');
      if (trigger) trigger.classList.add('text-orange', 'font-bold', 'is-active-nav');
    } else if (isFacilities && facDropdown) {
      facDropdown.classList.add('is-current-category');
      const trigger = facDropdown.querySelector('.dropdown-trigger');
      if (trigger) trigger.classList.add('text-orange', 'font-bold', 'is-active-nav');
    } else if (isDashboard && dashDropdown) {
      dashDropdown.classList.add('is-current-category');
      const trigger = dashDropdown.querySelector('.dropdown-trigger');
      if (trigger) trigger.classList.add('text-orange', 'font-bold', 'is-active-nav');
    }

    // 4. Highlight Active Sub-Links in Desktop Mega Menus
    document.querySelectorAll('.mega-dropdown-menu a').forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        const linkKey = resolvePageKey(href);
        if (linkKey === key) {
          link.classList.add('is-active-link');
        }
      }
    });

    // 5. Reset Mobile Menu Drawer Indicators
    document.querySelectorAll('.mobile-dropdown-toggle').forEach(b => {
      b.classList.remove('is-current-category', 'is-open', 'text-orange', 'font-bold');
      const icon = b.querySelector('.mobile-toggle-icon');
      if (icon) icon.classList.remove('rotate-180');
      const content = b.nextElementSibling;
      if (content) content.classList.add('hidden');
    });
    document.querySelectorAll('.mobile-menu-drawer .mobile-nav-link').forEach(a => {
      a.classList.remove('is-active-nav', 'text-orange', 'font-bold');
    });
    document.querySelectorAll('.mobile-menu-drawer .mobile-sub-link, .mobile-menu-drawer div div a').forEach(a => {
      a.classList.remove('is-active-link', 'is-active-nav');
    });

    // 6. Highlight Mobile Top-Level Category & Auto-Open Active Accordion
    if (isHome) {
      const homeBtn = document.querySelector('.mobile-dropdown-toggle[data-mobile-dropdown="home"]');
      if (homeBtn) {
        homeBtn.classList.add('is-current-category', 'is-open', 'text-orange', 'font-bold');
        const icon = homeBtn.querySelector('.mobile-toggle-icon');
        if (icon) icon.classList.add('rotate-180');
        const content = homeBtn.nextElementSibling;
        if (content) content.classList.remove('hidden');
      }
    } else if (isPrograms) {
      const progBtn = document.querySelector('.mobile-dropdown-toggle[data-mobile-dropdown="programs"]');
      if (progBtn) {
        progBtn.classList.add('is-current-category', 'is-open', 'text-orange', 'font-bold');
        const icon = progBtn.querySelector('.mobile-toggle-icon');
        if (icon) icon.classList.add('rotate-180');
        const content = progBtn.nextElementSibling;
        if (content) content.classList.remove('hidden');
      }
    } else if (isFacilities) {
      const facBtn = document.querySelector('.mobile-dropdown-toggle[data-mobile-dropdown="facilities"]');
      if (facBtn) {
        facBtn.classList.add('is-current-category', 'is-open', 'text-orange', 'font-bold');
        const icon = facBtn.querySelector('.mobile-toggle-icon');
        if (icon) icon.classList.add('rotate-180');
        const content = facBtn.nextElementSibling;
        if (content) content.classList.remove('hidden');
      }
    } else if (isDashboard) {
      const dashBtn = document.querySelector('.mobile-dropdown-toggle[data-mobile-dropdown="dashboard"]');
      if (dashBtn) {
        dashBtn.classList.add('is-current-category', 'is-open', 'text-orange', 'font-bold');
        const icon = dashBtn.querySelector('.mobile-toggle-icon');
        if (icon) icon.classList.add('rotate-180');
        const content = dashBtn.nextElementSibling;
        if (content) content.classList.remove('hidden');
      }
    } else if (isAbout) {
      document.querySelectorAll('.mobile-menu-drawer a[href*="about.html"]').forEach(a => {
        a.classList.add('is-active-nav', 'text-orange', 'font-bold');
      });
    } else if (isInstructors) {
      document.querySelectorAll('.mobile-menu-drawer a[href*="instructors.html"]').forEach(a => {
        a.classList.add('is-active-nav', 'text-orange', 'font-bold');
      });
    } else if (isContact) {
      document.querySelectorAll('.mobile-menu-drawer a[href*="contact.html"]').forEach(a => {
        a.classList.add('is-active-nav', 'text-orange', 'font-bold');
      });
    }

    // 7. Highlight Active Sub-link inside Mobile Drawer
    document.querySelectorAll('.mobile-menu-drawer .mobile-sub-link, .mobile-menu-drawer div div a').forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        const linkKey = resolvePageKey(href);
        if (linkKey === key) {
          link.classList.add('is-active-link');
        }
      }
    });
  }

  // 5. Desktop & Mobile Navigation Controls
  function initNavigation(key) {
    const navbar = document.querySelector('.main-navbar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-toggle');
    const mobileDrawer = document.querySelector('.mobile-menu-drawer');
    const mobileCloseBtn = document.querySelector('.mobile-menu-close');
    const backdrop = document.querySelector('.mobile-nav-backdrop');

    if (navbar && !navbar.dataset.scrollBound) {
      navbar.dataset.scrollBound = 'true';
      window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
          navbar.classList.add('shadow-lg', 'bg-white/95', 'dark:bg-navy-900/95', 'backdrop-blur-md');
        } else {
          navbar.classList.remove('shadow-lg');
        }
      });
    }

    function openMobileMenu() {
      if (mobileDrawer) {
        updateActiveNavState(key);
        mobileDrawer.classList.remove('translate-x-full', '-translate-x-full', 'hidden');
        mobileDrawer.classList.add('translate-x-0');
        if (backdrop) backdrop.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      }
    }

    function closeMobileMenu() {
      if (mobileDrawer) {
        const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
        mobileDrawer.classList.remove('translate-x-0');
        mobileDrawer.classList.add(isRtl ? 'translate-x-full' : '-translate-x-full');
        if (backdrop) backdrop.classList.add('hidden');
        document.body.style.overflow = '';
      }
    }

    if (mobileMenuBtn) {
      mobileMenuBtn.onclick = (e) => {
        e.preventDefault();
        openMobileMenu();
      };
    }

    if (mobileCloseBtn) {
      mobileCloseBtn.onclick = (e) => {
        e.preventDefault();
        closeMobileMenu();
      };
    }

    if (backdrop) {
      backdrop.onclick = closeMobileMenu;
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMobileMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1280 && mobileDrawer && mobileDrawer.classList.contains('translate-x-0')) {
        closeMobileMenu();
      }
    });

    if (mobileDrawer) {
      mobileDrawer.querySelectorAll('a').forEach(anchor => {
        anchor.addEventListener('click', closeMobileMenu);
      });
    }

    updateActiveNavState(key);
  }

  // 6. Fast Zero-Reload SPA Router for Public Pages
  async function navigateTo(targetUrl, isPopState = false) {
    startProgress();

    // Immediately close all dropdowns and blur active elements
    document.querySelectorAll('.nav-item-dropdown').forEach(d => {
      d.classList.add('force-closed');
      d.classList.remove('active', 'is-open');
      delete d.dataset.pinned;
      setTimeout(() => d.classList.remove('force-closed'), 350);
    });
    if (document.activeElement && typeof document.activeElement.blur === 'function') {
      document.activeElement.blur();
    }

    const pageKey = resolvePageKey(targetUrl);
    const canonicalUrl = getCanonicalUrl(pageKey);
    const hash = targetUrl.includes('#') ? targetUrl.split('#')[1] : null;

    // Direct dashboard and auth pages out to native browser handling
    if (pageKey.startsWith('dashboard') || pageKey.startsWith('auth')) {
      finishProgress();
      window.location.href = canonicalUrl;
      return;
    }

    const pageData = window.WELDPRO_PAGES ? window.WELDPRO_PAGES[pageKey] : null;
    const currentMain = document.querySelector('main');

    // Instant swap if page is in memory and DOM has <main>
    if (pageData && pageData.mainHtml && currentMain) {
      if (pageData.title) document.title = pageData.title;

      if (!isPopState) {
        try {
          history.pushState({ pageKey, url: canonicalUrl }, '', canonicalUrl);
        } catch (e) {}
      }

      const temp = document.createElement('div');
      temp.innerHTML = pageData.mainHtml;
      const newMain = temp.firstElementChild;

      if (newMain) {
        // Normalize image & asset paths according to active document directory depth
        try {
          const currentPath = window.location.pathname.replace(/\\/g, '/');
          const isNested = currentPath.split('/').filter(Boolean).some(s => ['programs', 'facilities', 'dashboard', 'auth'].includes(s));
          const targetPrefix = isNested ? '../assets/' : 'assets/';
          newMain.querySelectorAll('img').forEach(img => {
            const rawSrc = img.getAttribute('src');
            if (rawSrc && (rawSrc.includes('assets/images/') || rawSrc.includes('assets/logo/'))) {
              const filename = rawSrc.split('/').pop();
              const sub = rawSrc.includes('assets/logo/') ? 'logo/' : 'images/';
              img.setAttribute('src', targetPrefix + sub + filename);
            }
          });
        } catch (e) {}

        currentMain.replaceWith(newMain);

        if (hash) {
          const el = document.getElementById(hash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'instant' });
        }

        // 1. Immediately update active indicators across desktop and mobile nav
        try {
          updateActiveNavState(pageKey);
        } catch (err) {
          console.error('[WELDPRO] Error updating active nav state:', err);
        }

        // 2. Re-bind navigation drawer & scroll listeners
        try {
          initNavigation(pageKey);
        } catch (err) {
          console.error('[WELDPRO] Error re-binding navigation:', err);
        }

        // 3. Re-initialize interactive components safely
        try {
          if (window.WeldTheme && typeof window.WeldTheme.initButtons === 'function') {
            window.WeldTheme.initButtons();
          }
        } catch (err) {}

        try {
          if (window.WeldDirection && typeof window.WeldDirection.initButtons === 'function') {
            window.WeldDirection.initButtons();
          }
        } catch (err) {}

        try {
          if (window.WeldMegaMenu && typeof window.WeldMegaMenu.initMegaMenu === 'function') {
            window.WeldMegaMenu.initMegaMenu();
          }
        } catch (err) {}

        try {
          if (window.WeldMain && typeof window.WeldMain.reinitAll === 'function') {
            window.WeldMain.reinitAll();
          }
        } catch (err) {}

        finishProgress();
        return;
      }
    }

    // Fallback: Native load
    finishProgress();
    window.location.href = canonicalUrl;
  }

  // 7. Global Link Click Interceptor
  function initSPARouter() {
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Skip non-HTML links, mailto, tel, javascript, or external targets
      if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return;
      if (anchor.target === '_blank' || anchor.hasAttribute('download') || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

      const pageKey = resolvePageKey(href);

      // DO NOT intercept dashboard or auth — let browser navigate natively!
      if (pageKey.startsWith('dashboard') || pageKey.startsWith('auth')) {
        return;
      }

      const canonicalUrl = getCanonicalUrl(pageKey);
      const currentPageKey = resolvePageKey(window.location.href);
      const targetHash = href.includes('#') ? href.split('#')[1] : null;

      // Same page anchor navigation
      if (currentPageKey === pageKey && targetHash) {
        e.preventDefault();
        const el = document.getElementById(targetHash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      // Same page top scroll
      if (currentPageKey === pageKey && !targetHash && !href.includes('?')) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // Execute instant zero-reload transition
      e.preventDefault();
      navigateTo(canonicalUrl);
    });

    // Handle browser Back / Forward buttons
    window.addEventListener('popstate', (e) => {
      if (e.state && e.state.url) {
        navigateTo(e.state.url, true);
      } else {
        navigateTo(window.location.href, true);
      }
    });
  }

  function boot() {
    initNavigation();
    initSPARouter();
  }

  window.WeldNavigation = {
    initNavigation,
    updateActiveNavState,
    navigateTo,
    resolvePageKey,
    getSiteRoot,
    getCanonicalUrl
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
