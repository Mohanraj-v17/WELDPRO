/**
 * WELDPRO Mega Menu & Dropdown Interaction Manager
 * Rock-solid hover grace periods, click-to-pin, touch support,
 * and seamless sub-link interaction across all viewports.
 */
(function() {
  let closeTimers = new Map();

  function initMegaMenu() {
    // Clear any pending timers
    closeTimers.forEach(timer => clearTimeout(timer));
    closeTimers.clear();

    const dropdownItems = document.querySelectorAll('.nav-item-dropdown');

    dropdownItems.forEach(item => {
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

      // Attach mouse events to both container and menu
      item.addEventListener('mouseenter', onMouseEnter);
      item.addEventListener('mouseleave', onMouseLeave);

      // Keep menu open while cursor is anywhere inside the dropdown menu
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

    // 5. Close on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-item-dropdown')) {
        dropdownItems.forEach(item => {
          item.classList.remove('active', 'is-open');
          delete item.dataset.pinned;
        });
      }
    });

    // 6. Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        dropdownItems.forEach(item => {
          item.classList.remove('active', 'is-open');
          delete item.dataset.pinned;
        });
      }
    });

    // 7. Mobile Menu Drawer Accordions
    const mobileDropdownTriggers = document.querySelectorAll('.mobile-dropdown-toggle');
    mobileDropdownTriggers.forEach(btn => {
      btn.replaceWith(btn.cloneNode(true)); // remove stale listeners
    });

    document.querySelectorAll('.mobile-dropdown-toggle').forEach(btn => {
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

  window.WeldMegaMenu = {
    initMegaMenu
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMegaMenu);
  } else {
    initMegaMenu();
  }
})();
