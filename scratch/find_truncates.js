const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('dashboard').filter(f => f.endsWith('.html'));
for (const file of files) {
  const content = fs.readFileSync(path.join('dashboard', file), 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('truncate')) {
      console.log(`${file}:${idx+1}: ${line.trim()}`);
    }
  });
}
