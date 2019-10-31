---
id: deviceSupportsNativePay
title: .deviceSupportsNativePay() -> Promise
sidebar_label: .deviceSupportsNativePay()
---

Returns whether the user can make Native Pay payments (Apple Pay or Android Pay respectively).

The user may not be able to make payments for a variety of reasons. For example, this functionality may not be supported by their hardware, or it may be restricted by parental controls.

Returns `true` if the device supports making payments; otherwise, `false`.

**NOTE**: The iOS Simulator always returns `true`.

```js
import stripe from 'tipsi-stripe'

await stripe.deviceSupportsNativePay()
```
