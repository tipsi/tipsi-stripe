import { NativeModules } from 'react-native'
import checkArgs from './utils/checkArgs'
import processTheme from './utils/processTheme'
import * as types from './utils/types'

const { TPSStripeManager } = NativeModules

class Stripe {
  init = (options = {}) => {
    checkArgs(
      types.initOptionsPropTypes,
      options, 'options', 'Stripe.init'
    )
    return TPSStripeManager.init(options)
  }
  deviceSupportsApplePay = () => (
    TPSStripeManager.deviceSupportsApplePay()
  )
  canMakeApplePayPayments = (options = {}) => {
    checkArgs(
      types.canMakeApplePayPaymentsOptionsPropTypes,
      options, 'options', 'Stripe.canMakeApplePayPayments'
    )
    return TPSStripeManager.canMakeApplePayPayments(options)
  }
  paymentRequestWithApplePay = (items = [], options = {}) => {
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
  completeApplePayRequest = () => (
    TPSStripeManager.completeApplePayRequest()
  )
  cancelApplePayRequest = () => (
    TPSStripeManager.cancelApplePayRequest()
  )
  openApplePaySetup = () => (
    TPSStripeManager.openApplePaySetup()
  )
  paymentRequestWithCardForm = (options = {}) => {
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
    checkArgs(
      types.createTokenWithCardParamsPropTypes,
      params, 'params', 'Stripe.createTokenWithCard'
    )
    return TPSStripeManager.createTokenWithCard(params)
  }
  createTokenWithBankAccount = (params = {}) => {
    checkArgs(
      types.createTokenWithBankAccountParamsPropTypes,
      params, 'params', 'Stripe.createTokenWithBankAccount'
    )
    return TPSStripeManager.createTokenWithBankAccount(params)
  }
}

export default new Stripe()
