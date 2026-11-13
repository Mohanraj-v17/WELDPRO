/**
 * WELDPRO Mega Menu Manager
 * Handles desktop hover/click dropdowns, escape key, outside click,
 * and mobile accordion dropdown toggles.
 */
(function() {
  function initMegaMenu() {
    const dropdownItems = document.querySelectorAll('.nav-item-dropdown');

    // Desktop Click Toggle (in addition to hover)
    dropdownItems.forEach(item => {
      const trigger = item.querySelector('.dropdown-trigger');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          // On mobile & tablets (< 1280px), let mobile accordion handle it
          if (window.innerWidth < 1280) return;
          
          e.preventDefault();
          const isOpen = item.classList.contains('active');
          dropdownItems.forEach(other => {
            if (other !== item) other.classList.remove('active');
          });
          if (isOpen) {
            item.classList.remove('active');
          } else {
            item.classList.add('active');
          }
        });
      }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-item-dropdown')) {
        dropdownItems.forEach(item => item.classList.remove('active'));
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        dropdownItems.forEach(item => item.classList.remove('active'));
      }
    });

    // Mobile Accordion Behavior
    const mobileDropdownTriggers = document.querySelectorAll('.mobile-dropdown-toggle');
    mobileDropdownTriggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const content = btn.nextElementSibling;
        const icon = btn.querySelector('.mobile-toggle-icon');
        
        if (content) {
          const isClosed = content.classList.contains('hidden');
          if (isClosed) {
            content.classList.remove('hidden');
            if (icon) icon.classList.add('rotate-180');
          } else {
            content.classList.add('hidden');
            if (icon) icon.classList.remove('rotate-180');
          }
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMegaMenu);
  } else {
    initMegaMenu();
  }
})();
