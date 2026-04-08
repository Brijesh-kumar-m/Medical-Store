// Lightweight analytics wrapper - hooks into GA4 or custom backend
// Add VITE_GA_MEASUREMENT_ID to .env to enable Google Analytics

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || '';

// Initialize GA4
export function initAnalytics() {
  if (!GA_ID) return;
  
  // Load gtag script
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, {
    send_page_view: false, // We'll track manually for SPA
  });

  console.log('[Analytics] GA4 initialized:', GA_ID);
}

// Track page view (call on route change)
export function trackPageView(path, title) {
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: title,
    });
  }
  // Also log to console in dev
  if (import.meta.env.DEV) {
    console.log('[Analytics] Page:', path);
  }
}

// Track custom events
export function trackEvent(eventName, params = {}) {
  if (window.gtag) {
    window.gtag('event', eventName, params);
  }
  if (import.meta.env.DEV) {
    console.log('[Analytics] Event:', eventName, params);
  }
}

// Pre-defined event helpers
export const analytics = {
  // User events
  login: (method) => trackEvent('login', { method }),
  signup: () => trackEvent('sign_up'),

  // E-commerce events
  viewProduct: (product) => trackEvent('view_item', {
    currency: 'INR',
    value: product.price,
    items: [{ item_id: product.id, item_name: product.name, price: product.price }],
  }),

  addToCart: (product) => trackEvent('add_to_cart', {
    currency: 'INR',
    value: product.price,
    items: [{ item_id: product.id, item_name: product.name, price: product.price }],
  }),

  checkout: (total, items) => trackEvent('begin_checkout', {
    currency: 'INR',
    value: total,
    items: items.map(i => ({ item_id: i.id, item_name: i.name, price: i.price, quantity: i.quantity })),
  }),

  purchase: (orderId, total) => trackEvent('purchase', {
    transaction_id: orderId,
    currency: 'INR',
    value: total,
  }),

  // Blood test events
  bookTest: (testName, price) => trackEvent('book_blood_test', { test_name: testName, value: price }),

  // Referral events
  shareReferral: (method) => trackEvent('share_referral', { method }),

  // Prescription events
  uploadPrescription: () => trackEvent('upload_prescription'),
};
