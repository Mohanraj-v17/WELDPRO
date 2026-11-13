const fs = require('fs');

const files = ['attendance.html', 'lab-hours.html', 'notifications.html'];

for (const file of files) {
  let content = fs.readFileSync('dashboard/' + file, 'utf8');

  // Replace theme and dir buttons with wrapped container
  const target = `<button class="theme-toggle-btn w-8 h-8 sm:w-9 sm:h-9 rounded-md border border-slate-200 dark:border-steel bg-slate-50 dark:bg-navy flex items-center justify-center hover:border-orange transition" aria-label="Toggle Theme"><i class="fa-solid fa-sun text-yellow-400 text-xs sm:text-sm"></i></button>
          <button class="dir-toggle-btn px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-md border border-slate-200 dark:border-steel bg-slate-50 dark:bg-navy text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-orange transition flex items-center gap-1" aria-label="Toggle Direction"><i class="fa-solid fa-globe text-orange text-xs"></i><span class="dir-label hidden xs:inline sm:inline">RTL</span></button>`;

  const replacement = `<div class="dashboard-topbar-controls flex items-center gap-1.5 sm:gap-2.5 md:gap-3 flex-shrink-0">
            <button class="theme-toggle-btn w-8 h-8 sm:w-9 sm:h-9 rounded-md border border-slate-200 dark:border-steel bg-slate-50 dark:bg-navy flex items-center justify-center hover:border-orange transition" aria-label="Toggle Theme"><i class="fa-solid fa-sun text-yellow-400 text-xs sm:text-sm"></i></button>
            <button class="dir-toggle-btn px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-md border border-slate-200 dark:border-steel bg-slate-50 dark:bg-navy text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-orange transition flex items-center gap-1" aria-label="Toggle Direction"><i class="fa-solid fa-globe text-orange text-xs"></i><span class="dir-label hidden xs:inline sm:inline">RTL</span></button>
          </div>`;

  if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync('dashboard/' + file, content, 'utf8');
    console.log('Successfully wrapped topbar controls in ' + file);
  } else {
    console.log('Target not found in ' + file);
  }
}
