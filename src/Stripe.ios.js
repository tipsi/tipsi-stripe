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
  paymentRequestWithCardForm = (options = {}) => (
    TPSStripeManager.paymentRequestWithCardForm({
      ...options,
      theme: processTheme(options.theme),
    })
  )
  createTokenWithCard = (params = {}) => (
    TPSStripeManager.createTokenWithCard(params)
  )
}

export default new Stripe()
