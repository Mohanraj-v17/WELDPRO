/**
 * WELDPRO Main Application Script
 * Orchestrates counters, FAQ accordions, certificate previews, and shared interactions.
 */
(function() {
  function initCounters() {
    const counters = document.querySelectorAll('.counter-value');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-target')) || 0;
          const duration = 1500;
          const stepTime = 30;
          const steps = duration / stepTime;
          const increment = target / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              el.textContent = Number.isInteger(target) ? target.toLocaleString() : target.toFixed(1);
              clearInterval(timer);
            } else {
              el.textContent = Number.isInteger(target) ? Math.floor(current).toLocaleString() : current.toFixed(1);
            }
          }, stepTime);

          observer.unobserve(el);
        }
      });
    }, { threshold: 0.2 });

    counters.forEach(c => observer.observe(c));
  }

  function initFAQAccordions() {
    const faqButtons = document.querySelectorAll('.faq-accordion-btn');
    faqButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const content = btn.nextElementSibling;
        const icon = btn.querySelector('.faq-icon');
        const isOpen = content && content.classList.contains('open');

        // Close other FAQs in the same container if desired
        const parent = btn.closest('.faq-container');
        if (parent) {
          parent.querySelectorAll('.accordion-content').forEach(c => c.classList.remove('open'));
          parent.querySelectorAll('.faq-icon').forEach(i => i.classList.remove('rotate-180'));
        }

        if (!isOpen && content) {
          content.classList.add('open');
          if (icon) icon.classList.add('rotate-180');
        }
      });
    });
  }

  function initCertificateModal() {
    const modal = document.getElementById('certificatePreviewModal');
    if (!modal) return;

    const closeBtn = document.getElementById('btnCloseCertModal');
    const printBtn = document.getElementById('btnPrintCertificate');

    document.querySelectorAll('.btn-preview-certificate').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const certName = btn.getAttribute('data-cert-name') || btn.getAttribute('data-cert') || 'AWS D1.1 Structural Steel Welder Qualification';
        const certCode = btn.getAttribute('data-cert-code') || btn.getAttribute('data-id') || 'WP-AWS-2026-081';
        const certDate = btn.getAttribute('data-cert-date') || btn.getAttribute('data-date') || 'October 14, 2026';
        const certStudent = btn.getAttribute('data-cert-student') || (window.WeldAuth ? window.WeldAuth.getCurrentUser().name : 'Marcus Vance');
        const certInspector = btn.getAttribute('data-inspector') || 'J. Miller, CWI #140922';

        const elTitle = document.getElementById('modalCertTitle');
        const elCode = document.getElementById('modalCertCode') || document.getElementById('modalCertId');
        const elDate = document.getElementById('modalCertDate');
        const elStudent = document.getElementById('modalCertStudentName') || document.getElementById('modalCertStudent');
        const elInspector = document.getElementById('modalCertInspector');

        if (elTitle) elTitle.textContent = certName;
        if (elCode) elCode.textContent = certCode;
        if (elDate) elDate.textContent = certDate;
        if (elStudent) elStudent.textContent = certStudent;
        if (elInspector) elInspector.textContent = certInspector;

        modal.classList.remove('hidden');
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }
  }

  function initFooterYear() {
    document.querySelectorAll('.current-year').forEach(el => {
      el.textContent = new Date().getFullYear();
    });
  }

  function initContactFormPrefill() {
    const urlParams = new URLSearchParams(window.location.search);
    const instructor = urlParams.get('instructor');
    if (instructor) {
      const categorySelect = document.querySelector('select[name="contactCategory"]');
      const messageTextarea = document.querySelector('textarea[name="contactMessage"]');
      if (categorySelect) {
        categorySelect.value = 'Speak With An Instructor / Faculty';
      }
      if (messageTextarea && !messageTextarea.value.trim()) {
        messageTextarea.value = `Hello, I would like to schedule an in-booth consultation with instructor ${instructor} regarding curriculum specializations and welding test coupon qualifications.`;
      }
    }
  }

  function reinitAll() {
    initCounters();
    initFAQAccordions();
    initCertificateModal();
    initFooterYear();
    initContactFormPrefill();
  }

  window.WeldMain = {
    initCounters,
    initFAQAccordions,
    initCertificateModal,
    initFooterYear,
    reinitAll
  };

  document.addEventListener('DOMContentLoaded', reinitAll);
})();
