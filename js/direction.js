/**
 * WELDPRO Direction Manager (LTR / RTL)
 * Controls document.documentElement.dir with localStorage persistence.
 * Completely idempotent with robust event delegation to prevent duplicate toggles.
 */
(function() {
  const DIR_KEY = 'weldpro-direction';

  function getStoredDir() {
    try {
      return localStorage.getItem(DIR_KEY);
    } catch (e) {
      return null;
    }
  }

  function setStoredDir(dir) {
    try {
      localStorage.setItem(DIR_KEY, dir);
    } catch (e) {}
  }

  function applyDirection(dir) {
    const validDir = dir === 'rtl' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', validDir);

    const toggles = document.querySelectorAll('.dir-toggle-btn');
    toggles.forEach(btn => {
      const textSpan = btn.querySelector('.dir-label');
      if (textSpan) {
        textSpan.textContent = validDir === 'rtl' ? 'LTR' : 'RTL';
      }
      btn.setAttribute('title', `Switch to ${validDir === 'rtl' ? 'LTR' : 'RTL'}`);
      btn.setAttribute('aria-label', `Switch to ${validDir === 'rtl' ? 'LTR' : 'RTL'}`);
    });

    try {
      window.dispatchEvent(new CustomEvent('weldpro-dir-changed', { detail: { dir: validDir } }));
    } catch (e) {}
  }

  const savedDir = getStoredDir() || 'ltr';
  applyDirection(savedDir);

  window.WeldDirection = {
    get: () => document.documentElement.getAttribute('dir') || 'ltr',
    set: (dir) => {
      setStoredDir(dir);
      applyDirection(dir);
    },
    toggle: () => {
      const current = window.WeldDirection.get();
      const next = current === 'rtl' ? 'ltr' : 'rtl';
      window.WeldDirection.set(next);
    },
    applyDirection: applyDirection,
    initButtons: () => {
      applyDirection(window.WeldDirection.get());
    }
  };

  // Global idempotent click handler: exactly one click = exactly one toggle!
  if (!window.__weldDirDelegated) {
    window.__weldDirDelegated = true;
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.dir-toggle-btn');
      if (btn) {
        e.preventDefault();
        e.stopPropagation();
        window.WeldDirection.toggle();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.WeldDirection.initButtons);
  } else {
    window.WeldDirection.initButtons();
  }
})();
