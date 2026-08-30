const express = require('express');
const cors = require('cors');
const multer = require('multer');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const { OpenAI } = require('openai');
const path = require('path');
const crypto = require('crypto');
const fetch = require('node-fetch');
require('dotenv').config();
const mysql = require('mysql2/promise'); // For newsletter signup
const { validateAnalysisResult } = require('./lib/analysis-contract');

function logEvent(message, metadata = {}) {
    const safe = Object.fromEntries(
        Object.entries(metadata).filter(([key]) => !['key', 'token', 'password', 'body', 'image', 'messages', 'response'].includes(key.toLowerCase()))
    );
    console.log(JSON.stringify({ timestamp: new Date().toISOString(), message, ...safe }));
}

function requiredEnv(name) {
    const value = process.env[name];
    if (!value || !String(value).trim()) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return String(value).trim();
}

const app = express();

const PORT = process.env.PORT || 3001;
const OPENAI_API_KEY = requiredEnv('OPENAI_API_KEY');
const MEMBER_TOKEN_SECRET = requiredEnv('MEMBER_TOKEN_SECRET');
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';
const ENABLE_STRIPE_AUTO_REFUND = String(process.env.ENABLE_STRIPE_AUTO_REFUND || 'false').toLowerCase() === 'true';
const COMMERCE_ENABLED = String(process.env.COMMERCE_ENABLED || 'false').toLowerCase() === 'true';
const FREE_DAILY_LIMIT = 3;
const ADMIN_DASHBOARD_PASSWORD = process.env.ADMIN_DASHBOARD_PASSWORD || '';
const ALLOWED_ORIGINS = new Set(
    (process.env.ALLOWED_ORIGINS || 'https://www.gardenwithserge.com,https://gardenwithserge.com')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean)
);
const SUPPORTED_NEWSLETTER_LANGUAGES = new Set(['English', 'Greek', 'Spanish', 'French', 'German', 'Arabic', 'Russian']);

const PRICE_ID_TO_MEMBERSHIP = {
    price_1QZjhGFJK8JMTXAGlnc3JnKI: 'basic_monthly',
    price_1QZjhGFJK8JMTXAGfgE2HXCZ: 'basic_yearly',
    price_1QZjhGFJK8JMTXAGmnC4KLPQ: 'green_thumb_monthly',
    price_1QZjhGFJK8JMTXAGnbH5TYUW: 'green_thumb_yearly',
};

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

app.disable('x-powered-by');
app.set('trust proxy', Number(process.env.TRUST_PROXY_HOPS || 1));
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            baseUri: ["'self'"],
            objectSrc: ["'none'"],
            frameAncestors: ["'none'"],
            formAction: ["'self'", 'https://www.paypal.com', 'https://checkout.stripe.com'],
            imgSrc: ["'self'", 'data:', 'blob:'],
            scriptSrc: ["'self'", "'unsafe-inline'", 'https://js.stripe.com', 'https://www.paypal.com', 'https://www.googletagmanager.com'],
            styleSrc: ["'self'", "'unsafe-inline'"],
            connectSrc: ["'self'", 'https://api.stripe.com', 'https://www.google-analytics.com', 'https://region1.google-analytics.com'],
            frameSrc: ['https://js.stripe.com', 'https://hooks.stripe.com', 'https://www.paypal.com'],
            upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
        },
    },
    crossOriginEmbedderPolicy: false,
    strictTransportSecurity: process.env.NODE_ENV === 'production'
        ? { maxAge: 31536000, includeSubDomains: true, preload: true }
        : false,
}));
app.use((req, res, next) => {
    const incoming = String(req.headers['x-request-id'] || '');
    const requestId = /^[A-Za-z0-9._-]{8,100}$/.test(incoming) ? incoming : crypto.randomUUID();
    req.requestId = requestId;
    res.setHeader('X-Request-ID', requestId);
    res.setHeader('Permissions-Policy', 'camera=(self), geolocation=(), microphone=()');
    if (req.path.startsWith('/api/')) res.setHeader('Cache-Control', 'no-store');
    const startedAt = process.hrtime.bigint();
    res.on('finish', () => {
        const durationMs = Number(process.hrtime.bigint() - startedAt) / 1e6;
        logEvent('Request completed', {
            requestId,
            method: req.method,
            path: req.path,
            status: res.statusCode,
            durationMs: Math.round(durationMs),
        });
    });
    next();
});
app.use(cors({
    origin(origin, callback) {
        if (!origin || ALLOWED_ORIGINS.has(origin)) return callback(null, true);
        return callback(new Error('Origin not allowed'));
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Stripe-Signature'],
    credentials: true,
    maxAge: 86400,
}));

app.use((req, res, next) => {
    if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        const origin = req.headers.origin;
        if (origin && !ALLOWED_ORIGINS.has(origin)) {
            return res.status(403).json({ error: 'Origin not allowed' });
        }
    }
    return next();
});

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 120,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'Too many requests. Please try again later.' },
});
const aiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'Too many analysis requests. Please try again later.' },
});
const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: 'Too many authentication attempts. Try again later.',
});
const newsletterLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'Too many subscription attempts. Try again later.' },
});
app.use('/api', apiLimiter);

app.get('/healthz', (req, res) => res.json({ ok: true }));
app.get('/readyz', async (req, res) => {
    try {
        await withDb((connection) => connection.ping());
        return res.json({ ok: true });
    } catch (err) {
        logEvent('Readiness check failed', { errorType: err.name });
        return res.status(503).json({ ok: false });
    }
});

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 8 * 1024 * 1024, files: 1, fields: 5, parts: 6 },
    fileFilter(req, file, callback) {
        const allowed = new Set(['image/jpeg', 'image/png', 'image/webp']);
        if (!allowed.has(String(file.mimetype).toLowerCase())) {
            return callback(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'image'));
        }
        return callback(null, true);
    },
});

