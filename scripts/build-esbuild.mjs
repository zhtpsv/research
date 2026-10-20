// Optional: dependency-light build with esbuild only (no Vite). Output: dist-offline/ — opens by double-click.
import { build } from 'esbuild';
import { cpSync, mkdirSync, rmSync, readFileSync, writeFileSync } from 'node:fs';
rmSync('dist-offline', { recursive: true, force: true });
mkdirSync('dist-offline', { recursive: true });
await build({
  entryPoints: ['src/main.jsx'], bundle: true, minify: true, format: 'iife', outdir: 'dist-offline/assets',
  loader: { '.svg': 'file', '.json': 'json' }, assetNames: '[name]-[hash]', publicPath: './assets', jsx: 'automatic',
  define: { 'import.meta.env.BASE_URL': '"./"', 'process.env.NODE_ENV': '"production"' },
});
cpSync('public/downloads', 'dist-offline/downloads', { recursive: true });
let html = readFileSync('index.html', 'utf8').replace('<script type="module" src="/src/main.jsx"></script>',
  '<link rel="stylesheet" href="./assets/main.css" /><script src="./assets/main.js" defer></script>');
writeFileSync('dist-offline/index.html', html);
