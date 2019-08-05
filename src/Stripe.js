import { NativeModules, Platform } from 'react-native'
import processTheme from './utils/processTheme'
import checkArgs from './utils/checkArgs'
import checkInit from './utils/checkInit'
import * as types from './utils/types'
import errorCodes from './errorCodes'
import deprecatedMethodsForInstance from './Stripe.deprecated'

const { StripeModule } = NativeModules

class Stripe {
  stripeInitialized = false

  constructor() {
    // Mix in the deprecated methods
    Object.assign(this, deprecatedMethodsForInstance(this))
  }

  setOptions = (options = {}) => {
    checkArgs(types.setOptionsOptionsPropTypes, options, 'options', 'Stripe.setOptions')

    this.stripeInitialized = true

    return StripeModule.init(options, errorCodes)
  }

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

  createPaymentMethod = (params = {}) => {
    checkInit(this)
    checkArgs(types.createPaymentMethodPropType, params, 'params', 'Stripe.createPaymentMethod')
    return StripeModule.createPaymentMethod(params)
  }

  confirmPayment = (params = {}) => {
    checkInit(this)
    checkArgs(types.confirmPaymentPropType, params, 'params', 'Stripe.confirmPayment')
    return StripeModule.confirmPayment(params)
  }

  authenticatePayment = (params = {}) => {
    checkInit(this)
    checkArgs(types.authenticatePaymentPropType, params, 'params', 'Stripe.authenticatePayment')
    return StripeModule.authenticatePayment(params)
  }

  confirmSetupIntent = (params = {}) => {
    checkInit(this)
    checkArgs(types.confirmSetupIntentPropType, params, 'params', 'Stripe.confirmSetupIntent')
    return StripeModule.confirmSetupIntent(params)
  }

  authenticateSetup = (params = {}) => {
    checkInit(this)
    checkArgs(types.authenticateSetupPropType, params, 'params', 'Stripe.authenticateSetup')
    return StripeModule.authenticateSetup(params)
  }
}

export default new Stripe()
