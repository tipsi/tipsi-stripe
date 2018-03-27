---
id: token
title: Token
sidebar_label: Token
---

A `token object` returned from submitting payment details to the Stripe API via:
* `paymentRequestWithApplePay`
* `paymentRequestWithCardForm`
* `createTokenWithCard`

##### `token` — an object with the following keys

| Key | Type | Description |
| :--- | :--- | :--- |
| tokenId | String | The value of the token. You can store this value on your server and use it to make charges and customers |
| created | Number | When the token was created |
| livemode | Number | Whether or not this token was created in livemode. Will be 1 if you used your Live Publishable Key, and 0 if you used your Test Publishable Key |
| card | Object | The credit card details object that were used to create the token |
| bankAccount | Object | The external (bank) account details object that were used to create the token |
| extra | Object | An additional information that method can provide |

##### `card` — an object with the following keys

| Key | Type | Description |
| :--- | :--- | :--- |
| cardId | String | The Stripe ID for the card |
| brand | String | The card’s brand. Can be one of: **JCB **‖ **American Express **‖ **Visa **‖ **Discover **‖ **Diners Club **‖ **MasterCard **‖ **Unknown** |
| funding (iOS) | String | The card’s funding. Can be one of: **debit **‖ **credit **‖ **prepaid **‖ **unknown** |
| last4 | String | The last 4 digits of the card |
| dynamicLast4&nbsp;(iOS) | String | For cards made with Apple Pay, this refers to the last 4 digits of the Device Account Number for the tokenized card |
| isApplePayCard&nbsp;(iOS) | Bool | Whether or not the card originated from Apple Pay |
| expMonth | Number | The card’s expiration month. 1-indexed (i.e. 1 == January) |
| expYear | Number | The card’s expiration year |
| country | String | Two-letter ISO code representing the issuing country of the card |
| currency | String | This is only applicable when tokenizing debit cards to issue payouts to managed accounts. The card can then be used as a transfer destination for funds in this currency |
| name | String | The cardholder’s name |
| addressLine1 | String | The cardholder’s first address line |
| addressLine2 | String | The cardholder’s second address line |
| addressCity | String | The cardholder’s city |
| addressState | String | The cardholder’s state |
| addressCountry | String | The cardholder’s country |
| addressZip | String | The cardholder’s zip code |

##### `bankAccount`

| Key | Type | Description |
| :--- | :--- | :--- |
| routingNumber | String | The routing number of this account |
| accountNumber | String | The account number for this BankAccount. |
| countryCode | String | The two-letter country code that this account was created in |
| currency | String | The currency of this account |
| accountHolderName | String | The account holder's name |
| accountHolderType | String | the bank account type. Can be one of: **company **‖ **individual** |
| fingerprint | String | The account fingerprint |
| bankName | String | The name of bank |
| last4 | String | The last four digits of the account number |


## Example

```js
{
  tokenId: 'tok_19GCAQI5NuVQgnjeKNE32K0p',
  created: 1479236426,
  livemode: 0,
  card: {
    cardId: 'card_19GCAQI5NuVQgnjeRZizG4U3',
    brand: 'Visa',
    funding: 'credit',
    last4: '4242',
    expMonth: 4,
    expYear: 2024,
    country: 'US',
    name: 'Eugene Grissom',
    addressLine1: 'Green Street',
    addressLine2: '3380',
    addressCity: 'Nashville',
    addressState: 'Tennessee',
    addressCountry: 'US',
    addressZip: '37211',
  },
  bankAccount: {
    bankName: 'STRIPE TEST BANK',
    accountHolderType: 'company',
    last4: '6789',
    accountHolderName: 'Test holder name',
    currency: 'usd',
    fingerprint: 'afghsajhaartkjasd',
    countryCode: 'US',
    accountNumber: '424542424',
    routingNumber: '110000000',
  },
}
```
