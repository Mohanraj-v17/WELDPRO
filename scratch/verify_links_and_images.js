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
let brokenLinks = 0;
let brokenImgs = 0;

for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const dir = path.dirname(file);

  // Check hrefs (relative HTML files)
  const hrefMatches = content.matchAll(/href="([^"#:]+\.html)(?:#[^"]*)?"/gi);
  for (const m of hrefMatches) {
    const target = path.resolve(dir, m[1]);
    if (!fs.existsSync(target)) {
      console.error(`[BROKEN LINK] in ${file}: ${m[1]} -> ${target}`);
      brokenLinks++;
    }
  }

  // Check img src (relative files)
  const imgMatches = content.matchAll(/src="([^":]+\.(?:svg|png|jpg|jpeg|webp))"/gi);
  for (const m of imgMatches) {
    const target = path.resolve(dir, m[1]);
    if (!fs.existsSync(target)) {
      console.error(`[BROKEN IMG] in ${file}: ${m[1]} -> ${target}`);
      brokenImgs++;
    }
  }
}

console.log(`Link Check: ${brokenLinks} broken links.`);
console.log(`Img Check: ${brokenImgs} broken images.`);
if (brokenLinks > 0 || brokenImgs > 0) {
  process.exit(1);
} else {
  console.log('ALL internal links and images are valid and exist!');
}
