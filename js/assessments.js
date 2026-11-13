/**
 * WELDPRO Skill Assessments & Rubrics Manager
 */
(function() {
  const ASSESSMENTS_DATA = [
    {
      id: 'ASM-101',
      title: 'SMAW 3G Vertical-Up Groove Weld',
      code: 'AWS D1.1 Structural Plate',
      category: 'Shielded Metal Arc (SMAW)',
      score: '96/100',
      status: 'Passed',
      date: 'Oct 28, 2026',
      evaluator: 'R. Davis, AWS CWI',
      rubric: {
        visualInspection: 'Pass (Zero undercut, uniform 1/16" reinforcement)',
        rootBendTest: 'Pass (180 deg bend, zero cracks > 1/16")',
        faceBendTest: 'Pass (Sound ductile metal, no inclusions)',
        heatInput: 'Optimal (21.4 kJ/in)',
        interpassTemp: 'Verified 250°F max'
      },
      feedback: 'Excellent tie-ins on the weave passes. Arc stop/starts show zero pinholes. Candidate is fully qualified on 3G structural groove.',
      recommendation: 'Advance to 4G overhead groove weld test plates.'
    },
    {
      id: 'ASM-102',
      title: 'TIG 6G 2" Carbon Steel Pipe Joint',
      code: 'ASME Section IX B31.3',
      category: 'Gas Tungsten Arc (GTAW)',
      score: '94/100',
      status: 'Passed',
      date: 'Nov 04, 2026',
      evaluator: 'S. Patel, CWI',
      rubric: {
        visualInspection: 'Pass (Uniform root bead, complete flush tie-in)',
        radiographicTest: 'Grade A (Zero lack of fusion or tungsten spit)',
        rootPenetration: '1/16" positive reinforcement with zero suckback',
        gasShielding: '100% Argon @ 22 CFH with backing purge fixture',
        interpassCleaning: 'Wire brush stainless dedicated'
      },
      feedback: 'Outstanding torch angle and filler rod feeding in overhead position. Root pass showed immaculate keyhole control.',
      recommendation: 'Practice on thin-wall Super Duplex alloy schedule 10.'
    },
    {
      id: 'ASM-103',
      title: 'GMAW Spray Transfer Fillet Weld (2F)',
      code: 'AWS D1.1 Fillet Weld Break',
      category: 'Gas Metal Arc (GMAW / MIG)',
      score: '91/100',
      status: 'Passed',
      date: 'Oct 14, 2026',
      evaluator: 'J. Miller, CWI',
      rubric: {
        visualInspection: 'Pass (Flat contour, 5/16" equal leg length)',
        macroEtch: 'Pass (Deep penetration into root, zero porosity)',
        fractureTest: 'Pass (Break showed sound grain structure throughout)',
        shieldingGas: '90% Ar / 10% CO2 at 35 CFH',
        wireSpeed: '420 IPM @ 27.5V'
      },
      feedback: 'Smooth spray transfer with zero spatter. Gun angle was held steady at 15 degrees push angle.',
      recommendation: 'Focus on corner wrap termination to avoid crater cracking.'
    },
    {
      id: 'ASM-104',
      title: 'FCAW-G 3G Multi-Pass Heavy Plate (1")',
      code: 'AWS D1.1 Heavy Structural',
      category: 'Flux-Cored Arc (FCAW)',
      score: 'In Progress',
      status: 'In Progress',
      date: 'Target: Nov 18, 2026',
      evaluator: 'D. Kovacs, CSW',
      rubric: {
        visualInspection: 'Pending final cap passes',
        ultrasonicTest: 'Scheduled following cooling cycle',
        slagRemoval: 'Inspected between passes - 100% clean',
        preheatTemp: 'Maintained 200°F induction heat',
        wireFeed: '275 IPM @ 25V 75/25 Gas'
      },
      feedback: 'Root and fill passes 1-4 completed cleanly. Slag peeling cleanly with self-releasing action.',
      recommendation: 'Maintain steady travel speed on split weave cap passes.'
    },
    {
      id: 'ASM-105',
      title: 'ASME Section IX 6G 6" Sch 80 Pipe',
      code: 'High-Pressure Steam Qualification',
      category: 'Advanced Pipe Welding',
      score: 'Scheduled',
      status: 'Scheduled',
      date: 'Target: Nov 25, 2026',
      evaluator: 'Exam Board Board Review',
      rubric: {
        visualInspection: 'Full 360 degree inspection',
        sideBendTests: '4 side bend coupons (1/8" radius)',
        tensileStrength: '2 transverse tensile specimen pulls',
        hydrostaticSimulation: 'Pressure rating 1200 PSI',
        codeCompliance: 'ASME Boiler & Pressure Vessel IX'
      },
      feedback: 'Pre-assessment booth practice underway. Trainee is logging 4.5 hours daily on 45-degree fixed orientation.',
      recommendation: 'Review heat input calculations for cap passes.'
    }
  ];

  function renderAssessments(items) {
    const container = document.getElementById('assessmentsCardsContainer');
    if (!container) return;

    if (items.length === 0) {
      container.innerHTML = `<div class="col-span-full text-center py-12 text-slate-500">No skill assessments found for this filter.</div>`;
      return;
    }

    container.innerHTML = items.map(a => {
      let statusClass = 'status-completed';
      let icon = 'fa-circle-check';
      if (a.status === 'In Progress') {
        statusClass = 'status-in-progress';
        icon = 'fa-clock';
      } else if (a.status === 'Scheduled') {
        statusClass = 'status-pending';
        icon = 'fa-calendar';
      }

      return `
        <div class="industrial-card bg-white dark:bg-darkcard border border-slate-200 dark:border-navy-light/40 rounded-lg p-6 flex flex-col justify-between">
          <div>
            <div class="flex items-start justify-between gap-3 mb-3">
              <span class="text-xs font-mono font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded">${a.code}</span>
              <span class="status-pill ${statusClass}">
                <i class="fa-solid ${icon}"></i> ${a.status}
              </span>
            </div>
            <h3 class="text-xl font-heading text-slate-900 dark:text-white mb-1">${a.title}</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mb-4">${a.category} • Evaluated by ${a.evaluator}</p>
            
            <div class="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-navy-900/50 rounded mb-4 text-sm">
              <div>
                <span class="text-xs text-slate-400 block uppercase">Result / Score</span>
                <span class="font-bold text-lg text-slate-900 dark:text-white">${a.score}</span>
              </div>
              <div>
                <span class="text-xs text-slate-400 block uppercase">Exam Date</span>
                <span class="font-semibold text-slate-800 dark:text-slate-200">${a.date}</span>
              </div>
            </div>

            <p class="text-xs text-slate-600 dark:text-slate-300 italic mb-4 bg-orange-500/5 p-2.5 rounded border-l-2 border-orange-500">
              "${a.feedback}"
            </p>
          </div>

          <div class="pt-4 border-t border-slate-100 dark:border-navy-light/30 flex items-center justify-between">
            <span class="text-xs text-slate-500 dark:text-slate-400">ID: ${a.id}</span>
            <button class="btn-view-rubric text-xs font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-500 inline-flex items-center gap-1.5" data-id="${a.id}">
              <span>View Full Rubric</span>
              <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Attach click handlers to View Rubric buttons
    container.querySelectorAll('.btn-view-rubric').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const item = ASSESSMENTS_DATA.find(x => x.id === id);
        if (item) showRubricModal(item);
      });
    });
  }

  function showRubricModal(item) {
    const modal = document.getElementById('rubricDetailModal');
    if (!modal) return;

    document.getElementById('modalRubricTitle').textContent = item.title;
    document.getElementById('modalRubricCode').textContent = `${item.code} (${item.id})`;
    document.getElementById('modalRubricScore').textContent = item.score;
    document.getElementById('modalRubricStatus').textContent = item.status;
    document.getElementById('modalRubricEvaluator').textContent = item.evaluator;
    document.getElementById('modalRubricDate').textContent = item.date;
    document.getElementById('modalRubricFeedback').textContent = item.feedback;
    document.getElementById('modalRubricRecommendation').textContent = item.recommendation;

    const list = document.getElementById('modalRubricChecklist');
    if (list) {
      list.innerHTML = Object.entries(item.rubric).map(([k, v]) => `
        <li class="flex items-start justify-between py-2 border-b border-slate-200 dark:border-navy-light/40">
          <span class="text-slate-600 dark:text-slate-300 capitalize text-sm font-medium">${k.replace(/([A-Z])/g, ' $1')}:</span>
          <span class="font-semibold text-slate-900 dark:text-white text-sm text-right max-w-xs">${v}</span>
        </li>
      `).join('');
    }

    modal.classList.remove('hidden');
  }

  function initAssessments() {
    renderAssessments(ASSESSMENTS_DATA);

    const filterBtns = document.querySelectorAll('.assessment-filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        filterBtns.forEach(b => {
          b.classList.remove('bg-orange-500', 'text-white');
          b.classList.add('bg-slate-200', 'dark:bg-navy-light/50', 'text-slate-700', 'dark:text-slate-300');
        });
        btn.classList.add('bg-orange-500', 'text-white');
        btn.classList.remove('bg-slate-200', 'dark:bg-navy-light/50', 'text-slate-700', 'dark:text-slate-300');

        const filter = btn.getAttribute('data-filter');
        if (!filter || filter === 'all') {
          renderAssessments(ASSESSMENTS_DATA);
        } else {
          const filtered = ASSESSMENTS_DATA.filter(a => a.status.toLowerCase().replace(' ', '-') === filter.toLowerCase());
          renderAssessments(filtered);
        }
      });
    });

    const modal = document.getElementById('rubricDetailModal');
    const closeBtn = document.getElementById('btnCloseRubricModal');
    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAssessments);
  } else {
    initAssessments();
  }
})();
