const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');
const distDir = path.join(__dirname, '..', 'dist');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

const jsContent = fs.readFileSync(path.join(srcDir, 'companion.js'), 'utf8');
const cssContent = fs.readFileSync(path.join(srcDir, 'companion.css'), 'utf8');

const minified = `(function(){${jsContent}})();`;
const cssMinified = cssContent.replace(/\s+/g, ' ').replace(/\/\*[\s\S]*?\*\//g, '');

const combined = `
(function() {
  const style = document.createElement('style');
  style.textContent = \`${cssMinified}\`;
  document.head.appendChild(style);
  ${jsContent}
})();
`;

fs.writeFileSync(path.join(distDir, 'companion.js'), combined);
fs.writeFileSync(path.join(distDir, 'companion.min.js'), combined);

console.log('Build complete! Output in dist/');
