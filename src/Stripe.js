import { NativeModules, Platform } from 'react-native'
import processTheme from './utils/processTheme'
import checkArgs from './utils/checkArgs'
import checkInit from './utils/checkInit'
import * as types from './utils/types'
import errorCodes from './errorCodes'
import deprecatedMethodsForInstance from './Stripe.deprecated'
/**
 * @typedef {Object} PaymentMethodAddress
 * @property {string} city
 * @property {string} country
 * @property {string} line1
 * @property {string} line2
 * @property {string} postalCode
 * @property {string} state
 */

/**
 * @typedef {Object} BillingDetails
 * @property {PaymentMethodAddress} address
 * @property {string} email
 * @property {string} name
 * @property {string} phone
 */

/**
 * @typedef {Object} PaymentMethod
 * @property {string} id
 * @property {number} created
 * @property {boolean} livemode
 * @property {string} type
 * @property {BillingDetails} billingDetails
 * @property {string} customerId
 */

/**
 * @typedef {Object} confirmPaymentMethodParams
 * @property {string} clientSecret
 * @property {createPaymentMethodParams} paymentMethod
 * @property {string} paymentMethodId
 * @property {string} sourceId
 * @property {string} returnURL
 * @property {boolean} savePaymentMethod
 */

/**
 * @typedef {Object} PaymentIntentConfirmationResult
 * @property {string} status
 * @property {string} paymentIntentId
 */

/**
 * @typedef {Object} createPaymentMethodParams
 * @property {string} id
 * @property {BillingDetails} billingDetails
 * @property {(PaymentMethodCardParams|string)} card - Token String or the Parameters to build a card
 * @property {Object} metadata
 * @property {string} customerId
 */

const { StripeModule } = NativeModules

class Stripe {
  stripeInitialized = false

  constructor() {
    // Mix in the deprecated methods
    Object.assign(this, deprecatedMethodsForInstance(this))
  }
  /**
   * @param options: {StripeOptions}
   * @returns {void}
   */
  setOptions = (options = {}) => {
    checkArgs(types.setOptionsOptionsPropTypes, options, 'options', 'Stripe.setOptions')

    this.stripeInitialized = true

    return StripeModule.init(options, errorCodes)
  }

  /**
   * @returns {Promise<boolean>}
   */
  deviceSupportsNativePay = () =>
    Platform.select({
      ios: () => this.deviceSupportsApplePay(),
      android: () => this.deviceSupportsAndroidPay(),
    })()

  // iOS requires networks array while Android requires nothing
  canMakeNativePayPayments = (options = {}) =>
    Platform.select({
      ios: () => this.canMakeApplePayPayments(options),
      android: () => this.canMakeAndroidPayPayments(),
    })()

  potentiallyAvailableNativePayNetworks = () =>
    Platform.select({
      ios: () => StripeModule.potentiallyAvailableNativePayNetworks(),
      // Android doesn't expose this information, so resolve empty array
      android: async () => {
        const canNativePay = await this.canMakeAndroidPayPayments()
        return canNativePay ? [] : null
      },
    })()

  paymentRequestWithNativePay(options = {}, items = []) {
    return Platform.select({
      ios: () => this.paymentRequestWithApplePay(items, options),
      android: () => this.paymentRequestWithAndroidPay(options),
    })()
  }

  // no corresponding android impl exists
  completeNativePayRequest = () =>
    Platform.select({
      ios: () => this.completeApplePayRequest(),
      android: () => Promise.resolve(),
    })()

  // no corresponding android impl exists
  cancelNativePayRequest = () =>
    Platform.select({
      ios: () => this.cancelApplePayRequest(),
      android: () => Promise.resolve(),
    })()

  // no corresponding android impl exists
  openNativePaySetup = () =>
    Platform.select({
      ios: () => this.openApplePaySetup(),
      android: () => Promise.resolve(),
    })()

  paymentRequestWithCardForm = (options = {}) => {
    checkInit(this)
    checkArgs(
      types.paymentRequestWithCardFormOptionsPropTypes,
      options,
      'options',
      'Stripe.paymentRequestWithCardForm'
    )
    return StripeModule.paymentRequestWithCardForm({
      ...options,
      theme: processTheme(options.theme),
    })
  }

  createTokenWithCard = (params = {}) => {
    checkInit(this)
    checkArgs(
      types.createTokenWithCardParamsPropTypes,
      params,
      'params',
      'Stripe.createTokenWithCard'
    )
    return StripeModule.createTokenWithCard(params)
  }

  createTokenWithBankAccount = (params = {}) => {
    checkInit(this)
    checkArgs(
      types.createTokenWithBankAccountParamsPropTypes,
      params,
      'params',
      'Stripe.createTokenWithBankAccount'
    )
    return StripeModule.createTokenWithBankAccount(params)
  }

  createSourceWithParams = (params = {}) => {
    checkInit(this)
    checkArgs(
      types.createSourceWithParamsPropType,
      params,
      'params',
      'Stripe.createSourceWithParams'
    )
    return StripeModule.createSourceWithParams(params)
  }

  /**
   * After calling this, you need to hit your backend with this method to get a clientSecret
   * @param {createPaymentMethodParams} params
   * @returns {Promise<PaymentMethod>}
   */
  createPaymentMethod = (params = {}) => {
    checkInit(this)
    checkArgs(types.createPaymentMethodPropType, params, 'params', 'Stripe.createPaymentMethod')
    return StripeModule.createPaymentMethod(params)
  }

  /**
   * Takes a previously created paymentMethodId or a new paymentMethod, and then generates a paymentIntent
   * @param {confirmPaymentMethodParams} params
   * @returns {Promise<PaymentIntentConfirmationResult>}
   */
  confirmPayment = (params = {}) => {
    checkInit(this)
    checkArgs(types.confirmPaymentPropType, params, 'params', 'Stripe.confirmPayment')
    return StripeModule.confirmPayment(params)
  }

  /**
   * @param {authenticatePaymentParams} params
   * @returns {Promise<todo>}
   */
  authenticatePayment = (params = {}) => {
    checkInit(this)
    checkArgs(types.authenticatePaymentPropType, params, 'params', 'Stripe.authenticatePayment')
    return StripeModule.authenticatePayment(params)
  }

  /**
   * @param {confirmSetupIntent} params
   * @returns {Promise<todo>}
   */
  confirmSetupIntent = (params = {}) => {
    checkInit(this)
    checkArgs(types.confirmSetupIntentPropType, params, 'params', 'Stripe.confirmSetupIntent')
    return StripeModule.confirmSetupIntent(params)
  }

  /**
   * Displays 3DSecure2 or other flows to authenticate a SetupIntent
   * @param {authenticateSetupParams} params
   * @returns {Promise<todo>}
   */
  authenticateSetup = (params = {}) => {
    checkInit(this)
    checkArgs(types.authenticateSetupPropType, params, 'params', 'Stripe.authenticateSetup')
    return StripeModule.authenticateSetup(params)
  }
}

export default new Stripe()
