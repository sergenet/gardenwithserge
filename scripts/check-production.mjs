const primary = 'https://www.gardenwithserge.com';
const api = 'https://api.gardenwithserge.com';

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
for (const base of [primary, api]) {
    for (const path of ['/healthz', '/readyz']) {
        const result = await get(path, base);
        requireCondition(JSON.parse(result.body).ok === true, `${base}${path} did not report ok`);
        checks.push(`${base}${path}`);
    }
}

const commerce = JSON.parse((await get('/api/commerce/config')).body);
requireCondition(commerce.enabled === false && commerce.stripe === false && commerce.paypal === false, 'Commerce is not safely disabled');
checks.push('commerce-disabled');

const homepage = await get('/');
requireCondition(homepage.body.includes('<link rel="canonical" href="https://www.gardenwithserge.com/">'), 'Homepage canonical is missing');
requireCondition(homepage.body.includes('hero-garden-pathway-960.avif'), 'Optimized hero source is missing');
requireCondition(homepage.body.includes('app.min.js?v=12'), 'Current minified application script is missing');
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
