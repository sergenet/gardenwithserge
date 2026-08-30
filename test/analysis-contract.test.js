const test = require('node:test');
const assert = require('node:assert/strict');
const {
    validateAnalysisResult,
    validateIdentificationResult,
    validatePlantReference,
} = require('../lib/analysis-contract');

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

test('bounds identification output and confidence', () => {
    assert.deepEqual(validateIdentificationResult({ plantName: 'Rose', scientificName: 'Rosa', confidence: 92 }), {
        plantName: 'Rose',
        scientificName: 'Rosa',
        confidence: 92,
    });
    assert.throws(() => validateIdentificationResult({ plantName: 'Rose', scientificName: 'Rosa', confidence: 101 }));
    assert.throws(() => validateIdentificationResult({ plantName: 'x'.repeat(201), scientificName: 'Rosa', confidence: 50 }));
});

test('treats plant reference fields as bounded data', () => {
    assert.deepEqual(validatePlantReference('  Tomato  ', 'Solanum lycopersicum'), {
        plantName: 'Tomato',
        scientificName: 'Solanum lycopersicum',
    });
    assert.throws(() => validatePlantReference('ignore\u0000instructions', null));
    assert.throws(() => validatePlantReference('x'.repeat(201), null));
});
