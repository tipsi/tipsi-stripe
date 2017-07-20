import { NativeModules } from 'react-native'

const { StripeModule } = NativeModules

class Stripe {
  init = (options: { publishableKey, merchantId } = {}) => {
    if (typeof publishableKey !== 'string') {
      throw new Error(
        'You need to provide `publishableKey` property. \n'+
        'See https://github.com/tipsi/tipsi-stripe#usage for more information'
      )
    }

    StripeModule.init({ publishableKey, merchantId })
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
