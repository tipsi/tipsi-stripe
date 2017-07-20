import { NativeModules } from 'react-native'
import { initOptionsPropTypes } from './utils/types'
import checkPropTypes from './utils/checkPropTypes'

const { StripeModule } = NativeModules

class Stripe {
  init = (options = {}) => {
    checkPropTypes(initOptionsPropTypes, options, 'options', 'Stripe.init')
    StripeModule.init(options)
  }
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
  createTokenWithBankAccount = (params = {}) => (
    StripeModule.createTokenWithBankAccount(params)
  )
}

export default new Stripe()
