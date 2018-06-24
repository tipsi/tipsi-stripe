import stripe from 'tipsi-stripe'

stripe.setOptions({
  publishableKey: 'PUBLISHABLE_KEY',
  merchantId: 'MERCHANT_ID', // Optional
  androidPayMode: 'test', // Android only
});
