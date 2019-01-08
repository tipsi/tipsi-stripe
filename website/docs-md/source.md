---
id: source
title: Source
sidebar_label: Source
---

A source object returned from creating a source (via `createSourceWithParams`) with the Stripe API.

##### `source` — an object with the following keys:

| Key | Type | Description |
| :--- | :--- | :--- |
| amount | Number | The amount associated with the source |
| clientSecret | String | The client secret of the source. Used for client-side polling using a publishable key |
| created | Number | When the source was created |
| currency | String | The currency associated with the source |
| flow | String | The authentication flow of the source. Can be one of: **none ‖ redirect ‖ verification ‖ receiver ‖ unknown** |
| livemode | Bool | Whether or not this source was created in _livemode_. Will be _true_ if you used your Live Publishable Key, and _false_ if you used your Test Publishable Key |
| metadata | Object | A set of key/value pairs associated with the source object |
| owner | Object | Information about the owner of the payment instrument |
| receiver | Object (Optional) | Information related to the receiver flow. Present if the source is a receiver |
| redirect | Object (Optional) | Information related to the redirect flow. Present if the source is authenticated by a redirect |
| status | String | The status of the source. Can be one of: **pending ‖ chargable ‖ consumed ‖ cancelled ‖ failed** |
| type | String | The type of the source. Can be one of: **bancontact ‖ card ‖ griopay ‖ ideal ‖ sepaDebit ‖ sofort ‖ threeDSecure ‖ alipay ‖ unknown** |
| usage | String | Whether this source should be reusable or not. Can be one of: **reusable ‖ single ‖ unknown** |
| verification | Object (Optional) | Information related to the verification flow. Present if the source is authenticated by a verification |
| details | Object | Information about the source specific to its type |
| cardDetails | Object (Optional) | If this is a card source, this property contains information about the card |
| sepaDebitDetails | Object (Optional) | If this is a SEPA Debit source, this property contains information about the sepaDebit |

##### `owner`

| Key | Type | Description |
| :--- | :--- | :--- |
| address | Object (Optional) | Owner’s address |
| email | String (Optional) | Owner’s email address |
| name | String (Optional) | Owner’s full name |
| phone | String (Optional) | Owner’s phone number |
| verifiedAddress | Object (Optional) | Verified owner’s address |
| verifiedEmail | String (Optional) | Verified owner’s email address |
| verifiedName | String (Optional) | Verified owner’s full name |
| verifiedPhone | String (Optional) | Verified owner’s phone number |

##### `receiver`

| Key | Type | Description |
| :--- | :--- | :--- |
| address | Object | The address of the receiver source. This is the value that should be communicated to the customer to send their funds to |
| amountCharged | Number | The total amount charged by you |
| amountReceived | Number | The total amount received by the receiver source |
| amountReturned | Number | The total amount that was returned to the customer |

##### `redirect`

| Key | Type | Description |
| :--- | :--- | :--- |
| returnURL | String | The URL you provide to redirect the customer to after they authenticated their payment |
| status | String | The status of the redirect. Can be one of: **pending ‖ succeeded ‖ failed ‖ unknown** |
| url | String | The URL provided to you to redirect a customer to as part of a redirect authentication flow |

##### `verification`

| Key | Type | Description |
| :--- | :--- | :--- |
| attemptsRemaining | Number | The number of attempts remaining to authenticate the source object with a verification code |
| status | String | The status of the verification. Can be one of: **pending ‖ succeeded ‖ failed ‖ unknown** |

##### `cardDetails`

| Key | Type | Description |
| :--- | :--- | :--- |
| last4 | String | The last 4 digits of the card |
| expMonth | Number | The card’s expiration month. 1-indexed \(i.e. 1 == January\) |
| expYear | Number | The card’s expiration year |
| brand | String | The issuer of the card. Can be one of: **JCB ‖ American Express ‖ Visa ‖ Discover ‖ Diners Club ‖ MasterCard ‖ Unknown** |
| funding \(iOS\) | String | The funding source for the card. Can be one of: **debit ‖ credit ‖ prepaid ‖ unknown** |
| country | String | Two-letter ISO code representing the issuing country of the card |
| threeDSecure | String | Whether 3D Secure is supported or required by the card. Can be one of: **required ‖ optional ‖ notSupported ‖ unknown** |

##### `sepaDebitDetails`

| Key | Type | Description |
| :--- | :--- | :--- |
| last4 | String | The last 4 digits of the account number |
| bankCode | String | The account’s bank code |
| country | String | Two-letter ISO code representing the country of the bank account |
| fingerprint | String | The account’s fingerprint |
| mandateReference | String | The reference of the mandate accepted by your customer |
| mandateURL | String | The details of the mandate accepted by your customer |

# Example

```js
{
  livemode: false,
  amount: 50,
  owner: {},
  metadata: {},
  clientSecret: 'src_client_secret_BLnXIZxZprDmdhw3zv12123L',
  details: {
    native_url: null,
    statement_descriptor: null
  },
  type: 'alipay',
  redirect: {
    url: 'https://hooks.stripe.com/redirect/authenticate/src_1Az5vzE5aJKqY779Kes5s61m?client_secret=src_client_secret_BLnXIZxZprDmdhw3zv12123L',
    returnURL: 'example://stripe-redirect?redirect_merchant_name=example',
    status: 'succeeded'
  },
  usage: 'single',
  created: 1504713563,
  flow: 'redirect',
  currency: 'eur',
  status: 'chargable',
}
```