function isSupportedImage(buffer) {
    if (!Buffer.isBuffer(buffer) || buffer.length < 12) return false;
    const jpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    const png = buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    const webp = buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP';
    return jpeg || png || webp;
}

function getDbConfig() {
    return {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    };
}

async function withDb(fn) {
    const connection = await mysql.createConnection(getDbConfig());
    try {
        return await fn(connection);
    } finally {
        await connection.end();
    }
}

async function ensureAppSchema() {
    await withDb(async (connection) => {
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS analysis_usage_daily (
                subject_key VARCHAR(255) NOT NULL,
                usage_date DATE NOT NULL,
                analysis_count INT NOT NULL DEFAULT 0,
                last_tier VARCHAR(32) NOT NULL DEFAULT 'free',
                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (subject_key, usage_date)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);

        await connection.execute(`
            CREATE TABLE IF NOT EXISTS billing_requests (
                id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                request_type VARCHAR(32) NOT NULL,
                email VARCHAR(255) NOT NULL,
                provider VARCHAR(32) DEFAULT NULL,
                membership_type VARCHAR(64) DEFAULT NULL,
                status VARCHAR(32) NOT NULL DEFAULT 'received',
                reason TEXT DEFAULT NULL,
                details_json LONGTEXT DEFAULT NULL,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                KEY idx_email (email),
                KEY idx_request_type_status (request_type, status)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);

        await connection.execute(`
            CREATE TABLE IF NOT EXISTS payment_events (
                provider VARCHAR(32) NOT NULL,
                event_id VARCHAR(255) NOT NULL,
                event_type VARCHAR(128) NOT NULL,
                processed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (provider, event_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);

        await connection.execute(`
            CREATE TABLE IF NOT EXISTS newsletter_subscribers (
                id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL,
                language VARCHAR(64) DEFAULT 'English',
                membership_type VARCHAR(64) DEFAULT NULL,
                payment_provider VARCHAR(32) DEFAULT NULL,
                utm_source VARCHAR(255) DEFAULT NULL,
                utm_medium VARCHAR(255) DEFAULT NULL,
                utm_campaign VARCHAR(255) DEFAULT NULL,
                utm_content VARCHAR(255) DEFAULT NULL,
                active TINYINT(1) NOT NULL DEFAULT 1,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                subscribed_at DATETIME DEFAULT NULL,
                welcome_sent_at DATETIME DEFAULT NULL,
                followup_1_sent_at DATETIME DEFAULT NULL,
                followup_2_sent_at DATETIME DEFAULT NULL,
                KEY idx_email (email),
                KEY idx_active (active)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);

        await connection.execute("ALTER TABLE newsletter_subscribers ADD COLUMN IF NOT EXISTS language VARCHAR(64) DEFAULT 'English'");
        await connection.execute('ALTER TABLE newsletter_subscribers ADD COLUMN IF NOT EXISTS membership_type VARCHAR(64) DEFAULT NULL');
        await connection.execute('ALTER TABLE newsletter_subscribers ADD COLUMN IF NOT EXISTS payment_provider VARCHAR(32) DEFAULT NULL');
        await connection.execute('ALTER TABLE newsletter_subscribers ADD COLUMN IF NOT EXISTS utm_source VARCHAR(255) DEFAULT NULL');
        await connection.execute('ALTER TABLE newsletter_subscribers ADD COLUMN IF NOT EXISTS utm_medium VARCHAR(255) DEFAULT NULL');
        await connection.execute('ALTER TABLE newsletter_subscribers ADD COLUMN IF NOT EXISTS utm_campaign VARCHAR(255) DEFAULT NULL');
        await connection.execute('ALTER TABLE newsletter_subscribers ADD COLUMN IF NOT EXISTS utm_content VARCHAR(255) DEFAULT NULL');
        await connection.execute('ALTER TABLE newsletter_subscribers ADD COLUMN IF NOT EXISTS active TINYINT(1) NOT NULL DEFAULT 1');
        await connection.execute('ALTER TABLE newsletter_subscribers ADD COLUMN IF NOT EXISTS subscribed_at DATETIME DEFAULT NULL');
        await connection.execute('ALTER TABLE newsletter_subscribers ADD COLUMN IF NOT EXISTS welcome_sent_at DATETIME DEFAULT NULL');
        await connection.execute('ALTER TABLE newsletter_subscribers ADD COLUMN IF NOT EXISTS followup_1_sent_at DATETIME DEFAULT NULL');
        await connection.execute('ALTER TABLE newsletter_subscribers ADD COLUMN IF NOT EXISTS followup_2_sent_at DATETIME DEFAULT NULL');
        await connection.execute('ALTER TABLE newsletter_subscribers ADD COLUMN IF NOT EXISTS last_plant_name VARCHAR(255) DEFAULT NULL');
        await connection.execute('ALTER TABLE newsletter_subscribers ADD COLUMN IF NOT EXISTS last_disease_analysis VARCHAR(255) DEFAULT NULL');
        await connection.execute('ALTER TABLE newsletter_subscribers ADD COLUMN IF NOT EXISTS last_care_recommendations TEXT DEFAULT NULL');
        await connection.execute('ALTER TABLE newsletter_subscribers ADD COLUMN IF NOT EXISTS last_seven_day_checklist TEXT DEFAULT NULL');
        await connection.execute('ALTER TABLE newsletter_subscribers CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    });
}

function tierFromMembershipType(membershipType) {
    if (!membershipType) return 'free';
    if (String(membershipType).startsWith('green_thumb_') || membershipType === 'green_thumb') return 'green_thumb';
    if (String(membershipType).startsWith('basic_') || membershipType === 'basic') return 'basic';
    return 'free';
}

function parseCookieHeader(cookieHeader) {
    const out = {};
    if (!cookieHeader) return out;
    for (const part of cookieHeader.split(';')) {
        const idx = part.indexOf('=');
        if (idx === -1) continue;
        const key = part.slice(0, idx).trim();
        const val = decodeURIComponent(part.slice(idx + 1).trim());
        out[key] = val;
    }
    return out;
}

function base64UrlEncode(str) {
    return Buffer.from(str, 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlDecode(str) {
    const b64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const pad = b64.length % 4 === 0 ? '' : '='.repeat(4 - (b64.length % 4));
    return Buffer.from(b64 + pad, 'base64').toString('utf8');
}

function signPayload(payloadPart) {
    return crypto.createHmac('sha256', MEMBER_TOKEN_SECRET).update(payloadPart).digest('hex');
}

function issueMemberToken(email, tier) {
    const payload = {
        email,
        tier,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30),
    };
    const payloadPart = base64UrlEncode(JSON.stringify(payload));
    const sig = signPayload(payloadPart);
    return `${payloadPart}.${sig}`;
}

function verifyMemberToken(token) {
    if (!token || typeof token !== 'string' || !token.includes('.')) return null;
    const [payloadPart, sig] = token.split('.');
    if (!payloadPart || !sig) return null;
    const expected = signPayload(payloadPart);
    const a = Buffer.from(expected, 'utf8');
    const b = Buffer.from(sig, 'utf8');
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
    try {
        const payload = JSON.parse(base64UrlDecode(payloadPart));
        if (!payload || !payload.email || !payload.exp) return null;
        if (payload.exp < Math.floor(Date.now() / 1000)) return null;
        return payload;
    } catch {
        return null;
    }
}

function appendSetCookie(res, cookieValue) {
    const current = res.getHeader('Set-Cookie');
    if (!current) {
        res.setHeader('Set-Cookie', cookieValue);
        return;
    }
    if (Array.isArray(current)) {
        res.setHeader('Set-Cookie', [...current, cookieValue]);
        return;
    }
    res.setHeader('Set-Cookie', [current, cookieValue]);
}

function setMemberCookie(res, token) {
    const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
    const cookie = `gws_member=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}${secure}`;
    appendSetCookie(res, cookie);
}

async function lookupMembershipByEmail(email) {
    const normalized = String(email || '').trim().toLowerCase();
    if (!normalized) return { tier: 'free', membershipType: null, paymentProvider: null };

    return withDb(async (connection) => {
        const [rows] = await connection.execute(
            `SELECT email, membership_type, payment_provider, active
             FROM newsletter_subscribers
             WHERE email = ?
             ORDER BY id DESC
             LIMIT 1`,
            [normalized]
        );

        if (!rows || rows.length === 0) {
            return { tier: 'free', membershipType: null, paymentProvider: null };
        }

        const row = rows[0];
        const active = Number(row.active) === 1;
        const membershipType = active ? (row.membership_type || null) : null;
        return {
            tier: active ? tierFromMembershipType(membershipType) : 'free',
            membershipType,
            paymentProvider: row.payment_provider || null,
        };
    });
}

async function upsertMembership(email, membershipType, paymentProvider, active = 1) {
    const normalized = String(email || '').trim().toLowerCase();
    if (!normalized) return;
    await withDb(async (connection) => {
        const [rows] = await connection.execute(
            'SELECT id FROM newsletter_subscribers WHERE email = ? ORDER BY id DESC LIMIT 1',
            [normalized]
        );

        if (rows.length > 0) {
            await connection.execute(
                `UPDATE newsletter_subscribers
                 SET membership_type = ?, payment_provider = ?, active = ?, subscribed_at = NOW()
                 WHERE id = ?`,
                [membershipType, paymentProvider, active, rows[0].id]
            );
        } else {
            await connection.execute(
                `INSERT INTO newsletter_subscribers
                 (email, membership_type, payment_provider, active, created_at, subscribed_at)
                 VALUES (?, ?, ?, ?, NOW(), NOW())`,
                [normalized, membershipType, paymentProvider, active]
            );
        }
    });
}

async function resolveAccessContext(req) {
    const cookies = parseCookieHeader(req.headers.cookie || '');
    const tokenPayload = verifyMemberToken(cookies.gws_member || '');

    if (tokenPayload && tokenPayload.email) {
        const membership = await lookupMembershipByEmail(tokenPayload.email);
        return {
            email: tokenPayload.email,
            tier: membership.tier,
            membershipType: membership.membershipType,
            paymentProvider: membership.paymentProvider,
            subjectKey: `member:${tokenPayload.email}`,
            tokenValid: true,
        };
    }

    const ip = req.ip || 'unknown';
    return {
        email: null,
        tier: 'free',
        membershipType: null,
        paymentProvider: null,
        subjectKey: `ip:${ip}`,
        tokenValid: false,
    };
}

async function getDailyUsageCount(subjectKey) {
    return withDb(async (connection) => {
        const [rows] = await connection.execute(
            'SELECT analysis_count FROM analysis_usage_daily WHERE subject_key = ? AND usage_date = CURRENT_DATE()',
            [subjectKey]
        );
        return rows.length ? Number(rows[0].analysis_count) : 0;
    });
}

async function consumeDailyUsage(subjectKey, tier, limit) {
    return withDb(async (connection) => {
        await connection.beginTransaction();
        try {
            const [rows] = await connection.execute(
                'SELECT analysis_count FROM analysis_usage_daily WHERE subject_key = ? AND usage_date = CURRENT_DATE() FOR UPDATE',
                [subjectKey]
            );
            const current = rows.length ? Number(rows[0].analysis_count) : 0;
            if (current >= limit) {
                await connection.rollback();
                return { allowed: false, used: current };
            }
            if (rows.length) {
                await connection.execute(
                    'UPDATE analysis_usage_daily SET analysis_count = analysis_count + 1, last_tier = ?, updated_at = NOW() WHERE subject_key = ? AND usage_date = CURRENT_DATE()',
                    [tier, subjectKey]
                );
            } else {
                await connection.execute(
                    'INSERT INTO analysis_usage_daily (subject_key, usage_date, analysis_count, last_tier) VALUES (?, CURRENT_DATE(), 1, ?)',
                    [subjectKey, tier]
                );
            }
            await connection.commit();
            return { allowed: true, used: current + 1 };
        } catch (error) {
            await connection.rollback();
            throw error;
        }
    });
}

async function createBillingRequest(requestType, email, provider, membershipType, reason, status, details) {
    return withDb(async (connection) => {
        const [result] = await connection.execute(
            `INSERT INTO billing_requests (request_type, email, provider, membership_type, status, reason, details_json)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [requestType, email, provider || null, membershipType || null, status, reason || null, JSON.stringify(details || {})]
        );
        return result.insertId;
    });
}

function parseBasicAuthHeader(headerValue) {
    if (!headerValue || !headerValue.startsWith('Basic ')) return null;
    const encoded = headerValue.slice(6).trim();
    try {
        const decoded = Buffer.from(encoded, 'base64').toString('utf8');
        const separatorIndex = decoded.indexOf(':');
        if (separatorIndex === -1) return null;
        return {
            username: decoded.slice(0, separatorIndex),
            password: decoded.slice(separatorIndex + 1),
        };
    } catch {
        return null;
    }
}

function requireAdminAuth(req, res, next) {
    if (!ADMIN_DASHBOARD_PASSWORD) {
        return res.status(503).send('Admin dashboard is not configured. Set ADMIN_DASHBOARD_PASSWORD.');
    }

    const credentials = parseBasicAuthHeader(req.headers.authorization || '');
    const supplied = Buffer.from(credentials ? credentials.password : '', 'utf8');
    const expected = Buffer.from(ADMIN_DASHBOARD_PASSWORD, 'utf8');
    const valid = supplied.length === expected.length && crypto.timingSafeEqual(supplied, expected);
    if (!valid) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Garden with Serge Admin", charset="UTF-8"');
        return res.status(401).send('Authentication required.');
    }

    return next();
}

