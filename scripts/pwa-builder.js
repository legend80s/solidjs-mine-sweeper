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

console.log(`write to "${fp}":`, str);
