import { NativeModules } from 'react-native'
import processTheme from './utils/processTheme'

const { TPSStripeManager } = NativeModules

class Stripe {
  init = (options: { publishableKey, merchantId } = {}) => {
    if (typeof publishableKey !== 'string') {
      throw new Error(
        'You need to provide `publishableKey` property. \n'+
        'See https://github.com/tipsi/tipsi-stripe#usage for more information'
      )
    }
    TPSStripeManager.init({ publishableKey, merchantId })
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
