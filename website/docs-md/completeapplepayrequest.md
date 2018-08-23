---
id: completeapplepayrequest
title: .completeApplePayRequest() -> Promise
sidebar_label: .completeApplePayRequest()
---

__Method is deprecated, use completeNativePayRequest() instead__

After `paymentRequestWithApplePay` you should complete the operation by calling `completeApplePayRequest` .

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
  const token = await stripe.paymentRequestWithApplePay(items, options)

  // Client specific code
  // api.sendTokenToBackend(token)

  // You should complete the operation by calling
  stripe.completeApplePayRequest()
} catch (error) {
  // Or cancel if an error occurred
  // stripe.cancelApplePayRequest()
}
```
