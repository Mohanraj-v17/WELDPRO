/**
 * WELDPRO Dashboard Interactions & State Manager
 */
(function() {
  function initDashboard() {
    const sidebar = document.querySelector('.dashboard-sidebar');
    const sidebarToggle = document.querySelector('.sidebar-toggle-btn');
    const sidebarClose = document.querySelector('.sidebar-close-btn');
    const backdrop = document.querySelector('.dashboard-backdrop');

    // Sidebar Mobile Toggling
    if (sidebarToggle && sidebar) {
      sidebarToggle.addEventListener('click', (e) => {
        e.preventDefault();
        sidebar.classList.toggle('sidebar-open');
        if (backdrop) backdrop.classList.toggle('active');
      });
    }

    if (sidebarClose && sidebar) {
      sidebarClose.addEventListener('click', (e) => {
        e.preventDefault();
        sidebar.classList.remove('sidebar-open');
        if (backdrop) backdrop.classList.remove('active');
      });
    }

    if (backdrop && sidebar) {
      backdrop.addEventListener('click', () => {
        sidebar.classList.remove('sidebar-open');
        backdrop.classList.remove('active');
      });
    }

    // Populate Student Data across all UI slots
    const user = window.WeldAuth ? window.WeldAuth.getCurrentUser() : null;
    if (user) {
      document.querySelectorAll('.user-name-display').forEach(el => el.textContent = user.name);
      document.querySelectorAll('.user-id-display').forEach(el => el.textContent = user.studentId);
      document.querySelectorAll('.user-program-display').forEach(el => el.textContent = user.program);
      document.querySelectorAll('.user-email-display').forEach(el => el.textContent = user.email);
      document.querySelectorAll('.user-phone-display').forEach(el => el.textContent = user.phone || '+1 (555) 234-8921');
      document.querySelectorAll('.user-hours-completed').forEach(el => el.textContent = user.completedHours);
      document.querySelectorAll('.user-hours-total').forEach(el => el.textContent = user.totalHours);
      document.querySelectorAll('.user-hours-remaining').forEach(el => el.textContent = user.totalHours - user.completedHours);
      document.querySelectorAll('.user-avatar-display').forEach(el => {
        if (el.tagName === 'IMG') {
          el.src = user.avatar;
          el.alt = user.name;
        }
      });
    }

    // User Profile Dropdown in Topbar
    const profileTrigger = document.querySelector('.profile-menu-trigger');
    const profileDropdown = document.querySelector('.profile-menu-dropdown');
    if (profileTrigger && profileDropdown) {
      profileTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle('hidden');
      });
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.profile-menu-wrapper')) {
          profileDropdown.classList.add('hidden');
        }
      });
    }

    // Notifications Dropdown
    const notifTrigger = document.querySelector('.notif-menu-trigger');
    const notifDropdown = document.querySelector('.notif-menu-dropdown');
    if (notifTrigger && notifDropdown) {
      notifTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        notifDropdown.classList.toggle('hidden');
      });
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.notif-menu-wrapper')) {
          notifDropdown.classList.add('hidden');
        }
      });
    }

    // Logout Button
    document.querySelectorAll('.btn-logout-action').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Are you sure you want to log out of the WELDPRO Student Portal?')) {
          window.WeldAuth.logout('../auth/login.html');
        }
      });
    });

    // Profile Form Handler (if on my-profile.html)
    const profileForm = document.getElementById('studentProfileForm');
    if (profileForm) {
      // Pre-fill fields
      if (user) {
        if (profileForm.elements['fullName']) profileForm.elements['fullName'].value = user.name;
        if (profileForm.elements['email']) profileForm.elements['email'].value = user.email;
        if (profileForm.elements['phone']) profileForm.elements['phone'].value = user.phone;
        if (profileForm.elements['emergencyContact']) profileForm.elements['emergencyContact'].value = user.emergencyContact || '';
        if (profileForm.elements['boothAssigned']) profileForm.elements['boothAssigned'].value = user.boothAssigned || '';
      }

      profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const updated = {
          name: profileForm.elements['fullName']?.value || user.name,
          phone: profileForm.elements['phone']?.value || user.phone,
          emergencyContact: profileForm.elements['emergencyContact']?.value || '',
          boothAssigned: profileForm.elements['boothAssigned']?.value || ''
        };
        window.WeldAuth.updateCurrentUser(updated);
        
        // Show success alert
        const alertBox = document.getElementById('profileSuccessAlert');
        if (alertBox) {
          alertBox.classList.remove('hidden');
          setTimeout(() => alertBox.classList.add('hidden'), 4000);
        }
      });
    }

    // Active Sidebar Nav link
    const pathname = window.location.pathname.toLowerCase();
    document.querySelectorAll('.sidebar-nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        const cleanHref = href.replace('./', '').toLowerCase();
        if (pathname.endsWith(cleanHref) || (cleanHref === 'index.html' && pathname.endsWith('/dashboard/'))) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboard);
  } else {
    initDashboard();
  }
})();
