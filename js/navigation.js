/**
 * WELDPRO Navigation Manager
 * Handles sticky navbar, mobile drawers, active states
 */
(function() {
  function initNavigation() {
    const navbar = document.querySelector('.main-navbar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-toggle');
    const mobileDrawer = document.querySelector('.mobile-menu-drawer');
    const mobileCloseBtn = document.querySelector('.mobile-menu-close');
    const backdrop = document.querySelector('.mobile-nav-backdrop');

    // Sticky header on scroll
    if (navbar) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
          navbar.classList.add('shadow-lg', 'bg-white/95', 'dark:bg-navy-900/95', 'backdrop-blur-md');
        } else {
          navbar.classList.remove('shadow-lg');
        }
      });
    }

    // Open Mobile Drawer
    function openMobileMenu() {
      if (mobileDrawer) {
        mobileDrawer.classList.remove('translate-x-full', '-translate-x-full', 'hidden');
        mobileDrawer.classList.add('translate-x-0');
        if (backdrop) backdrop.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      }
    }

    // Close Mobile Drawer
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
      mobileMenuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openMobileMenu();
      });
    }

    if (mobileCloseBtn) {
      mobileCloseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeMobileMenu();
      });
    }

    if (backdrop) {
      backdrop.addEventListener('click', closeMobileMenu);
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMobileMenu();
      }
    });

    // Auto-close drawer on viewport resize to desktop (>= 1280px)
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1280 && mobileDrawer && mobileDrawer.classList.contains('translate-x-0')) {
        closeMobileMenu();
      }
    });

    // Close mobile drawer when clicking regular navigation links inside it
    if (mobileDrawer) {
      mobileDrawer.querySelectorAll('a').forEach(anchor => {
        anchor.addEventListener('click', () => {
          closeMobileMenu();
        });
      });
    }

    // Highlight current nav link
    const currentPath = window.location.pathname.toLowerCase();
    const navLinks = document.querySelectorAll('.nav-link-item');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        const cleanHref = href.replace('../', '').replace('./', '').toLowerCase();
        if (currentPath.endsWith(cleanHref) && cleanHref !== '#' && cleanHref !== '') {
          link.classList.add('text-orange-500', 'font-semibold');
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
  } else {
    initNavigation();
  }
})();