async function stripeRequest(method, endpointPath, formData = null) {
    if (!STRIPE_SECRET_KEY) {
        throw new Error('Stripe secret key is not configured.');
    }
    const url = `https://api.stripe.com${endpointPath}`;
    const headers = {
        Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
    };
    let body;
    if (formData && Object.keys(formData).length > 0) {
        const params = new URLSearchParams();
        for (const [k, v] of Object.entries(formData)) {
            if (v === undefined || v === null) continue;
            params.append(k, String(v));
        }
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
        body = params.toString();
    }

    const response = await fetch(url, { method, headers, body });
    const text = await response.text();
    let payload;
    try {
        payload = JSON.parse(text);
    } catch {
        payload = { raw: text };
    }
    if (!response.ok) {
        const message = payload && payload.error && payload.error.message ? payload.error.message : `Stripe API ${response.status}`;
        throw new Error(message);
    }
    return payload;
}

function membershipTypeFromCheckoutSession(session) {
    const metadata = session && session.metadata ? session.metadata : {};
    const membershipTypeMeta = metadata.membershipType || metadata.membership_type || null;
    const billingCycle = metadata.billingCycle || metadata.billing_cycle || null;

    if (membershipTypeMeta === 'basic' && billingCycle) return `basic_${billingCycle}`;
    if ((membershipTypeMeta === 'green-thumb' || membershipTypeMeta === 'green_thumb') && billingCycle) return `green_thumb_${billingCycle}`;
    if (membershipTypeMeta && (membershipTypeMeta.startsWith('basic_') || membershipTypeMeta.startsWith('green_thumb_'))) return membershipTypeMeta;

    const lineItems = session && session.line_items && Array.isArray(session.line_items.data) ? session.line_items.data : [];
    for (const item of lineItems) {
        const priceId = item && item.price && item.price.id ? item.price.id : null;
        if (priceId && PRICE_ID_TO_MEMBERSHIP[priceId]) {
            return PRICE_ID_TO_MEMBERSHIP[priceId];
        }
    }
    return null;
}

