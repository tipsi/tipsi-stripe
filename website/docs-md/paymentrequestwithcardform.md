---
id: paymentrequestwithcardform
title: .paymentRequestWithCardForm(options) -> Promise
sidebar_label: .paymentRequestWithCardForm()
---

Opens the `Add Card` view to to accept a payment.

**options (iOS only)** — An object with the following keys:

| Key | Type | Description |
| :--- | :--- | :--- |
| requiredBillingAddressFields | String | The billing address fields the user must fill out when prompted for their payment details. Can be one of: **full** or **zip** or left unspecified to disable |
| prefilledInformation | Object | You can set this property to pre-fill any information you’ve already collected from your user |
| managedAccountCurrency | String | Required to be able to add the card to an account (in all other cases, this parameter is not used). More info |
| theme | Object | Can be used to visually style Stripe-provided UI |

**options.prefilledInformation** — An object with the following keys:

| Key | Type | Description |
| :--- | :--- | :--- |
| email | String | The user’s email address |
| phone | String | The user’s phone number |
| billingAddress | Object | The user’s billing address. When set, the add card form will be filled with this address |

**options.prefilledInformation.billingAddress** — An object with the following keys:

| Key | Type | Description |
| :--- | :--- | :--- |
| name | String | The user’s full name (e.g. "Jane Doe") |
| line1 | String | The first line of the user’s street address (e.g. "123 Fake St") |
| line2 | String | The apartment, floor number, etc of the user’s street address (e.g. "Apartment 1A") |
| city | String | The city in which the user resides (e.g. "San Francisco") |
| state | String | The state in which the user resides (e.g. "CA") |
| postalCode | String | The postal code in which the user resides (e.g. "90210") |
| country | String | The ISO country code of the address (e.g. "US") |
| phone | String | The phone number of the address (e.g. "8885551212") |
| email | String | The email of the address (e.g. "jane@doe.com") |

**options.theme** — An object with the following keys:

| Key | Type | Description |
| :--- | :--- | :--- |
| primaryBackgroundColor | String | The primary background color of this theme |
| secondaryBackgroundColor | String | The secondary background color of this theme |
| primaryForegroundColor | String | The primary foreground color of this theme. This will be used as the text color for any important labels in a view with this theme (such as the text color for a text field that the user needs to fill out) |
| secondaryForegroundColor | String | The secondary foreground color of this theme. This will be used as the text color for any supplementary labels in a view with this theme (such as the placeholder color for a text field that the user needs to fill out) |
| accentColor | String | The accent color of this theme - it will be used for any buttons and other elements on a view that are important to highlight |
| errorColor | String | The error color of this theme - it will be used for rendering any error messages or view |

### Example

```js
const options = {
  requiredBillingAddressFields: 'full',
  prefilledInformation: {
    billingAddress: {
      name: 'Gunilla Haugeh',
      line1: 'Canary Place',
      line2: '3',
      city: 'Macon',
      state: 'Georgia',
      country: 'US',
      postalCode: '31217',
    },
  },
}

const token = await stripe.paymentRequestWithCardForm(options)

// Client specific code
// api.sendTokenToBackend(token)
```

![](https://cloud.githubusercontent.com/assets/1177226/20274560/1432abf2-aaa6-11e6-8505-0cdc3017fe22.gif)  ![](https://cloud.githubusercontent.com/assets/1177226/20572150/54192810-b1bb-11e6-9df6-5c068bf69904.gif)
