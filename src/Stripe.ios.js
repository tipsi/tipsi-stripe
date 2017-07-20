import { NativeModules } from 'react-native'
import PropTypes from 'prop-types'
import processTheme from './utils/processTheme'
import initOptionsPropTypes from './utils/types'

const { TPSStripeManager } = NativeModules

class Stripe {
  init = (options = {}) => {
    PropTypes.checkPropTypes(
      initOptionsPropTypes,
      options,
      'options',
      'Stripe.init'
    )
    TPSStripeManager.init(options)
  }
  deviceSupportsApplePay = () => (
    TPSStripeManager.deviceSupportsApplePay()
  )
  canMakeApplePayPayments = (options = {}) => (
    TPSStripeManager.canMakeApplePayPayments(options)
  )
  paymentRequestWithApplePay = (items = [], options = {}) => (
    TPSStripeManager.paymentRequestWithApplePay(items, options)
  )
  completeApplePayRequest = () => (
    TPSStripeManager.completeApplePayRequest()
  )
  cancelApplePayRequest = () => (
    TPSStripeManager.cancelApplePayRequest()
  )
  paymentRequestWithCardForm = (options = {}) => (
    TPSStripeManager.paymentRequestWithCardForm({
      ...options,
      theme: processTheme(options.theme),
    })
  )
  createTokenWithCard = (params = {}) => (
    TPSStripeManager.createTokenWithCard(params)
  )
  openApplePaySetup = () => (
    TPSStripeManager.openApplePaySetup()
  )
  createTokenWithBankAccount = (params = {}) => (
    TPSStripeManager.createTokenWithBankAccount(params)
  )
}

export default new Stripe()
