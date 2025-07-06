document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.plan-buttons').forEach(function(el) {
    // Stripe Button
    const stripeUrl = el.dataset.stripe;
    if (stripeUrl) {
      const stripeBtn = document.createElement('button');
      stripeBtn.className = 'stripe-btn';
      stripeBtn.innerText = 'Pay with Stripe';
      stripeBtn.onclick = function() {
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
        createSubscription: function(data, actions) {
          return actions.subscription.create({ plan_id: planId });
        },
        onApprove: function(data, actions) {
          alert('Thank you for subscribing! PayPal Subscription ID: ' + data.subscriptionID);
        }
      }).render(`#paypal-button-container-${planId}`);
    }
  });
});