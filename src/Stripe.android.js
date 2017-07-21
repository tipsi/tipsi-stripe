import { NativeModules } from 'react-native'
import checkArgs from './utils/checkArgs'
import * as types from './utils/types'

const { StripeModule } = NativeModules

class Stripe {
  init = (options = {}) => {
    checkArgs(
      types.initOptionsPropTypes,
      options, 'options', 'Stripe.init'
    )
    StripeModule.init(options)
  }
  deviceSupportsAndroidPay = () => (
    StripeModule.deviceSupportsAndroidPay()
  )
  paymentRequestWithAndroidPay = (options = {}) => {
    checkArgs(
      types.paymentRequestWithAndroidPayOptionsPropTypes,
      options, 'options', 'Stripe.paymentRequestWithAndroidPay'
    )
    StripeModule.paymentRequestWithAndroidPay(options)
  }
  paymentRequestWithCardForm = (options = {}) => {
    checkArgs(
      types.paymentRequestWithCardFormOptionsPropTypes,
      options, 'options', 'Stripe.paymentRequestWithCardForm'
    )
    StripeModule.paymentRequestWithCardForm(options)
  }
  createTokenWithCard = (params = {}) => {
    checkArgs(
      types.createTokenWithCardParamsPropTypes,
      options, 'options', 'Stripe.createTokenWithCard'
    )
    StripeModule.createTokenWithCard(params)
  }
  createTokenWithBankAccount = (params = {}) => {
    checkArgs(
      types.createTokenWithBankAccountParamsPropTypes,
      options, 'options', 'Stripe.createTokenWithBankAccount'
    )
    StripeModule.createTokenWithBankAccount(params)
  }
}

export default new Stripe()
