import test from 'tape'
import checkArgs from '../checkArgs'
import {
  availableApplePayNetworks,
  availableApplePayAddressFields,
  availableApplePayShippingTypes,
  setOptionsOptionsPropTypes,
  availableApplePayNetworkPropTypes,
  canMakeApplePayPaymentsOptionsPropTypes,
  paymentRequestWithApplePayItemPropTypes,
  paymentRequestWithApplePayItemsPropTypes,
  applePayAddressFieldsPropTypes,
  applePayOptionShippingMethodPropTypes,
  paymentRequestWithApplePayOptionsPropTypes,
  paymentRequestWithCardFormOptionsPropTypes,
  createTokenWithCardParamsPropTypes,
  createTokenWithBankAccountParamsPropTypes,
  androidPayLineItemPropTypes,
  paymentRequestWithAndroidPayOptionsPropTypes,
  availableSourceTypes,
  createSourceWithParamsPropType,
} from '../types'

const checkPropTypes = (...args) => () => checkArgs(...args)

test('setOptionsOptionsPropTypes', (t) => {
  const passedProps = {
    publishableKey: 'publishableKey',
    merchantId: 'merchantId',
    androidPayMode: 'development',
  }

  t.doesNotThrow(checkPropTypes(setOptionsOptionsPropTypes, passedProps))

  t.end()
})

test('availableApplePayNetworkPropTypes', (t) => {
  const goodNetworks = availableApplePayNetworks

  // Good cases
  goodNetworks.forEach((network) => {
    t.doesNotThrow(
      checkPropTypes({ network: availableApplePayNetworkPropTypes }, { network }),
      `${network} is available ApplePay Network`
    )
  })

  // Bad cases
  const badNetworks = ['twitter', 'facebook', 'instagram', 'telegram']

  badNetworks.forEach((network) => {
    t.throws(
      checkPropTypes({ network: availableApplePayNetworkPropTypes }, { network }),
      `${network} should throws when check availableApplePayNetworks`
    )
  })

  t.end()
})

test('canMakeApplePayPaymentsOptionsPropTypes', (t) => {
  const passedProps = availableApplePayNetworks

  t.doesNotThrow(checkPropTypes(canMakeApplePayPaymentsOptionsPropTypes, passedProps))

  t.end()
})

test('paymentRequestWithApplePayItemPropTypes', (t) => {
  // Check bad value
  const badTypes = ['lol', 'kek']

  badTypes.forEach((type) => {
    const passedProps = {
      type,
      label: 'label',
      amount: 'amount',
    }

    t.throws(
      checkPropTypes(
        paymentRequestWithApplePayItemPropTypes,
        passedProps,
        'items',
        'Stripe.paymentRequestWithApplePay'
      ),
      `${type} should throws an error about bad type`
    )
  })

  const goodTypes = ['final', 'pending']

  // Check typo oneOf('final', 'pending')
  goodTypes.forEach((type) => {
    const passedProps = {
      type,
      label: 'label',
      amount: 'amount',
    }

    t.doesNotThrow(
      checkPropTypes(paymentRequestWithApplePayItemPropTypes, passedProps),
      'typeSpecs[typeSpecName] is not a function'
    )
  })

  t.end()
})

test('paymentRequestWithApplePayItemsPropTypes', (t) => {
  const types = ['final', 'pending']

  types.forEach((type) => {
    const passedProps = {
      items: [{
        type,
        label: 'label',
        amount: 'amount',
      }],
    }

    t.doesNotThrow(checkPropTypes(paymentRequestWithApplePayItemsPropTypes, passedProps))
  })

  t.end()
})

test('applePayAddressFieldsPropTypes', (t) => {
  const goodFields = availableApplePayAddressFields

  // Good cases
  goodFields.forEach((field) => {
    t.doesNotThrow(
      checkPropTypes({ field: applePayAddressFieldsPropTypes }, { field }),
      `${field} is available ApplePay address field`
    )
  })

  // Bad cases
  const badFields = ['home', 'flat', 'door', 'floor']

  badFields.forEach((field) => {
    t.throws(
      checkPropTypes({ field: applePayAddressFieldsPropTypes }, { field }),
      `${field} should throws when check availableApplePayAddressFields`
    )
  })

  t.end()
})

test('applePayOptionShippingMethodPropTypes', (t) => {
  const passedProps = {
    id: 'id',
    label: 'label',
    detail: 'detail',
    amount: 'amount',
  }

  t.doesNotThrow(checkPropTypes(applePayOptionShippingMethodPropTypes, passedProps))

  t.end()
})

test('paymentRequestWithApplePayOptionsPropTypes', (t) => {
  availableApplePayShippingTypes.forEach((shippingType) => {
    const passedProps = {
      currencyCode: 'currencyCode',
      countryCode: 'countryCode',
      requiredBillingAddressFields: availableApplePayAddressFields,
      requiredShippingAddressFields: availableApplePayAddressFields,
      shippingMethods: [{
        id: 'id',
        label: 'label',
        detail: 'detail',
        amount: 'amount',
      }],
      shippingType,
    }

    t.doesNotThrow(checkPropTypes(paymentRequestWithApplePayOptionsPropTypes, passedProps))
  })

  t.end()
})

