# Changelog

## [5.0.0] - 2018-03-21

### Breaking changes:

#### 1) Initialization
 
before 5.0.0: 

```javascript
// somewhere in the app start section
  
stripe.init({
  merchantId: '<MERCHANT_ID>',
  publishableKey: '<PUB_KEY>',
  androidPayMode: 'test',      
})
  
stripe.paymentRequestWithAndroidPay(paymentOptions)
```

after 5.0.0:

##### single-step initialization

```javascript
// same as above except used method name
  
stripe.setOptions({
  merchantId: '<MERCHANT_ID>',
  publishableKey: '<PUB_KEY>',
  androidPayMode: 'test',      
})
  
stripe.paymentRequestWithAndroidPay(paymentOptions)
```

##### multi-step initialization
```javascript
// somewhere in the app start section
// make sure you've set androidPayMode before using androidPay related methods i.e.
// stripe.deviceSupportsAndroidPay()
// stripe.paymentRequestWithAndroidPay()
// or runtime exception will be thrown
  
stripe.setOptions({
  androidPayMode: 'test',      
})
  
// somewhere else later i.e. near store cart code
stripe.setOptions({
  publishableKey: '<PUB_KEY>',
})
  
// make sure you've set *all* needed options before, both androidPayMode and publishableKey
// or exception will be thrown
  
stripe.paymentRequestWithAndroidPay(paymentOptions)
```

#### 2) billing/shipping address requirement
before 5.0.0:
```javascript
// you couldn't before set billing_address_required, shipping_address_required options
// to require user filling that data. shipping_address_required was true by default
// and such data was missing in the method response (useless user input)
  
stripe.paymentRequestWithAndroidPay(paymentOptions)
```

after 5.0.0:
```javascript

// explicitly set required input from user by
// setting billing_address_required, shipping_address_required props,
// omitted values are false by default
  
const addressRequirements = {
  billing_address_required: false,
  shipping_address_required: true,
}
  
stripe.paymentRequestWithAndroidPay({
  paymentOptions,
  ...addressRequirements,
})
```

### Added
- Modern GooglePay [api](https://developers.google.com/pay/api/setup) was used by default
- `shippingContact`, `billingContact` appear are in results of `paymentRequestWithAndroidPay()`
- Firebase dependency appears
- More strict runtime argument checks

### Changed
- Method `setOptions()` performs multi-step initialization and used instead of `init()`. Options `publishableKey`, `androidPayMode` are settable at runtime. If method requires presence of options that are unset, runtime exception will be thrown. Special case: `androidPayMode` re-init is forbidden and **leads to runtime exception**.
- Wallet api version bump
- AndroidPay flow extracted from `StripeModule`
- Better naming
- Only create api client on demand
- Extract commons to utils
- Avoid copy and paste in old code

### Removed
- Obsolete AndroidPay flow is disabled by default and will be removed soon

### Fixed
- Fix of [Android Pay Shipping address not working](https://github.com/tipsi/tipsi-stripe/issues/240)
- Avoid `StripeModule` Activity NPE
- Avoid bugs regarding options default values
- Fix leaked promise bug
