const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const server = fs.readFileSync(path.join(root, 'server.js'), 'utf8');
const index = fs.readFileSync(path.join(root, 'public', 'index.html'), 'utf8');
const publicHtaccess = fs.readFileSync(path.join(root, 'public', '.htaccess'), 'utf8');
const legacyRoot = path.join(root, '..', 'gardenwithserge.com');
const legacyLogin = fs.readFileSync(path.join(legacyRoot, 'login.php'), 'utf8');
const legacyJournal = fs.readFileSync(path.join(legacyRoot, 'journal.php'), 'utf8');
const legacyBenefits = fs.readFileSync(path.join(legacyRoot, 'get_plant_benefits.php'), 'utf8');
const legacyHtaccess = fs.readFileSync(path.join(legacyRoot, '.htaccess'), 'utf8');

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

test('public static serving denies manifests, databases, logs, and dotfiles', () => {
    assert.match(server, /PUBLIC_SENSITIVE_PATH/);
    assert.match(server, /package\(\?:-lock\)\?\\\.json/);
    assert.match(server, /sqlite3\|db\|bak\|backup/);
    assert.match(server, /express\.static[\s\S]*dotfiles:\s*'deny'/);
    assert.match(publicHtaccess, /\\\.php\$/);
    assert.match(publicHtaccess, /env\|json\|log\|sqlite\|db/);
    assert.match(publicHtaccess, /inject_keys\\\.js/);
    assert.match(publicHtaccess, /verify-payment-setup/);
});

test('free access is limited to three identifications and excludes disease diagnosis', () => {
    assert.match(server, /plant-identify[\s\S]*consumeDailyUsage\(`\$\{access\.subjectKey\}:identify`, access\.tier, FREE_DAILY_LIMIT\)/);
    assert.match(server, /plant-analyze[\s\S]*PAID_MEMBERSHIP_REQUIRED/);
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

test('legacy member routes retain secure authentication and private journal storage', () => {
    assert.match(legacyLogin, /session_set_cookie_params/);
    assert.match(legacyLogin, /login_csrf_token/);
    assert.match(legacyLogin, /CREATE TABLE IF NOT EXISTS login_attempts/);
    assert.match(legacyLogin, /session_regenerate_id\(true\)/);
    assert.match(legacyJournal, /JOURNAL_DB_PATH/);
    assert.match(legacyJournal, /csrf_token/);
    assert.match(legacyJournal, /header\('Location: login\.php'\)/);
});

test('legacy paid benefits route is bounded and obsolete PHP APIs are denied', () => {
    assert.match(legacyBenefits, /REQUEST_METHOD.*POST/);
    assert.match(legacyBenefits, /membership_type.*green_thumb/);
    assert.match(legacyBenefits, /benefits_request_times/);
    assert.match(legacyBenefits, /CURLOPT_TIMEOUT/);
    assert.doesNotMatch(legacyBenefits, /OpenAI error:/);
    assert.match(legacyHtaccess, /RewriteRule "\^api\/\[\^\/\]\+\\\.php\$" - \[F,L,NC\]/);
    assert.match(legacyHtaccess, /RewriteRule "\^backend\(\?:\/\|\$\)" - \[F,L,NC\]/);
});
