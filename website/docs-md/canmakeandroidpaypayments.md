---
id: canmakeandroidpaypayments
title: .canMakeAndroidPayPayments() -> Promise
sidebar_label: .canMakeAndroidPayPayments()
---

__Method is deprecated, use canMakeNativePayPayments() instead.__

Indicates whether or not the device supports AndroidPay and the user has set up an existing payment method. Returns a `Boolean` value.

```js
import stripe from 'tipsi-stripe'

await stripe.canMakeAndroidPayPayments()
```
