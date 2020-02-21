---
id: createCardOrSubscription
title: Create Card Or Subscription
sidebar_label: Save Card/Subscription
---

## How to save payment info for future usage

You will need to store and use cards on your backend server.


1. `tipsi-stripe` will only generate token that will be used by backend to create card object. Use [API](./createtokenwithcard.html) to create token
2. Send it to your backend server where it can save it using [Stripe API to create card](https://stripe.com/docs/api/cards/create)
3. Save response in your database and then you will be able to reuse saved card token to make payments. Add some description to help user to select this card in the future (last4, name).
4. Add API on the backend side that will return list of your descriptions with ids
5. Use this id to get `CardToken` and use card token instead of one time token when performing payments


When you've saved the card on your backend you may use it to create subscriptions via [Stripe API](https://stripe.com/docs/billing/subscriptions/creating).

If you are using `PaymentIntents` you can use instructions from [SCA](./paymentIntents.html#the-user-is-saving-a-card-for-future-use)

How to use ApplePay with recurring subscriptions https://support.stripe.com/questions/use-apple-pay-for-recurring-payments
