---
id: completeNativePayRequest
title: .completeNativePayRequest() -> Promise
sidebar_label: .completeNativePayRequest()
---

After [`paymentRequestWithNativePay()`](paymentRequestWithNativePay.md) you should complete the operation by calling `completeNativePayRequest` .

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
  requiredBillingAddressFields: 'all',
  requiredShippingAddressFields: 'all',
  shippingMethods,
}

try {
  const token = await stripe.paymentRequestWithNativePay(items, options)

  // Client specific code
  // api.sendTokenToBackend(token)

  // You should complete the operation by calling
  stripe.completeNativePayRequest()
} catch (error) {
  // Or cancel if an error occurred
  // stripe.cancelNativePayRequest()
}
```
