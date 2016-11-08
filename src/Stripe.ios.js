import { NativeModules } from 'react-native'
import processTheme from './processTheme'

const { TPSStripeManager } = NativeModules

class Stripe {
  init = (options = {}) => (
    TPSStripeManager.init(options)
  )
  deviceSupportsApplePay = () => (
    TPSStripeManager.deviceSupportsApplePay()
  )
  paymentRequestWithApplePay = (items = [], options = {}) => (
    TPSStripeManager.paymentRequestWithApplePay(items, options)
  )
  completeApplePayRequest = () => (
    TPSStripeManager.completeApplePayRequest()
  )
  paymentRequestWithCardForm = (price = '0', options = {}) => (
    TPSStripeManager.paymentRequestWithCardForm(price, {
      ...options,
      theme: processTheme(options.theme),
    })
  )
  createTokenWithCard = (params = {}, options = {}) => (
    TPSStripeManager.createTokenWithCard(params, options)
  )
}

export default new Stripe()
