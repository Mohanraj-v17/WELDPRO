const fs = require('fs');

const files = fs.readdirSync('dashboard').filter(f => f.endsWith('.html'));
for (const f of files) {
  const content = fs.readFileSync('dashboard/' + f, 'utf8');
  const m = content.match(/<!-- Trainee Profile Snippet -->([\s\S]*?)<!-- Sidebar Navigation Links -->/);
  console.log('=== ' + f + ' ===');
  if (m) {
    console.log(m[0].trim());
  } else {
    // try fallback search
    const m2 = content.match(/<aside class="dashboard-sidebar"[\s\S]*?<\/aside>/);
    console.log(m2 ? m2[0].slice(0, 300) : 'NO SIDEBAR MATCH');
  }
}
