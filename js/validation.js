/**
 * WELDPRO Form Validation & Notification Toast Engine
 */
(function() {
  // Toast notification helper
  window.WeldToast = {
    show: (message, type = 'info') => {
      let toastContainer = document.getElementById('weldproToastContainer');
      if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'weldproToastContainer';
        toastContainer.className = 'fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4';
        document.body.appendChild(toastContainer);
      }

      const toast = document.createElement('div');
      const colors = {
        success: 'bg-emerald-600 text-white border-emerald-500',
        error: 'bg-rose-600 text-white border-rose-500',
        info: 'bg-navy text-white border-orange-500',
        warning: 'bg-amber-600 text-white border-amber-500'
      };
      const icons = {
        success: 'fa-circle-check',
        error: 'fa-triangle-exclamation',
        info: 'fa-circle-info',
        warning: 'fa-shield-halved'
      };

      toast.className = `pointer-events-auto p-4 rounded-lg shadow-xl border flex items-center gap-3 transition-all duration-300 transform translate-y-4 opacity-0 ${colors[type] || colors.info}`;
      toast.innerHTML = `
        <i class="fa-solid ${icons[type] || icons.info} text-lg"></i>
        <div class="text-sm font-medium flex-1">${message}</div>
        <button class="text-white/80 hover:text-white" onclick="this.parentElement.remove()"><i class="fa-solid fa-xmark"></i></button>
      `;

      toastContainer.appendChild(toast);
      requestAnimationFrame(() => {
        toast.classList.remove('translate-y-4', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');
      });

      setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-4');
        setTimeout(() => toast.remove(), 300);
      }, 4500);
    }
  };

  // Validation Rules
  const Regex = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
  };

  function setError(input, message) {
    input.classList.add('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
    input.classList.remove('border-slate-300', 'dark:border-navy-light');
    let err = input.parentElement.querySelector('.form-error-msg');
    if (!err) {
      err = document.createElement('p');
      err.className = 'form-error-msg text-xs text-red-500 mt-1 font-medium';
      input.parentElement.appendChild(err);
    }
    err.textContent = message;
    err.classList.remove('hidden');
  }

  function clearError(input) {
    input.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
    input.classList.add('border-slate-300', 'dark:border-navy-light');
    const err = input.parentElement.querySelector('.form-error-msg');
    if (err) {
      err.classList.add('hidden');
    }
  }

  function initValidation() {
    // 1. Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;
        const email = loginForm.elements['email'];
        const password = loginForm.elements['password'];
        const remember = loginForm.elements['rememberMe']?.checked ?? true;

        if (!email.value.trim() || !Regex.email.test(email.value.trim())) {
          setError(email, 'Please enter a valid institutional or personal email address.');
          valid = false;
        } else {
          clearError(email);
        }

        if (!password.value || password.value.length < 6) {
          setError(password, 'Password must be at least 6 characters.');
          valid = false;
        } else {
          clearError(password);
        }

        if (valid) {
          window.WeldAuth.login(email.value, password.value, remember);
          window.WeldToast.show('Authentication verified. Welcome to WELDPRO Portal!', 'success');
          setTimeout(() => {
            window.location.href = '../dashboard/index.html';
          }, 800);
        }
      });
    }

    // 2. Register Form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;
        const name = registerForm.elements['fullName'];
        const email = registerForm.elements['email'];
        const phone = registerForm.elements['phone'];
        const program = registerForm.elements['weldingProgram'];
        const password = registerForm.elements['password'];
        const confirmPassword = registerForm.elements['confirmPassword'];

        if (!name.value.trim() || name.value.trim().length < 2) {
          setError(name, 'Please enter your full legal name.');
          valid = false;
        } else {
          clearError(name);
        }

        if (!email.value.trim() || !Regex.email.test(email.value.trim())) {
          setError(email, 'Please enter a valid email.');
          valid = false;
        } else {
          clearError(email);
        }

        if (phone.value.trim() && !Regex.phone.test(phone.value.trim())) {
          setError(phone, 'Please enter a valid contact phone number.');
          valid = false;
        } else {
          clearError(phone);
        }

        if (!program.value) {
          setError(program, 'Please select your intended welding program.');
          valid = false;
        } else {
          clearError(program);
        }

        if (!password.value || password.value.length < 6) {
          setError(password, 'Password must be at least 6 characters.');
          valid = false;
        } else {
          clearError(password);
        }

        if (password.value !== confirmPassword.value) {
          setError(confirmPassword, 'Passwords do not match.');
          valid = false;
        } else {
          clearError(confirmPassword);
        }

        if (valid) {
          window.WeldAuth.register({
            name: name.value.trim(),
            email: email.value.trim(),
            phone: phone.value.trim(),
            program: program.value
          });
          window.WeldToast.show('Enrollment profile created! Redirecting to student dashboard...', 'success');
          setTimeout(() => {
            window.location.href = '../dashboard/index.html';
          }, 1000);
        }
      });
    }

    // 3. Forgot Password Form
    const forgotForm = document.getElementById('forgotPasswordForm');
    if (forgotForm) {
      forgotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = forgotForm.elements['email'];
        if (!email.value.trim() || !Regex.email.test(email.value.trim())) {
          setError(email, 'Please enter a valid email address.');
          return;
        }
        clearError(email);
        const confirmNotice = document.getElementById('recoverySentNotice');
        if (confirmNotice) confirmNotice.classList.remove('hidden');
        window.WeldToast.show('A demo password recovery link has been dispatched to your email.', 'info');
      });
    }

    // 4. Reset Password Form
    const resetForm = document.getElementById('resetPasswordForm');
    if (resetForm) {
      resetForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;
        const newPass = resetForm.elements['newPassword'];
        const confirmPass = resetForm.elements['confirmPassword'];

        if (!newPass.value || newPass.value.length < 6) {
          setError(newPass, 'New password must be at least 6 characters.');
          valid = false;
        } else {
          clearError(newPass);
        }

        if (newPass.value !== confirmPass.value) {
          setError(confirmPass, 'Passwords do not match.');
          valid = false;
        } else {
          clearError(confirmPass);
        }

        if (valid) {
          window.WeldToast.show('Password successfully reset! You can now log in.', 'success');
          setTimeout(() => {
            window.location.href = './login.html';
          }, 1200);
        }
      });
    }

    // 5. Contact / Enquiry Form
    const contactForm = document.getElementById('contactEnquiryForm');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;
        const name = contactForm.elements['contactName'];
        const email = contactForm.elements['contactEmail'];
        const message = contactForm.elements['contactMessage'];

        if (!name.value.trim()) {
          setError(name, 'Please provide your full name.');
          valid = false;
        } else {
          clearError(name);
        }

        if (!email.value.trim() || !Regex.email.test(email.value.trim())) {
          setError(email, 'Please provide a valid email address.');
          valid = false;
        } else {
          clearError(email);
        }

        if (!message.value.trim() || message.value.trim().length < 10) {
          setError(message, 'Please enter a message of at least 10 characters.');
          valid = false;
        } else {
          clearError(message);
        }

        if (valid) {
          contactForm.reset();
          const successBox = document.getElementById('contactSuccessAlert');
          if (successBox) {
            successBox.classList.remove('hidden');
            setTimeout(() => successBox.classList.add('hidden'), 5000);
          }
          window.WeldToast.show('Thank you! Your training enquiry has been submitted to Admissions.', 'success');
        }
      });
    }

    // 6. Admissions Application Form
    const admissionsForm = document.getElementById('admissionsApplicationForm');
    if (admissionsForm) {
      admissionsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;
        const fname = admissionsForm.elements['applicantFirstName'];
        const lname = admissionsForm.elements['applicantLastName'];
        const email = admissionsForm.elements['applicantEmail'];
        const phone = admissionsForm.elements['applicantPhone'];
        const program = admissionsForm.elements['applicantProgram'];

        if (!fname.value.trim()) {
          setError(fname, 'First name is required.');
          valid = false;
        } else clearError(fname);

        if (!lname.value.trim()) {
          setError(lname, 'Last name is required.');
          valid = false;
        } else clearError(lname);

        if (!email.value.trim() || !Regex.email.test(email.value.trim())) {
          setError(email, 'Valid email required.');
          valid = false;
        } else clearError(email);

        if (!phone.value.trim() || !Regex.phone.test(phone.value.trim())) {
          setError(phone, 'Valid contact phone required.');
          valid = false;
        } else clearError(phone);

        if (!program.value) {
          setError(program, 'Please select a training program.');
          valid = false;
        } else clearError(program);

        if (valid) {
          admissionsForm.reset();
          const banner = document.getElementById('admissionSuccessBanner');
          if (banner) banner.classList.remove('hidden');
          window.WeldToast.show('Application submitted! Our admissions counselor will contact you within 24 hours.', 'success');
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initValidation);
  } else {
    initValidation();
  }
})();
