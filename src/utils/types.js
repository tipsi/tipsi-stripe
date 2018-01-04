import PropTypes from 'prop-types'

const availableApplePayNetworks = ['american_express', 'discover', 'master_card', 'visa']
const availableApplePayAddressFields = ['all', 'name', 'email', 'phone', 'postal_address']

export const initOptionsPropTypes = {
  publishableKey: PropTypes.string.isRequired,
  merchantId: PropTypes.string,
  androidPayMode: PropTypes.string,
}

export const canMakeApplePayPaymentsOptionsPropTypes = {
  networks: PropTypes.arrayOf(PropTypes.oneOf(availableApplePayNetworks)),
}

export const paymentRequestWithApplePayItemsPropTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    amount: PropTypes.string.isRequired,
  })),
}

export const paymentRequestWithApplePayOptionsPropTypes = {
  currencyCode: PropTypes.string,
  countryCode: PropTypes.string,
  requiredBillingAddressFields: PropTypes.arrayOf(PropTypes.oneOf(availableApplePayAddressFields)),
  requiredShippingAddressFields: PropTypes.arrayOf(PropTypes.oneOf(availableApplePayAddressFields)),
  shippingMethods: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    detail: PropTypes.string.isRequired,
    amount: PropTypes.string.isRequired,
  })),
}

export const paymentRequestWithCardFormOptionsPropTypes = {
  requiredBillingAddressFields: PropTypes.oneOf(['full', 'zip']),
  managedAccountCurrency: PropTypes.string,
  smsAutofillDisabled: PropTypes.bool,
  prefilledInformation: PropTypes.shape({
    email: PropTypes.string,
    phone: PropTypes.string,
    billingAddress: PropTypes.shape({
      name: PropTypes.string,
      line1: PropTypes.string,
      line2: PropTypes.string,
      city: PropTypes.string,
      state: PropTypes.string,
      postalCode: PropTypes.string,
      country: PropTypes.string,
      phone: PropTypes.string,
      email: PropTypes.string,
    }),
  }),
  theme: PropTypes.shape({
    primaryBackgroundColor: PropTypes.string,
    secondaryBackgroundColor: PropTypes.string,
    primaryForegroundColor: PropTypes.string,
    secondaryForegroundColor: PropTypes.string,
    accentColor: PropTypes.string,
    errorColor: PropTypes.string,
  })
}

export const createTokenWithCardParamsPropTypes = {
  number: PropTypes.string.isRequired,
  expMonth: PropTypes.number.isRequired,
  expYear: PropTypes.number.isRequired,
  cvc: PropTypes.string,
  name: PropTypes.string,
  addressLine1: PropTypes.string,
  addressLine2: PropTypes.string,
  addressCity: PropTypes.string,
  addressState: PropTypes.string,
  addressZip: PropTypes.string,
  addressCountry: PropTypes.string,
  country: PropTypes.string,
  currency: PropTypes.string,

  // Android Only
  brand: PropTypes.string,
  last4: PropTypes.string,
  fingerprint: PropTypes.string,
  funding: PropTypes.string,
}

export const createTokenWithBankAccountParamsPropTypes = {
  accountNumber: PropTypes.string.isRequired,
  countryCode: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  routingNumber: PropTypes.string,
  accountHolderName: PropTypes.string,
  accountHolderType: PropTypes.oneOf(['company', 'individual']),
}

export const paymentRequestWithAndroidPayOptionsPropTypes = {
  total_price: PropTypes.string.isRequired,
  currency_code: PropTypes.string.isRequired,
  shipping_address_required: PropTypes.bool,
  line_items: PropTypes.array.isRequired,
}

export const createSourceWithParamsPropType = {
  type: PropTypes.oneOf(['bancontact', 'bitcoin', 'giropay', 'ideal', 'sepaDebit', 'sofort', 'threeDSecure', 'alipay']).isRequired,
  amount: PropTypes.number,
  name: PropTypes.string,
  returnURL: PropTypes.string,
  statementDescriptor: PropTypes.string,
  currency: PropTypes.string,
  email: PropTypes.string,
  bank: PropTypes.string,
  iban: PropTypes.string,
  addressLine1: PropTypes.string,
  city: PropTypes.string,
  postalCode: PropTypes.string,
  country: PropTypes.string,
  card: PropTypes.string,
}
