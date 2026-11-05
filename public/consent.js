// Consent gate for Garden with Serge.
//
// Mirrors the behaviour TimerHaven uses: Google AdSense and GA4 load only after
// a visitor presses Accept, the decision is remembered in localStorage, and
// nothing third-party is requested for Decline or for no answer at all.
//
// Public API:
//   window.gardenConsentGiven()              -> true only after Accept
//   window.gardenLoadAfterConsent(fn)        -> run fn now if granted, else queue
//   window.gardenRevokeConsent()             -> forget the choice, ask again
//   window.gardenFillAdUnits()               -> fill any <ins class="adsbygoogle">
(function () {
  'use strict';

  var STORAGE_KEY = 'gardenConsent';
  var AD_CLIENT = 'ca-pub-0467059729557007';
  var GA_ID = 'G-52BQHQ8HL1';
  var LOADED_FLAG = '__garden_third_party_loaded';
  var QUEUE = [];
  var banner = null;

  function getStored() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function isGranted() { return getStored() === 'granted'; }

  function setStored(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) {}
    try {
      document.dispatchEvent(new CustomEvent('gardenConsentChanged', {
        detail: { consent: value === 'granted' }
      }));
    } catch (e) {}
  }

  function gardenConsentGiven() { return isGranted(); }

  function gardenLoadAfterConsent(callback) {
    if (typeof callback !== 'function') return;
    if (isGranted()) {
      try { callback(); } catch (e) { console.warn('consent callback error', e); }
    } else {
      QUEUE.push(callback);
    }
  }

  function runQueue() {
    while (QUEUE.length) {
      var callback = QUEUE.shift();
      try { callback(); } catch (e) { console.warn('consent callback error', e); }
    }
  }

  // Ad units are plain markup with no inline push(): a push made before the
  // library exists is silently dropped. Filling them only after the loader has
  // run means an ad request cannot happen before consent.
  function fillAdUnits() {
    try {
      var units = document.querySelectorAll('ins.adsbygoogle');
      if (!units.length) return;
      window.adsbygoogle = window.adsbygoogle || [];
      for (var i = 0; i < units.length; i++) {
        if (units[i].getAttribute('data-ad-filled')) continue;
        units[i].setAttribute('data-ad-filled', '1');
        window.adsbygoogle.push({});
      }
    } catch (e) { console.warn('fillAdUnits error', e); }
  }

  function loadAdsAndAnalytics() {
    try {
      if (window[LOADED_FLAG]) { fillAdUnits(); return; }
      window[LOADED_FLAG] = true;

      if (!document.querySelector('script[src*="pagead2.googlesyndication.com"]')) {
        var ads = document.createElement('script');
        ads.async = true;
        ads.crossOrigin = 'anonymous';
        ads.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + AD_CLIENT;
        ads.onload = fillAdUnits;
        ads.onerror = function () { console.warn('AdSense loader failed to load'); };
        document.head.appendChild(ads);
      } else {
        fillAdUnits();
      }

      if (!document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
        var tag = document.createElement('script');
        tag.async = true;
        tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
        document.head.appendChild(tag);
      }

      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', GA_ID);

      // Unit markup can still be parsing when the loader finishes, so retry on load.
      if (document.readyState !== 'complete') {
        window.addEventListener('load', fillAdUnits);
      }
    } catch (e) { console.warn('loadAdsAndAnalytics error', e); }
  }

  function acceptConsent() {
    setStored('granted');
    hideBanner();
    runQueue();
    loadAdsAndAnalytics();
  }

  function declineConsent() {
    setStored('denied');
    hideBanner();
    QUEUE = [];
  }

  function gardenRevokeConsent() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    showBanner();
  }

  function el(tag, attrs, text) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        if (key === 'class') node.className = attrs[key];
        else node.setAttribute(key, attrs[key]);
      });
    }
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function buildBanner() {
    if (banner) return banner;

    banner = el('div', {
      class: 'garden-consent-banner',
      role: 'dialog',
      'aria-modal': 'false',
      'aria-label': 'Cookie and advertising consent',
      'aria-live': 'polite'
    });

    var inner = el('div', { class: 'garden-consent-inner' });
    var message = el('div', { class: 'garden-consent-message' });
    message.appendChild(el('strong', null, 'Cookies and third-party services'));
    message.appendChild(document.createTextNode(
      'Garden with Serge uses analytics and advertising cookies. Nothing third-party loads until you accept. '
    ));
    var policy = el('a', { href: '/privacy.html', target: '_blank', rel: 'noopener' }, 'Read our Privacy Policy');
    message.appendChild(policy);
    message.appendChild(document.createTextNode('.'));

    var actions = el('div', { class: 'garden-consent-actions' });
    var accept = el('button', { class: 'garden-consent-btn garden-consent-accept', type: 'button' }, 'Accept');
    var decline = el('button', { class: 'garden-consent-btn garden-consent-decline', type: 'button' }, 'Decline');
    var manage = el('button', { class: 'garden-consent-btn garden-consent-manage', type: 'button' }, 'Manage');

    accept.addEventListener('click', function (e) { e.preventDefault(); acceptConsent(); });
    decline.addEventListener('click', function (e) { e.preventDefault(); declineConsent(); });
    manage.addEventListener('click', function (e) {
      e.preventDefault();
      window.open('/privacy.html', '_blank', 'noopener');
    });

    actions.appendChild(accept);
    actions.appendChild(decline);
    actions.appendChild(manage);
    inner.appendChild(message);
    inner.appendChild(actions);
    banner.appendChild(inner);

    banner.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') declineConsent();
    });

    return banner;
  }

  function showBanner() {
    try {
      var stored = getStored();
      if (stored === 'granted' || stored === 'denied') return;
      if (!document.body) return;
      var node = buildBanner();
      if (!document.body.contains(node)) {
        document.body.appendChild(node);
        setTimeout(function () { node.classList.add('garden-consent-visible'); }, 20);
      }
    } catch (e) { console.warn('showBanner error', e); }
  }

  function hideBanner() {
    try {
      if (!banner) return;
      banner.classList.remove('garden-consent-visible');
      var node = banner;
      banner = null;
      setTimeout(function () {
        try { node.remove(); } catch (e) {}
      }, 240);
    } catch (e) {}
  }

  function start() {
    if (isGranted()) {
      runQueue();
      loadAdsAndAnalytics();
    } else {
      showBanner();
    }
  }

  window.gardenConsentGiven = gardenConsentGiven;
  window.gardenLoadAfterConsent = gardenLoadAfterConsent;
  window.gardenRevokeConsent = gardenRevokeConsent;
  window.gardenFillAdUnits = fillAdUnits;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
