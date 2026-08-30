const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const publicDir = path.join(__dirname, '..', 'public');
const policyFiles = ['privacy.html', 'terms.html', 'ai-limitations.html', 'refunds.html', 'contact.html'];

test('required disclosure pages exist with canonical metadata', () => {
    for (const file of policyFiles) {
        const source = fs.readFileSync(path.join(publicDir, file), 'utf8');
        assert.match(source, /<title>[^<]+\| Garden with Serge<\/title>/);
        assert.match(source, /<meta name="description"/);
        assert.match(source, new RegExp(`rel="canonical" href="https://www\\.gardenwithserge\\.com/${file}"`));
    }
});

test('homepage links disclosures at upload, signup, checkout, and footer', () => {
    const source = fs.readFileSync(path.join(publicDir, 'index.html'), 'utf8');
    for (const link of ['/privacy.html', '/terms.html', '/ai-limitations.html', '/refunds.html', '/contact.html']) {
        assert.match(source, new RegExp(`href="${link.replace('.', '\\.')}"`));
    }
    assert.match(source, /Your selected image is sent to an AI provider/);
    assert.match(source, /Plans renew at the displayed monthly or yearly interval until canceled/);
    assert.match(source, /You can unsubscribe in every email/);
});
