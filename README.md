# tipsi-stripe

[![build status](https://img.shields.io/travis/itsmepetrov/redux-entities/master.svg?style=flat-square)](https://travis-ci.org/tipsi/tipsi-stripe)

React Native Stripe binding for iOS/Andriod platforms

## Requirements

### iOS

* Xcode 8+
* iOS 10+
* [CocoaPods](https://cocoapods.org) 1.1.1+

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

## Usage

Let's require `tipsi-stripe` module:

```js
import stripe from 'tipsi-stripe'
```

And initialize it with your Stripe credentials that you can get from [dashboard](https://dashboard.stripe.com). If you want to use Apple Pay you must provide your Merchant ID.

```js
stripe.init({
  publishableKey: 'PUBLISHABLE_KEY',
  merchantId: 'MERCHANT_ID', // Optional
})
```

### Apple Pay (iOS only)

#### `paymentRequestWithApplePay(items, [options]) -> Promise`

Launch the Apple Pay view to to accept payment.

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

#### Example

![](https://cloud.githubusercontent.com/assets/1177226/20272773/008e5994-aaa0-11e6-8c24-b4bedf245741.gif)

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

const result = await stripe.paymentRequestWithApplePay(items, options)

// Client specific code
// api.sendTokenToBackend(result.token)

// You should complete the operation by calling
stripe.completeApplePayRequest()

// Or cancel if an error occurred
// stripe.cancelApplePayRequest()
```

#### Request with Card Form

```js
const total = '110.00'

const options = {
  smsAutofillDisabled: true,
  requiredBillingAddressFields: 'full', // full|zip or not specify to disable
}

const result = await stripe.paymentRequestWithCardForm(total, options)

// Client specific code
// api.sendTokenToBackend(result.token)
```

#### Request with card params object

```js
const params = {
  number: '4242424242424242',
  expMonth: 11,
  expYear: 17,
  cvc: '223',
  name: 'Test User', // Optional
  currency: 'usd', // Optional
}

const result = await stripe.createTokenWithCard(params)

// Client specific code
// api.sendTokenToBackend(result.token)
```

#### PaymentCardTextField component (iOS only)

```js
import { PaymentCardTextField } from 'tipsi-stripe'

const style = {
  width: 300,
  color: '#449aeb',
  borderColor: '#000',
  borderWidth: 1,
  borderRadius: 5,
}

const handleFieldParamsChange = (valid, params) => {
  console.log(`
    Valid: ${valid}
    Number: ${params.number || '-'}
    Month: ${params.expMonth || '-'}
    Year: ${params.expYear || '-'}
    CVC: ${params.cvc || '-'}
  `)
}

<PaymentCardTextField
  style={style}
  cursorColor={...}
  textErrorColor={...}
  placeholderColor={...}
  numberPlaceholder={...}
  expirationPlaceholder={...}
  cvcPlaceholder={...},
  disabled={false},
  onParamsChange={handleFieldParamsChange}
/>
```

## Tests

#### Local CI

To run e2e tests for all platforms you can use `npm run ci` command. Before run this command you need to specify `PUBLISHABLE_KEY` and `MERCHANT_ID` environment variables:

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

#### Troubleshooting

You might encounter the following error while trying to run tests:

`An unknown server-side error occurred while processing the command. Original error: Command \'/bin/bash Scripts/bootstrap.sh -d\' exited with code 1`

You can fix it by installing `Carthage`:

```bash
brew install carthage
```

## Example

To see more of the `tipsi-stripe` in action, you can check out the source in [example](https://github.com/tipsi/tipsi-stripe/tree/master/example) folder.

## License

tipsi-stripe is available under the MIT license. See the [LICENSE](https://github.com/tipsi/tipsi-stripe/tree/master/LICENSE) file for more info.