test('paymentRequestWithCardFormOptionsPropTypes', (t) => {
  const billingAddressFields = ['full', 'zip']

  billingAddressFields.forEach((billingAddressField) => {
    const passedProps = {
      requiredBillingAddressFields: billingAddressField,
      smsAutofillDisabled: true,
      prefilledInformation: {
        email: 'email',
        phone: 'phone',
        billingAddress: {
          name: 'name',
          line1: 'line1',
          line2: 'line2',
          city: 'city',
          state: 'state',
          postalCode: 'postalCode',
          country: 'country',
          phone: 'phone',
          email: 'email',
        },
      },
      theme: {
        primaryBackgroundColor: 'primaryBackgroundColor',
        secondaryBackgroundColor: 'secondaryBackgroundColor',
        primaryForegroundColor: 'primaryForegroundColor',
        secondaryForegroundColor: 'secondaryForegroundColor',
        accentColor: 'accentColor',
        errorColor: 'errorColor',
      },
    }

    t.doesNotThrow(checkPropTypes(paymentRequestWithCardFormOptionsPropTypes, passedProps))
  })

  t.end()
})

test('createTokenWithCardParamsPropTypes', (t) => {
  const passedProps = {
    number: 'number',
    expMonth: 11,
    expYear: 20,
    cvc: 'cvc',
    name: 'name',
    addressLine1: 'addressLine1',
    addressLine2: 'addressLine2',
    addressCity: 'addressCity',
    addressState: 'addressState',
    addressZip: 'addressZip',
    addressCountry: 'addressCountry',
    country: 'country',
    currency: 'currency',

    // Android Only
    brand: 'brand',
    last4: 'last4',
    fingerprint: 'fingerprint',
    funding: 'funding',
  }

  t.doesNotThrow(checkPropTypes(createTokenWithCardParamsPropTypes, passedProps))

  t.end()
})

test('createTokenWithBankAccountParamsPropTypes', (t) => {
  const accountHolderTypes = ['company', 'individual']

  accountHolderTypes.forEach((accountHolderType) => {
    const passedProps = {
      accountNumber: 'accountNumber',
      countryCode: 'countryCode',
      currency: 'currency',
      routingNumber: 'routingNumber',
      accountHolderName: 'accountHolderName',
      accountHolderType,
    }

    t.doesNotThrow(checkPropTypes(createTokenWithBankAccountParamsPropTypes, passedProps))
  })

  t.end()
})

test('androidPayLineItemPropTypes', (t) => {
  const passedProps = {
    currency_code: 'currency_code',
    total_price: 'total_price',
    unit_price: 'unit_price',
    quantity: 'quantity',
    description: 'description',
  }

  t.doesNotThrow(checkPropTypes(androidPayLineItemPropTypes, passedProps))

  t.end()
})

test('paymentRequestWithAndroidPayOptionsPropTypes', (t) => {
  const passedProps = {
    total_price: 'total_price',
    currency_code: 'currency_code',
    line_items: [{
      currency_code: 'currency_code',
      total_price: 'total_price',
      unit_price: 'unit_price',
      quantity: 'quantity',
      description: 'description',
    }],
    shipping_address_required: false,
    billing_address_required: false,
  }

  t.doesNotThrow(checkPropTypes(paymentRequestWithAndroidPayOptionsPropTypes, passedProps))

  t.end()
})

test('createSourceWithParamsPropType', (t) => {
  availableSourceTypes.forEach((type) => {
    const passedProps = {
      type,
      amount: 100,
      name: 'name',
      returnURL: 'returnURL',
      statementDescriptor: 'statementDescriptor',
      email: 'email',
      bank: 'bank',
      iban: 'iban',
      addressLine1: 'addressLine1',
      city: 'city',
      postalCode: 'postalCode',
      country: 'country',
      card: 'card',
      number: 'number',
      expMonth: 11,
      expYear: 29,
      cvc: 'cvc',
      addressCity: 'addressCity',
      addressCountry: 'addressCountry',
      addressLine2: 'addressLine2',
      addressState: 'addressState',
      addressZip: 'addressZip',
      brand: 'brand',
      fingerprint: 'fingerprint',
      funding: 'funding',
      id: 'id',
      last4: 'last4',
    }

    t.doesNotThrow(
      checkPropTypes(createSourceWithParamsPropType, passedProps),
      null,
      `Type \`${type}\` should not throws`
    )
  })

  const wrongNumberProps = {
    type: 'card',
    number: 1234567890,
    expMonth: 11,
    expYear: 29,
    cvc: 'cvc',
  }

  t.throws(
    checkPropTypes(createSourceWithParamsPropType, wrongNumberProps),
    /Invalid .* `number` of type `number` supplied to .*, expected `string`\./,
    'With `card` type, `number` should be a string'
  )

  const wrongExpMonthProps = {
    type: 'card',
    number: 'number',
    expMonth: '10',
    expYear: 29,
    cvc: 'cvc',
  }

  t.throws(
    checkPropTypes(createSourceWithParamsPropType, wrongExpMonthProps),
    /Invalid .* `expMonth` of type `string` supplied to .*, expected `number`\./,
    'With `card` type, `expMonth` should be a number'
  )

  const wrongExpYearProps = {
    type: 'card',
    number: 'number',
    expMonth: 11,
    expYear: '19',
    cvc: 'cvc',
  }

  t.throws(
    checkPropTypes(createSourceWithParamsPropType, wrongExpYearProps),
    /Invalid .* `expYear` of type `string` supplied to .*, expected `number`\./,
    'With `card` type, `expYear` should be a number'
  )

  const wrongCvcProps = {
    type: 'card',
    number: 'number',
    expMonth: 11,
    expYear: 29,
    cvc: 123,
  }

  t.throws(
    checkPropTypes(createSourceWithParamsPropType, wrongCvcProps),
    /Invalid .* `cvc` of type `number` supplied to .*, expected `string`\./,
    'With `card` type, `cvc` should be a string'
  )

  t.end()
})
