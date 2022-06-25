const fs = require('fs');
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

const script = `<script>
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").then((registration) => {
        console.log("[PWA] Service Worker registered successfully with scope:", registration.scope);
      }).catch((error) => {
        console.error(error);
      });
    });
  }
</script>`

appendToHead(m + '\n' + script, ifp)

console.log(fp, 'and', ifp, 'done.');

function appendToHead(newContent) {
  const content = fs.readFileSync(ifp, 'utf-8');

  const updated = content.replace('</head>', `${newContent}\n</head>`);

  fs.writeFileSync(ifp, updated)
}