function parseStripeSignatureHeader(sigHeader) {
    const out = {};
    if (!sigHeader) return out;
    sigHeader.split(',').forEach((part) => {
        const [k, v] = part.split('=');
        if (k && v) out[k.trim()] = v.trim();
    });
    return out;
}

function verifyStripeWebhookSignature(rawBody, sigHeader, secret) {
    const parsed = parseStripeSignatureHeader(sigHeader);
    const t = parsed.t;
    const v1 = parsed.v1;
    if (!t || !v1) return false;
    const payloadToSign = `${t}.${rawBody.toString('utf8')}`;
    const expected = crypto.createHmac('sha256', secret).update(payloadToSign).digest('hex');
    const a = Buffer.from(expected, 'utf8');
    const b = Buffer.from(v1, 'utf8');
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
    const timestamp = Number(t);
    if (!Number.isFinite(timestamp)) return false;
    const age = Math.abs(Math.floor(Date.now() / 1000) - timestamp);
    return age <= 300;
}

async function stripeFindCustomerByEmail(email) {
    const list = await stripeRequest('GET', `/v1/customers?email=${encodeURIComponent(email)}&limit=1`);
    return list && list.data && list.data.length ? list.data[0] : null;
}

async function stripeFindActiveSubscriptionForCustomer(customerId) {
    const list = await stripeRequest('GET', `/v1/subscriptions?customer=${encodeURIComponent(customerId)}&status=all&limit=20`);
    const subs = list && list.data ? list.data : [];
    return subs.find((s) => ['active', 'trialing', 'past_due', 'unpaid'].includes(s.status)) || null;
}

