---
id: paymentIntents
title: Payment Intent API
sidebar_label: Payment Intent API
---

## Introduction

Card payments with Stripe should be performed with PaymentIntents.

This API was created to handle modern payments, where the cardholder's bank may require
the user to authenticate themselves with the bank before a payment can be authorized.  

Authentication requirements first started to appear with European banks regulated 
by PSD2 which introduced [Strong Customer Authentication
(SCA)](https://stripe.com/en-ca/guides/strong-customer-authentication) requirements.


---
**tipsi-stripe** helps to support key parts of the payment experience, with sections on each below.

1) Creating a PaymentMethod (with card data, a card token, or a token from Google Pay / Apple Pay)
2) Initiating a payment from the mobile app
3) Asking the user to authenticate a transaction that was attempted off-session by you, the Merchant
4) Saving a card for future use
---



## Creating a PaymentMethod

Creating a payment method using card details:
```js
try {
  const paymentMethod = await stripe.createPaymentMethod({
    card : {
      number : '4000002500003155',
      cvc : '123',
      expMonth : 11,
      expYear : 2020
    }
  })
} catch (e) {
  // Handle error
}
```

Creating a payment method using a  card token.
This could be:
* a token from Google Pay
* a token returned by `await stripe.paymentRequestWithCardForm(...)`
* a token returned by `await stripe.createTokenWithCard(...)`
* a token returned by `await stripe.createTokenWithBankAccount(...)`

```js
try {
  const paymentMethod = await stripe.createPaymentMethod({
    card : {
      token : '1F70U2HbHFZUJkLLGyJ26n5rWDBfofzDJmdnal0dMrcEHTvKd',
    }
  })
} catch (e) {
  // Handle error
}
```

Here are the PropTypes that defines the shape of what can be provided to createPaymentMethod:
```js
{

  // Card properties:
  // - As an alternative to providing card PAN info, you can also provide a Stripe token:
  //   https://stripe.com/docs/api/payment_methods/create#create_payment_method-card
  card: PropTypes.oneOfType([
    PropTypes.shape({
      cvc: PropTypes.string,
      expMonth: PropTypes.number,
      expYear: PropTypes.number,
      number: PropTypes.string,
    }),
    PropTypes.shape({ token: PropTypes.string }),
  ]),
  
  // You can also attach billing information to a payment method
  billingDetails: PropTypes.shape({
    address: PropTypes.shape({
      city: PropTypes.string,
      country: PropTypes.string,
      line1: PropTypes.string,
      line2: PropTypes.string,
      postalCode: PropTypes.string,
      state: PropTypes.string,
    }),
    email: PropTypes.string,
    name: PropTypes.string,
    phone: PropTypes.string,
  }),
}
```



## Initiating a payment from the mobile app

To do this, make a call from your mobile app to [create a Payment Intent on your backend server](https://stripe.com/docs/api/payment_intents/create)
  * If you created the payment intent with `confirmation_method='manual'` then you're using
    a manual confirmation flow, and payment intents can only be confirmed from the backend
    using the secret key.  Jump to the [**... with manual confirmation**](#with-manual-confirmation) section
  * Otherwise, if you created the payment intent without specifying `confirmation_method` or
    by setting `confirmation_method='automatic'` then you are using an automatic 
    confirmation flow.  In this flow, you can confirm (process) the payment intent right from
    the mobile app, and webhooks sent by Stripe will notify your backend of success.  This is
    the preferred flow.
    Jump to the [**... with automatic confirmation**](#with-automatic-confirmation) section
       

### ... with manual confirmation
In this flow, follow these steps:
  * Obtain a PaymentMethod (either one saved to the customer or a new one as described in the [Creating a PaymentMethod](#creating-a-paymentmethod) section.),
  * Create a PaymentIntent on the backend, with the provided PaymentMethod and the amount.
    * set `confirmation_method=manual` when creating the intent
    * do **not** specify `off_session=true`, since these are steps for creating an on-session payment (a payment where the user is present).
  * Confirm the PaymentIntent on the backend.  If the PaymentIntent moves to a `succeeded` state, then that's it!  The payment was successful.
  * If the PaymentIntent status moves to `requires_action`, then return the `client_secret` of the PaymentIntent to the mobile app,
    along with the ID of the PaymentIntent.
  * Call `await stripe.authenticatePaymentIntent({ clientSecret: "..." })`, passing in the client_secret.
    This will launch an activity where the user can then authenticate the payment.
  * If the call above succeeds, then call your backend with the PaymentIntent ID, [Retrieve the PaymentIntent](https://stripe.com/docs/api/payment_intents/retrieve),
    and then [Confirm the PaymentIntent](https://stripe.com/docs/api/payment_intents/confirm).


### ... with automatic confirmation
In this flow, follow these steps:
  * Obtain a PaymentMethod (either one saved to the customer or a new one as described in the [Creating a PaymentMethod](#creating-a-paymentmethod) section.),
  * Create a PaymentIntent on the backend, with the provided PaymentMethod and the amount.
    * set `confirmation_method=automatic` when creating the intent (or omit it, since it is the default)
    * do **not** specify `off_session=true`, since these are steps for creating an on-session payment (a payment where the user is present).
  * Call `await stripe.confirmPaymentIntent({ ... })`, passing in the client_secret.
    If an authentication is needed then an activity will be launched where the user can then authenticate the payment.
    If the user authenticates, then the payment is confirmed automatically and the `stripe.confirmPaymentIntent` call
    resolves with the result, which includes the resulting status of the payment intent.
    The statuses in a [Payment Intent Lifecycle](https://stripe.com/docs/payments/intents) can be viewed through that link.
  * On your backend, you can listen for webhooks of the payment intent succeeding that will be sent by Stripe.


## You initiated a payment on the server that required authentication from the user 

In this scenario, you attempted to confirm a PaymentIntent on the server using a payment method
with `off_session=true`, however the payment required authentication.
The `/confirm` API call would fail and the PaymentIntent would transition to `status=requires_payment_method`.

At this stage the user needs to be brought back on-session, via an email or notification.  When
the user is brought into the app, you should, for the same PaymentIntent:

1) Present the option to attempt the payment using the same card, or to provide a new one.
2) Attach the selected card to the payment method to the PaymentIntent on the server side.
3) Handle the payment as though it were an on-session payment.  See the section [Initiating a payment from the mobile app](#initiating-a-payment-from-the-mobile-app)



## The user is saving a card for future use

When saving a card as a PaymentMethod to either bill a user later, or for the user to make purchases
with, we want to collect authentication up-front, if it's needed by the card, to minimize the chance
that we will need to interrupt them for authentication on future payments.  We can prepare the card
by using a SetupIntent.  Here are the steps:

1) Create a SetupIntent on the server (use `confirmation_method=automatic`) for the selected payment method.
2) Return the `client_secret` of the SetupIntent to the app.
3) Call `stripe.confirmSetupIntent()`.  This will prompt the user for authentication (if needed) and
finishes the setup.    
  
```js
try {
  const result = await stripe.confirmSetupIntent({
    clientSecret : "..."
  })
} catch (e) {
  // handle exception here
}
```
