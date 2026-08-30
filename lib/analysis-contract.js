const MAX_TEXT = 4000;

function safeText(value, { required = false, max = MAX_TEXT } = {}) {
    if (value == null && !required) return null;
    if (typeof value !== 'string') throw new Error('Expected text value.');
    const normalized = value.trim();
    if (required && !normalized) throw new Error('Required text is empty.');
    if (normalized.length > max) throw new Error('Text value is too long.');
    if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(normalized)) throw new Error('Text contains control characters.');
    return normalized;
}

function safeTextArray(value, { min = 0, max = 5 } = {}) {
    if (!Array.isArray(value) || value.length < min || value.length > max) throw new Error('Invalid recommendation list.');
    return value.map((entry) => safeText(entry, { required: true, max: 1000 }));
}

function validateChecklist(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    const allowed = ['Day 1-2', 'Day 3-4', 'Day 5-6', 'Day 7'];
    const result = {};
    for (const key of allowed) {
        if (value[key] != null) result[key] = safeText(value[key], { required: true, max: 1000 });
    }
    return result;
}

function validateAnalysisResult(value, tier = 'free') {
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Analysis result must be an object.');
    const result = {
        healthStatus: safeText(value.healthStatus, { required: true, max: 500 }),
        diseaseAnalysis: safeText(value.diseaseAnalysis, { required: true, max: 2000 }),
        careRecommendations: safeTextArray(value.careRecommendations, { min: 1, max: tier === 'green_thumb' ? 5 : 3 }),
        sevenDayChecklist: validateChecklist(value.sevenDayChecklist),
    };
    if (tier === 'green_thumb') {
        result.expandedHealthDiagnosis = safeText(value.expandedHealthDiagnosis, { max: 3000 });
        result.riskFactors = value.riskFactors == null ? [] : safeTextArray(value.riskFactors, { min: 0, max: 5 });
        result.benefits = safeText(value.benefits, { max: 2000 });
    }
    result.uncertainty = safeText(value.uncertainty, { max: 1000 }) || 'The image alone may not be sufficient for a reliable conclusion.';
    result.needsLocalExpert = Boolean(value.needsLocalExpert);
    result.safetyNotice = 'Do not make pesticide, food-safety, pet-safety, or destructive treatment decisions without authoritative local verification.';
    return result;
}

module.exports = { validateAnalysisResult };
