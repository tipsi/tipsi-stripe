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

#### Running Apple Pay in a Real Device

In order to run Apple Pay on an Apple device (as opposed to a simulator), there's an extra step you need to complete in XCode. Without completing this step, Apple Pay will say that it is not supported - even if Apple Pay is set up correctly on the device.

Navigate to the Capabilities tab in your XCode project and turn Apple Pay on. Then, add your Apple Pay Merchant ID
to the 'Merchant IDs' section by clicking the '+' icon. Finally, make sure that the checkbox next to your merchant ID is blue and checked off.

![tipsiapplepay](https://user-images.githubusercontent.com/24738825/28348524-4bbd78e6-6bf2-11e7-97ed-b6e4b4ee0f0e.png)

### Android

#### react-native cli

Run `react-native link tipsi-stripe` so your project is linked against your Android project

#### Manual

In your `android/app/build.gradle` add:

```diff
...
dependencies {
  ...
+ compile project(':tipsi-stripe')
}
```

In your `android/settings.gradle` add:

```diff
...
+include ':tipsi-stripe'
+project(':tipsi-stripe').projectDir = new File(rootProject.projectDir, '../node_modules/tipsi-stripe/android')
```

In your `android/build.gradle` add:

```diff
...
allprojects {
  repositories {
    ...
+   maven { url "https://jitpack.io" }
  }
}
```

In your `android/app/src/main/java/com/%YOUR_APP_NAME%/MainApplication.java` add:

```diff
...
+ import com.gettipsi.stripe.StripeReactPackage;
...
protected List<ReactPackage> getPackages() {
  return Arrays.<ReactPackage>asList(
-   new MainReactPackage()
+   new MainReactPackage(),
+   new StripeReactPackage()
  );
}
```

Ensure that you have Google Play Services installed:

For `Genymotion` you can follow [these instructions](http://stackoverflow.com/questions/20121883/how-to-install-google-play-services-in-a-genymotion-vm-with-no-drag-and-drop-su/20137324#20137324).
For a physical device you need to search on Google for 'Google Play Services'. There will be a link that takes you to the `Play Store` and from there you will see a button to update it (do not search within the `Play Store`).

#### Android Pay

For using Android Pay in your `android/app/src/main/AndroidManifest.xml` add:


```diff
<application
...     
+  <meta-data
+    android:name="com.google.android.gms.wallet.api.enabled"
+    android:value="true" />
...
</application>
```

More information about Android Pay [deployment and testing](https://developers.google.com/android-pay/deployment).

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
  androidPayMode: 'test', // Optional, android only, 'production' by default
})
```

`androidPayMode` _String_ (Android only) - Corresponds to [WALLET_ENVIRONMENT](https://developers.google.com/android-pay/tutorial#about_constants
). Can be one of: `test|production`.

### Token

A token object returned from submitting payment details (via `paymentRequestWithApplePay`, `paymentRequestWithCardForm` and `createTokenWithCard`) to the Stripe API.

##### `token`

An object with the following keys:

* `tokenId` _String_ - The value of the token. You can store this value on your server and use it to make charges and customers.
* `created` _Number_ - When the token was created.
* `livemode` _Number_ - Whether or not this token was created in livemode. Will be `1` if you used your `Live Publishable Key`, and `0` if you used your `Test Publishable Key`.
* `card` _Object_ - The credit card details object that were used to create the token.
* `bankAccount` _Object_ - The external (bank) account details object that were used to create the token.
* `extra` _Object_  (iOS only)- An additional information that method can provide.

##### `card`

An object with the following keys:

* `cardId` _String_ - The Stripe ID for the card.
* `brand` _String_ - The card’s brand. Can be one of: `JCB`|`American Express`|`Visa`|`Discover`|`Diners Club`|`MasterCard`|`Unknown`.
* `funding` _String_ (iOS only) - The card’s funding. Can be one of: `debit`|`credit`|`prepaid`|`unknown`.
* `last4` _String_ - The last 4 digits of the card.
* `dynamicLast4` _String_ (iOS only) - For cards made with `Apple Pay`, this refers to the last 4 digits of the `Device Account Number` for the tokenized card.
* `isApplePayCard` _Bool_ (iOS only) - Whether or not the card originated from Apple Pay.
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

##### `bankAccount`

An object with the following keys:

* `routingNumber` _String_ - The routing number of this account.
* `accountNumber` _String_ - The account number for this BankAccount.
* `countryCode`  _String_ - The two-letter country code that this account was created in.
* `currency`  _String_ - The currency of this account.
* `accountHolderName` _String_ - The account holder's name.
* `accountHolderType` _String_ - the bank account type. Can be one of: `company`|`individual`.
* `fingerprint` _String_ - The account fingerprint.
* `bankName` _String_ - The name of bank.
* `last4` _String_ - The last four digits of the account number.

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
    addressZip: '37211',
  },
  bankAccount: {
    bankName: 'STRIPE TEST BANK',
    accountHolderType: 'company',
    last4: '6789',
    accountHolderName: 'Test holder name',
    currency: 'usd',
    fingerprint: 'afghsajhaartkjasd',
    countryCode: 'US',
    accountNumber: '424542424',
    routingNumber: '110000000',
  },
}
```

### Source

A source object returned from creating a source (via `createSourceWithParams`) with the Stripe API.

##### `source`

An object with the following keys:

* `amount` _Number_ - The amount associated with the source.
* `clientSecret` _String_ - The client secret of the source. Used for client-side polling using a publishable key.
* `created` _Number_ - When the source was created.
* `currency` _String_ - The currency associated with the source.
* `flow` _String_ - The authentication flow of the source. Can be one of: `none`|`redirect`|`verification`|`receiver`|`unknown`.
* `livemode` _Bool_ - Whether or not this source was created in livemode. Will be `true` if you used your `Live Publishable Key`, and `false` if you used your `Test Publishable Key`.
* `metadata` _Object_ - A set of key/value pairs associated with the source object.
* `owner` _Object_ - Information about the owner of the payment instrument.
* `receiver` _Object_ (Optional) - Information related to the receiver flow. Present if the source is a receiver.
* `redirect` _Object_ (Optional) - Information related to the redirect flow. Present if the source is authenticated by a redirect.
* `status` _String_ - The status of the source. Can be one of: `pending`|`chargable`|`consumed`|`cancelled`|`failed`.
* `type` _String_ - The type of the source. Can be one of: `bancontact`|`bitcoin`|`card`|`giropay`|`ideal`|`sepaDebit`|`sofort`|`threeDSecure`|`alipay`|`unknown`.
* `usage` _String_ - Whether this source should be reusable or not. Can be one of: `reusable`|`single`|`unknown`.
* `verification` _Object_ (Optional) - Information related to the verification flow. Present if the source is authenticated by a verification.
* `details` _Object_ - Information about the source specific to its type.
* `cardDetails` _Object_ (Optional) - If this is a card source, this property contains information about the card.
* `sepaDebitDetails` _Object_ (Optional) - If this is a SEPA Debit source, this property contains information about the sepaDebit.

##### `owner`

An object with the following keys:

* `address` _Object_ (Optional) - Owner’s address.
* `email` _String_ (Optional) - Owner’s email address.
* `name` _String_ (Optional) - Owner’s full name.
* `phone` _String_ (Optional) - Owner’s phone number.
* `verifiedAddress` _Object_ (Optional) - Verified owner’s address.
* `verifiedEmail` _String_ (Optional) - Verified owner’s email address.
* `verifiedName` _String_ (Optional) - Verified owner’s full name.
* `verifiedPhone` _String_ (Optional) - Verified owner’s phone number.

##### `receiver`

An object with the following keys:

* `address` _Object_ - The address of the receiver source. This is the value that should be communicated to the customer to send their funds to.
* `amountCharged` _Number_ - The total amount charged by you.
* `amountReceived` _Number_ - The total amount received by the receiver source.
* `amountReturned` _Number_ - The total amount that was returned to the customer.

##### `redirect`

An object with the following keys:

* `returnURL` _String_ - The URL you provide to redirect the customer to after they authenticated their payment.
* `status` _String_ - The status of the redirect. Can be one of: `pending`|`succeeded`|`failed`|`unknown`.
* `url` _String_ - The URL provided to you to redirect a customer to as part of a redirect authentication flow.

##### `verification`

An object with the following keys:

* `attemptsRemaining` _Number_ - The number of attempts remaining to authenticate the source object with a verification code.
* `status` _String_ - The status of the verification. Can be one of: `pending`|`succeeded`|`failed`|`unknown`.

##### `cardDetails`

An object with the following keys:

* `last4` _String_ - The last 4 digits of the card.
* `expMonth` _Number_ - The card’s expiration month. 1-indexed (i.e. 1 == January)
* `expYear` _Number_ - The card’s expiration year.
* `brand` _String_ - The issuer of the card. Can be one of: `JCB`|`American Express`|`Visa`|`Discover`|`Diners Club`|`MasterCard`|`Unknown`.
* `funding` _String_ (iOS only) - The funding source for the card. Can be one of: `debit`|`credit`|`prepaid`|`unknown`.
* `country` _String_ - Two-letter ISO code representing the issuing country of the card.
* `threeDSecure` _String_ Whether 3D Secure is supported or required by the card. Can be one of: `required`|`optional`|`notSupported`|`unknown`.

##### `sepaDebitDetails`

An object with the following keys:

* `last4` _String_ - The last 4 digits of the account number.
* `bankCode` _String_ - The account’s bank code.
* `country` _String_ - Two-letter ISO code representing the country of the bank account.
* `fingerprint` _String_ - The account’s fingerprint.
* `mandateReference` _String_ The reference of the mandate accepted by your customer.
* `mandateURL` _String_ - The details of the mandate accepted by your customer.

#### Example

```js
{
  livemode: false,
  amount: 50,
  owner: {},
  metadata: {},
  clientSecret: 'src_client_secret_BLnXIZxZprDmdhw3zv12123L',
  details: {
    native_url: null,
    statement_descriptor: null
  },
  type: 'alipay',
  redirect: {
    url: 'https://hooks.stripe.com/redirect/authenticate/src_1Az5vzE5aJKqY779Kes5s61m?client_secret=src_client_secret_BLnXIZxZprDmdhw3zv12123L',
    returnURL: 'example://stripe-redirect?redirect_merchant_name=example',
    status: 'succeeded'
  },
  usage: 'single',
  created: 1504713563,
  flow: 'redirect',
  currency: 'eur',
  status: 'chargable',
}
```

### Apple Pay (iOS only)

#### `openApplePaySetup()`

Opens the user interface to set up credit cards for Apple Pay.

#### `deviceSupportsApplePay() -> Promise`

Returns whether the user can make Apple Pay payments.
User may not be able to make payments for a variety of reasons. For example, this functionality may not be supported by their hardware, or it may be restricted by parental controls.
Returns `true` if the device supports making payments; otherwise, `false`.

_NOTE_: iOS Simulator always return `true`

#### `canMakeApplePayPayments([options]) -> Promise`

Returns whether the user can make Apple Pay payments with specified options.
If there are no configured payment cards, this method always returns `false`.
Return `true` if the user can make Apple Pay payments through any of the specified networks; otherwise, `false`.

_NOTE_: iOS Simulator always return `true`

##### `options`

An object with the following keys:

* `networks` _[String]_ (Array of String) - Indicates whether the user can make Apple Pay payments through the specified network. Available networks: `american_express`|`discover`|`master_card`|`visa`. If option does not specify we pass all available networks under the hood.

#### `paymentRequestWithApplePay(items, [options]) -> Promise`

Launch the `Apple Pay` view to accept payment.

##### `items`

An array of object with the following keys:

* `label` _String_ - A short, localized description of the item.
* `amount` _String_ - The summary item’s amount.

_NOTE_: The final item should represent your company; it'll be prepended with the word "Pay" (i.e. "Pay Tipsi, Inc $50")

##### `options`

An object with the following keys:

* `requiredBillingAddressFields` _Array\<String\>_ - A bit field of billing address fields that you need in order to process the transaction. Can be one of: `all`|`name`|`email`|`phone`|`postal_address` or not specify to disable.
* `requiredShippingAddressFields` _Array\<String\>_ - A bit field of shipping address fields that you need in order to process the transaction. Can be one of: `all`|`name`|`email`|`phone`|`postal_address` or not specify to disable.
* `shippingMethods` _Array_ - An array of `shippingMethod` objects that describe the supported shipping methods.
* `currencyCode` _String_ - The three-letter ISO 4217 currency code. Default `USD`.
* `countryCode` _String_ - The two-letter code for the country where the payment will be processed. Default `US`.

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
  requiredBillingAddressFields: ['all'],
  requiredShippingAddressFields: ['phone', 'postal_address'],
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

Launch the `Android Pay` view to accept payment.

##### `options`

An object with the following keys:

* `total_price` _String_ - Price of the item.
* `currency_code` _String_ - Three-letter ISO currency code representing the currency paid out to the bank account.
* `shipping_address_required` _Boolean_ (Optional) - Is shipping address menu required. Default `true`.
* `shipping_countries` _Array_ (Optional) - Set of country specifications that should be allowed for shipping. If omitted or an empty array is provided the API will default to using a country specification that only allows shipping in the US. Country code allowed in [ISO 3166-2](https://en.wikipedia.org/wiki/ISO_3166-2) format. 
* `line_items` _Array_ - Array of purchased items. Each item contains:
    * `currency_code` _String_ - Currency code string.
    * `description`  _String_ - Short description that will shown to user.
    * `total_price`  _String_ - Total order price.
    * `unit_price`  _String_ - Price per unit.
    * `quantity`  _String_ - Number of items.

#### Example

```js
const options = {
  total_price: '80.00',
  currency_code: 'USD',
  shipping_address_required: false,
  shipping_countries: ["US", "CA"],
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

Example of token:
```
{ card: 
  { currency: null,
    fingerprint: null,
    funding: "credit",
    brand: "MasterCard",
    number: null,
    addressState: null,
    country: "US",
    cvc: null,
    expMonth: 12,
    addressLine1: null,
    expYear: 2022,
    addressCountry: null,
    name: null,
    last4: "4448",
    addressLine2: null,
    addressCity: null,
    addressZip: null 
  },
  created: 1512322244000,
  used: false,
  extra: { 
    email: "randomemail@mail.com",
    billingContact: { 
      postalCode: "220019",
      name: "John Doe",
      locality: "NY",
      countryCode: "US",
      administrativeArea: "US",
      address1: "Time square 1/11" 
    },
    shippingContact: {} 
  },
  livemode: false,
  tokenId: "tok_1BV1IeDZwqOES60ZphBXBoDr" 
}
```
Where `billingContact` and `shippingContact` are representation of the[UserAddress](https://developers.google.com/android/reference/com/google/android/gms/identity/intents/model/UserAddress).

### Request with Card Form

#### `paymentRequestWithCardForm(options) -> Promise`

Launch `Add Card` view to to accept payment.

##### `options (iOS only)`

An object with the following keys:

* `requiredBillingAddressFields` _String_ - The billing address fields the user must fill out when prompted for their payment details. Can be one of: `full`|`zip` or not specify to disable.
* `prefilledInformation` _Object_ - You can set this property to pre-fill any information you’ve already collected from your user.
* `managedAccountCurrency` _String_ - Required to be able to add the card to an account (in all other cases, this parameter is not used). [More info](https://stripe.com/docs/api#create_card_token-card-currency).
* `theme` _Object_ - Can be used to visually style Stripe-provided UI.

##### `prefilledInformation`

An object with the following keys:

* `email` _String_ - The user’s email address.
* `phone` _String_ - The user’s phone number.
* `billingAddress` _Object_ - The user’s billing address. When set, the add card form will be filled with this address.

##### `billingAddress`

An object with the following keys:

* `name` _String_ - The user’s full name (e.g. "Jane Doe").
* `line1` _String_ - The first line of the user’s street address (e.g. "123 Fake St").
* `line2` _String_ - The apartment, floor number, etc of the user’s street address (e.g. "Apartment 1A").
* `city` _String_ - The city in which the user resides (e.g. "San Francisco").
* `state` _String_ - The state in which the user resides (e.g. "CA").
* `postalCode` _String_ - The postal code in which the user resides (e.g. "90210").
* `country` _String_ - The ISO country code of the address (e.g. "US").
* `phone` _String_ - The phone number of the address (e.g. "8885551212").
* `email` _String_ - The email of the address (e.g. "jane@doe.com").

##### `theme`

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
  requiredBillingAddressFields: 'full',
  prefilledInformation: {
    billingAddress: {
      name: 'Gunilla Haugeh',
      line1: 'Canary Place',
      line2: '3',
      city: 'Macon',
      state: 'Georgia',
      country: 'US',
      postalCode: '31217',
    },
  },
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
  // mandatory
  number: '4242424242424242',
  expMonth: 11,
  expYear: 17,
  cvc: '223',
  // optional
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

### Request with external (bank) account params object

#### `createTokenWithBankAccount(params) -> Promise`

Creates token based on external (bank) params.

##### `params`

An object with the following keys:

* `accountNumber` _String_ (Required) - The account number for this BankAccount.
* `countryCode`  _String_ (Required) - The two-letter country code that this account was created in.
* `currency`  _String_ (Required) - The currency of this account.
* `routingNumber` _String_ - The routing number of this account.
* `accountHolderName` _String_ - The account holder's name.
* `accountHolderType` _String_ - the bank account type. Can be one of: `company`|`individual`.

##### Example

![Bank Params Android](https://cloud.githubusercontent.com/assets/1286226/26419755/6c801f06-40c9-11e7-972e-521850eda2ef.gif)

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

### PaymentCardTextField component

A text field component specialized for collecting credit/debit card information. It manages multiple text fields under the hood to collect this information. It’s designed to fit on a single line.

#### Props
* `styles` _Object_ - Accepts all `View` styles, also support `color` param.
* `cursorColor` _String_ (IOS only) - The cursor color for the field.
* `textErrorColor` _String_ (IOS only) - The text color to be used when the user has entered invalid information, such as an invalid card number.
* `placeholderColor` _String_ (IOS only) - The text placeholder color used in each child field.
* `numberPlaceholder` _String_ - The placeholder for the card number field.
* `expirationPlaceholder` _String_ - The placeholder for the expiration field.
* `cvcPlaceholder` _String_ - The placeholder for the cvc field.
* `disabled` _Bool_ - Enable/disable selecting or editing the field. Useful when submitting card details to Stripe.
* `onChange` _Func_ - This function will be called each input change.
* `card` _Object_ - Accept a card object for the default value
  * `number` _String_ Credit card number.
  * `expMonth` _String_ Credit card month expiration.
  * `expYear` _String_ Credit card year expiration.
  * `cvc` _String_ Credit card CVC.
* `onParamsChange` _Func_ - This function will be called each input change, it takes two argumants:
  * `valid` _Bool_ - Whether or not the form currently contains a valid card number, expiration date, and CVC.
  * `params` _Object_ - Contains entered card params: `number`, `expMonth`, `expYear` and `cvc`.

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
        cvcPlaceholder={...}
        disabled={false}
        onParamsChange={this.handleFieldParamsChange}
      />
    )
  }
}
```

### Create source object with params

#### `createSourceWithParams(params) -> Promise`

Creates source object based on params. Sources are used to create payments for a variety of [payment methods](https://stripe.com/docs/sources)

_NOTE_: For sources that require redirecting your customer to authorize the payment, you need to specify a return URL when you create the source. This allows your customer to be redirected back to your app after they authorize the payment. For this return URL, you can either use a custom URL scheme or a universal link supported by your app.

##### iOS

For more information on registering and handling URLs in your app, refer to the Apple documentation:

* [Implementing Custom URL Schemes](https://developer.apple.com/library/content/documentation/iPhone/Conceptual/iPhoneOSProgrammingGuide/Inter-AppCommunication/Inter-AppCommunication.html#//apple_ref/doc/uid/TP40007072-CH6-SW10)
* [Supporting Universal Links](https://developer.apple.com/library/content/documentation/General/Conceptual/AppSearch/UniversalLinks.html)

You also need to setup your `AppDelegate.m` app delegate to forward URLs to the Stripe SDK according to the [official iOS implementation](https://stripe.com/docs/mobile/ios/sources#redirecting-your-customer)

##### Android

You have to declare your return url in application's `build.gradle` file.
In order to do that, add the following code replacing `CUSTOM_SCHEME` with the your custom scheme inside `android.defaultConfig` block.

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
> Example: if the return url used is `my_custom_scheme://callback`, replace `CUSTOM_SCHEME` with `my_custom_scheme`.

**NOTE**: the redirection will be automatically handled by tipsi-stripe **on its own activity**.
In case of your app makes use of its own custom URL scheme for other purpose rather than handling stripe payments, be sure that `CUSTOM_SCHEME` value is not exaclty the same that the one used in the rest of the app.

> In such case you might end up using `my_custom_scheme_tipsi://callback` as return URL and setting `CUSTOM_SCHEME` equals to `my_custom_scheme_tipsi`, following the previous example.

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
Thouse explicit designation of RedirectUriReceiver need to override default `example` redirect scheme, that has been already defined into tipsi-stripe library.

Also you need to add:
```xmlns:tools="http://schemas.android.com/tools" ``` as an attribute into the root node of your manifest.

**NOTE**: This is **only** necessary if you are going to use Sources!

##### `params`

An object with the following keys:
(Depending on the type you need to provide different params. Check the [STPSourceParams docs](https://stripe.github.io/stripe-ios/docs/Classes/STPSourceParams.html) for reference)

* `type` _String_ (Required) - The type of the source to create. Can be one of: `bancontact`|`bitcoin`|`card`|`giropay`|`ideal`|`sepaDebit`|`sofort`|`threeDSecure`|`alipay`.
* `amount` _Number_ - A positive number in the smallest currency unit representing the amount to charge the customer (e.g., 1099 for a €10.99 payment).
* `name` _String_ - The full name of the account holder.
* `returnURL` _String_ The URL the customer should be redirected to after they have successfully verified the payment.
* `statementDescriptor` _String_ A custom statement descriptor for the payment.
* `currency` _String_ - The currency associated with the source. This is the currency for which the source will be chargeable once ready.
* `email` _String_ - The customer’s email address.
* `bank` _String_ - The customer’s bank.
* `iban` _String_ - The IBAN number for the bank account you wish to debit.
* `addressLine1` _String_ - The bank account holder’s first address line (optional).
* `city` _String_ - The bank account holder’s city.
* `postalCode` _String_ - The bank account holder’s postal code.
* `country` _String_ - The bank account holder’s two-letter country code (`sepaDebit`) or the country code of the customer’s bank (`sofort`).
* `card` _String_ - The ID of the card source.

##### Example

![Source Params iOS](https://user-images.githubusercontent.com/5305150/30137085-019fa90e-9362-11e7-9e6b-b934d6e68b60.gif)

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

#### jest
To make jest work with tipsi-stripe, you should change `transformIgnorePatterns` in `package.json` file. Please refer to [here](https://facebook.github.io/jest/docs/tutorial-react-native.html#transformignorepatterns-customization)
```js
"jest": {
  "preset": "react-native",
  "transformIgnorePatterns": [
    "node_modules/(?!(jest-)?react-native|tipsi-stripe)"
  ]
}
```

## Example

To see more of the `tipsi-stripe` in action, you can check out the source in [example](https://github.com/tipsi/tipsi-stripe/tree/master/example) folder.

## License

tipsi-stripe is available under the MIT license. See the [LICENSE](https://github.com/tipsi/tipsi-stripe/tree/master/LICENSE) file for more info.
