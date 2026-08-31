'use strict';

const PAYPAL_HANDLED_EVENT_TYPES = new Set([
    'BILLING.SUBSCRIPTION.ACTIVATED',
    'BILLING.SUBSCRIPTION.UPDATED',
    'BILLING.SUBSCRIPTION.SUSPENDED',
    'BILLING.SUBSCRIPTION.CANCELLED',
    'BILLING.SUBSCRIPTION.EXPIRED',
    'BILLING.SUBSCRIPTION.PAYMENT.FAILED',
    'BILLING.SUBSCRIPTION.RE-ACTIVATED',
]);

function isHandledPayPalEventType(type) {
    return PAYPAL_HANDLED_EVENT_TYPES.has(String(type || ''));
}

function isPayPalSubscriptionEntitled(status) {
    return String(status || '').toUpperCase() === 'ACTIVE';
}

function paypalApiBase(environment) {
    return String(environment || '').toLowerCase() === 'sandbox'
        ? 'https://api-m.sandbox.paypal.com'
        : 'https://api-m.paypal.com';
}

function isAllowedPayPalApprovalUrl(value, environment) {
    try {
        const url = new URL(String(value || ''));
        const allowedHost = String(environment || '').toLowerCase() === 'sandbox'
            ? 'www.sandbox.paypal.com'
            : 'www.paypal.com';
        return url.protocol === 'https:' && url.hostname === allowedHost;
    } catch {
        return false;
    }
}

function inspectPayPalPlanPayload(plan, expected) {
    const cycles = plan && Array.isArray(plan.billing_cycles) ? plan.billing_cycles : [];
    const regular = cycles.find((cycle) => cycle && cycle.tenure_type === 'REGULAR');
    const price = regular && regular.pricing_scheme ? regular.pricing_scheme.fixed_price : null;
    const frequency = regular ? regular.frequency : null;
    const amount = price ? Number(price.value) : NaN;
    const valid = Boolean(
        plan && plan.status === 'ACTIVE'
        && regular && price && frequency
        && price.currency_code === 'USD'
        && Number.isFinite(amount) && Math.round(amount * 100) === expected.unitAmount
        && frequency.interval_unit === expected.intervalUnit
        && Number(frequency.interval_count) === 1
    );
    return {
        configured: true,
        valid,
        active: Boolean(plan && plan.status === 'ACTIVE'),
        currency: price ? price.currency_code || null : null,
        unitAmount: Number.isFinite(amount) ? Math.round(amount * 100) : null,
        interval: frequency ? frequency.interval_unit || null : null,
    };
}

module.exports = {
    inspectPayPalPlanPayload,
    isAllowedPayPalApprovalUrl,
    isHandledPayPalEventType,
    isPayPalSubscriptionEntitled,
    paypalApiBase,
};
