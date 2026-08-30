const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const copies = [
    [path.join(root, 'node_modules', 'lucide', 'dist', 'umd', 'lucide.min.js'), path.join(root, 'public', 'vendor', 'lucide.min.js')],
    [path.join(root, '..', 'gardenwithserge.com', 'favicon.png'), path.join(root, 'public', 'favicon.png')],
];

for (const [source, destination] of copies) {
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(source, destination);
}
