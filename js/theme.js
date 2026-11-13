/**
 * WELDPRO Theme Manager
 * Dark / Light Mode with localStorage persistence & no-flash execution
 */
(function() {
  const THEME_KEY = 'weldpro-theme';

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Update all theme toggle buttons on the page
    const toggles = document.querySelectorAll('.theme-toggle-btn');
    toggles.forEach(btn => {
      const icon = btn.querySelector('i');
      const label = btn.querySelector('.theme-label');
      if (icon) {
        if (theme === 'dark') {
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

    // Swap logo assets for dark/light contrast (except in dark footer)
    const logos = document.querySelectorAll('img[src*="weldpro-logo"]');
    logos.forEach(img => {
      if (img.closest('footer') || img.closest('.bg-navy-900')) {
        img.src = img.src.replace('weldpro-logo-light.svg', 'weldpro-logo.svg');
      } else if (theme === 'light') {
        img.src = img.src.replace('weldpro-logo.svg', 'weldpro-logo-light.svg');
      } else {
        img.src = img.src.replace('weldpro-logo-light.svg', 'weldpro-logo.svg');
      }
    });

    window.dispatchEvent(new CustomEvent('weldpro-theme-changed', { detail: { theme } }));
  }

  // Determine initial theme
  const savedTheme = localStorage.getItem(THEME_KEY);
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

  // Immediately apply to avoid flash
  applyTheme(initialTheme);

  window.WeldTheme = {
    get: () => document.documentElement.classList.contains('dark') ? 'dark' : 'light',
    set: (theme) => {
      localStorage.setItem(THEME_KEY, theme);
      applyTheme(theme);
    },
    toggle: () => {
      const nextTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
      window.WeldTheme.set(nextTheme);
    },
    initButtons: () => {
      document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
        btn.removeEventListener('click', window.WeldTheme.toggle);
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          window.WeldTheme.toggle();
        });
      });
      applyTheme(window.WeldTheme.get());
    }
  };

  // Re-sync button states when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.WeldTheme.initButtons);
  } else {
    window.WeldTheme.initButtons();
  }
})();
