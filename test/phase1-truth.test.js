const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const publicDir = path.join(__dirname, '..', 'public');
const appSource = fs.readFileSync(path.join(publicDir, 'app.js'), 'utf8');
const indexSource = fs.readFileSync(path.join(publicDir, 'index.html'), 'utf8');
const translationsSource = fs.readFileSync(path.join(publicDir, 'translations.js'), 'utf8');

test('analysis failure cannot render a synthetic result', () => {
    assert.doesNotMatch(appSource, /showAnalysisResults\(null\)/);
    assert.doesNotMatch(appSource, /randomHealth|randomRecs|Math\.random\(\).*confidence/s);
    assert.match(appSource, /function showAnalysisError\(/);
    assert.match(appSource, /No diagnosis or treatment recommendation was produced/);
});

test('result rendering requires a minimally valid backend response', () => {
    assert.match(appSource, /typeof data\.healthStatus !== 'string'/);
    assert.match(appSource, /!Array\.isArray\(data\.careRecommendations\)/);
    assert.match(appSource, /typeof analysisData\.healthStatus !== 'string'/);
});

test('initial homepage contains no fabricated diagnosis or unsupported metrics', () => {
    const combined = `${indexSource}\n${translationsSource}`;
    for (const prohibited of [
        /98%/i,
        /1000\+/i,
        /15,000\+/i,
        /Your plant appears to be in excellent health!/i,
        /Rose \(Rosa\)/i,
        /Community forum access/i,
        /Member discounts/i,
        /AI garden planning & insights/i,
        /Location-specific calendars/i,
    ]) {
        assert.doesNotMatch(combined, prohibited);
    }
});

test('homepage gives a clear AI limitation notice', () => {
    assert.match(indexSource, /AI-generated results are not guaranteed to be accurate/);
    assert.match(indexSource, /not a substitute for an in-person assessment/);
});
