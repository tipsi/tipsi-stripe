---
id: canmakeapplepaypaymentsoptions
title: .canMakeApplePayPayments([options]) -> Promise
sidebar_label: .canMakeApplePayPayments()
---

__Method is deprecated, use canMakeNativePayPayments() instead.__


## All Platforms

When referring to `networks` below, we mean values from this list:

* `american_express`
* `cartes_bancaires`
* `china_union_pay`
* `discover`
* `eftpos`
* `electron`
* `elo`
* `id_credit`
* `interac`
* `jcb`
* `mada`
* `maestro`
* `master_card`
* `private_label`
* `quic_pay`
* `suica`
* `visa`
* `vpay`

Returns whether the user can make Apple Pay payments with specified options.
If there are no configured payment cards, this method always returns `false`.

Returns `true` if the user can make Apple Pay payments through any of the specified networks; otherwise, `false`.

**NOTE**: The iOS Simulator always returns `true`.

##### `options`

| Key | Type | Description |
| :--- | :--- | :--- |
| networks | Array[String] | Indicates whether the user can make Apple Pay payments through the specified network. Available networks: **american_express ‖ discover ‖ master_card ‖ visa**. If left unspecified, we pass all available networks under the hood. |

#### Example

```js
import stripe from 'tipsi-stripe'

await stripe.canMakeApplePayPayments()
```

```js
import stripe from 'tipsi-stripe'

await stripe.canMakeApplePayPayments(['american_express', 'discover'])
```
