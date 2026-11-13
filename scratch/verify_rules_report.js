const fs = require('fs');

const css = fs.readFileSync('css/dashboard.css', 'utf8') + '\n' + fs.readFileSync('css/responsive.css', 'utf8');

console.log('--- Checking CSS definitions ---');
const checks = [
  'sidebar-toggle-btn',
  'sidebar-close-btn',
  'sidebar-responsive-name',
  'dashboard-topbar-controls',
  'sidebar-mobile-controls',
  '@media (max-width: 1240px)'
];

for (const c of checks) {
  const count = (css.match(new RegExp(c.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g')) || []).length;
  console.log(`${c}: found ${count} times in CSS`);
}

console.log('\n--- Checking 8 Dashboard Pages for Elements ---');
const pages = [
  'index.html',
  'my-profile.html',
  'my-programs.html',
  'lab-hours.html',
  'skill-assessments.html',
  'certifications.html',
  'attendance.html',
  'notifications.html'
];

for (const p of pages) {
  const content = fs.readFileSync('dashboard/' + p, 'utf8');
  const hasRespName = content.includes('sidebar-responsive-name');
  const hasMobileCtrl = content.includes('sidebar-mobile-controls');
  const hasTopbarCtrl = content.includes('dashboard-topbar-controls');
  const hasNameInTopbar = content.includes('user-name-label') && content.includes('Marcus Vance');
  console.log(`${p}: respName=${hasRespName}, mobileCtrl=${hasMobileCtrl}, topbarCtrl=${hasTopbarCtrl}, nameInTopbar=${hasNameInTopbar}`);
}
