const fs = require('fs');
const path = require('path');

const dashboardDir = 'dashboard';
const files = [
  'index.html',
  'my-profile.html',
  'my-programs.html',
  'lab-hours.html',
  'skill-assessments.html',
  'certifications.html',
  'attendance.html',
  'notifications.html'
];

const mobileControlsHTML = `      <!-- Mobile Quick Controls (Active <= 1240px) -->
      <div class="sidebar-mobile-controls p-3 mx-3 my-2 rounded-lg bg-navy/60 border border-steel/40 flex items-center justify-around gap-2">
        <button class="theme-toggle-btn w-9 h-9 rounded-md border border-steel bg-navy flex items-center justify-center hover:border-orange transition text-yellow-400" aria-label="Toggle Theme" title="Toggle Theme">
          <i class="fa-solid fa-sun text-sm"></i>
        </button>
        <button class="dir-toggle-btn px-2.5 py-1.5 rounded-md border border-steel bg-navy text-xs font-bold text-slate-200 hover:border-orange transition flex items-center gap-1.5" aria-label="Toggle Direction" title="Toggle RTL">
          <i class="fa-solid fa-globe text-orange text-xs"></i>
          <span class="dir-label text-xs">RTL</span>
        </button>
        <a href="notifications.html" class="w-9 h-9 rounded-md border border-steel bg-navy flex items-center justify-center text-slate-200 hover:text-orange hover:border-orange transition relative" aria-label="Notifications" title="Notifications">
          <i class="fa-solid fa-bell text-sm"></i>
          <span class="absolute -top-1 -right-1 w-4 h-4 bg-orange text-white rounded-full text-[10px] font-bold flex items-center justify-center">3</span>
        </a>
        <a href="my-profile.html" class="w-9 h-9 rounded-md border border-steel bg-navy flex items-center justify-center text-orange hover:border-orange transition" aria-label="My Profile" title="My Profile">
          <i class="fa-solid fa-user text-sm"></i>
        </a>
      </div>`;

for (const file of files) {
  const filePath = path.join(dashboardDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Update sidebar user name to include sidebar-responsive-name class
  content = content.replace(
    /<h4 class="user-name-display text-sm font-heading font-bold text-white truncate">Marcus Vance<\/h4>/g,
    '<h4 class="user-name-display text-sm font-heading font-bold text-white truncate sidebar-responsive-name">Marcus Vance</h4>'
  );

  // 2. Add sidebar-mobile-controls if not present
  if (!content.includes('sidebar-mobile-controls')) {
    // Insert right after the Trainee Profile Snippet closing div
    const pattern = /(<!-- Trainee Profile Snippet -->[\s\S]*?Active • Level 3\s*<\/span>\s*<\/div>\s*<\/div>)/;
    if (pattern.test(content)) {
      content = content.replace(pattern, `$1\n\n${mobileControlsHTML}`);
    } else {
      // Fallback: match without the comment
      const pattern2 = /(<div class="w-11 h-11 rounded-lg bg-orange\/20[\s\S]*?Active • Level 3\s*<\/span>\s*<\/div>\s*<\/div>)/;
      if (pattern2.test(content)) {
        content = content.replace(pattern2, `$1\n\n${mobileControlsHTML}`);
      } else {
        console.warn(`Could not find profile snippet in ${file}`);
      }
    }
  }

  // 3. Remove user-name-label Marcus Vance from topbar profile button in index.html
  if (file === 'index.html') {
    content = content.replace(
      /\s*<span class="user-name-label[^>]*>Marcus Vance<\/span>/g,
      ''
    );
  }

  // 4. Update topbar controls wrapper
  if (file === 'index.html' || file === 'my-profile.html' || file === 'my-programs.html' || file === 'certifications.html' || file === 'skill-assessments.html') {
    // Add dashboard-topbar-controls class to topbar action cluster
    content = content.replace(
      /<div class="flex items-center gap-1\.5 sm:gap-2\.5 md:gap-3 flex-shrink-0">/g,
      '<div class="dashboard-topbar-controls flex items-center gap-1.5 sm:gap-2.5 md:gap-3 flex-shrink-0">'
    );
  } else if (file === 'attendance.html' || file === 'lab-hours.html' || file === 'notifications.html') {
    // These files have a primary action button before the theme and RTL toggles
    // We want the theme & RTL toggles wrapped in dashboard-topbar-controls
    const regex = /(<button class="theme-toggle-btn[\s\S]*?<button class="dir-toggle-btn[\s\S]*?<\/button>)/;
    if (regex.test(content) && !content.includes('dashboard-topbar-controls')) {
      content = content.replace(regex, `<div class="dashboard-topbar-controls flex items-center gap-1.5 sm:gap-2.5 md:gap-3 flex-shrink-0">\n          $1\n        </div>`);
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
}
