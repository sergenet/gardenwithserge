'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { classifyAiError } = require('../lib/ai-error-policy');

test('classifies AI provider failures without exposing provider messages', () => {
    assert.equal(classifyAiError({ status: 401 }), 'AI_AUTHENTICATION_FAILED');
    assert.equal(classifyAiError({ status: 429 }), 'AI_RATE_LIMITED');
    assert.equal(classifyAiError({ status: 503 }), 'AI_UPSTREAM_UNAVAILABLE');
    assert.equal(classifyAiError({ code: 'ETIMEDOUT' }), 'AI_UPSTREAM_UNAVAILABLE');
    assert.equal(classifyAiError(new Error('private provider detail')), 'AI_UPSTREAM_FAILED');
});
