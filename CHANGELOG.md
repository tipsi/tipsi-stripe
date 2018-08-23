# Changelog

## [5.6.0] - 2018-08-22
### Added
- [Common error codes](https://tipsi.github.io/tipsi-stripe/docs/errorcodes.html). Part of them provided by `tipsi-stripe`, another part by `Stripe` itself.

## [5.5.1] - 2018-08-10
### Added
- `paymentRequestWithAndroidPay` now supports _boolean_ `phone_number_required` field to ask a user for phone number  

## [5.5.0] - 2018-08-08
### Added
- `tipsi-stripe` now respects [project-level GMS version](https://github.com/tipsi/tipsi-stripe/pull/350) on Android 

## [5.4.0] - 2018-07-27
From this release we are starting unify our Public API.  
There was a difference between iOS and Android API, now we've created new methods that currently work as a proxy.  
So, we have marked deprecated methods inside `src/Stripe.js`, and yes there is no more Stripe.${platform}.js files.  
But, you won't see any changes. Breaking changes will be introduced in version 6.

### DEPRECATED METHODS
- `deviceSupportsAndroidPay` and `deviceSupportsApplePay` => `deviceSupportsNativePay`
- `canMakeAndroidPayPayments` and `canMakeApplePayPayments` => `canMakeNativePayPayments`
- `paymentRequestWithAndroidPay` and `paymentRequestWithApplePay` => `paymentRequestWithNativePay`
- `completeApplePayRequest` => `completeNativePayRequest` (Android implementation doesn't exist)
- `cancelApplePayRequest` => `cancelNativePayRequest` (Android implementation doesn't exist)
- `openApplePaySetup` => `openNativePaySetup` (Android implementation doesn't exist)

As you can see all platform specific methods are now unified.  
We called them `Native Methods` because `Google/Android Pay` and `ApplePay` are native payments systems unlike Credit Cards.  

### Changed
- `Stripe.ios.js` and `Stripe.android.js` => `Stripe.js`
- Native iOS `TPSStripeManager` renamed to `StripeModule`
- Example App now uses new unified methods

## [5.3.0] - 2018-07-23
### Changed
- `REACT_CLASS` for Native Android implementation of PaymentCardTextField renamed `CreditCardForm => TPSCardField`
- `PaymentCardTextField` merged into one compoment. It's a first step to clearing the difference between iOS and Android
- `Android Pay => Google Pay` in `android/src/main/res/values/strings.xml`
- `prop-types` in example updated `15.5.10 => 15.6.1`, appium `1.8.0 => 1.8.1`

### Added
- Default string value for Cancel button in Card Form `gettipsi_card_enter_dialog_negative_button`
- Support `overflow` style property on PaymentCardTextField (now it has <View /> wrapper inside)

### Removed
- Obsolete AndroidPay flow

## [5.2.4] - 2018-06-28
### Added
- Added missing `{number|expiration|cvc}Placeholder` fields to iOS' `<PaymentCardTextField />`

## [5.2.3] - 2018-06-07
### Changed
- Removed `package.json` from tipsi-stripe's podspec `preserve_paths` (to enable adding this pod via a `:git` key without hitting npm/yarn considering it a js package)

## [5.2.2] - 2018-06-01
### Changed
- Fixed int LOAD_PAYMENT_DATA_REQUEST_CODE in GoogleApiPayFlowImpl.java (< 65535)

## [5.2.1] - 2018-05-05
### Added
- Fixed an error with PropTypes

## [5.2.0] - 2018-04-04
### Added 
- Method `stripe.canMakeAndroidPayPayments()` checks if gpay supported and user has existing payment method

### Changed
- Method `stripe.deviceSupportsAndroidPay()` doesn’t require anymore user to have existing payment method

## [5.1.0] - 2018-03-28
### Changed
- Method `deviceSupportAndroidPay()` now also checks if google pay has at least one existing payment method (for example user attached his card before)

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
