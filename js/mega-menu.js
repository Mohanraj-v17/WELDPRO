/**
 * WELDPRO Mega Menu & Dropdown Interaction Manager
 * Rock-solid hover grace periods, click-to-pin, touch support,
 * and seamless sub-link interaction across all viewports.
 * Idempotent: Never stacks duplicate event listeners.
 */
(function() {
  let closeTimers = new Map();

  function initMegaMenu() {
    // Clear any pending timers
    closeTimers.forEach(timer => clearTimeout(timer));
    closeTimers.clear();

    const dropdownItems = document.querySelectorAll('.nav-item-dropdown');

    dropdownItems.forEach(item => {
      // Prevent attaching duplicate listeners to the same dropdown item
      if (item.dataset.megaBound === 'true') return;
      item.dataset.megaBound = 'true';

      const trigger = item.querySelector('.dropdown-trigger');
      const menu = item.querySelector('.mega-dropdown-menu, .dropdown-menu');

      if (!trigger || !menu) return;

      // 1. Hover Enter (with instant activation and timer cancellation)
      function onMouseEnter() {
        if (closeTimers.has(item)) {
          clearTimeout(closeTimers.get(item));
          closeTimers.delete(item);
        }

        // Close unpinned siblings
        dropdownItems.forEach(other => {
          if (other !== item && other.dataset.pinned !== 'true') {
            other.classList.remove('active', 'is-open');
          }
        });

        item.classList.add('active', 'is-open');
      }

      // 2. Hover Leave (with 250ms debounce grace period)
      function onMouseLeave() {
        if (item.dataset.pinned === 'true') return; // Stay open if pinned by click

        if (closeTimers.has(item)) {
          clearTimeout(closeTimers.get(item));
        }

        const timer = setTimeout(() => {
          item.classList.remove('active', 'is-open');
          closeTimers.delete(item);
        }, 250);

        closeTimers.set(item, timer);
      }

      // Attach mouse events to container and menu
      item.addEventListener('mouseenter', onMouseEnter);
      item.addEventListener('mouseleave', onMouseLeave);

      menu.addEventListener('mouseenter', () => {
        if (closeTimers.has(item)) {
          clearTimeout(closeTimers.get(item));
          closeTimers.delete(item);
        }
        item.classList.add('active', 'is-open');
      });

      menu.addEventListener('mouseleave', onMouseLeave);

      // 3. Click / Touch to Toggle & Pin Open
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const isCurrentlyOpen = item.classList.contains('active') || item.classList.contains('is-open');

        // Close all other dropdowns
        dropdownItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('active', 'is-open');
            delete other.dataset.pinned;
          }
        });

        if (isCurrentlyOpen && item.dataset.pinned === 'true') {
          item.classList.remove('active', 'is-open');
          delete item.dataset.pinned;
        } else {
          item.classList.add('active', 'is-open');
          item.dataset.pinned = 'true';
        }
      });

      // 4. Sub-Link Interaction: allow immediate navigation and instant clean closure
      const subLinks = menu.querySelectorAll('a');
      subLinks.forEach(link => {
        function closeDropdownImmediately() {
          item.classList.add('force-closed');
          item.classList.remove('active', 'is-open');
          delete item.dataset.pinned;
          if (document.activeElement && typeof document.activeElement.blur === 'function') {
            document.activeElement.blur();
          }
          setTimeout(() => {
            item.classList.remove('force-closed');
          }, 350);
        }

        link.addEventListener('click', closeDropdownImmediately);
        link.addEventListener('touchend', closeDropdownImmediately);
      });
    });

    // 5. Mobile Menu Drawer Accordions
    document.querySelectorAll('.mobile-dropdown-toggle').forEach(btn => {
      if (btn.dataset.accordionBound === 'true') return;
      btn.dataset.accordionBound = 'true';

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const content = btn.nextElementSibling;
        const icon = btn.querySelector('.mobile-toggle-icon');
        
        if (content) {
          const isClosed = content.classList.contains('hidden');
          if (isClosed) {
            content.classList.remove('hidden');
            btn.classList.add('is-open');
            if (icon) icon.classList.add('rotate-180');
          } else {
            content.classList.add('hidden');
            btn.classList.remove('is-open');
            if (icon) icon.classList.remove('rotate-180');
          }
        }
      });
    });
  }

  // Global document-level listeners (registered ONCE)
  if (!window.__weldMegaMenuGlobalBound) {
    window.__weldMegaMenuGlobalBound = true;

    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-item-dropdown')) {
        document.querySelectorAll('.nav-item-dropdown').forEach(item => {
          item.classList.remove('active', 'is-open');
          delete item.dataset.pinned;
        });
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.nav-item-dropdown').forEach(item => {
          item.classList.remove('active', 'is-open');
          delete item.dataset.pinned;
        });
      }
    });
  }

  window.WeldMegaMenu = {
    initMegaMenu
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMegaMenu);
  } else {
    initMegaMenu();
  }
})();
