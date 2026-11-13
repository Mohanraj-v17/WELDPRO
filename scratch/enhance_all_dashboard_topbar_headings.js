const fs = require('fs');
const path = require('path');

const updates = {
  'index.html': {
    oldH1: /<h1 class="text-sm sm:text-base md:text-xl font-heading font-bold text-slate-900 dark:text-white uppercase leading-tight truncate">([\s\S]*?)<\/h1>/,
    newH1: '<h1 class="text-[13px] sm:text-base md:text-xl font-heading font-bold text-slate-900 dark:text-white uppercase leading-snug sm:leading-tight">\n              Student Profile &amp; Complete Training Dossier\n            </h1>',
    oldSpan: /<span class="text-\[10px\] sm:text-xs text-orange uppercase tracking-wider font-mono font-bold flex items-center gap-1\.5 truncate">/,
    newSpan: '<span class="text-[10px] sm:text-xs text-orange uppercase tracking-wider font-mono font-bold flex items-center gap-1.5">'
  },
  'my-profile.html': {
    oldH1: /<h1 class="text-sm sm:text-base md:text-xl font-heading font-bold text-slate-900 dark:text-white uppercase leading-tight truncate">([\s\S]*?)<\/h1>/,
    newH1: '<h1 class="text-[13px] sm:text-base md:text-xl font-heading font-bold text-slate-900 dark:text-white uppercase leading-snug sm:leading-tight">\n              Student Profile &amp; Settings\n            </h1>',
    oldSpan: /<span class="text-\[10px\] sm:text-xs text-slate-400 uppercase tracking-wider font-mono hidden sm:inline">Student Portal<\/span>/,
    newSpan: '<span class="text-[10px] sm:text-xs text-orange uppercase tracking-wider font-mono font-bold flex items-center gap-1.5"><i class="fa-solid fa-id-badge"></i> Student Portal</span>'
  },
  'my-programs.html': {
    oldH1: /<h1 class="text-sm sm:text-base md:text-xl font-heading font-bold text-slate-900 dark:text-white uppercase leading-tight truncate">([\s\S]*?)<\/h1>/,
    newH1: '<h1 class="text-[13px] sm:text-base md:text-xl font-heading font-bold text-slate-900 dark:text-white uppercase leading-snug sm:leading-tight">My Enrolled Programs</h1>',
    oldSpan: /<span class="text-\[10px\] sm:text-xs text-slate-400 uppercase tracking-wider font-mono hidden sm:inline">Curriculum Progression<\/span>/,
    newSpan: '<span class="text-[10px] sm:text-xs text-orange uppercase tracking-wider font-mono font-bold flex items-center gap-1.5"><i class="fa-solid fa-book-open"></i> Curriculum Progression</span>'
  },
  'lab-hours.html': {
    oldH1: /<h1 class="text-sm sm:text-base md:text-xl font-heading font-bold text-slate-900 dark:text-white uppercase leading-tight truncate">([\s\S]*?)<\/h1>/,
    newH1: '<h1 class="text-[13px] sm:text-base md:text-xl font-heading font-bold text-slate-900 dark:text-white uppercase leading-snug sm:leading-tight">Lab Hours &amp; Booth History</h1>',
    oldSpan: /<span class="text-\[10px\] sm:text-xs text-slate-400 uppercase tracking-wider font-mono hidden sm:inline">Practical Training Log<\/span>/,
    newSpan: '<span class="text-[10px] sm:text-xs text-orange uppercase tracking-wider font-mono font-bold flex items-center gap-1.5"><i class="fa-solid fa-stopwatch"></i> Practical Training Log</span>'
  },
  'skill-assessments.html': {
    oldH1: /<h1 class="text-sm sm:text-base md:text-xl font-heading font-bold text-slate-900 dark:text-white uppercase leading-tight truncate">([\s\S]*?)<\/h1>/,
    newH1: '<h1 class="text-[13px] sm:text-base md:text-xl font-heading font-bold text-slate-900 dark:text-white uppercase leading-snug sm:leading-tight">Coupon Evaluations &amp; Scores</h1>',
    oldSpan: /<span class="text-\[10px\] sm:text-xs text-slate-400 uppercase tracking-wider font-mono hidden sm:inline">Quality Verification<\/span>/,
    newSpan: '<span class="text-[10px] sm:text-xs text-orange uppercase tracking-wider font-mono font-bold flex items-center gap-1.5"><i class="fa-solid fa-clipboard-check"></i> Quality Verification</span>'
  },
  'certifications.html': {
    oldH1: /<h1 class="text-sm sm:text-base md:text-xl font-heading font-bold text-slate-900 dark:text-white uppercase leading-tight truncate">([\s\S]*?)<\/h1>/,
    newH1: '<h1 class="text-[13px] sm:text-base md:text-xl font-heading font-bold text-slate-900 dark:text-white uppercase leading-snug sm:leading-tight">Earned Credentials &amp; Transcripts</h1>',
    oldSpan: /<span class="text-\[10px\] sm:text-xs text-slate-400 uppercase tracking-wider font-mono hidden sm:inline">Certified Qualifications<\/span>/,
    newSpan: '<span class="text-[10px] sm:text-xs text-orange uppercase tracking-wider font-mono font-bold flex items-center gap-1.5"><i class="fa-solid fa-award"></i> Certified Qualifications</span>'
  },
  'attendance.html': {
    oldH1: /<h1 class="text-sm sm:text-base md:text-xl font-heading font-bold text-slate-900 dark:text-white uppercase leading-tight truncate">([\s\S]*?)<\/h1>/,
    newH1: '<h1 class="text-[13px] sm:text-base md:text-xl font-heading font-bold text-slate-900 dark:text-white uppercase leading-snug sm:leading-tight">Attendance &amp; Shop Floor Log</h1>',
    oldSpan: /<span class="text-\[10px\] sm:text-xs text-slate-400 uppercase tracking-wider font-mono hidden sm:inline">Industrial Training Records<\/span>/,
    newSpan: '<span class="text-[10px] sm:text-xs text-orange uppercase tracking-wider font-mono font-bold flex items-center gap-1.5"><i class="fa-solid fa-calendar-check"></i> Industrial Training Records</span>'
  },
  'notifications.html': {
    oldH1: /<h1 class="text-sm sm:text-base md:text-xl font-heading font-bold text-slate-900 dark:text-white uppercase leading-tight truncate">([\s\S]*?)<\/h1>/,
    newH1: '<h1 class="text-[13px] sm:text-base md:text-xl font-heading font-bold text-slate-900 dark:text-white uppercase leading-snug sm:leading-tight">Notifications &amp; Bulletins</h1>',
    oldSpan: /<span class="text-\[10px\] sm:text-xs text-slate-400 uppercase tracking-wider font-mono hidden sm:inline">Communication Center<\/span>/,
    newSpan: '<span class="text-[10px] sm:text-xs text-orange uppercase tracking-wider font-mono font-bold flex items-center gap-1.5"><i class="fa-solid fa-bell"></i> Communication Center</span>'
  }
};

for (const [file, cfg] of Object.entries(updates)) {
  const filePath = path.join('dashboard', file);
  let content = fs.readFileSync(filePath, 'utf8');

  let updated = false;
  if (cfg.oldH1.test(content)) {
    content = content.replace(cfg.oldH1, cfg.newH1);
    updated = true;
  }
  if (cfg.oldSpan.test(content)) {
    content = content.replace(cfg.oldSpan, cfg.newSpan);
    updated = true;
  }

  // Also remove truncate from hero h2 in index.html
  if (file === 'index.html') {
    content = content.replace(
      'font-heading font-bold uppercase tracking-wide truncate',
      'font-heading font-bold uppercase tracking-wide'
    );
  }

  // Remove truncate from lab-hours.html session list header if present
  if (file === 'lab-hours.html') {
    content = content.replace(
      'font-heading font-bold text-base text-slate-900 dark:text-white uppercase truncate',
      'font-heading font-bold text-base text-slate-900 dark:text-white uppercase'
    );
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Enhanced topbar heading in ${file} (updated: ${updated})`);
}
