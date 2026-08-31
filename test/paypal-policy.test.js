'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
    inspectPayPalPlanPayload,
    isAllowedPayPalApprovalUrl,
    isHandledPayPalEventType,
    isPayPalSubscriptionEntitled,
    paypalApiBase,
} = require('../lib/paypal-policy');

const expectedMonthly = { unitAmount: 499, intervalUnit: 'MONTH' };

function plan(overrides = {}) {
    return {
        status: 'ACTIVE',
        billing_cycles: [{
            tenure_type: 'REGULAR',
            frequency: { interval_unit: 'MONTH', interval_count: 1 },
            pricing_scheme: { fixed_price: { currency_code: 'USD', value: '4.99' } },
        }],
        ...overrides,
    };
}

test('PayPal environment selects only official API hosts', () => {
    assert.equal(paypalApiBase('live'), 'https://api-m.paypal.com');
    assert.equal(paypalApiBase('sandbox'), 'https://api-m.sandbox.paypal.com');
    assert.equal(paypalApiBase('unexpected'), 'https://api-m.paypal.com');
});

test('PayPal approval URLs fail closed by environment and exact hostname', () => {
    assert.equal(isAllowedPayPalApprovalUrl('https://www.paypal.com/checkoutnow?token=x', 'live'), true);
    assert.equal(isAllowedPayPalApprovalUrl('https://www.sandbox.paypal.com/checkoutnow?token=x', 'sandbox'), true);
    assert.equal(isAllowedPayPalApprovalUrl('https://www.paypal.com.evil.example/checkout', 'live'), false);
    assert.equal(isAllowedPayPalApprovalUrl('http://www.paypal.com/checkout', 'live'), false);
    assert.equal(isAllowedPayPalApprovalUrl('https://www.paypal.com/checkout', 'sandbox'), false);
});

test('PayPal plans must be active and exactly match price, currency, and interval', () => {
    assert.equal(inspectPayPalPlanPayload(plan(), expectedMonthly).valid, true);
    assert.equal(inspectPayPalPlanPayload(plan({ status: 'INACTIVE' }), expectedMonthly).valid, false);
    assert.equal(inspectPayPalPlanPayload(plan({
        billing_cycles: [{
            tenure_type: 'REGULAR',
            frequency: { interval_unit: 'YEAR', interval_count: 1 },
            pricing_scheme: { fixed_price: { currency_code: 'USD', value: '4.99' } },
        }],
    }), expectedMonthly).valid, false);
    assert.equal(inspectPayPalPlanPayload(plan({
        billing_cycles: [{
            tenure_type: 'REGULAR',
            frequency: { interval_unit: 'MONTH', interval_count: 1 },
            pricing_scheme: { fixed_price: { currency_code: 'USD', value: '5.00' } },
        }],
    }), expectedMonthly).valid, false);
});

test('only active PayPal subscriptions grant access and lifecycle events are bounded', () => {
    assert.equal(isPayPalSubscriptionEntitled('ACTIVE'), true);
    assert.equal(isPayPalSubscriptionEntitled('SUSPENDED'), false);
    assert.equal(isHandledPayPalEventType('BILLING.SUBSCRIPTION.ACTIVATED'), true);
    assert.equal(isHandledPayPalEventType('PAYMENT.SALE.COMPLETED'), false);
});
