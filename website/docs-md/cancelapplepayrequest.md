---
id: cancelapplepayrequest
title: .cancelApplePayRequest() -> Promise
sidebar_label: .cancelApplePayRequest()
---

__Method is deprecated, use cancelNativePayRequest() instead__

After `paymentRequestWithApplePay` you should complete the operation by calling `cancelApplePayRequest` if an error occurred.

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
  await stripe.paymentRequestWithApplePay(items, options)

  // You should complete the operation by calling
  // stripe.completeApplePayRequest()
} catch (error) {
  // Or cancel if an error occurred
  stripe.cancelApplePayRequest()
}
```
