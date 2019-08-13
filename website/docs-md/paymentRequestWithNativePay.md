---
id: paymentRequestWithNativePay
title: .paymentRequestWithNativePay(options, [items]) -> Promise
sidebar_label: .paymentRequestWithNativePay()
---

Launches the Native Pay view to accept payment.

### iOS

#### `options` — An object with the following keys:

| Key | Type | Description |
| :--- | :--- | :--- |
| requiredBillingAddressFields | Array[String] | A bit field of billing address fields that you need in order to process the transaction. It can contain values of: **all ‖ name ‖ email ‖ phone ‖ postal_address** or be left unspecified to disable |
| requiredShippingAddressFields | Array[String] | A bit field of shipping address fields that you need in order to process the transaction. It can contain values of: **all ‖ name ‖ email ‖ phone ‖ postal_address** or be left unspecified to disable |
| shippingMethods | Array | An array of `shippingMethod` objects that describe the supported shipping methods. |
| currencyCode | String | The three-letter ISO 4217 currency code. Default is **USD** |
| countryCode | String | The two-letter code for the country where the payment will be processed. Default is **US** |
| shippingType | String | An optional value that indicates how purchased items are to be shipped. Default is **shipping**. Available options are: **shipping ‖ delivery ‖ store_pickup ‖ service_pickup** |

##### `shippingMethod` — An object with the following keys:

| Key | Type | Description |
| :--- | :--- | :--- |
| id | String | A unique identifier for the shipping method, used by the app |
| id | String | A short, localized description of the shipping method |
| label | String | A unique identifier for the shipping method, used by the app |
| detail | String | A user-readable description of the shipping method |
| amount | String | The shipping method’s amount |

#### `items` — An array of object with the following keys:

| Key | Type | Description |
| :--- | :--- | :--- |
| label | _String_ | A short, localized description of the item. |
| amount | _String_ | The summary item’s amount. |
| type | _String_ | The summary item’s type. Must be "pending" or "final". Defaults to "final". |

**NOTE**: The final item should represent your company; it'll be prepended with the word "Pay" (i.e. "Pay Tipsi, Inc $50")

#### Example

```js
const items = [{
  label: 'Whisky',
  amount: '50.00',
}, {
  label: 'Tipsi, Inc',
  amount: '50.00',
}]

const shippingMethods = [{
  id: 'fedex',
  label: 'FedEX',
  detail: 'Test @ 10',
  amount: '10.00',
}]

const options = {
  requiredBillingAddressFields: ['all'],
  requiredShippingAddressFields: ['phone', 'postal_address'],
  shippingMethods,
}

const token = await stripe.paymentRequestWithNativePay(items, options)
```

#### Token structure – `paymentRequestWithNativePay` response

`extra` — An object with the following keys:

| Key | Type | Description |
| :--- | :--- | :--- |
| shippingMethod | Object | Selected shippingMethod object |
| billingContact | Object | The user's billing contact object |
| shippingContact | Object | The user's shipping contact object |

`contact` — An object with the following keys:

| Key | Type | Description |
| :--- | :--- | :--- |
| name | String | The contact’s name |
| phoneNumber | String | The contact’s phone number |
| emailAddress | String | The contact’s email address |
| street | String | The street name in a postal address |
| city | String | The city name in a postal address |
| state | String | The state name in a postal address |
| country | String | The country name in a postal address |
| ISOCountryCode | String | The ISO country code for the country in a postal address |
| postalCode | String | The postal code in a postal address |
| supplementarySubLocality | String | The contact’s sublocality |

![](https://cloud.githubusercontent.com/assets/1177226/20272773/008e5994-aaa0-11e6-8c24-b4bedf245741.gif)

### Android

**options** — An object with the following keys:

| Key | Type | Description |
| :--- | :--- | :--- |
| total_price | String | Total price for items |
| currency_code | String | Three-letter ISO currency code representing the currency paid out to the bank account |
| shipping_address_required&nbsp;(Optional) | Bool | Is shipping address menu required? Default is **false** |
| billing_address_required&nbsp;(Optional) | Bool | Is billing address menu required? Default is **false** |
| phone_number_required&nbsp;(Optional) | Bool | Is phone number required? Default is **false** |
| line_items | Array | Array of purchased items. Each item contains **line_item** |

**line_item** — An object with the following keys:

| Key | Type | Description |
| :--- | :--- | :--- |
| currency_code | String | Currency code string |
| description | String | Short description that will be shown to the user |
| total_price | String | Total order price |
| unit_price | String | Price per unit |
| quantity | String | Number of items |

#### Example

```js
const options = {
  total_price: '80.00',
  currency_code: 'USD',
  shipping_address_required: false,
  billing_address_required: true,
  shipping_countries: ["US", "CA"],
  line_items: [{
    currency_code: 'USD',
    description: 'Whisky',
    total_price: '50.00',
    unit_price: '50.00',
    quantity: '1',
  }, {
    currency_code: 'USD',
    description: 'Vine',
    total_price: '30.00',
    unit_price: '30.00',
    quantity: '1',
  }],
}

const token = await stripe.paymentRequestWithAndroidPay(options)

// Client specific code
// api.sendTokenToBackend(token)
```

Example of token:
```
{ card:
  { currency: null,
    fingerprint: null,
    funding: "credit",
    brand: "MasterCard",
    number: null,
    addressState: null,
    country: "US",
    cvc: null,
    expMonth: 12,
    addressLine1: null,
    expYear: 2022,
    addressCountry: null,
    name: null,
    last4: "4448",
    addressLine2: null,
    addressCity: null,
    addressZip: null
  },
  created: 1512322244000,
  used: false,
  extra: {
    email: "randomemail@mail.com",
    billingContact: {
      postalCode: "220019",
      name: "John Doe",
      locality: "NY",
      countryCode: "US",
      administrativeArea: "US",
      address1: "Time square 1/11"
    },
    shippingContact: {}
  },
  livemode: false,
  tokenId: "tok_1BV1IeDZwqOES60ZphBXBoDr"
}
```

Where `billingContact` and `shippingContact` are representation of [UserAddress.](https://developers.google.com/android/reference/com/google/android/gms/identity/intents/model/UserAddress)

