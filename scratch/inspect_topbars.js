const fs = require('fs');

['my-profile.html', 'lab-hours.html'].forEach(f => {
  const content = fs.readFileSync('dashboard/' + f, 'utf8');
  const m = content.match(/<header class="dashboard-topbar">([\s\S]*?)<\/header>/);
  console.log('=== ' + f + ' ===');
  console.log(m ? m[0] : 'null');
});
