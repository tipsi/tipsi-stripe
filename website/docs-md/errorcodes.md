---
id: errorcodes
title: Error Codes
sidebar_label: Error Codes
---

[Custom error codes](https://github.com/tipsi/tipsi-stripe/blob/master/src/errorCodes.js) provided by `tipsi-stripe`:  

| Key | Description |
| :--- | :--- |
| **busy** | Previous request is not completed |
| **cancelled** | Cancelled by user |
| **purchaseCancelled** | Purchase was cancelled |
| **sourceStatusCanceled** | Cancelled by user |
| **sourceStatusPending** | The source has been created and is awaiting customer action |
| **sourceStatusFailed** | The source status is unknown. You shouldn\'t encounter this value. |
| **sourceStatusUnknown** | Source polling unknown error |
| **noPaymentRequest** | Missing payment request |
| **noMerchantIdentifier** | Missing merchant identifier |
| **noAmount** | Amount should be greater than 0 |
| **parseResponse** | Failed to parse JSON |
| **activityUnavailable** | Cannot continue with no current activity |
| **playServicesUnavailable** | Play services are not available |
| **redirectCancelled** | Redirect cancelled |
| **redirectNoSource** | Received redirect uri but there is no source to process |
| **redirectWrongSourceId** | Received wrong source id in redirect uri |
| **redirectCancelledByUser** | User cancelled source redirect |
| **redirectFailed** | Source redirect failed |

Error codes with description provided by `Stripe` itself:  

| Key |
| :--- |
| **api** |
| **apiConnection** |
| **redirectSpecific** |
| **card** |
| **invalidRequest** |
| **stripe** |
| **rateLimit** |
| **authentication** |
| **permission** |

#### Example
```js
// all error codes available through named import
import { errorCodes } from 'tipsi-stripe'
```
