const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const projectRoot = path.resolve(__dirname, '..');
const deployableRoots = [
    path.join(projectRoot, 'public'),
    path.join(projectRoot, 'lib'),
    path.join(projectRoot, 'server.js')
];

const forbidden = [
    /amazon(?:\.com|aws)/i,
    /\bamzn\.(?:to|com)\b/i,
    /amazon associates/i,
    /[?&]tag=[^&\s"'<>]+-20\b/i
];

function collectFiles(target) {
    const stat = fs.statSync(target);
    if (stat.isFile()) return [target];

    return fs.readdirSync(target, { withFileTypes: true }).flatMap((entry) => {
        const fullPath = path.join(target, entry.name);
        return entry.isDirectory() ? collectFiles(fullPath) : [fullPath];
    });
}

test('deployable source contains no Amazon affiliate links or identifiers', () => {
    const findings = [];

    for (const file of deployableRoots.flatMap(collectFiles)) {
        const source = fs.readFileSync(file, 'utf8');
        for (const pattern of forbidden) {
            if (pattern.test(source)) {
                findings.push(`${path.relative(projectRoot, file)} matched ${pattern}`);
            }
        }
    }

    assert.deepEqual(findings, []);
});
