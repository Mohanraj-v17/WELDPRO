const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('dashboard').filter(f => f.endsWith('.html'));
for (const f of files) {
  const content = fs.readFileSync(path.join('dashboard', f), 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('user-name-display')) {
      console.log(`${f}:${idx+1}: ${line.trim()}`);
    }
  });
}
