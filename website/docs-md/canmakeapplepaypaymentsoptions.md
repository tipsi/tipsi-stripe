---
id: canmakeapplepaypaymentsoptions
title: .canMakeApplePayPayments([options]) -> Promise
sidebar_label: .canMakeApplePayPayments()
---

__Method is deprecated, use canMakeNativePayPayments() instead__

Returns whether the user can make Apple Pay payments with specified options.
If there are no configured payment cards, this method always returns `false`.
Return `true` if the user can make Apple Pay payments through any of the specified networks; otherwise, `false`.

**NOTE**: iOS Simulator always return `true`

##### `options`

| Key | Type | Description |
| :--- | :--- | :--- |
| networks | Array[String] | Indicates whether the user can make Apple Pay payments through the specified network. Available networks: **american_express ‖ discover ‖ master_card ‖ visa**. If option does not specify we pass all available networks under the hood. |

#### Example

```js
import stripe from 'tipsi-stripe'

await stripe.canMakeApplePayPayments()
```

```js
import stripe from 'tipsi-stripe'

await stripe.canMakeApplePayPayments(['american_express', 'discover'])
```
