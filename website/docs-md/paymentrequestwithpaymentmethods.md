---
id: paymentrequestwithpaymentmethods
title: .paymentRequestWithPaymentMethods(options) -> Promise
sidebar_label: .paymentRequestWithPayment-Methods()
---

Launch Stripe `Payment Methods` view ([iOS](https://stripe.com/docs/mobile/ios/custom#stppaymentoptionsviewcontroller), [Android](https://stripe.com/docs/mobile/android/customer-information#let-your-user-select-their-payment-method)) to to accept payments with a customer.

**options** — An object. _All keys but `ephemeralKey` are only effective on iOS_:

| Key                          | Type    | Description                                                                                                                                                                                                                                                                                                        |
| :--------------------------- | :------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ephemeralKey                 | String  | A token created by the application backend (using [Stripe API](https://stripe.com/docs/mobile/ios/standard#ephemeral-key)) to allow the payment methods to perform actions on the respective `Customer` object. Passing this key is optional, if you do not know which API version to use. See Instructions below. |
| requiredBillingAddressFields | String  | The billing address fields the user must fill out when prompted for their payment details. Can be one of: **full** or **zip** or not specify to disable                                                                                                                                                            |
| theme                        | Object  | Can be used to visually style Stripe-provided UI                                                                                                                                                                                                                                                                   |
| createCardSource             | Boolean | Return a card selection as source (and not as card). On Android return source always.                                                                                                                                                                                                                              |
| includeApplePaySources       | Boolean | Show apple pay source in UI. you should normally not use it (apple pay appears as one selection), so only for debugging                                                                                                                                                                                            |

**options.theme** — An object with the following keys:

| Key                      | Type   | Description                                                                                                                                                                                                               |
| :----------------------- | :----- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| primaryBackgroundColor   | String | The primary background color of the theme                                                                                                                                                                                 |
| secondaryBackgroundColor | String | The secondary background color of this theme                                                                                                                                                                              |
| primaryForegroundColor   | String | The primary foreground color of this theme. This will be used as the text color for any important labels in a view with this theme (such as the text color for a text field that the user needs to fill out)              |
| secondaryForegroundColor | String | The secondary foreground color of this theme. This will be used as the text color for any supplementary labels in a view with this theme (such as the placeholder color for a text field that the user needs to fill out) |
| accentColor              | String | The accent color of this theme - it will be used for any buttons and other elements on a view that are important to highlight                                                                                             |
| errorColor               | String | The error color of this theme - it will be used for rendering any error messages or view                                                                                                                                  |

### Instructions

The Payment methods UI ([iOS](https://stripe.com/docs/mobile/ios/custom#stppaymentoptionsviewcontroller), [Android](https://stripe.com/docs/mobile/android/customer-information#let-your-user-select-their-payment-method)) manages a customer wallet, based on Stripe `Customer` object.

Use this modal dialog as part of your payment process to allow the user to select a card that they used in the past, or add a new card:

1. The dialog is launched, receiving an [Ephemeral Key](https://stripe.com/docs/mobile/ios/standard#ephemeral-key) representing the customer.
2. The dialog code loads the customer information. While in the dialog the user may add and remove credits cards, and finally selects a payment method. The cards are saved on the Stripe `Customer` object for a later usage.
3. When the dialog is closed, continue with a backend charge based on the dialog return value.

The return value is an object representing the selected payment methods. It may be a card, a source or apple pay. To tell the difference inspect the `resultType` key. It will be one of:

- `STPSource` - card as source
- `STPCard` - card
- `STPApplePayPaymentMethod` - apple pay payment method

#### Charging

Charging at the backend, when using the `Customer` workflow, normally charges the `Customer` object. Only when **Apple Pay** is used (return value has `STPApplePayPaymentMethod` as `resultType`), should you continue with apple pay workflow (via `paymentRequestWithNativePay`) to create a token, and then charge based on the token (This will automatically set Apple Pay as the default payment method for this customer).
To be able to tell one from another use the return value of the dialog.

#### Ephemeral Key

The [Ephemeral Key](https://stripe.com/docs/mobile/ios/standard#ephemeral-key) creation is based on the Stripe SDK version that's used. If you do not know which SDK version you are using don't provide `ephemeralKey` as input for the method. In this case, the call will return with the Stripe SDK version, which you can then pass to your backend to create an Ephemeral Key. Then continue with the dialog display using `completePaymentRequestWithPaymentMethods` (See there for full instructions).

### Example

With Ephemeral Key in advance:

```js
// this.requestEphemeralKey calls the backend to get an Ephemeral Key representing
// the customer.
const ephemeralKey = await this.requestEphemeralKey();

const result = await stripe.paymentRequestWithPaymentMethods({
  ephemeralKey
});

if (result.resultType === "STPApplePayPaymentMethod") {
  // continue with apple pay, and then charge the result token in backend.
} else {
  // charge the backend via the customer object.
}
```

With Ephemeral Key after having received a version:

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