async function attemptStripeCancelByEmail(email, immediate) {
    const customer = await stripeFindCustomerByEmail(email);
    if (!customer) return { ok: false, code: 'customer_not_found' };
    const subscription = await stripeFindActiveSubscriptionForCustomer(customer.id);
    if (!subscription) return { ok: false, code: 'subscription_not_found' };

    if (immediate) {
        const canceled = await stripeRequest('DELETE', `/v1/subscriptions/${encodeURIComponent(subscription.id)}`);
        return { ok: true, mode: 'immediate', subscriptionId: canceled.id, status: canceled.status };
    }

    const updated = await stripeRequest('POST', `/v1/subscriptions/${encodeURIComponent(subscription.id)}`, {
        cancel_at_period_end: 'true',
    });
    return { ok: true, mode: 'period_end', subscriptionId: updated.id, status: updated.status, cancelAtPeriodEnd: updated.cancel_at_period_end };
}

async function attemptStripeRefundByEmail(email, amountCents) {
    const customer = await stripeFindCustomerByEmail(email);
    if (!customer) return { ok: false, code: 'customer_not_found' };

    const charges = await stripeRequest('GET', `/v1/charges?customer=${encodeURIComponent(customer.id)}&limit=20`);
    const eligible = (charges.data || []).find((c) => c.paid && !c.refunded && c.status === 'succeeded');
    if (!eligible) return { ok: false, code: 'charge_not_found' };

    const payload = { charge: eligible.id };
    if (Number.isFinite(amountCents) && amountCents > 0) {
        payload.amount = Math.floor(amountCents);
    }
    const refund = await stripeRequest('POST', '/v1/refunds', payload);
    return { ok: true, refundId: refund.id, chargeId: eligible.id, status: refund.status };
}

app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
    let claimedStripeEventId = null;
    try {
        const sigHeader = req.headers['stripe-signature'] || '';
        if (!STRIPE_WEBHOOK_SECRET) {
            return res.status(500).json({ error: 'Stripe webhook secret is not configured.' });
        }

        const verified = verifyStripeWebhookSignature(req.body, sigHeader, STRIPE_WEBHOOK_SECRET);
        if (!verified) {
            return res.status(400).json({ error: 'Invalid Stripe webhook signature.' });
        }

        const event = JSON.parse(req.body.toString('utf8'));
        const type = event.type;
        const object = event.data && event.data.object ? event.data.object : null;

        if (!event.id || !type) return res.status(400).json({ error: 'Invalid Stripe event.' });
        const isNewEvent = await withDb(async (connection) => {
            const [result] = await connection.execute(
                'INSERT IGNORE INTO payment_events (provider, event_id, event_type) VALUES (?, ?, ?)',
                ['stripe', String(event.id), String(type)]
            );
            return result.affectedRows === 1;
        });
        if (!isNewEvent) return res.status(200).json({ ok: true, duplicate: true });
        claimedStripeEventId = String(event.id);

        if (!object) return res.status(200).json({ ok: true, ignored: true });

        if (type === 'checkout.session.completed') {
            const session = await stripeRequest('GET', `/v1/checkout/sessions/${encodeURIComponent(object.id)}?expand[]=line_items.data.price`);
            const email = (session.customer_details && session.customer_details.email) || session.customer_email || null;
            const membershipType = membershipTypeFromCheckoutSession(session);
            if (email && membershipType) {
                await upsertMembership(email, membershipType, 'stripe', 1);
            }
        }

        if (type === 'customer.subscription.updated' || type === 'customer.subscription.created' || type === 'customer.subscription.deleted') {
            const subscription = object;
            const customerId = subscription.customer;
            const customer = await stripeRequest('GET', `/v1/customers/${encodeURIComponent(customerId)}`);
            const email = customer && customer.email ? customer.email : null;
            const priceId = subscription.items && subscription.items.data && subscription.items.data[0] && subscription.items.data[0].price ? subscription.items.data[0].price.id : null;
            const membershipType = PRICE_ID_TO_MEMBERSHIP[priceId] || null;
            if (email && membershipType) {
                const active = ['active', 'trialing', 'past_due', 'unpaid'].includes(subscription.status) ? 1 : 0;
                await upsertMembership(email, membershipType, 'stripe', active);
            }
        }

        return res.status(200).json({ ok: true });
    } catch (err) {
        if (claimedStripeEventId) {
            try {
                await withDb((connection) => connection.execute(
                    'DELETE FROM payment_events WHERE provider = ? AND event_id = ?',
                    ['stripe', claimedStripeEventId]
                ));
            } catch {
                logEvent('Failed to release Stripe event claim');
            }
        }
        logEvent('Stripe webhook processing failed', { errorType: err.name });
        return res.status(500).json({ error: 'Webhook processing failed' });
    }
});

app.use(express.json({ limit: '256kb', strict: true }));

app.get('/admin/billing-requests', adminLimiter, requireAdminAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'admin-billing-requests.html'));
});

app.get('/api/admin/billing-requests', adminLimiter, requireAdminAuth, async (req, res) => {
    try {
        const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 50, 1), 200);
        const status = String(req.query.status || '').trim();

        const result = await withDb(async (connection) => {
            const recentQuery = status
                ? `SELECT id, request_type, email, provider, membership_type, status, reason, details_json, created_at, updated_at
                   FROM billing_requests
                   WHERE status = ?
                   ORDER BY id DESC
                   LIMIT ?`
                : `SELECT id, request_type, email, provider, membership_type, status, reason, details_json, created_at, updated_at
                   FROM billing_requests
                   ORDER BY id DESC
                   LIMIT ?`;

            const recentParams = status ? [status, limit] : [limit];
            const [recentRows] = await connection.execute(recentQuery, recentParams);

            const [pendingRows] = await connection.execute(
                `SELECT id, request_type, email, provider, membership_type, status, reason, details_json, created_at, updated_at
                 FROM billing_requests
                 WHERE status IN ('received', 'pending_manual')
                 ORDER BY id DESC
                 LIMIT ?`,
                [limit]
            );

            const [counts] = await connection.execute(
                `SELECT status, COUNT(*) AS count
                 FROM billing_requests
                 GROUP BY status`
            );

            return { recentRows, pendingRows, counts };
        });

        return res.json({
            recent: result.recentRows.map((row) => ({
                ...row,
                details_json: row.details_json ? (() => {
                    try { return JSON.parse(row.details_json); } catch { return row.details_json; }
                })() : null,
            })),
            pendingManualActions: result.pendingRows.map((row) => ({
                ...row,
                details_json: row.details_json ? (() => {
                    try { return JSON.parse(row.details_json); } catch { return row.details_json; }
                })() : null,
            })),
            counts: result.counts.reduce((acc, row) => {
                acc[row.status] = Number(row.count);
                return acc;
            }, {}),
        });
    } catch (err) {
        logEvent('Admin billing request fetch failed', { errorType: err.name });
        return res.status(500).json({ error: 'Unable to fetch admin billing requests' });
    }
});

