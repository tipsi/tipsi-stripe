# tipsi-stripe

[![build status](https://img.shields.io/travis/itsmepetrov/redux-entities/master.svg?style=flat-square)](https://travis-ci.org/tipsi/tipsi-stripe)

React Native Stripe binding for Andriod/iOS platforms

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

#### Manual

Coming soon...

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

#### Apple Pay (iOS only)

```js
const items = [{
  label: 'Whisky',
  amount: '50.00',
}]

const shippingMethods = [{
  id: 'fedex',
  label: 'FedEX',
  detail: 'Test @ 10',
  amount: '10.00',
}]

const options = {
  requiredBillingAddressFields: 'all', // all|name|email|phone|postal_address or not specify to disable
  requiredShippingAddressFields: 'all', // all|name|email|phone|postal_address or not specify to disable
  shippingMethods,
}

const result = await stripe.paymentRequestWithApplePay(items, options)

// Client specific code
// api.sendTokenToBackend(result.token)

// You must complete the operation by calling
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

## API

Coming soon...

## Tests

#### Local CI

To run e2e tests for all platforms you can use `npm run ci` command. Before run this command you need to specify `PUBLISHABLE_KEY` and `MERCHANT_ID` environment variables:

```bash
PUBLISHABLE_KEY=<...> MERCHANT_ID=<...> npm run ci
```

#### Manual

Coming soon...

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
