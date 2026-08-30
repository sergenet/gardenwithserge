const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const {
    MAILING_ADDRESS,
    buildWelcomeMessage,
    createUnsubscribeToken,
    verifyUnsubscribeToken,
} = require('../lib/mailer');

test('unsubscribe tokens are normalized, scoped, and tamper resistant', () => {
    const secret = 'unit-test-secret';
    const token = createUnsubscribeToken('Seed@Example.com ', secret);
    assert.equal(verifyUnsubscribeToken('seed@example.com', token, secret), true);
    assert.equal(verifyUnsubscribeToken('other@example.com', token, secret), false);
    assert.equal(verifyUnsubscribeToken('seed@example.com', `${token}0`, secret), false);
});

test('welcome message includes truthful consent copy, mailing address, and signed unsubscribe', () => {
    const previous = process.env.UNSUBSCRIBE_TOKEN_SECRET;
    process.env.UNSUBSCRIBE_TOKEN_SECRET = 'unit-test-secret';
    try {
        const message = buildWelcomeMessage('seed@example.com');
        assert.match(message.text, /periodic gardening tips and site updates/i);
        assert.match(message.text, new RegExp(MAILING_ADDRESS.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
        assert.match(message.unsubscribeUrl, /^https:\/\/www\.gardenwithserge\.com\/unsubscribe\?/);
        assert.doesNotMatch(message.text, /unlimited|accuracy|community forum|AI gardening assistant/i);
    } finally {
        if (previous === undefined) delete process.env.UNSUBSCRIBE_TOKEN_SECRET;
        else process.env.UNSUBSCRIBE_TOKEN_SECRET = previous;
    }
});

test('newsletter signup uses the single-recipient mailer and an atomic welcome claim', () => {
    const server = fs.readFileSync(path.join(__dirname, '..', 'server.js'), 'utf8');
    assert.match(server, /claimedWelcome/);
    assert.match(server, /welcome_sent_at = NOW\(\)[\s\S]*welcome_sent_at IS NULL/);
    assert.match(server, /sendWelcomeEmail\(emailRaw\)/);
    assert.doesNotMatch(server, /send_welcome_now\.php|execFile\('php'/);
});

test('mailer supports explicit authenticated TLS mode for port 465', () => {
    const mailer = fs.readFileSync(path.join(__dirname, '..', 'lib', 'mailer.js'), 'utf8');
    assert.match(mailer, /SMTP_PORT/);
    assert.match(mailer, /SMTP_SECURE/);
    assert.match(mailer, /requireTLS:\s*!secure/);
    assert.match(mailer, /rejectUnauthorized:\s*true/);
});
