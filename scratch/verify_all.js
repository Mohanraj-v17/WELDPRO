const fs = require('fs');
const path = require('path');

function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (item !== 'node_modules' && item !== '.git') {
        results = results.concat(getHtmlFiles(fullPath));
      }
    } else if (item.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const allFiles = getHtmlFiles('.');
console.log(`Found ${allFiles.length} HTML files.`);

let hasError = false;

for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf8');

  // Count divs
  const openDivs = (content.match(/<div(\s|>)/gi) || []).length;
  const closeDivs = (content.match(/<\/div>/gi) || []).length;

  if (openDivs !== closeDivs) {
    console.error(`[MISMATCH] ${file}: ${openDivs} open vs ${closeDivs} close divs (diff: ${openDivs - closeDivs})`);
    hasError = true;
  }
}

if (!hasError) {
  console.log(`ALL ${allFiles.length} HTML files have 100% BALANCED <div> tags!`);
} else {
  process.exit(1);
}
