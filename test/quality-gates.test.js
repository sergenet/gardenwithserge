'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const publicDir = path.join(__dirname, '..', 'public');

test('homepage uses responsive modern hero images and minified scripts', () => {
    const html = fs.readFileSync(path.join(publicDir, 'index.html'), 'utf8');
    assert.match(html, /hero-garden-pathway-480\.avif 480w/);
    assert.match(html, /hero-garden-pathway-960\.avif 960w/);
    assert.match(html, /hero-garden-pathway-1200\.avif 1200w/);
    assert.match(html, /hero-garden-pathway-480\.webp 480w/);
    assert.match(html, /hero-garden-pathway-960\.webp 960w/);
    assert.match(html, /translations\.min\.js\?v=10/);
    assert.match(html, /app\.min\.js\?v=18/);
    assert.ok(fs.statSync(path.join(publicDir, 'hero-garden-pathway-480.webp')).size < 60_000);
    assert.ok(fs.statSync(path.join(publicDir, 'hero-garden-pathway-960.webp')).size < 160_000);
    assert.ok(fs.statSync(path.join(publicDir, 'hero-garden-pathway-960.avif')).size < 80_000);
});

test('primary plant doctor page has a main landmark and non-blocking script placement', () => {
    const html = fs.readFileSync(path.join(publicDir, 'plant-doctor.html'), 'utf8');
    assert.match(html, /<main class="container">[\s\S]*<\/main>/);
    assert.match(html, /<\/main>\s*<script src="translations\.min\.js\?v=10"><\/script>/);
    assert.doesNotMatch(html, /<head>[\s\S]*translations\.min\.js[\s\S]*<\/head>/);
});

test('Plant Doctor guards optional membership-benefit elements', () => {
    const app = fs.readFileSync(path.join(publicDir, 'app.js'), 'utf8');
    assert.doesNotMatch(app, /getElementById\('plant-benefits-(?:section|content)'\)\.(?:style|innerText)/);
});

test('language changes refresh the dynamic daily analysis counter', () => {
    const source = fs.readFileSync(path.join(publicDir, 'app.js'), 'utf8');
    const updateTranslations = source.slice(
        source.indexOf('function updateTranslations(lang)'),
        source.indexOf('// Language switching handler')
    );
    assert.match(updateTranslations, /updateAnalysisCounter\(\)/);
});

test('paid diagnosis message is rendered inside the visible identification step', () => {
    const html = fs.readFileSync(path.join(publicDir, 'index.html'), 'utf8');
    const app = fs.readFileSync(path.join(publicDir, 'app.js'), 'utf8');
    assert.match(html, /<div id="identification-step"[\s\S]*id="diagnosis-access-message"[\s\S]*<\/div>\s*<!-- Analysis Results -->/);
    assert.match(app, /getElementById\('diagnosis-access-message'\)/);
});

test('static cache policy distinguishes immutable and mutable assets', () => {
    const htaccess = fs.readFileSync(path.join(publicDir, '.htaccess'), 'utf8');
    assert.match(htaccess, /max-age=31536000, immutable/);
    assert.match(htaccess, /max-age=2592000, stale-while-revalidate=86400/);
});

test('featured cornerstone guides are static, canonical, and linked without blocked PHP paths', () => {
    const index = fs.readFileSync(path.join(publicDir, 'index.html'), 'utf8');
    const sitemap = fs.readFileSync(path.join(publicDir, 'sitemap.xml'), 'utf8');
    for (const slug of ['plant-disease-guide', 'plant-troubleshooting', 'indoor-plants-guide']) {
        const guide = fs.readFileSync(path.join(publicDir, `${slug}.html`), 'utf8');
        assert.match(index, new RegExp(`/${slug}\\.html`));
        assert.match(sitemap, new RegExp(`/${slug}\\.html`));
        assert.match(guide, new RegExp(`rel="canonical" href="https://www\\.gardenwithserge\\.com/${slug}\\.html"`));
        assert.doesNotMatch(guide, /<\?php|cdn\.tailwindcss\.com/);
    }
    assert.doesNotMatch(index, /(?:plant-disease-guide|plant-troubleshooting|indoor-plants-guide)\.php/);
});

test('plant disease guide has search-focused metadata, truthful access language, and matching Article data', () => {
    const guide = fs.readFileSync(path.join(publicDir, 'plant-disease-guide.html'), 'utf8');
    const translations = fs.readFileSync(path.join(publicDir, 'translations.js'), 'utf8');
    const sitemap = fs.readFileSync(path.join(publicDir, 'sitemap.xml'), 'utf8');

    assert.match(guide, /<title>Plant Disease Identification Guide: Symptoms and Treatment<\/title>/);
    assert.match(guide, /<meta name="description" content="Identify common plant diseases by leaf, stem, root, and pest symptoms\./);
    assert.match(guide, /<meta property="og:url" content="https:\/\/www\.gardenwithserge\.com\/plant-disease-guide\.html">/);
    assert.match(guide, /<meta name="robots" content="index,follow,max-image-preview:large">/);
    assert.doesNotMatch(guide, /<meta name="keywords"/);
    assert.doesNotMatch(guide, /"@type": "FAQPage"/);

    const jsonLdBlocks = [...guide.matchAll(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/g)]
        .map((match) => JSON.parse(match[1]));
    const article = jsonLdBlocks.find((block) => block['@type'] === 'Article');
    assert.ok(article);
    assert.equal(article.headline, 'Plant Disease Identification Guide: Symptoms and Treatment');
    assert.equal(article.mainEntityOfPage, 'https://www.gardenwithserge.com/plant-disease-guide.html');
    assert.equal(article.dateModified, '2026-08-31');
    assert.deepEqual(article.author, { '@type': 'Person', name: 'Serge Shammas' });

    assert.match(guide, /Plant Doctor disease analysis is available with a paid membership/);
    assert.match(guide, /Free visitors can identify up to three plants per day/);
    assert.match(guide, /link\.href = url\.pathname \+ url\.search \+ url\.hash/);
    assert.doesNotMatch(guide, /free AI Plant Doctor|Try Plant Doctor Now \(Free\)|Diagnose Now \(Free\)|instant, accurate diagnosis/i);
    assert.match(translations, /"pdg-unsure-desc": "Plant Doctor disease analysis is available with a paid membership/);
    assert.match(sitemap, /plant-disease-guide\.html<\/loc><lastmod>2026-08-31<\/lastmod>/);
});
