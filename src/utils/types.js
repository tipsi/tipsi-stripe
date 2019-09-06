import PropTypes from 'prop-types'
import { Platform } from 'react-native'

export const availableApplePayNetworks = [
  'american_express',
  'cartes_bancaires',
  'china_union_pay',
  'discover',
  'eftpos',
  'electron',
  'elo',
  'id_credit',
  'interac',
  'jcb',
  'mada',
  'maestro',
  'master_card',
  'private_label',
  'quic_pay',
  'suica',
  'visa',
  'vpay',
]
export const availableApplePayAddressFields = ['all', 'name', 'email', 'phone', 'postal_address']
export const availableApplePayShippingTypes = [
  'shipping',
  'delivery',
  'store_pickup',
  'service_pickup',
]
export const availableSourceTypes = [
  'bancontact',
  'giropay',
  'ideal',
  'sepaDebit',
  'sofort',
  'threeDSecure',
  'alipay',
  'card',
]

/** Keys are lower-cased slug|string */
export const brandToBrandSlugMapping = {
  unknown: 'unknown',
  amex: 'amex',
  diners: 'diners',
  discover: 'discover',
  jcb: 'jcb',
  mastercard: 'mastercard',
  unionpay: 'unionpay',
  visa: 'visa',

  'american express': 'amex',
  'diners club': 'diners',
}
export const exactBrandSlugs = new Set(Object.values(brandToBrandSlugMapping))
/** Keys are lower-cased slug|string */
export const brandToPresentableBrandStringMapping = {
  unknown: 'Unknown',
  amex: 'American Express',
  diners: 'Diners Club',
  discover: 'Discover',
  jcb: 'JCB',
  mastercard: 'MasterCard',
  unionpay: 'UnionPay',
  visa: 'Visa',

  'american express': 'American Express',
  'diners club': 'Diners Club',
}
export const exactPresentableBrandStrings = new Set(
  Object.values(brandToPresentableBrandStringMapping)
)

export const setOptionsOptionsPropTypes = {
  publishableKey: PropTypes.string,
  merchantId: PropTypes.string,
  androidPayMode: PropTypes.string,
}

export const availableApplePayNetworkPropTypes = PropTypes.oneOf(availableApplePayNetworks)

export const canMakeApplePayPaymentsOptionsPropTypes = {
  networks: PropTypes.arrayOf(availableApplePayNetworkPropTypes),
}
export const potentiallyAvailableNativePayPaymentsOptionsPropTypes = Platform.select({
  ios: {
    networks: PropTypes.arrayOf(availableApplePayNetworkPropTypes),
  },
  android: {},
})

export const paymentRequestWithApplePayItemPropTypes = {
  label: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['final', 'pending']),
}

export const paymentRequestWithApplePayItemsPropTypes = {
  items: PropTypes.arrayOf(PropTypes.shape(paymentRequestWithApplePayItemPropTypes)).isRequired,
}

export const applePayAddressFieldsPropTypes = PropTypes.oneOf(availableApplePayAddressFields)

export const applePayOptionShippingMethodPropTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  detail: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
}

export const paymentRequestWithApplePayOptionsPropTypes = {
  currencyCode: PropTypes.string,
  countryCode: PropTypes.string,
  requiredBillingAddressFields: PropTypes.arrayOf(applePayAddressFieldsPropTypes),
  requiredShippingAddressFields: PropTypes.arrayOf(applePayAddressFieldsPropTypes),
  shippingMethods: PropTypes.arrayOf(PropTypes.shape(applePayOptionShippingMethodPropTypes)),
  shippingType: PropTypes.oneOf(availableApplePayShippingTypes),
}

export const paymentRequestWithCardFormOptionsPropTypes = {
  requiredBillingAddressFields: PropTypes.oneOf(['full', 'name', 'zip']),
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
  }),
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

export const androidPayLineItemPropTypes = {
  currency_code: PropTypes.string.isRequired,
  total_price: PropTypes.string.isRequired,
  unit_price: PropTypes.string.isRequired,
  quantity: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
}

export const paymentRequestWithAndroidPayOptionsPropTypes = {
  total_price: PropTypes.string.isRequired,
  currency_code: PropTypes.string.isRequired,
  line_items: PropTypes.arrayOf(PropTypes.shape(androidPayLineItemPropTypes)).isRequired,
  shipping_address_required: PropTypes.bool,
  billing_address_required: PropTypes.bool,
  email_address_required: PropTypes.bool,
}

export const createSourceWithParamsPropType = {
  type: PropTypes.oneOf(availableSourceTypes).isRequired,
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
  number: PropTypes.string,
  expMonth: PropTypes.number,
  expYear: PropTypes.number,
  cvc: PropTypes.string,
  addressCity: PropTypes.string,
  addressCountry: PropTypes.string,
  addressLine2: PropTypes.string,
  addressState: PropTypes.string,
  addressZip: PropTypes.string,
  brand: PropTypes.string,
  fingerprint: PropTypes.string,
  funding: PropTypes.string,
  id: PropTypes.string,
  last4: PropTypes.string,
}

// Corresponds to https://stripe.com/docs/api/payment_methods/create
export const createPaymentMethodPropType = {
  // BillingDetails properties:
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

  // TODO: Add documentation for metadata (supported on iOS and Android)
  metadata: PropTypes.object,
  // TODO: customerId support
}

const confirmPaymentIntentPropTypeBase = {
  clientSecret: PropTypes.string.isRequired,
  savePaymentMethod: PropTypes.bool,
  returnURL: PropTypes.string,
}
/**
 * One of the following may be provided
 * - paymentMethod
 * - paymentMethodId (any supported ID, including IDs for saved card sources)
 *
 * If you don't provide these, then you're required to attach the paymentMethod
 *  on your backend before you call this API.
 */
export const confirmPaymentIntentPropType = PropTypes.oneOfType([
  PropTypes.shape({
    ...confirmPaymentIntentPropTypeBase,
    paymentMethod: PropTypes.shape(createPaymentMethodPropType),
  }),
  PropTypes.shape({
    ...confirmPaymentIntentPropTypeBase,
    paymentMethodId: PropTypes.string,
  }),
]).isRequired

export const authenticatePaymentIntentPropType = {
  clientSecret: PropTypes.string.isRequired,
  returnURL: PropTypes.string,
}

const confirmSetupIntentPropTypeBase = {
  clientSecret: PropTypes.string.isRequired,
  returnURL: PropTypes.string,
}
/**
 * One of the following must be provided:
 * - paymentMethod
 * - paymentMethodId (any supported ID, including IDs for saved card sources)
 */
export const confirmSetupIntentPropType = PropTypes.oneOfType([
  PropTypes.shape({
    ...confirmSetupIntentPropTypeBase,
    paymentMethod: PropTypes.shape(createPaymentMethodPropType).isRequired,
  }),
  PropTypes.shape({
    ...confirmSetupIntentPropTypeBase,
    paymentMethodId: PropTypes.string.isRequired,
  }),
]).isRequired

export const authenticateSetupIntentPropType = {
  clientSecret: PropTypes.string.isRequired,
  returnURL: PropTypes.string,
}