app.post('/api/admin/billing-requests/:id/status', adminLimiter, requireAdminAuth, async (req, res) => {
    try {
        const requestId = parseInt(req.params.id, 10);
        const nextStatus = String(req.body.status || '').trim();
        const allowed = ['received', 'pending_manual', 'processed', 'rejected', 'resolved'];
        if (!requestId || !allowed.includes(nextStatus)) {
            return res.status(400).json({ error: 'Invalid request id or status.' });
        }

        await withDb(async (connection) => {
            await connection.execute(
                'UPDATE billing_requests SET status = ?, updated_at = NOW() WHERE id = ?',
                [nextStatus, requestId]
            );
        });

        return res.json({ success: true, id: requestId, status: nextStatus });
    } catch (err) {
        logEvent('Admin billing request update failed', { errorType: err.name });
        return res.status(500).json({ error: 'Unable to update billing request status' });
    }
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/commerce/config', (req, res) => {
    return res.json({
        enabled: COMMERCE_ENABLED,
        stripe: COMMERCE_ENABLED && Boolean(STRIPE_SECRET_KEY) && Boolean(STRIPE_WEBHOOK_SECRET),
        paypal: false,
    });
});

app.get('/api/membership/status', async (req, res) => {
    try {
        const context = await resolveAccessContext(req);
        const used = context.tier === 'free' ? await getDailyUsageCount(context.subjectKey) : 0;
        const remaining = context.tier === 'free' ? Math.max(0, FREE_DAILY_LIMIT - used) : null;
        return res.json({
            tier: context.tier,
            membershipType: context.membershipType,
            email: context.email,
            freeDailyLimit: FREE_DAILY_LIMIT,
            usedToday: used,
            remainingToday: remaining,
        });
    } catch (err) {
        return res.status(500).json({ error: 'Unable to resolve membership status' });
    }
});

app.get('/api/membership/confirm-stripe-session', async (req, res) => {
    try {
        const sessionId = String(req.query.session_id || '').trim();
        if (!sessionId) {
            return res.status(400).json({ error: 'session_id is required' });
        }
        if (!STRIPE_SECRET_KEY) {
            return res.status(500).json({ error: 'Stripe secret key is not configured.' });
        }

        const session = await stripeRequest('GET', `/v1/checkout/sessions/${encodeURIComponent(sessionId)}?expand[]=line_items.data.price`);
        const email = (session.customer_details && session.customer_details.email) || session.customer_email || null;
        const membershipType = membershipTypeFromCheckoutSession(session);

        if (session.status !== 'complete' || !['paid', 'no_payment_required'].includes(session.payment_status) || !email || !membershipType) {
            return res.status(400).json({ error: 'Unable to confirm membership from Stripe session.' });
        }

        await upsertMembership(email, membershipType, 'stripe', 1);
        const tier = tierFromMembershipType(membershipType);
        const token = issueMemberToken(email, tier);
        setMemberCookie(res, token);

        return res.json({
            success: true,
            membershipType,
            tier,
        });
    } catch (err) {
        logEvent('Stripe session confirmation failed', { errorType: err.name });
        return res.status(500).json({ error: 'Stripe session confirmation failed' });
    }
});

app.post('/api/subscription/cancel-request', async (req, res) => {
    try {
        const access = await resolveAccessContext(req);
        const email = String(req.body.email || '').trim().toLowerCase();
        const reason = String(req.body.reason || '').trim();
        const immediate = Boolean(req.body.immediate);
        if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
            return res.status(400).json({ error: 'Valid email is required.' });
        }
        if (!access.tokenValid || access.email !== email) {
            return res.status(403).json({ error: 'Verified member access is required.' });
        }

        const membership = await lookupMembershipByEmail(email);
        let status = 'received';
        let attempt = { ok: false, code: 'not_attempted' };

        if (membership.paymentProvider === 'stripe' || (!membership.paymentProvider && STRIPE_SECRET_KEY)) {
            try {
                attempt = await attemptStripeCancelByEmail(email, immediate);
                status = attempt.ok ? 'processed' : 'pending_manual';
                if (attempt.ok && immediate && membership.membershipType) {
                    await upsertMembership(email, membership.membershipType, 'stripe', 0);
                }
            } catch (err) {
                attempt = { ok: false, code: 'stripe_error', message: err.message };
                status = 'pending_manual';
            }
        }

        const requestId = await createBillingRequest(
            'cancel',
            email,
            membership.paymentProvider,
            membership.membershipType,
            reason,
            status,
            { immediate, attempt }
        );

        return res.json({ success: true, requestId, status, attempt });
    } catch (err) {
        logEvent('Cancellation request failed', { errorType: err.name });
        return res.status(500).json({ error: 'Failed to create cancellation request' });
    }
});

