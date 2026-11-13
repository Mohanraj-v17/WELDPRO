/**
 * WELDPRO Lab Hours Management
 * Interactive session log, progress tracking, dynamic calculation
 */
(function() {
  const SESSIONS_STORE = 'weldpro_lab_sessions_v1';

  const DEFAULT_SESSIONS = [
    { id: 1, date: '2026-11-10', process: 'Pipe Welding (6G)', booth: 'Booth 14', hours: 4.5, instructor: 'J. Miller, CWI', status: 'Approved', notes: 'Sch 80 Carbon pipe, root GTAW, fill/cap SMAW E7018. Clean penetration.' },
    { id: 2, date: '2026-11-08', process: 'TIG Welding (GTAW)', booth: 'Booth 09', hours: 5.0, instructor: 'S. Patel, CWI', status: 'Approved', notes: 'Stainless 304 tube, argon purge backing. Good heat tint control.' },
    { id: 3, date: '2026-11-05', process: 'Structural (FCAW)', booth: 'Booth 14', hours: 6.0, instructor: 'D. Kovacs, CSW', status: 'Approved', notes: '1/2 inch bevel plate 3G vertical up. Gas-shielded E71T-1M wire.' },
    { id: 4, date: '2026-11-02', process: 'MIG Welding (GMAW)', booth: 'Booth 04', hours: 4.0, instructor: 'J. Miller, CWI', status: 'Approved', notes: 'Fillet weld lap joints 2F position. Gun angle and travel speed verified.' },
    { id: 5, date: '2026-10-29', process: 'SMAW Stick', booth: 'Booth 02', hours: 5.5, instructor: 'R. Davis, AWS CWI', status: 'Approved', notes: 'E6010 open root pass, keyhole control practice. Excellent restart technique.' },
    { id: 6, date: '2026-10-26', process: 'Pipe Welding (5G)', booth: 'Booth 14', hours: 4.0, instructor: 'J. Miller, CWI', status: 'Approved', notes: 'Fixed horizontal pipe position. Overhead to vertical transition drill.' },
    { id: 7, date: '2026-10-22', process: 'Safety & Oxy-Fuel Cutting', booth: 'Cutting Bay A', hours: 3.5, instructor: 'R. Davis, AWS CWI', status: 'Approved', notes: 'Bevel preparation and mechanical joint cleanup prior to welding.' }
  ];

  function getSessions() {
    try {
      const data = localStorage.getItem(SESSIONS_STORE);
      return data ? JSON.parse(data) : DEFAULT_SESSIONS;
    } catch (e) {
      return DEFAULT_SESSIONS;
    }
  }

  function saveSessions(sessions) {
    localStorage.setItem(SESSIONS_STORE, JSON.stringify(sessions));
  }

  function renderTable(sessionsToRender) {
    const tbody = document.getElementById('labSessionsTableBody');
    if (!tbody) return;

    if (sessionsToRender.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center py-8 text-slate-500 dark:text-slate-400">No training sessions found matching filter.</td></tr>`;
      return;
    }

    tbody.innerHTML = sessionsToRender.map(s => `
      <tr class="hover:bg-slate-50 dark:hover:bg-navy-light/40 transition">
        <td class="font-medium text-slate-900 dark:text-white">${s.date}</td>
        <td>
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-orange-500/10 text-orange-600 dark:text-orange-400">
            <i class="fa-solid fa-fire-burner"></i> ${s.process}
          </span>
        </td>
        <td class="text-slate-600 dark:text-slate-300 font-mono text-sm">${s.booth}</td>
        <td class="font-bold text-slate-900 dark:text-white">${s.hours.toFixed(1)} hrs</td>
        <td class="text-slate-600 dark:text-slate-300 text-sm">${s.instructor}</td>
        <td>
          <span class="status-pill status-completed">
            <i class="fa-solid fa-circle-check"></i> ${s.status}
          </span>
        </td>
        <td class="text-slate-500 dark:text-slate-400 text-sm max-w-xs truncate" title="${s.notes}">
          ${s.notes}
        </td>
      </tr>
    `).join('');
  }

  function updateCalculations() {
    const sessions = getSessions();
    const totalRequired = 300;
    
    // Sum base prior hours + recorded session hours
    const baseArchivedHours = 181.5; // verified prior certified modules
    const recordedHours = sessions.reduce((acc, curr) => acc + (parseFloat(curr.hours) || 0), 0);
    const completed = Math.min(totalRequired, Math.round((baseArchivedHours + recordedHours) * 10) / 10);
    const remaining = Math.max(0, Math.round((totalRequired - completed) * 10) / 10);
    const percent = Math.min(100, Math.round((completed / totalRequired) * 100));

    // Update UI elements
    const completedEl = document.getElementById('statCompletedHours');
    const remainingEl = document.getElementById('statRemainingHours');
    const totalEl = document.getElementById('statTotalRequiredHours');
    const percentEl = document.getElementById('statProgressPercent');
    const barEl = document.getElementById('statProgressBarFill');

    if (completedEl) completedEl.textContent = completed;
    if (remainingEl) remainingEl.textContent = remaining;
    if (totalEl) totalEl.textContent = totalRequired;
    if (percentEl) percentEl.textContent = percent + '%';
    if (barEl) barEl.style.width = percent + '%';
  }

  function initLabHours() {
    updateCalculations();
    const sessions = getSessions();
    renderTable(sessions);

    // Filter by process
    const filterSelect = document.getElementById('filterProcessSelect');
    if (filterSelect) {
      filterSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        const current = getSessions();
        if (!val || val === 'ALL') {
          renderTable(current);
        } else {
          const filtered = current.filter(s => s.process.toLowerCase().includes(val.toLowerCase()));
          renderTable(filtered);
        }
      });
    }

    // Modal Add Session
    const openModalBtn = document.getElementById('btnOpenAddSessionModal');
    const modal = document.getElementById('addSessionModal');
    const closeModalBtn = document.getElementById('btnCloseSessionModal');
    const cancelModalBtn = document.getElementById('btnCancelSessionModal');
    const addSessionForm = document.getElementById('addSessionForm');

    function openModal() {
      if (modal) modal.classList.remove('hidden');
    }
    function closeModal() {
      if (modal) modal.classList.add('hidden');
    }

    if (openModalBtn) openModalBtn.addEventListener('click', openModal);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);

    if (addSessionForm) {
      addSessionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const date = addSessionForm.elements['sessionDate'].value || new Date().toISOString().split('T')[0];
        const process = addSessionForm.elements['sessionProcess'].value;
        const booth = addSessionForm.elements['sessionBooth'].value;
        const hours = parseFloat(addSessionForm.elements['sessionHours'].value) || 4.0;
        const instructor = addSessionForm.elements['sessionInstructor'].value;
        const notes = addSessionForm.elements['sessionNotes'].value || 'Standard practical booth run.';

        const current = getSessions();
        const newSession = {
          id: Date.now(),
          date,
          process,
          booth,
          hours,
          instructor,
          status: 'Approved',
          notes
        };

        current.unshift(newSession);
        saveSessions(current);
        renderTable(current);
        updateCalculations();
        closeModal();
        addSessionForm.reset();

        // Toast feedback
        if (window.WeldToast) {
          window.WeldToast.show('Training session logged successfully!', 'success');
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLabHours);
  } else {
    initLabHours();
  }
})();
