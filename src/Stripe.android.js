import { NativeModules } from 'react-native'
import checkArgs from './utils/checkArgs'
import checkInit from './utils/checkInit'
import * as types from './utils/types'

const { StripeModule } = NativeModules

class Stripe {
  stripeInitialized = false

  init = (options = {}) => {
    checkArgs(
      types.initOptionsPropTypes,
      options, 'options', 'Stripe.init'
    )
    this.stripeInitialized = true
    return StripeModule.init(options)
  }

  deviceSupportsAndroidPay = () => {
    checkInit(this)
    return StripeModule.deviceSupportsAndroidPay()
  }

  paymentRequestWithAndroidPay = (options = {}) => {
    checkInit(this)
    checkArgs(
      types.paymentRequestWithAndroidPayOptionsPropTypes,
      options, 'options', 'Stripe.paymentRequestWithAndroidPay'
    )
    return StripeModule.paymentRequestWithAndroidPay(options)
  }

  paymentRequestWithCardForm = (options = {}) => {
    checkInit(this)
    checkArgs(
      types.paymentRequestWithCardFormOptionsPropTypes,
      options, 'options', 'Stripe.paymentRequestWithCardForm'
    )
    return StripeModule.paymentRequestWithCardForm(options)
  }

  createTokenWithCard = (params = {}) => {
    checkInit(this)
    checkArgs(
      types.createTokenWithCardParamsPropTypes,
      params, 'params', 'Stripe.createTokenWithCard'
    )
    return StripeModule.createTokenWithCard(params)
  }

  createTokenWithBankAccount = (params = {}) => {
    checkInit(this)
    checkArgs(
      types.createTokenWithBankAccountParamsPropTypes,
      params, 'params', 'Stripe.createTokenWithBankAccount'
    )
    return StripeModule.createTokenWithBankAccount(params)
  }
}

export default new Stripe()
