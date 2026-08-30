'use strict';

function classifyAiError(error) {
    const status = Number(error && error.status);
    const code = String((error && error.code) || '').toUpperCase();
    if (status === 401 || status === 403 || code === 'INVALID_API_KEY') return 'AI_AUTHENTICATION_FAILED';
    if (status === 429 || code === 'RATE_LIMIT_EXCEEDED') return 'AI_RATE_LIMITED';
    if (['ETIMEDOUT', 'ECONNRESET', 'ECONNREFUSED'].includes(code)) return 'AI_UPSTREAM_UNAVAILABLE';
    if (status >= 500) return 'AI_UPSTREAM_UNAVAILABLE';
    return 'AI_UPSTREAM_FAILED';
}

module.exports = { classifyAiError };
