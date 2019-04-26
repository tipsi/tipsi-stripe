---
id: createtokenwithbankaccount
title: .createTokenWithBankAccount(params) -> Promise
sidebar_label: .createTokenWithBankAccount()
---

Creates token based on external \(bank\) params.

**`params`** — An object with the following keys:

| Key | Type | Description |
| :--- | :--- | :--- |
| accountNumber \(Required\) | String | The account number for this BankAccount |
| countryCode \(Required\) | String | The two-letter country code of the country this account was created in |
| currency \(Required\) | String | The currency of this account |
| routingNumber | String | The routing number of this account |
| accountHolderName | String | The account holder's name |
| accountHolderType | String | The bank account type. Can be one of: **company ‖ individual** |

### Example

```js
const params = {
  // mandatory
  accountNumber: '000123456789',
  countryCode: 'us',
  currency: 'usd',
  // optional
  routingNumber: '110000000', // 9 digits
  accountHolderName: 'Test holder name',
  accountHolderType: 'company', // "company" or "individual"
}

const token = await stripe.createTokenWithBankAccount(params)

// Client specific code
// api.sendTokenToBackend(token)
```

![](https://cloud.githubusercontent.com/assets/1286226/26419755/6c801f06-40c9-11e7-972e-521850eda2ef.gif)
