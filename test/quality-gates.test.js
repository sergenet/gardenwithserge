'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const publicDir = path.join(__dirname, '..', 'public');

test('homepage uses responsive modern hero images and minified scripts', () => {
    const html = fs.readFileSync(path.join(publicDir, 'index.html'), 'utf8');
    assert.match(html, /hero-garden-pathway-480\.webp 480w/);
    assert.match(html, /hero-garden-pathway-960\.webp 960w/);
    assert.match(html, /translations\.min\.js\?v=9/);
    assert.match(html, /app\.min\.js\?v=8/);
    assert.ok(fs.statSync(path.join(publicDir, 'hero-garden-pathway-480.webp')).size < 60_000);
    assert.ok(fs.statSync(path.join(publicDir, 'hero-garden-pathway-960.webp')).size < 160_000);
});

test('primary plant doctor page has a main landmark and non-blocking script placement', () => {
    const html = fs.readFileSync(path.join(publicDir, 'plant-doctor.html'), 'utf8');
    assert.match(html, /<main class="container">[\s\S]*<\/main>/);
    assert.match(html, /<\/main>\s*<script src="translations\.min\.js\?v=9"><\/script>/);
    assert.doesNotMatch(html, /<head>[\s\S]*translations\.min\.js[\s\S]*<\/head>/);
});

test('static cache policy distinguishes immutable and mutable assets', () => {
    const htaccess = fs.readFileSync(path.join(publicDir, '.htaccess'), 'utf8');
    assert.match(htaccess, /max-age=31536000, immutable/);
    assert.match(htaccess, /max-age=2592000, stale-while-revalidate=86400/);
});
