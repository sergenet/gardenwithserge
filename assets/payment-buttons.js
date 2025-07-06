// Injects Stripe and PayPal buttons into .plan-buttons divs.
// Now waits for window.onload to ensure all scripts/rendering are complete before injecting buttons.
// This prevents the issue where new buttons disappear due to other scripts re-rendering the DOM.

function injectPaymentButtons(root = document) {
  root.querySelectorAll('.plan-buttons').forEach(function (el) {
    // Remove any legacy/hardcoded buttons from previous renders
    el.querySelectorAll('.stripe-btn').forEach(btn => btn.remove());
    el.querySelectorAll('[id^="paypal-button-container-"]').forEach(div => div.remove());

    // Prevent double-injection (should be redundant now, but kept for safety)
    if (el.querySelector('.stripe-btn, [id^="paypal-button-container-"]')) return;

    // Stripe Button
    const stripeUrl = el.dataset.stripe;
    if (stripeUrl) {
      const stripeBtn = document.createElement('button');
      stripeBtn.className = 'stripe-btn';
      stripeBtn.innerText = 'Pay with Stripe';
      stripeBtn.onclick = function () {
        window.location.href = stripeUrl;
      };
      el.appendChild(stripeBtn);
    }

    // PayPal Button
    const planId = el.dataset.paypal;
    if (planId && window.paypal) {
      const paypalDiv = document.createElement('div');
      paypalDiv.id = `paypal-button-container-${planId}`;
      el.appendChild(paypalDiv);

      window.paypal.Buttons({
        style: { shape: 'rect', color: 'gold', layout: 'vertical', label: 'subscribe' },
        createSubscription: function (data, actions) {
          return actions.subscription.create({ plan_id: planId });
        },
        onApprove: function (data, actions) {
          alert('Thank you for subscribing! PayPal Subscription ID: ' + data.subscriptionID);
        }
      }).render(`#paypal-button-container-${planId}`);
    }
  });
}

// Wait for all scripts and assets to be loaded
window.addEventListener('load', function () {
  injectPaymentButtons();

  // Observe DOM changes to re-inject payment buttons if needed (e.g., if any scripts modify the DOM after initial load)
  const observer = new MutationObserver(function (mutationsList) {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList' || mutation.type === 'subtree') {
        injectPaymentButtons();
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
});

// Also re-inject when PayPal script loads (in case window.paypal is not ready at window.onload)
if (!window.paypal) {
  const orig = window.onload;
  window.onload = function () {
    injectPaymentButtons();
    if (typeof orig === "function") orig();
  }
}