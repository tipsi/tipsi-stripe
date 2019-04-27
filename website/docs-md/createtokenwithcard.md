---
id: createtokenwithcard
title: .createTokenWithCard(params) -> Promise
sidebar_label: .createTokenWithCard()
---

Creates a token based on the passed card params.

**params** — An object with the following keys:

| Key | Type | Description |
| :--- | :--- | :--- |
| number (Required) | String | The card’s number |
| expMonth (Required) | Number | The card’s expiration month |
| expYear (Required) | Number | The card’s expiration year |
| cvc | String | The card’s security code, found on the back |
| name | String | The cardholder’s name |
| addressLine1 | String | The first line of the billing address |
| addressLine2 | String | The second line of the billing address |
| addressCity | String | City of the billing address |
| addressState | String | State of the billing address |
| addressZip | String | Zip code of the billing address |
| addressCountry | String | Country for the billing address |
| brand (Android) | String | Brand of this card. Can be one of: **JCB ‖ American Express ‖ Visa ‖ Discover ‖ Diners Club ‖ MasterCard ‖ Unknown** |
| last4 (Android) | String | The last 4 digits of the card |
| fingerprint (Android) | String | The card's fingerprint |
| funding (Android) | String | The funding type of the card. Can be one of: **debit ‖ credit ‖ prepaid ‖ unknown** |
| country (Android) | String | ISO country code of the card itself |
| currency | String | Three-letter ISO currency code representing the currency paid out to the bank account. This is only applicable when tokenizing debit cards to issue payouts to managed accounts. You should not set it otherwise. The card can then be used as a transfer destination for funds in this currency |

### Example

```js
const params = {
  // mandatory
  number: '4242424242424242',
  expMonth: 11,
  expYear: 17,
  cvc: '223',
  // optional
  name: 'Test User',
  currency: 'usd',
  addressLine1: '123 Test Street',
  addressLine2: 'Apt. 5',
  addressCity: 'Test City',
  addressState: 'Test State',
  addressCountry: 'Test Country',
  addressZip: '55555',
}

const token = await stripe.createTokenWithCard(params)

// Client specific code
// api.sendTokenToBackend(token)
```

![](https://cloud.githubusercontent.com/assets/1177226/20275232/cf0f8e3e-aaa8-11e6-85bf-5e093706ea0a.gif)  ![](https://cloud.githubusercontent.com/assets/1177226/20572183/7a0a4824-b1bb-11e6-82f2-9b3f7038b1a9.gif)
