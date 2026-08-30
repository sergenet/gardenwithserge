const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const server = fs.readFileSync(path.join(root, 'server.js'), 'utf8');
const index = fs.readFileSync(path.join(root, 'public', 'index.html'), 'utf8');

test('commerce fails closed and webhooks are replay protected', () => {
    assert.match(server, /COMMERCE_ENABLED.*false/);
    assert.match(server, /confirm-stripe-session[\s\S]*COMMERCE_DISABLED/);
    assert.match(server, /CREATE TABLE IF NOT EXISTS payment_events/);
    assert.match(server, /INSERT IGNORE INTO payment_events/);
    assert.doesNotMatch(server, /success:\s*true,\s*email,/s);
    const paymentButtons = [...index.matchAll(/<button class="payment-half [^"]+"[^>]*>/g)];
    assert.equal(paymentButtons.length, 8);
    paymentButtons.forEach(([button]) => assert.match(button, /\bdisabled\b/));
});

test('unknown API and page requests have explicit 404 handlers', () => {
    assert.match(server, /app\.use\('\/api',[\s\S]*status\(404\)\.json/);
    assert.match(server, /status\(404\)\.sendFile\(path\.join\(__dirname, 'public', '404\.html'\)\)/);
});

test('security middleware restricts origins, framing, and browser permissions', () => {
    assert.match(server, /ALLOWED_ORIGINS/);
    assert.match(server, /frameAncestors:\s*\["'none'"\]/);
    assert.match(server, /Permissions-Policy/);
    assert.match(server, /timingSafeEqual\(supplied, expected\)/);
});

test('deployable primary tree contains no obvious private-key credential pattern', () => {
    const prohibited = [
        /sk_(?:live|test)_[A-Za-z0-9]{12,}/,
        /xsmtpsib-[A-Za-z0-9_-]{20,}/,
        /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
    ];
    for (const file of ['server.js', 'public/app.js', 'public/index.html', 'public/translations.js']) {
        const source = fs.readFileSync(path.join(root, file), 'utf8');
        prohibited.forEach((pattern) => assert.doesNotMatch(source, pattern));
    }
});
