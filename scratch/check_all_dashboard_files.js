const fs = require('fs');

const files = [
  'attendance.html',
  'certifications.html',
  'lab-hours.html',
  'my-profile.html',
  'my-programs.html',
  'notifications.html',
  'skill-assessments.html'
];

for (const file of files) {
  const content = fs.readFileSync('dashboard/' + file, 'utf8');
  console.log(`\n================= ${file} =================`);
  const hasResponsiveName = content.includes('sidebar-responsive-name');
  const hasMobileControls = content.includes('sidebar-mobile-controls');
  const hasTopbarControls = content.includes('dashboard-topbar-controls');
  console.log(`responsive-name: ${hasResponsiveName}, mobile-controls: ${hasMobileControls}, topbar-controls: ${hasTopbarControls}`);

  const topbarMatch = content.match(/<header class="dashboard-topbar">([\s\S]*?)<\/header>/);
  if (topbarMatch) {
    console.log(topbarMatch[0].trim());
  }
}