app.post('/api/refund-request', async (req, res) => {
    try {
        const access = await resolveAccessContext(req);
        const email = String(req.body.email || '').trim().toLowerCase();
        const reason = String(req.body.reason || '').trim();
        const amount = req.body.amount;
        if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
            return res.status(400).json({ error: 'Valid email is required.' });
        }
        if (!access.tokenValid || access.email !== email) {
            return res.status(403).json({ error: 'Verified member access is required.' });
        }

        const membership = await lookupMembershipByEmail(email);
        let status = 'received';
        let attempt = { ok: false, code: 'manual_review' };

        if (ENABLE_STRIPE_AUTO_REFUND && (membership.paymentProvider === 'stripe' || STRIPE_SECRET_KEY)) {
            try {
                const amountCents = amount ? Math.round(Number(amount) * 100) : null;
                attempt = await attemptStripeRefundByEmail(email, amountCents);
                status = attempt.ok ? 'processed' : 'pending_manual';
            } catch (err) {
                attempt = { ok: false, code: 'stripe_error', message: err.message };
                status = 'pending_manual';
            }
        }

        const requestId = await createBillingRequest(
            'refund',
            email,
            membership.paymentProvider,
            membership.membershipType,
            reason,
            status,
            { amount, attempt }
        );

        return res.json({ success: true, requestId, status, attempt, autoRefundEnabled: ENABLE_STRIPE_AUTO_REFUND });
    } catch (err) {
        logEvent('Refund request failed', { errorType: err.name });
        return res.status(500).json({ error: 'Failed to create refund request' });
    }
});

// Step 1: Plant Identification
app.post('/api/plant-identify', aiLimiter, upload.single('image'), async (req, res) => {
    try {
        const access = await resolveAccessContext(req);
        if (!req.file || !isSupportedImage(req.file.buffer)) {
            return res.status(400).json({ error: 'A valid JPEG, PNG, or WebP image is required.' });
        }
        const { language } = req.body;
        const langCode = language || req.query.lang || 'en';
        
        const langMap = {
            'en': 'English',
            'es': 'Spanish',
            'fr': 'French',
            'de': 'German',
            'el': 'Greek',
            'ru': 'Russian',
            'ar': 'Arabic'
        };
        const targetLang = langMap[langCode.toLowerCase()] || 'English';

        const imageBase64 = req.file.buffer.toString('base64');
        const prompt = `
Identify the plant in the image. Respond as JSON:
{
  "plantName": "",
  "scientificName": "",
  "confidence": 0
}
You MUST write the plantName value in the ${targetLang} language. Keep the scientificName in its standard Latin format.
Use null if unsure. Only return JSON.`;

        const messages = [
            {
                role: "system",
                content: "You are an expert botanist. Only return JSON as instructed."
            },
            {
                role: "user",
                content: [
                    { type: "text", text: prompt },
                    { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
                ]
            }
        ];

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages,
            max_tokens: 300,
            response_format: { type: "json_object" },
            temperature: 0
        });

        let result;
        try {
            result = JSON.parse(completion.choices[0].message.content);
        } catch (e) {
            logEvent('Invalid JSON returned for plant-identify');
            return res.status(502).json({ error: 'Plant identification could not be completed.' });
        }
        res.json({ ...result, tier: access.tier });
    } catch (err) {
        logEvent('Plant identification failed', { errorType: err.name });
        res.status(500).json({ error: 'Plant identification failed.' });
    }
});

// Step 2: Disease Analysis
app.post('/api/plant-analyze', aiLimiter, upload.single('image'), async (req, res) => {
    try {
        const access = await resolveAccessContext(req);
        const { plantName, scientificName, language } = req.body;
        if (!req.file || !isSupportedImage(req.file.buffer) || !plantName) {
            return res.status(400).json({ error: 'A valid image and plant name are required.' });
        }

        const langCode = language || req.query.lang || 'en';
        const langMap = {
            'en': 'English',
            'es': 'Spanish',
            'fr': 'French',
            'de': 'German',
            'el': 'Greek',
            'ru': 'Russian',
            'ar': 'Arabic'
        };
        const targetLang = langMap[langCode.toLowerCase()] || 'English';

        let freeUsage = null;
        if (access.tier === 'free') {
            freeUsage = await consumeDailyUsage(access.subjectKey, access.tier, FREE_DAILY_LIMIT);
            if (!freeUsage.allowed) {
                return res.status(429).json({
                    error: 'Daily free analysis limit reached. Upgrade to Basic for unlimited analysis.',
                    code: 'FREE_LIMIT_REACHED',
                    tier: 'free',
                    limit: FREE_DAILY_LIMIT,
                    used: freeUsage.used,
                    remaining: 0,
                });
            }
        }

        const imageBase64 = req.file.buffer.toString('base64');
        const prompt = access.tier === 'green_thumb'
            ? `
Analyze the health of the following plant in the image. Plant name: "${plantName}"${scientificName ? `, Scientific name: "${scientificName}"` : ""}.
Return an expanded expert report for Green Thumb members as JSON only:
{
    "healthStatus": "",
    "diseaseAnalysis": "",
    "expandedHealthDiagnosis": "",
    "riskFactors": ["", "", ""],
    "careRecommendations": ["", "", "", "", ""],
    "benefits": "",
    "sevenDayChecklist": {
        "Day 1-2": "",
        "Day 3-4": "",
        "Day 5-6": "",
        "Day 7": ""
    }
}
You MUST write all textual output values in the ${targetLang} language (e.g. healthStatus, diseaseAnalysis, careRecommendations, benefits, expandedHealthDiagnosis, sevenDayChecklist, etc.).
Use null if unsure. Only return JSON.`
            : `
Analyze the health of the following plant in the image. Plant name: "${plantName}"${scientificName ? `, Scientific name: "${scientificName}"` : ""}. 
Respond as JSON:
{
    "healthStatus": "",
    "diseaseAnalysis": "",
    "careRecommendations": ["", "", ""],
    "sevenDayChecklist": {
        "Day 1-2": "",
        "Day 3-4": "",
        "Day 5-6": "",
        "Day 7": ""
    }
}
You MUST write all textual output values in the ${targetLang} language (e.g. healthStatus, diseaseAnalysis, careRecommendations, sevenDayChecklist, etc.).
Use null if unsure. Only return JSON.`;

        const messages = [
            {
                role: "system",
                content: "You are a plant disease expert. Only return JSON as instructed."
            },
            {
                role: "user",
                content: [
                    { type: "text", text: prompt },
                    { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
                ]
            }
        ];

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages,
            max_tokens: 800,
            response_format: { type: "json_object" },
            temperature: 0
        });

        let result;
        try {
            result = JSON.parse(completion.choices[0].message.content);
            result = validateAnalysisResult(result, access.tier);
        } catch (e) {
            logEvent('Invalid or unsafe result returned for plant-analyze');
            return res.status(502).json({ error: 'Plant analysis could not be completed.' });
        }
        if (access.tier !== 'green_thumb') {
            delete result.expandedHealthDiagnosis;
            delete result.riskFactors;
            delete result.benefits;
            if (Array.isArray(result.careRecommendations)) {
                result.careRecommendations = result.careRecommendations.slice(0, 3);
            }
        }

        let used = null;
        let remaining = null;
        if (access.tier === 'free') {
            used = freeUsage.used;
            remaining = Math.max(0, FREE_DAILY_LIMIT - used);
        }

        res.json({
            ...result,
            tier: access.tier,
            freeDailyLimit: access.tier === 'free' ? FREE_DAILY_LIMIT : null,
            usedToday: used,
            remainingToday: remaining,
        });
    } catch (err) {
        logEvent('Plant analysis failed', { errorType: err.name });
        res.status(500).json({ error: 'Plant analysis failed.' });
    }
});

