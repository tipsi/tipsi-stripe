# tipsi-stripe

[![npm version](https://img.shields.io/npm/v/tipsi-stripe.svg?style=flat-square)](https://www.npmjs.com/package/tipsi-stripe)
[![build status](https://img.shields.io/travis/tipsi/tipsi-stripe/master.svg?style=flat-square)](https://travis-ci.org/tipsi/tipsi-stripe)

React Native Stripe binding for iOS/Android platforms

## Requirements

### iOS

* Xcode 8+
* iOS 10+
* [CocoaPods](https://cocoapods.org) 1.1.1+

### Android

* SDK 17+

## Compatibility

This package is now built for React Native `0.40` or greater! If you need to support React Native < `0.40`, you should install this package `@1.4.0`.

## Installation

Run `npm install --save tipsi-stripe` to add the package to your app's dependencies.

### iOS

#### react-native cli

Run `react-native link tipsi-stripe` so your project is linked against your Xcode project and all CocoaPods dependencies are installed.

#### CocoaPods

1. Setup your `Podfile` like the included [example/ios/Podfile](example/ios/Podfile) then run `pod install`.
2. Open your project in Xcode workspace.
3. Drag the following folder into your project:
  * `node_modules/tipsi-stripe/ios/TPSStripe/`

#### Manual

1. Open your project in Xcode, right click on Libraries and click `Add Files to "Your Project Name"`.
2. Look under `node_modules/tipsi-stripe/ios` and add `TPSStripe.xcodeproj`.
3. Add `libTPSStripe.a` to `Build Phases` -> `Link Binary With Libraries`.
4. Click on `TPSStripe.xcodeproj` in Libraries and go the Build Settings tab. Double click the text to the right of `Header Search Paths` and verify that it has `$(SRCROOT)/../../react-native/React` as well as `${SRCROOT}/../../../ios/Pods/Headers/Public` - if they aren't, then add them. This is so Xcode is able to find the headers that the `TPSStripe` source files are referring to by pointing to the header files installed within the `react-native` `node_modules` directory.
5. Whenever you want to use it within React code now you can:
  * `import stripe from 'tipsi-stripe'`

### Android

#### react-native cli

Run `react-native link tipsi-stripe` so your project is linked against your Android project

#### Manual

In your `android/app/build.gradle` add:

```gradle
...
dependencies {
 ...
 compile project(':tipsi-stripe')
}
```

In your `android/settings.gradle` add:

```gradle
...
include ':tipsi-stripe'
project(':tipsi-stripe').projectDir = new File(rootProject.projectDir, '../node_modules/tipsi-stripe/android')
```

In your `android/build.gradle` add:

```gradle
...
allprojects {
    repositories {
...
        maven { url "https://jitpack.io" }
    }
}
```

Ensure that you have Google Play Services installed:

For `Genymotion` you can follow [these instructions](http://stackoverflow.com/questions/20121883/how-to-install-google-play-services-in-a-genymotion-vm-with-no-drag-and-drop-su/20137324#20137324).
For a physical device you need to search on Google for 'Google Play Services'. There will be a link that takes you to the `Play Store` and from there you will see a button to update it (do not search within the `Play Store`).

## Usage

Let's require `tipsi-stripe` module:

```js
import stripe from 'tipsi-stripe'
```

And initialize it with your Stripe credentials that you can get from [dashboard](https://dashboard.stripe.com). If you want to use `Apple Pay` you must provide your `Merchant ID`.

```js
stripe.init({
  publishableKey: 'PUBLISHABLE_KEY',
  merchantId: 'MERCHANT_ID', // Optional
})
```

### Token

A token object returned from submitting payment details (via `paymentRequestWithApplePay`, `paymentRequestWithCardForm` and `createTokenWithCard`) to the Stripe API.

##### `token`

An object with the following keys:

* `tokenId` _String_ - The value of the token. You can store this value on your server and use it to make charges and customers.
* `created` _Number_ - When the token was created.
* `livemode` _Number_ - Whether or not this token was created in livemode. Will be `1` if you used your `Live Publishable Key`, and `0` if you used your `Test Publishable Key`.
* `card` _Object_ - The credit card details object that were used to create the token.
* `extra` _Object_  (iOS only)- An additional information that method can provide.

##### `card`

An object with the following keys:

* `cardId` _String_ - The Stripe ID for the card.
* `brand` _String_ - The card’s brand. Can be one of: `JCB`|`American Express`|`Visa`|`Discover`|`Diners Club`|`MasterCard`|`Unknown`.
* `funding` _String_ (iOS only) - The card’s funding. Can be one of: `debit`|`credit`|`prepaid`|`unknown`.
* `last4` _String_ - The last 4 digits of the card.
* `dynamicLast4` _String_ (iOS only) - For cards made with `Apple Pay`, this refers to the last 4 digits of the `Device Account Number` for the tokenized card.
* `expMonth` _Number_ - The card’s expiration month. 1-indexed (i.e. 1 == January)
* `expYear` _Number_ - The card’s expiration year.
* `country` _String_ - Two-letter ISO code representing the issuing country of the card.
* `currency` _String_ - This is only applicable when tokenizing debit cards to issue payouts to managed accounts. The card can then be used as a transfer destination for funds in this currency.
* `name` _String_ - The cardholder’s name.
* `addressLine1` _String_ - The cardholder’s first address line.
* `addressLine2` _String_ - The cardholder’s second address line.
* `addressCity` _String_ - The cardholder’s city.
* `addressState` _String_ - The cardholder’s state.
* `addressCountry` _String_ - The cardholder’s country.
* `addressZip` _String_ - The cardholder’s zip code.

#### Example

```js
{
  tokenId: 'tok_19GCAQI5NuVQgnjeKNE32K0p',
  created: 1479236426,
  livemode: 0,
  card: {
    cardId: 'card_19GCAQI5NuVQgnjeRZizG4U3',
    brand: 'Visa',
    funding: 'credit',
    last4: '4242',
    expMonth: 4,
    expYear: 2024,
    country: 'US',
    name: 'Eugene Grissom',
    addressLine1: 'Green Street',
    addressLine2: '3380',
    addressCity: 'Nashville',
    addressState: 'Tennessee',
    addressCountry: 'US',
    addressZip: '37211'
  }
}
```

### Apple Pay (iOS only)

#### `openApplePaySetup()`

Opens the user interface to set up credit cards for Apple Pay.

#### `deviceSupportsApplePay() -> Promise`

Indicates whether or not the device supports Apple Pay. Returns a `Boolean` value.

#### `paymentRequestWithApplePay(items, [options]) -> Promise`

Launch the `Apple Pay` view to to accept payment.

##### `items`

An array of object with the following keys:

* `label` _String_ - A short, localized description of the item.
* `amount` _String_ - The summary item’s amount.

_NOTE_: The final item should represent your company; it'll be prepended with the word "Pay" (i.e. "Pay Tipsi, Inc $50")

##### `options`

An object with the following keys:

* `requiredBillingAddressFields` _String_ - A bit field of billing address fields that you need in order to process the transaction. Can be one of: `all`|`name`|`email`|`phone`|`postal_address` or not specify to disable.
* `requiredShippingAddressFields` _String_ - A bit field of shipping address fields that you need in order to process the transaction. Can be one of: `all`|`name`|`email`|`phone`|`postal_address` or not specify to disable.
* `shippingMethods` _Array_ - An array of `shippingMethod` objects that describe the supported shipping methods.

##### `shippingMethod`

An object with the following keys:

* `id` _String_ - A unique identifier for the shipping method, used by the app.
* `label` _String_ - A short, localized description of the shipping method.
* `detail` _String_ - A user-readable description of the shipping method.
* `amount` _String_ - The shipping method’s amount.

#### `completeApplePayRequest()/cancelApplePayRequest() -> Promise`

After `requiredBillingAddressFields` you should complete the operation by calling `completeApplePayRequest` or cancel if an error occurred.

#### Extra info

Token's `extra` field

##### `extra`

An object with the following keys:

* `shippingMethod` _Object_ - Selected `shippingMethod` object.
* `billingContact` _Object_ - The user's billing `contact` object.
* `shippingContact` _Object_ - The user's shipping `contact` object.

##### `contact`

An object with the following keys:

* `name` _String_ - The contact’s name.
* `phoneNumber` _String_ - The contact’s phone number.
* `emailAddress` _String_ - The contact’s email address.
* `street` _String_ - The street name in a postal address.
* `city` _String_ - The city name in a postal address.
* `state` _String_ - The state name in a postal address.
* `country` _String_ - The country name in a postal address.
* `ISOCountryCode` _String_ - The ISO country code for the country in a postal address.
* `postalCode` _String_ - The postal code in a postal address.
* `supplementarySubLocality` _String_ - The contact’s sublocality.

#### Example

![Apple Pay](https://cloud.githubusercontent.com/assets/1177226/20272773/008e5994-aaa0-11e6-8c24-b4bedf245741.gif)

```js
const items = [{
  label: 'Whisky',
  amount: '50.00',
}, {
  label: 'Tipsi, Inc'
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

const token = await stripe.paymentRequestWithApplePay(items, options)

// Client specific code
// api.sendTokenToBackend(token)

// You should complete the operation by calling
stripe.completeApplePayRequest()

// Or cancel if an error occurred
// stripe.cancelApplePayRequest()
```

### Android Pay (Android only)
(Under active development)

#### `deviceSupportsAndroidPay() -> Promise`

Indicates whether or not the device supports Android Pay. Returns a `Boolean` value.

#### `paymentRequestWithAndroidPay(options) -> Promise`

Launch the `Android Pay` view to to accept payment.

##### `options`

An object with the following keys:

* `price` _String_ - Price of the item.
* `currency` _String_ - Three-letter ISO currency code representing the currency paid out to the bank account.

#### Example

```js
const options = {
  total_price: '80.00',
  currency_code: 'USD',
  line_items: [{
    currency_code: 'USD',
    description: 'Whisky',
    total_price: '50.00',
    unit_price: '50.00',
    quantity: '1',
  }, {
    currency_code: 'USD',
    description: 'Vine',
    total_price: '30.00',
    unit_price: '30.00',
    quantity: '1',
  }],
}

const token = await stripe.paymentRequestWithAndroidPay(options)

// Client specific code
// api.sendTokenToBackend(token)
```

### Request with Card Form

#### `paymentRequestWithCardForm(options) -> Promise`

Launch `Add Card` view to to accept payment.

##### `options (iOS only)`

An object with the following keys:

* `requiredBillingAddressFields` _String_ - The billing address fields the user must fill out when prompted for their payment details. Can be one of: `full`|`zip` or not specify to disable.
* `smsAutofillDisabled` _Bool_ - When entering their payment information, users who have a saved card with Stripe will be prompted to autofill it by entering an SMS code. Set this property to `true` to disable this feature.
* `theme` _Object_ - Can be used to visually style Stripe-provided UI.

##### `theme (iOS only)`

An object with the following keys:

* `primaryBackgroundColor` _String_ - The primary background color of the theme.
* `secondaryBackgroundColor` _String_ - The secondary background color of this theme.
* `primaryForegroundColor` _String_ - The primary foreground color of this theme. This will be used as the text color for any important labels in a view with this theme (such as the text color for a text field that the user needs to fill out).
* `secondaryForegroundColor` _String_ - The secondary foreground color of this theme. This will be used as the text color for any supplementary labels in a view with this theme (such as the placeholder color for a text field that the user needs to fill out).
* `accentColor` _String_ - The accent color of this theme - it will be used for any buttons and other elements on a view that are important to highlight.
* `errorColor` _String_ - The error color of this theme - it will be used for rendering any error messages or view.

#### Example

![Card Form iOS](https://cloud.githubusercontent.com/assets/1177226/20274560/1432abf2-aaa6-11e6-8505-0cdc3017fe22.gif)
![Card Form Android](https://cloud.githubusercontent.com/assets/1177226/20572150/54192810-b1bb-11e6-9df6-5c068bf69904.gif)

```js
const options = {
  smsAutofillDisabled: true,
  requiredBillingAddressFields: 'full',
}

const token = await stripe.paymentRequestWithCardForm(options)

// Client specific code
// api.sendTokenToBackend(token)
```

### Request with card params object

#### `createTokenWithCard(params) -> Promise`

Creates token based on passed card params.

##### `params`

An object with the following keys:

* `number` _String_ (Required) - The card’s number.
* `expMonth` _Number_ (Required) - The card’s expiration month.
* `expYear` _Number_ (Required) - The card’s expiration year.
* `cvc` _String_ - The card’s security code, found on the back.
* `name` _String_ - The cardholder’s name.
* `addressLine1` _String_ - The first line of the billing address.
* `addressLine2` _String_ - The second line of the billing address.
* `addressCity` _String_ - City of the billing address.
* `addressState` _String_ - State of the billing address.
* `addressZip` _String_ - Zip code of the billing address.
* `addressCountry` _String_ - Country for the billing address.
* `brand` _String_ (Android only) - Brand of this card. Can be one of: `JCB`|`American Express`|`Visa`|`Discover`|`Diners Club`|`MasterCard`|`Unknown`.
* `last4` _String_ (Android only) - last 4 digits of the card.
* `fingerprint` _String_ (Android only) - The card fingerprint.
* `funding` _String_ (Android only) - The funding type of the card. Can be one of: `debit`|`credit`|`prepaid`|`unknown`.
* `country` _String_ (Android only) - ISO country code of the card itself.
* `currency` _String_ - Three-letter ISO currency code representing the currency paid out to the bank account. This is only applicable when tokenizing debit cards to issue payouts to managed accounts. You should not set it otherwise. The card can then be used as a transfer destination for funds in this currency.

##### Example

![Card Params iOS](https://cloud.githubusercontent.com/assets/1177226/20275232/cf0f8e3e-aaa8-11e6-85bf-5e093706ea0a.gif)
![Card Params Android](https://cloud.githubusercontent.com/assets/1177226/20572183/7a0a4824-b1bb-11e6-82f2-9b3f7038b1a9.gif)

```js
const params = {
  //mandatory
  number: '4242424242424242',
  expMonth: 11,
  expYear: 17,
  cvc: '223',
  //optional
  name: 'Test User',
  currency: 'usd',
  addressLine1: '123 Test Street',
  addressLine2: 'Apt. 5',
  addressCity: 'Test City',
  addressState: 'Test State',
  addressCountry: 'Test Country',
  addressZip: '55555',
}

const token = await stripe.createTokenWithCard(params)

// Client specific code
// api.sendTokenToBackend(token)
```

### PaymentCardTextField component

A text field component specialized for collecting credit/debit card information. It manages multiple text fields under the hood to collect this information. It’s designed to fit on a single line.

#### Props
* `styles` Object - Accepts all `View` styles, also support `color` param.
* `cursorColor` String (IOS only) - The cursor color for the field.
* `textErrorColor` String (IOS only) - The text color to be used when the user has entered invalid information, such as an invalid card number.
* `placeholderColor` String (IOS only)- The text placeholder color used in each child field.
* `numberPlaceholder` String - The placeholder for the card number field.
* `expirationPlaceholder` String - The placeholder for the expiration field.
* `cvcPlaceholder` String - The placeholder for the cvc field.
* `disabled` Bool(IOS only) - Enable/disable selecting or editing the field. Useful when submitting card details to Stripe.
* `enabled` Bool (Android only) - Enable/disable selecting or editing the field. Useful when submitting card details to Stripe.
* `onChange` Func - This function will be called each input change.
* `onParamsChange` Func - This function will be called each input change, it takes two argumants:
  * `valid` Bool - Whether or not the form currently contains a valid card number, expiration date, and CVC.
  * `params` Object - Contains entered card params: `number`, `expMonth`, `expYear` and `cvc`.

#### Initial params

To set inital params you can use `<instance>.setParams(params)` method which is available via `ref`.
For example, if you’re using another library to scan your user’s credit card with a camera, you can assemble that data into an object and set this property to that object to prefill the fields you’ve collected.

You can also access to `valid` and `params` info via `<instance>.valid` and `<instance>.params` respectively.

##### Example
![PaymentCardTextField iOS](https://cloud.githubusercontent.com/assets/1177226/20276457/60680ee8-aaad-11e6-834f-007909ce6814.gif)
![PaymentCardTextField Android](https://cloud.githubusercontent.com/assets/1177226/20572188/82ae5bf0-b1bb-11e6-97fe-fce360208130.gif)

```js
import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { PaymentCardTextField } from 'tipsi-stripe'

const styles = StyleSheet.create({
  field: {
    width: 300,
    color: '#449aeb',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
  }
})

class FieldExample extends Component {
  handleFieldParamsChange = (valid, params) => {
    console.log(`
      Valid: ${valid}
      Number: ${params.number || '-'}
      Month: ${params.expMonth || '-'}
      Year: ${params.expYear || '-'}
      CVC: ${params.cvc || '-'}
    `)
  }

  render() {
    return (
      <PaymentCardTextField
        style={styles.field}
        cursorColor={...}
        textErrorColor={...}
        placeholderColor={...}
        numberPlaceholder={...}
        expirationPlaceholder={...}
        cvcPlaceholder={...},
        disabled={false},
        onParamsChange={this.handleFieldParamsChange}
      />
    )
  }
}
```

## Tests

#### Local CI

To run `example` app e2e tests for all platforms you can use `npm run ci` command. Before run this command you need to specify `PUBLISHABLE_KEY` and `MERCHANT_ID` environment variables:

```bash
PUBLISHABLE_KEY=<...> MERCHANT_ID=<...> npm run ci
```

#### Manual

1. Go to example folder `cd example`
2. Install CocoaPods dependencies (iOS only) `pod install --project-directory=ios`
3. Install npm dependencies `npm install`
4. Configure project before build `PUBLISHABLE_KEY=<...> MERCHANT_ID=<...> npm run configure`
5. Build project:
  * `npm run build:ios` - for iOS
  * `npm run build:android` - for Android
  * `npm run build` - for both iOS and Android
6. Open Appium in other tab `npm run appium`
7. Run tests:
  * `npm run test:ios` - for iOS
  * `npm run test:android` - for Android
  * `npm run test` - for both iOS and Android

## Troubleshooting

#### Tests

You might encounter the following error while trying to run tests:

`An unknown server-side error occurred while processing the command. Original error: Command \'/bin/bash Scripts/bootstrap.sh -d\' exited with code 1`

You can fix it by installing `Carthage`:

```bash
brew install carthage
```

#### use_frameworks! issue

If you are using `CocoaPods` and `use_frameworks!` enabled in your `Podfile` you might get the [following error](https://github.com/tipsi/tipsi-stripe/issues/29):

`
fatal error: 'Stripe/Stripe.h' file not found
`

To solve this problem please be sure that `Stripe.framework` is added to `Link Binary` with `Libraries` section of `Build Phases` in `TPSStripe.xcodeproj`. If problem still persist, please try to clean your build folder and rebuild again.

![stripe_framework](https://cloud.githubusercontent.com/assets/1446268/23510226/1969c904-ff72-11e6-95b4-b918497b4d1b.png)

#### Android

* Using higher than [ours version](https://github.com/tipsi/tipsi-stripe/blob/master/android/build.gradle#L26) of Google Play Services in your project might encourage [an error](https://github.com/tipsi/tipsi-stripe/issues/18):
`NoClassDefFoundError: com.google.android.gms.wallet.MaskedWalletRequest`

We have fixed this issue, but if you somehow facing this bug again - please, create an issue or a pull request and we will take another look.

## Example

To see more of the `tipsi-stripe` in action, you can check out the source in [example](https://github.com/tipsi/tipsi-stripe/tree/master/example) folder.

## License

tipsi-stripe is available under the MIT license. See the [LICENSE](https://github.com/tipsi/tipsi-stripe/tree/master/LICENSE) file for more info.
