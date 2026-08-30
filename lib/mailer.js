'use strict';

const crypto = require('crypto');
const nodemailer = require('nodemailer');

const MAILING_ADDRESS = 'Serge Shammas, 20249 Livorno Way, Los Angeles, CA 91326, USA';

function normalizeEmail(email) {
    return String(email || '').trim().toLowerCase();
}

function createUnsubscribeToken(email, secret = process.env.UNSUBSCRIBE_TOKEN_SECRET) {
    const normalized = normalizeEmail(email);
    if (!normalized || !secret) throw new Error('Unsubscribe signing is not configured.');
    return crypto.createHmac('sha256', String(secret)).update(normalized).digest('hex');
}

function verifyUnsubscribeToken(email, token, secret = process.env.UNSUBSCRIBE_TOKEN_SECRET) {
    if (!token || !secret) return false;
    let expected;
    try {
        expected = createUnsubscribeToken(email, secret);
    } catch {
        return false;
    }
    const supplied = Buffer.from(String(token), 'utf8');
    const calculated = Buffer.from(expected, 'utf8');
    return supplied.length === calculated.length && crypto.timingSafeEqual(supplied, calculated);
}

function buildWelcomeMessage(email) {
    const normalized = normalizeEmail(email);
    const token = createUnsubscribeToken(normalized);
    const unsubscribeUrl = `https://www.gardenwithserge.com/unsubscribe?email=${encodeURIComponent(normalized)}&token=${encodeURIComponent(token)}`;
    const text = [
        'Welcome to Garden with Serge.',
        '',
        'You asked to receive periodic gardening tips and site updates. You can unsubscribe at any time.',
        '',
        `Unsubscribe: ${unsubscribeUrl}`,
        '',
        MAILING_ADDRESS,
    ].join('\n');
    const html = [
        '<h1>Welcome to Garden with Serge</h1>',
        '<p>You asked to receive periodic gardening tips and site updates. You can unsubscribe at any time.</p>',
        `<p><a href="${unsubscribeUrl}">Unsubscribe</a></p>`,
        `<p style="font-size:12px;color:#555">${MAILING_ADDRESS}</p>`,
    ].join('');
    return { html, text, unsubscribeUrl };
}

function createTransport() {
    const host = String(process.env.SMTP_HOST || '').trim();
    const user = String(process.env.SMTP_USERNAME || '').trim();
    const pass = String(process.env.SMTP_PASSWORD || '').trim();
    if (!host || !user || !pass) throw new Error('SMTP is not configured.');
    return nodemailer.createTransport({
        host,
        port: 587,
        secure: false,
        requireTLS: true,
        auth: { user, pass },
        tls: { minVersion: 'TLSv1.2', rejectUnauthorized: true },
        connectionTimeout: 15000,
        greetingTimeout: 15000,
        socketTimeout: 30000,
    });
}

async function sendWelcomeEmail(email) {
    const normalized = normalizeEmail(email);
    const { html, text, unsubscribeUrl } = buildWelcomeMessage(normalized);
    const fromEmail = String(process.env.SMTP_FROM_EMAIL || '').trim();
    const fromName = String(process.env.SMTP_FROM_NAME || 'Garden with Serge').trim();
    if (!fromEmail) throw new Error('SMTP sender is not configured.');
    return createTransport().sendMail({
        from: { name: fromName, address: fromEmail },
        to: normalized,
        replyTo: fromEmail,
        subject: 'Welcome to Garden with Serge',
        text,
        html,
        headers: {
            'List-Unsubscribe': `<${unsubscribeUrl}>`,
        },
    });
}

module.exports = {
    MAILING_ADDRESS,
    buildWelcomeMessage,
    createUnsubscribeToken,
    sendWelcomeEmail,
    verifyUnsubscribeToken,
};
