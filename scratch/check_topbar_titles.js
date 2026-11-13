const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('dashboard').filter(f => f.endsWith('.html'));
for (const file of files) {
  const content = fs.readFileSync(path.join('dashboard', file), 'utf8');
  const m = content.match(/<header class="dashboard-topbar">([\s\S]*?)<\/header>/);
  if (m) {
    const h1Match = m[0].match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
    const spanMatch = m[0].match(/<span[^>]*class="[^"]*text-orange[^"]*"[^>]*>([\s\S]*?)<\/span>/) || m[0].match(/<span[^>]*class="[^"]*text-slate-400[^"]*"[^>]*>([\s\S]*?)<\/span>/);
    console.log(`=== ${file} ===`);
    console.log('Sub: ' + (spanMatch ? spanMatch[0].trim() : 'none'));
    console.log('H1:  ' + (h1Match ? h1Match[0].trim() : 'none'));
  }
}
