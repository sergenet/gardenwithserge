import { readFile } from 'node:fs/promises';

const primary = 'https://www.gardenwithserge.com';
const api = 'https://api.gardenwithserge.com';
const bare = 'https://gardenwithserge.com';

function requireCondition(condition, message) {
    if (!condition) throw new Error(message);
}

async function get(path, base = primary) {
    const response = await fetch(`${base}${path}`, {
        redirect: 'follow',
        signal: AbortSignal.timeout(20_000),
        headers: { 'user-agent': 'GardenWithSergeProductionCheck/1.0' },
    });
    const body = await response.text();
    requireCondition(response.ok, `${base}${path} returned ${response.status}`);
    return { body, headers: response.headers, status: response.status };
}

const checks = [];

const dynamicProbePath = `/__canonical-host-probe-${Date.now()}`;
const dynamicProbe = await fetch(`${bare}${dynamicProbePath}`, { redirect: 'manual', signal: AbortSignal.timeout(20_000) });
requireCondition(dynamicProbe.status === 301, `${bare}${dynamicProbePath} must return 301`);
requireCondition(dynamicProbe.headers.get('location') === `${primary}${dynamicProbePath}`, `${bare}${dynamicProbePath} redirect target mismatch`);

const barePlantDoctor = await fetch(`${bare}/plant-doctor.html`, { redirect: 'manual', signal: AbortSignal.timeout(20_000) });
if (barePlantDoctor.status === 200) {
    const html = await barePlantDoctor.text();
    requireCondition(html.includes('<link rel="canonical" href="https://www.gardenwithserge.com/plant-doctor.html">'), 'Bare Plant Doctor canonical mismatch');
} else {
    requireCondition(barePlantDoctor.status === 301 && barePlantDoctor.headers.get('location') === `${primary}/plant-doctor.html`, 'Bare Plant Doctor redirect mismatch');
}

const bareSitemap = await fetch(`${bare}/sitemap.xml`, { redirect: 'manual', signal: AbortSignal.timeout(20_000) });
if (bareSitemap.status === 200) {
    const xml = await bareSitemap.text();
    const bareSitemapUrls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    requireCondition(bareSitemapUrls.length > 0 && bareSitemapUrls.every((url) => url.startsWith(`${primary}/`)), 'Bare sitemap contains non-canonical URLs');
} else {
    requireCondition(bareSitemap.status === 301 && bareSitemap.headers.get('location') === `${primary}/sitemap.xml`, 'Bare sitemap redirect mismatch');
}
checks.push('bare-domain-redirect-and-static-canonicals');
const localHomepage = await readFile(new URL('../public/index.html', import.meta.url), 'utf8');
const expectedAppScript = localHomepage.match(/app\.min\.js\?v=\d+/)?.[0];
requireCondition(expectedAppScript, 'Local homepage does not reference a versioned application script');
for (const base of [primary, api]) {
    for (const path of ['/healthz', '/readyz']) {
        const result = await get(path, base);
        requireCondition(JSON.parse(result.body).ok === true, `${base}${path} did not report ok`);
        checks.push(`${base}${path}`);
    }
}

const commerce = JSON.parse((await get('/api/commerce/config')).body);
requireCondition(commerce.enabled === true && commerce.stripe === true && commerce.paypal === true, 'Live Stripe and PayPal commerce are not both ready');
checks.push('stripe-and-paypal-commerce-enabled');

const homepage = await get('/');
requireCondition(homepage.body.includes('<link rel="canonical" href="https://www.gardenwithserge.com/">'), 'Homepage canonical is missing');
requireCondition(homepage.body.includes('hero-garden-pathway-960.avif'), 'Optimized hero source is missing');
requireCondition(homepage.body.includes(expectedAppScript), `Current minified application script is missing: ${expectedAppScript}`);
requireCondition(!/amazon\.|amzn\.|tag=sergenet05-20/i.test(homepage.body), 'Closed Amazon affiliate link detected');
requireCondition(homepage.headers.get('strict-transport-security')?.includes('max-age=31536000'), 'HSTS is missing');
requireCondition(homepage.headers.get('x-content-type-options') === 'nosniff', 'nosniff header is missing');
requireCondition(homepage.headers.get('content-security-policy')?.includes('https://api.gardenwithserge.com'), 'Plant Doctor API is blocked by CSP');
checks.push('homepage-content-and-headers');

const sitemap = await get('/sitemap.xml');
const urls = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
requireCondition(urls.length >= 7, 'Sitemap is unexpectedly small');
for (const url of urls) {
    const response = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(20_000) });
    requireCondition(response.ok, `${url} returned ${response.status}`);
    const html = await response.text();
    requireCondition(html.includes(`<link rel="canonical" href="${url}">`), `${url} canonical mismatch`);
}
checks.push(`sitemap-${urls.length}-urls`);

console.log(JSON.stringify({ ok: true, checkedAt: new Date().toISOString(), checks }, null, 2));
