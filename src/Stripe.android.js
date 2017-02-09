import { NativeModules } from 'react-native'

const { StripeModule } = NativeModules

class Stripe {
  init = (options = {}) => (
    StripeModule.init(options)
  )
  deviceSupportsAndroidPay = () => (
    StripeModule.deviceSupportsAndroidPay()
  )
  paymentRequestWithAndroidPay = (options = {}) => (
    StripeModule.paymentRequestWithAndroidPay(options)
  )
  paymentRequestWithCardForm = (options = {}) => (
    StripeModule.paymentRequestWithCardForm(options)
  )
  createTokenWithCard = (params = {}) => (
    StripeModule.createTokenWithCard(params)
  )
}

export default new Stripe()
