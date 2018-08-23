---
id: paymentrequestwithandroidpay
title: .paymentRequestWithAndroidPay(options) -> Promise
sidebar_label: .paymentRequestWithAndroidPay()
---

__Method is deprecated, use paymentRequestWithNativePay() instead__

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
| description | String | Short description that will shown to user |
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
