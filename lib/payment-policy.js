'use strict';

const STRIPE_HANDLED_EVENT_TYPES = new Set([
    'checkout.session.completed',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted',
]);

function isHandledStripeEventType(type) {
    return STRIPE_HANDLED_EVENT_TYPES.has(String(type || ''));
}

function isStripeSubscriptionEntitled(status) {
    return status === 'active' || status === 'trialing';
}

function isStripeCheckoutSessionEntitled(session) {
    if (!session || session.status !== 'complete') return false;
    if (!['paid', 'no_payment_required'].includes(session.payment_status)) return false;
    return session.mode === 'subscription' && Boolean(session.subscription);
}

module.exports = {
    isHandledStripeEventType,
    isStripeCheckoutSessionEntitled,
    isStripeSubscriptionEntitled,
};
