const fs = require('fs');
const cp = require('child_process');


const hashed = cp.execSync(`ls dist/assets/*.js dist/assets/*.css`).toString()
  .split(/\s/)
  .filter(Boolean)
  .map(x => `"${x.replace(/^dist/, '.')}"`)
  .join(', ')

const str  =`function genHashedAssets() {
  return [${hashed}];
}`;

// console.log('str:', str);

fs.appendFileSync('../sw.js', str)
