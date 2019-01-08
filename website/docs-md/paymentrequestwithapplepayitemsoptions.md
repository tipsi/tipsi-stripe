---
id: paymentrequestwithapplepayitemsoptions
title: .paymentRequestWithApplePay(items, [options]) -> Promise
sidebar_label: .paymentRequestWithApplePay()
---

__Method is deprecated, use paymentRequestWithNativePay() instead__

Launch the  Pay view to accept payment.

##### `items` — An array of object with the following keys:

| Key | Type | Description |
| :--- | :--- | :--- |
| label | _String_ | A short, localized description of the item. |
| amount | _String_ | The summary item’s amount. |
| type | _String_ | The summary item’s type. Must be "pending" or "final". Defaults to "final". |

**NOTE**: The final item should represent your company; it'll be prepended with the word "Pay" (i.e. "Pay Tipsi, Inc $50")

##### `options` — An object with the following keys:

| Key | Type | Description |
| :--- | :--- | :--- |
| requiredBillingAddressFields | Array[String] | A bit field of billing address fields that you need in order to process the transaction. Array should contain one of: **all ‖ name ‖ email ‖ phone ‖ postal_address** or not specify to disable |
| requiredShippingAddressFields | Array[String] | A bit field of shipping address fields that you need in order to process the transaction. Array should contain one of: **all ‖ name ‖ email ‖ phone ‖ postal_address** or not specify to disable |
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

const token = await stripe.paymentRequestWithApplePay(items, options)
```

#### Token structure – `paymentRequestWithApplePay` response

`extra` — An object with the following keys

| Key | Type | Description |
| :--- | :--- | :--- |
| shippingMethod | Object | Selected shippingMethod object |
| billingContact | Object | The user's billing contact object |
| shippingContact | Object | The user's shipping contact object |

`contact` — An object with the following keys

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
