const test = require('node:test');
const assert = require('node:assert/strict');
const { validateAnalysisResult } = require('../lib/analysis-contract');

const valid = {
    healthStatus: 'Possible water stress',
    diseaseAnalysis: 'The visible signs are not conclusive from this image.',
    careRecommendations: ['Check soil moisture before changing treatment.'],
    sevenDayChecklist: { 'Day 1-2': 'Observe and photograph changes.' },
    uncertainty: 'Roots and leaf undersides are not visible.',
    needsLocalExpert: true,
};

test('accepts a bounded analysis and adds a safety notice', () => {
    const result = validateAnalysisResult(valid, 'free');
    assert.equal(result.needsLocalExpert, true);
    assert.match(result.safetyNotice, /pesticide/);
});

test('rejects missing diagnoses and recommendations', () => {
    assert.throws(() => validateAnalysisResult({}, 'free'));
    assert.throws(() => validateAnalysisResult({ ...valid, careRecommendations: [] }, 'free'));
});

test('enforces tier-specific recommendation limits', () => {
    const four = { ...valid, careRecommendations: ['1', '2', '3', '4'] };
    assert.throws(() => validateAnalysisResult(four, 'free'));
    assert.equal(validateAnalysisResult(four, 'green_thumb').careRecommendations.length, 4);
});

test('rejects oversized or control-character content', () => {
    assert.throws(() => validateAnalysisResult({ ...valid, diseaseAnalysis: 'x'.repeat(2001) }, 'free'));
    assert.throws(() => validateAnalysisResult({ ...valid, healthStatus: 'bad\u0000value' }, 'free'));
});
