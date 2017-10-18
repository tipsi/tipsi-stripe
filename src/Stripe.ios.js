import { NativeModules } from 'react-native'
import processTheme from './utils/processTheme'
import checkArgs from './utils/checkArgs'
import checkInit from './utils/checkInit'
import * as types from './utils/types'

const { TPSStripeManager } = NativeModules

class Stripe {
  stripeInitialized = false

  // Error domain
  TPSErrorDomain = TPSStripeManager.TPSErrorDomain

  // Error codes
  TPSErrorCodeApplePayNotConfigured = TPSStripeManager.TPSErrorCodeApplePayNotConfigured
  TPSErrorCodePreviousRequestNotCompleted = TPSStripeManager.TPSErrorCodePreviousRequestNotCompleted
  TPSErrorCodeUserCancel = TPSStripeManager.TPSErrorCodeUserCancel

  init = (options = {}) => {
    checkArgs(
      types.initOptionsPropTypes,
      options, 'options', 'Stripe.init'
    )
    this.stripeInitialized = true
    return TPSStripeManager.init(options)
  }

  deviceSupportsApplePay = () => {
    checkInit(this)
    return TPSStripeManager.deviceSupportsApplePay()
  }

  canMakeApplePayPayments = (options = {}) => {
    checkInit(this)
    checkArgs(
      types.canMakeApplePayPaymentsOptionsPropTypes,
      options, 'options', 'Stripe.canMakeApplePayPayments'
    )
    return TPSStripeManager.canMakeApplePayPayments(options)
  }

  paymentRequestWithApplePay = (items = [], options = {}) => {
    checkInit(this)
    checkArgs(
      types.paymentRequestWithApplePayItemsPropTypes,
      { items }, 'items', 'Stripe.paymentRequestWithApplePay'
    )
    checkArgs(
      types.paymentRequestWithApplePayOptionsPropTypes,
      options, 'options', 'Stripe.paymentRequestWithApplePay'
    )
    return TPSStripeManager.paymentRequestWithApplePay(items, options)
  }

  completeApplePayRequest = () => {
    checkInit(this)
    return TPSStripeManager.completeApplePayRequest()
  }

  cancelApplePayRequest = () => {
    checkInit(this)
    return TPSStripeManager.cancelApplePayRequest()
  }

  openApplePaySetup = () => {
    checkInit(this)
    return TPSStripeManager.openApplePaySetup()
  }

  paymentRequestWithCardForm = (options = {}) => {
    checkInit(this)
    checkArgs(
      types.paymentRequestWithCardFormOptionsPropTypes,
      options, 'options', 'Stripe.paymentRequestWithCardForm'
    )
    return TPSStripeManager.paymentRequestWithCardForm({
      ...options,
      theme: processTheme(options.theme),
    })
  }

  createTokenWithCard = (params = {}) => {
    checkInit(this)
    checkArgs(
      types.createTokenWithCardParamsPropTypes,
      params, 'params', 'Stripe.createTokenWithCard'
    )
    return TPSStripeManager.createTokenWithCard(params)
  }

  createTokenWithBankAccount = (params = {}) => {
    checkInit(this)
    checkArgs(
      types.createTokenWithBankAccountParamsPropTypes,
      params, 'params', 'Stripe.createTokenWithBankAccount'
    )
    return TPSStripeManager.createTokenWithBankAccount(params)
  }
}

export default new Stripe()
