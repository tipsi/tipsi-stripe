---
id: usage
title: Usage
sidebar_label: Usage
---

Let's require `tipsi-stripe` module:

```js
import stripe from 'tipsi-stripe'
```

And initialize it with your Stripe credentials that you can get from [dashboard](https://dashboard.stripe.com). If you want to use `Apple Pay` you must provide your `Merchant ID`.

```js
stripe.setOptions({
  publishableKey: 'PUBLISHABLE_KEY',
  merchantId: 'MERCHANT_ID', // Optional
  androidPayMode: 'test', // Android only
})
```

`androidPayMode` _String_ (Android only) - Corresponds to [WALLET_ENVIRONMENT](https://developers.google.com/android/reference/com/google/android/gms/wallet/WalletConstants
).
Can be one of: `test|production`.

### Usage with Stripe Connect	

If you're using [Stripe Connect](https://stripe.com/docs/connect) and need to set a `stripeAccount` do the following:	

```js
stripe.setStripeAccount('<ACCT_>');	
```

when you're done doing operations on the stripe connected account do:
```js
stripe.setStripeAccount(null);
```
