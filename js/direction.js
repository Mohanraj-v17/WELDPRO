/**
 * WELDPRO Direction Manager (LTR / RTL)
 * Controls document.documentElement.dir and persists in localStorage
 */
(function() {
  const DIR_KEY = 'weldpro-direction';

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

    window.dispatchEvent(new CustomEvent('weldpro-dir-changed', { detail: { dir: validDir } }));
  }

  const savedDir = localStorage.getItem(DIR_KEY) || 'ltr';
  applyDirection(savedDir);

  window.WeldDirection = {
    get: () => document.documentElement.getAttribute('dir') || 'ltr',
    set: (dir) => {
      localStorage.setItem(DIR_KEY, dir);
      applyDirection(dir);
    },
    toggle: () => {
      const current = window.WeldDirection.get();
      const next = current === 'rtl' ? 'ltr' : 'rtl';
      window.WeldDirection.set(next);
    },
    initButtons: () => {
      document.querySelectorAll('.dir-toggle-btn').forEach(btn => {
        btn.removeEventListener('click', window.WeldDirection.toggle);
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          window.WeldDirection.toggle();
        });
      });
      applyDirection(window.WeldDirection.get());
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.WeldDirection.initButtons);
  } else {
    window.WeldDirection.initButtons();
  }
})();
