---
id: stripeconnect
title: .setStripeAccount(stripeAccount) -> void
sidebar_label: .setStripeAccount()
---

Authenticating as another User via Connect

Changes the currently connected account used for authentication for all future Stripe API requests.
Can be used to perform API actions for other users on their behalf. [More info](https://stripe.com/docs/connect/authentication#stripe-account-header)

**stripeAccount** _String_ (Required) — The `CONNECTED_STRIPE_ACCOUNT_ID` to switch to.

#### Example

```js
import stripe from 'tipsi-stripe'

stripe.setStripeAccount(CONNECTED_STRIPE_ACCOUNT_ID)
```
