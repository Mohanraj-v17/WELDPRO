/**
 * WELDPRO Theme Manager
 * Dark / Light Mode with localStorage persistence & zero-flash execution.
 * Completely idempotent with robust event delegation to prevent duplicate toggles.
 */
(function() {
  const THEME_KEY = 'weldpro-theme';

  function getStoredTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (e) {
      return null;
    }
  }

  function setStoredTheme(theme) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {}
  }

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Update all theme toggle buttons across the DOM (desktop navbar, mobile drawer, auth, dashboard)
    const toggles = document.querySelectorAll('.theme-toggle-btn');
    toggles.forEach(btn => {
      const icon = btn.querySelector('i');
      const label = btn.querySelector('.theme-label');
      if (icon) {
        if (isDark) {
          icon.className = 'fa-solid fa-sun text-yellow-400';
          btn.setAttribute('title', 'Switch to Light Mode');
          btn.setAttribute('aria-label', 'Switch to Light Mode');
          if (label) label.textContent = 'Light';
        } else {
          icon.className = 'fa-solid fa-moon text-slate-700';
          btn.setAttribute('title', 'Switch to Dark Mode');
          btn.setAttribute('aria-label', 'Switch to Dark Mode');
          if (label) label.textContent = 'Dark';
        }
      }
    });

    // Safely swap logo assets for dark/light contrast
    const logos = document.querySelectorAll('img[src*="weldpro-logo"]');
    logos.forEach(img => {
      const rawSrc = img.getAttribute('src') || '';
      const isSidebar = Boolean(img.closest('.dashboard-sidebar'));
      const dirIndex = rawSrc.lastIndexOf('/');
      const prefix = dirIndex !== -1 ? rawSrc.substring(0, dirIndex + 1) : '';

      if (isSidebar || isDark) {
        img.src = prefix + 'weldpro-logo.svg';
      } else {
        img.src = prefix + 'weldpro-logo-light.svg';
      }
    });

    try {
      window.dispatchEvent(new CustomEvent('weldpro-theme-changed', { detail: { theme: isDark ? 'dark' : 'light' } }));
    } catch (e) {}
  }

  // Determine initial theme
  const savedTheme = getStoredTheme();
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

  // Immediately apply to avoid flash
  applyTheme(initialTheme);

  window.WeldTheme = {
    get: () => document.documentElement.classList.contains('dark') ? 'dark' : 'light',
    set: (theme) => {
      setStoredTheme(theme);
      applyTheme(theme);
    },
    toggle: () => {
      const current = window.WeldTheme.get();
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      window.WeldTheme.set(nextTheme);
    },
    applyTheme: applyTheme,
    initButtons: () => {
      applyTheme(window.WeldTheme.get());
    }
  };

  // Global idempotent click handler: exactly one click = exactly one toggle!
  if (!window.__weldThemeDelegated) {
    window.__weldThemeDelegated = true;
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.theme-toggle-btn');
      if (btn) {
        e.preventDefault();
        e.stopPropagation();
        window.WeldTheme.toggle();
      }
    });
  }

  // Sync button states on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.WeldTheme.initButtons);
  } else {
    window.WeldTheme.initButtons();
  }
})();
