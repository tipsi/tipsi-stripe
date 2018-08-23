---
id: deviceSupportsApplePay
title: .deviceSupportsApplePay() -> Promise
sidebar_label: .deviceSupportsApplePay()
---

__Method is deprecated, use deviceSupportsNativePay() instead__

Returns whether the user can make Apple Pay payments.
User may not be able to make payments for a variety of reasons. For example, this functionality may not be supported by their hardware, or it may be restricted by parental controls.

Returns `true` if the device supports making payments; otherwise, `false`.

**NOTE**: iOS Simulator always return `true`

```js
import stripe from 'tipsi-stripe'

await stripe.deviceSupportsApplePay()
```
