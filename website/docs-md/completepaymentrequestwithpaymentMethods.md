---
id: completepaymentrequestWithpaymentmethods
title: .completePaymentRequestWithPaymentMethods(ephemeralKey) -> Promise
sidebar_label: .completePaymentRequestWith-PaymentMethods()
---

Continue workflow started with `paymentRequestWithPaymentMethods`, In the case where an [Ephemeral Key](https://stripe.com/docs/mobile/ios/standard#ephemeral-key) was not provided at first. Provide a single parameter - An ephemeral key created by stripe API.

### Instructions

Use this method if you do not know the stripe SDK version when wanting to launch the payment methods via `paymentRequestWithPaymentMethods`.
In that case:

1. Call `paymentRequestWithPaymentMethods` without an Ephemeral Key. The call will return a string with the Stripe SDK Version.
2. Use your backend to create an Ephemeral Key with the specified version.
3. Continue the workflow in the payment methods dialog by calling this method with the key - `completePaymentRequestWithPaymentMethods(key)`.

The return value of the dialog will return now as the value of the last call, to - `completePaymentRequestWithPaymentMethods`.

### Example

```js
const apiVersion = await stripe.paymentRequestWithPaymentMethods();

// this.requestEphemeralKey calls the backend to get an Ephemeral Key representing
// the customer. here - based on a version returned from the initial call
// to payment methods
const ephemeralKey = await this.requestEphemeralKey(apiVersion);

// continue with the dialog.
const result = await stripe.completePaymentRequestWithPaymentMethods(
  ephemeralKey
);

if (result.resultType === "STPApplePayPaymentMethod") {
  // continue with apple pay, and then charge the result token in backend.
} else {
  // charge the backend via the customer object.
}
```
