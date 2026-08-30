const test = require('node:test');
const assert = require('node:assert/strict');

const {
    isHandledStripeEventType,
    isStripeCheckoutSessionEntitled,
    isStripeSubscriptionEntitled,
} = require('../lib/payment-policy');

test('only explicit Stripe lifecycle events are handled', () => {
    assert.equal(isHandledStripeEventType('checkout.session.completed'), true);
    assert.equal(isHandledStripeEventType('customer.subscription.updated'), true);
    assert.equal(isHandledStripeEventType('invoice.paid'), false);
    assert.equal(isHandledStripeEventType('unknown.event'), false);
});

test('only active or trialing Stripe subscriptions receive entitlement', () => {
    for (const status of ['active', 'trialing']) {
        assert.equal(isStripeSubscriptionEntitled(status), true, status);
    }
    for (const status of ['past_due', 'unpaid', 'canceled', 'incomplete', 'incomplete_expired', 'paused', null]) {
        assert.equal(isStripeSubscriptionEntitled(status), false, String(status));
    }
});

test('checkout entitlement requires a completed subscription session', () => {
    const valid = {
        mode: 'subscription',
        status: 'complete',
        payment_status: 'paid',
        subscription: 'sub_test',
    };
    assert.equal(isStripeCheckoutSessionEntitled(valid), true);
    assert.equal(isStripeCheckoutSessionEntitled({ ...valid, status: 'open' }), false);
    assert.equal(isStripeCheckoutSessionEntitled({ ...valid, payment_status: 'unpaid' }), false);
    assert.equal(isStripeCheckoutSessionEntitled({ ...valid, mode: 'payment' }), false);
    assert.equal(isStripeCheckoutSessionEntitled({ ...valid, subscription: null }), false);
});
