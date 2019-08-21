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

/* eslint-disable max-len */
/**
 * https://stripe.com/docs/api/payment_intents/object#payment_intent_object-status
 * @typedef {('unknown'|'canceled'|'processing'|'requires_action'|'requires_capture'|'requires_payment_method'|'requires_confirmation'|'succeeded')} StripePaymentIntentStatus
 */

/**
 * https://stripe.com/docs/api/setup_intents/object#setup_intent_object-status
 * @typedef {('unknown'|'canceled'|'processing'|'requires_action'|'requires_payment_method'|'requires_confirmation'|'succeeded')} StripeSetupIntentStatus
 */
/* eslint-enable max-len */

/**
 * @typedef {Object} PaymentMethodParamsCardByToken
 * @property {string} token - Token String
 */

/**
 * @typedef {Object} CreatePaymentMethodParams
 * @property {string} id
 * @property {BillingDetails} billingDetails
 * @property {(PaymentMethodCardParams|PaymentMethodParamsCardByToken)} card - the Parameters to build a card
 * @property {Object} metadata
 * @property {string} customerId
 */

/**
 * @typedef {Object} ConfirmPaymentIntentParams
 * @property {string} clientSecret
 * @property {CreatePaymentMethodParams} paymentMethod
 * @property {string} paymentMethodId
 * @property {string} sourceId
 * @property {string} returnURL
 * @property {boolean} savePaymentMethod
 */

/**
 * @typedef {Object} PaymentIntentConfirmationResult
 * @property {StripePaymentIntentStatus} status
 * @property {string} paymentIntentId
 */

/**
 * @typedef {Object} AuthenticatePaymentIntentParams
 * @property {string} clientSecret
 */

/**
 * @typedef {Object} PaymentIntentAuthenticationResult
 * @property {StripePaymentIntentStatus} status
 * @property {string} paymentIntentId
 */

/**
 * @typedef {Object} ConfirmSetupIntentParams
 * @property {string} clientSecret
 * @property {CreatePaymentMethodParams} paymentMethod
 * @property {string} paymentMethodId
 * @property {string} returnURL
 */

/**
 * @typedef {Object} SetupIntentConfirmationResult
 * @property {StripeSetupIntentStatus} status
 * @property {string} setupIntentId
 */

/**
 * @typedef {Object} AuthenticateSetupIntentParams
 * @property {string} clientSecret
 */

/**
 * @typedef {Object} SetupIntentAuthenticationResult
 * @property {StripeSetupIntentStatus} status
 * @property {string} setupIntentId
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
   * @param {CreatePaymentMethodParams} params
   * @returns {Promise<PaymentMethod>}
   */
  createPaymentMethod = (params = {}) => {
    checkInit(this)
    checkArgs(types.createPaymentMethodPropType, params, 'params', 'Stripe.createPaymentMethod')
    return StripeModule.createPaymentMethod(params)
  }

  /**
   * Takes a previously created paymentMethodId or a new paymentMethod, and then generates a paymentIntent
   * @param {ConfirmPaymentIntentParams} params
   * @returns {Promise<PaymentIntentConfirmationResult>}
   */
  confirmPaymentIntent = (params = {}) => {
    checkInit(this)
    checkArgs(types.confirmPaymentIntentPropType, params, 'params', 'Stripe.confirmPaymentIntent')
    return StripeModule.confirmPaymentIntent(params)
  }

  /**
   * @param {AuthenticatePaymentIntentParams} params
   * @returns {Promise<PaymentIntentAuthenticationResult>}
   */
  authenticatePaymentIntent = (params = {}) => {
    checkInit(this)
    checkArgs(
      types.authenticatePaymentIntentPropType,
      params,
      'params',
      'Stripe.authenticatePaymentIntent'
    )
    return StripeModule.authenticatePaymentIntent(params)
  }

  /**
   * @param {ConfirmSetupIntentParams} params
   * @returns {Promise<SetupIntentConfirmationResult>}
   */
  confirmSetupIntent = (params = {}) => {
    checkInit(this)
    checkArgs(types.confirmSetupIntentPropType, params, 'params', 'Stripe.confirmSetupIntent')
    return StripeModule.confirmSetupIntent(params)
  }

  /**
   * Displays 3DSecure2 or other flows to authenticate a SetupIntent
   * @param {AuthenticateSetupIntentParams} params
   * @returns {Promise<SetupIntentAuthenticationResult>}
   */
  /*

  DISABLED FOR NOW - you should be able to use confirmSetupIntent
  Will re-add if needed.

  authenticateSetupIntent = (params = {}) => {
    checkInit(this)
    checkArgs(
      types.authenticateSetupIntentPropType,
      params,
      'params',
      'Stripe.authenticateSetupIntent'
    )
    return StripeModule.authenticateSetupIntent(params)
  }
  */
}

export default new Stripe()