// Newsletter Signup Endpoint
app.post('/api/newsletter-signup', newsletterLimiter, async (req, res) => {
    const emailRaw = String((req.body && req.body.email) || '').trim().toLowerCase();
    const languageRaw = String((req.body && req.body.language) || '').trim();
    const language = SUPPORTED_NEWSLETTER_LANGUAGES.has(languageRaw) ? languageRaw : 'English';

    const plantName = (req.body && req.body.plantName) ? String(req.body.plantName).trim() : null;
    const diseaseAnalysis = (req.body && req.body.diseaseAnalysis) ? String(req.body.diseaseAnalysis).trim() : null;
    const careRecommendations = (req.body && req.body.careRecommendations) ? JSON.stringify(req.body.careRecommendations) : null;
    const sevenDayChecklist = (req.body && req.body.sevenDayChecklist) ? JSON.stringify(req.body.sevenDayChecklist) : null;

    if (!emailRaw || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailRaw)) {
        return res.status(400).json({ error: 'Invalid email address.' });
    }
    try {
        let shouldSendWelcome = false;
        await withDb(async (connection) => {
            const [rows] = await connection.execute(
                `SELECT id, active
                 FROM newsletter_subscribers
                 WHERE email = ?
                 ORDER BY id DESC
                 LIMIT 1`,
                [emailRaw]
            );

            if (rows && rows.length > 0) {
                const existing = rows[0];
                shouldSendWelcome = Number(existing.active) !== 1;
                await connection.execute(
                    `UPDATE newsletter_subscribers
                     SET language = ?,
                         subscribed_at = NOW(),
                         welcome_sent_at = CASE WHEN active = 0 THEN NULL ELSE welcome_sent_at END,
                         followup_1_sent_at = CASE WHEN active = 0 THEN NULL ELSE followup_1_sent_at END,
                         followup_2_sent_at = CASE WHEN active = 0 THEN NULL ELSE followup_2_sent_at END,
                         active = 1,
                         last_plant_name = ?,
                         last_disease_analysis = ?,
                         last_care_recommendations = ?,
                         last_seven_day_checklist = ?
                     WHERE id = ?`,
                    [language, plantName, diseaseAnalysis, careRecommendations, sevenDayChecklist, existing.id]
                );
            } else {
                shouldSendWelcome = true;
                await connection.execute(
                    `INSERT INTO newsletter_subscribers (email, language, active, subscribed_at, last_plant_name, last_disease_analysis, last_care_recommendations, last_seven_day_checklist)
                     VALUES (?, ?, 1, NOW(), ?, ?, ?, ?)`,
                    [emailRaw, language, plantName, diseaseAnalysis, careRecommendations, sevenDayChecklist]
                );
            }
            if (shouldSendWelcome) {
                const { execFile } = require('child_process');
                execFile('php', ['/home/sergbcqk/gardenwithserge.com/send_welcome_now.php'], { cwd: '/home/sergbcqk/gardenwithserge.com', timeout: 30000 }, (err) => {
                if (err) {
                        logEvent('Welcome email process failed', { errorType: err.name });
                    }
                });
                }

            return res.json({ message: 'Subscription request accepted.', welcomeScheduled: shouldSendWelcome });
        });
    } catch (err) {
        logEvent('Newsletter signup failed', { errorType: err.name });
        return res.status(500).json({ error: 'Server error.' });
    }
});

// (Optional) Test DB connection endpoint for debugging
/*
app.get('/api/db-test', async (req, res) => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    await connection.ping();
    await connection.end();
    res.send('Database connection OK!');
  } catch (err) {
    res.status(500).send('DB ERROR: ' + err.message);
  }
});
*/

// Catch-all route for SPA (must be last)
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: 'Invalid or oversized upload.' });
    }
    if (err && err.message === 'Origin not allowed') {
        return res.status(403).json({ error: 'Origin not allowed' });
    }
    logEvent('Unhandled request error', { errorType: err && err.name ? err.name : 'Error' });
    return res.status(500).json({ error: 'Request failed.' });
});

app.use('/api', (req, res) => {
    return res.status(404).json({ error: 'API route not found.', requestId: req.requestId });
});

app.use((req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        return res.status(404).type('text').send('Not found.');
    }
    return res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

ensureAppSchema()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        logEvent('Failed to initialize schema', { errorType: err.name });
        process.exit(1);
    });
