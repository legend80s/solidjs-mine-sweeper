const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const hashed = cp.execSync(`ls dist/assets/*.js dist/assets/*.css`).toString()
  .split(/\s/)
  .filter(Boolean)
  .map(x => `"${x.replace(/^dist/, '.')}"`)
  .join(', ')

const str  =`\n/** auto generated */\nfunction genHashedAssets() {
  return [${hashed}];
}`;

const fp = 'dist/sw.js';

fs.appendFileSync(fp, str)

const m = `  <link rel="manifest" href="manifest.json" />`

const ifp = 'dist/index.html'

appendToHead(m, ifp)

console.log(fp, 'and', ifp, 'done.');

function appendToHead() {
  const content = fs.readFileSync(ifp, 'utf-8');

  const updated = content.replace('</head>', `${m}\n</head>`);

  fs.writeFileSync(ifp, updated)
}
