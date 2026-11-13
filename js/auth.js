/**
 * WELDPRO Student Authentication Engine (Demo Mode)
 * Provides authenticated student session management with localStorage persistence.
 * Note: Clearly labelled for demonstration and training institutional workflows.
 */
(function() {
  const SESSION_KEY = 'weldpro_auth_session';
  const STUDENTS_STORE = 'weldpro_registered_students';

  // Pre-configured default demo student
  const DEFAULT_STUDENT = {
    name: 'Marcus Vance',
    email: 'student@weldpro.edu',
    phone: '+1 (555) 234-8921',
    studentId: 'WP-2026-8942',
    program: 'Advanced Pipe & Pressure Vessel Welding',
    enrolledDate: 'August 15, 2026',
    status: 'Active - Level 3',
    boothAssigned: 'Booth #14 (Heavy Industrial)',
    emergencyContact: 'Elena Vance (+1 555-882-9912)',
    ppeSize: 'Helmet: L | Jacket: XL | Gloves: 10',
    totalHours: 300,
    completedHours: 214,
    assessmentsPassed: 8,
    certificationsEarned: 2,
    avatar: null
  };

  function getStoredStudents() {
    try {
      const list = JSON.parse(localStorage.getItem(STUDENTS_STORE)) || [];
      return list;
    } catch (e) {
      return [];
    }
  }

  function saveStudent(student) {
    const list = getStoredStudents();
    const index = list.findIndex(s => s.email.toLowerCase() === student.email.toLowerCase());
    if (index >= 0) {
      list[index] = { ...list[index], ...student };
    } else {
      list.push(student);
    }
    localStorage.setItem(STUDENTS_STORE, JSON.stringify(list));
  }

  window.WeldAuth = {
    isLoggedIn: () => {
      return !!localStorage.getItem(SESSION_KEY);
    },

    getCurrentUser: () => {
      try {
        const data = localStorage.getItem(SESSION_KEY);
        if (!data) return DEFAULT_STUDENT;
        return JSON.parse(data);
      } catch (e) {
        return DEFAULT_STUDENT;
      }
    },

    updateCurrentUser: (updates) => {
      const current = window.WeldAuth.getCurrentUser();
      const updated = { ...current, ...updates };
      localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
      saveStudent(updated);
      window.dispatchEvent(new CustomEvent('weldpro-user-updated', { detail: updated }));
      return updated;
    },

    login: (email, password, remember = true) => {
      const trimmedEmail = (email || '').trim().toLowerCase();
      // Demo authentication simulation
      let user = DEFAULT_STUDENT;
      const registered = getStoredStudents().find(s => s.email.toLowerCase() === trimmedEmail);
      if (registered) {
        user = registered;
      } else if (trimmedEmail !== 'student@weldpro.edu' && trimmedEmail.length > 3) {
        user = {
          ...DEFAULT_STUDENT,
          name: trimmedEmail.split('@')[0].replace('.', ' ').toUpperCase(),
          email: trimmedEmail,
          studentId: 'WP-' + Math.floor(1000 + Math.random() * 9000)
        };
      }
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      return { success: true, user };
    },

    register: (formData) => {
      const newStudent = {
        ...DEFAULT_STUDENT,
        name: formData.name || 'New Trainee',
        email: (formData.email || '').toLowerCase(),
        phone: formData.phone || '+1 (555) 000-0000',
        program: formData.program || 'SMAW Stick Welding',
        studentId: 'WP-2026-' + Math.floor(1000 + Math.random() * 9000),
        enrolledDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        completedHours: 0,
        totalHours: 300,
        assessmentsPassed: 0,
        certificationsEarned: 0
      };
      saveStudent(newStudent);
      localStorage.setItem(SESSION_KEY, JSON.stringify(newStudent));
      return { success: true, user: newStudent };
    },

    logout: (redirectUrl) => {
      localStorage.removeItem(SESSION_KEY);
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        window.location.reload();
      }
    },

    syncNavAuthButton: () => {
      const authLinks = document.querySelectorAll('.nav-login-btn, .nav-auth-btn');
      authLinks.forEach(link => {
        const textElem = link.querySelector('.auth-btn-text') || link.querySelector('span');
        const iconElem = link.querySelector('i');
        const isNested = window.location.pathname.includes('/dashboard/') || window.location.pathname.includes('/programs/') || window.location.pathname.includes('/facilities/') || window.location.pathname.includes('/auth/');
        const loginHref = isNested ? '../auth/login.html' : './auth/login.html';

        link.setAttribute('href', loginHref);
        if (textElem) textElem.textContent = 'Login';
        if (iconElem) iconElem.className = 'fa-solid fa-arrow-right-to-bracket text-xs';
      });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.WeldAuth.syncNavAuthButton);
  } else {
    window.WeldAuth.syncNavAuthButton();
  }
})();
