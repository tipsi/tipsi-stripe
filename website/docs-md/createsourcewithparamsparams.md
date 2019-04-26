---
id: createsourcewithparamsparams
title: .createSourceWithParams(params) -> Promise
sidebar_label: .createSourceWithParams()
---

Creates source object based on params. Sources are used to create payments for a variety of [payment methods](https://stripe.com/docs/sources)

_NOTE_: For sources that require redirecting your customer to authorize the payment, you need to specify a return URL when you create the source. This allows your customer to be redirected back to your app after they have authorized the payment. For this return URL, you can either use a custom URL scheme or a universal link supported by your app.

##### iOS

For more information on registering and handling URLs in your app, refer to the Apple documentation:

* [Implementing Custom URL Schemes](https://developer.apple.com/library/content/documentation/iPhone/Conceptual/iPhoneOSProgrammingGuide/Inter-AppCommunication/Inter-AppCommunication.html#//apple_ref/doc/uid/TP40007072-CH6-SW10)
* [Supporting Universal Links](https://developer.apple.com/library/content/documentation/General/Conceptual/AppSearch/UniversalLinks.html)

You also need to setup your `AppDelegate.m` app delegate to forward URLs to the Stripe SDK according to the [official iOS implementation](https://stripe.com/docs/mobile/ios/sources#redirecting-your-customer).

##### Android

You have to declare your return url in application's `build.gradle` file.
In order to do that, add the following code replacing `CUSTOM_SCHEME` with the your custom scheme inside the `android.defaultConfig` block.

```groovy
android {
    // ...
    defaultConfig {
        // ...
        manifestPlaceholders = [
            tipsiStripeRedirectScheme: "CUSTOM_SCHEME"
        ]
    }
    // ...
}
```
> Example: if the return URL used is `my_custom_scheme://callback`, replace `CUSTOM_SCHEME` with `my_custom_scheme`.

**NOTE**: the redirection will be automatically handled by tipsi-stripe **on its own activity**.
If your app makes use of its own custom URL scheme for other purpose than handling stripe payments, make sure that the `CUSTOM_SCHEME` value is not exactly the same as the one used in the rest of the app.

> In such a case you might end up using `my_custom_scheme_tipsi://callback` as return URL and setting `CUSTOM_SCHEME` equal to `my_custom_scheme_tipsi`, following the previous example.

You also need to add into your application's manifest section with redirect activity:
```xml
<activity android:name=".RedirectUriReceiver">
  <intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="${tipsiStripeRedirectScheme}" tools:replace="android:scheme" />
  </intent-filter>
</activity>
```
This explicit designation of RedirectUriReceiver needs to override the default `example` redirect scheme, that has already been defined in the tipsi-stripe library.

You also need to add:
```
xmlns:tools="http://schemas.android.com/tools"
```
as an attribute into the root node of your manifest.

**NOTE**: This is **only** necessary if you are going to use Sources!


`params` — An object with the following keys:

**Depending on the type you need to provide different params. Check the STPSourceParams docs for reference.**

| Key | Type | Description |
| :--- | :--- | :--- |
| type (Required) | String | The type of the source to create. Can be one of: **bancontact ‖ card ‖ griopay ‖ ideal ‖ sepaDebit ‖ sofort ‖ threeDSecure ‖ alipay** |
| amount | Number | A positive number in the smallest currency unit representing the amount to charge the customer (e.g., 1099 for a €10.99 payment) |
| name | String | The full name of the account holder |
| returnURL | String | The URL the customer should be redirected to after they have successfully verified the payment |
| statementDescriptor | String | A custom statement descriptor for the payment |
| currency | String | The currency associated with the source. This is the currency for which the source will be chargeable once ready |
| email | String | The customer’s email address |
| bank | String | The customer’s bank |
| iban | String | The IBAN number for the bank account you wish to debit |
| addressLine1 | String | The bank account holder’s first address line (optional) |
| city | String | The bank account holder’s city |
| postalCode | String | The bank account holder’s postal code |
| country | String | The bank account holder’s two-letter country code (sepaDebit) or the country code of the customer’s bank (sofort) |
| card | String | The ID of the card source |

### Example

```js
const params = {
  type: 'alipay',
  amount: 5,
  currency: 'EUR',
  returnURL: 'example://stripe-redirect',
}

const source = await stripe.createSourceWithParams(params)

// Client specific code
// api.sendSourceToBackend(source)
```

![](https://user-images.githubusercontent.com/5305150/30137085-019fa90e-9362-11e7-9e6b-b934d6e68b60.gif)
