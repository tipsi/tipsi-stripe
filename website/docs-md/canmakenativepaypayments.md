---
id: canMakeNativePayPayments
title: .canMakeNativePayPayments([options]) -> Promise
sidebar_label: .canMakeNativePayPayments()
---

Returns whether the user can make Native Pay payments (either Apple Pay or AndroidPay) with the specified options.

If there are no configured payment cards, this method always returns `false`.

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

### Example

```js
import stripe from 'tipsi-stripe'

await stripe.canMakeNativePayPayments()
```

```js
import stripe from 'tipsi-stripe'

await stripe.canMakeNativePayPayments({networks: ['american_express', 'discover']})
```

## iOS

##### `options`

| Key | Type | Description |
| :--- | :--- | :--- |
| networks | optional Array[String] | Indicates whether the user can make Apple Pay payments through the specified network(s). If left unspecified, we pass all available networks under the hood. |

Returns `true` if the user can make Apple Pay payments through any of the specified networks; otherwise, `false`.

## Android

Indicates whether or not the device supports AndroidPay and the user has set up an existing payment method. Returns a `Boolean` value.
