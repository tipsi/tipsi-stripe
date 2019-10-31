import { NativeModules, Platform } from 'react-native'
import checkArgs from './utils/checkArgs'
import checkInit from './utils/checkInit'
import * as types from './utils/types'

const { StripeModule } = NativeModules

const deprecatedMethodsForInstance = (instance) => ({
  // @deprecated use deviceSupportsNativePay
  deviceSupportsAndroidPay: () => StripeModule.deviceSupportsAndroidPay(),

  // @deprecated use deviceSupportsNativePay
  deviceSupportsApplePay: () => StripeModule.deviceSupportsApplePay(),

  // @deprecated use canMakeNativePayPayments
  canMakeApplePayPayments: (options = {}) => {
    checkArgs(
      types.canMakeApplePayPaymentsOptionsPropTypes,
      options,
      'options',
      'Stripe.canMakeApplePayPayments'
    )
    return StripeModule.canMakeApplePayPayments(options)
  },

  // @deprecated use canMakeNativePayPayments
  canMakeAndroidPayPayments: () => StripeModule.canMakeAndroidPayPayments(),

  // @deprecated use paymentRequestWithNativePay
  paymentRequestWithAndroidPay: (options = {}) => {
    checkInit(instance)
    checkArgs(
      types.paymentRequestWithAndroidPayOptionsPropTypes,
      options,
      'options',
      'Stripe.paymentRequestWithAndroidPay'
    )
    return StripeModule.paymentRequestWithAndroidPay(options)
  },

  // @deprecated use paymentRequestWithNativePay
  paymentRequestWithApplePay: (items = [], options = {}) => {
    checkInit(instance)
    checkArgs(
      types.paymentRequestWithApplePayItemsPropTypes,
      { items },
      'items',
      'Stripe.paymentRequestWithApplePay'
    )
    checkArgs(
      types.paymentRequestWithApplePayOptionsPropTypes,
      options,
      'options',
      'Stripe.paymentRequestWithApplePay'
    )
    return StripeModule.paymentRequestWithApplePay(items, options)
  },

  // @deprecated use initiateNativePayRequest
  paymentRequestWithNativePay: (options = {}, items = []) => {
    return Platform.select({
      ios: () => instance.paymentRequestWithApplePay(items, options),
      android: () => instance.paymentRequestWithAndroidPay(options),
    })()
  },

  // @deprecated use completeNativePayRequest
  completeApplePayRequest: () => {
    checkInit(instance)
    return StripeModule.completeApplePayRequest()
  },

  // @deprecated use cancelNativePayRequest
  cancelApplePayRequest: () => {
    checkInit(instance)
    return StripeModule.cancelApplePayRequest()
  },

  // @deprecated use openNativePaySetup
  openApplePaySetup: () => StripeModule.openApplePaySetup(),

  createTokenWithCard: (params = {}) => {
    checkInit(instance)
    checkArgs(
      types.createTokenWithCardParamsPropTypes,
      params,
      'params',
      'Stripe.createTokenWithCard'
    )
    return StripeModule.createTokenWithCard(params)
  },

  createTokenWithBankAccount: (params = {}) => {
    checkInit(instance)
    checkArgs(
      types.createTokenWithBankAccountParamsPropTypes,
      params,
      'params',
      'Stripe.createTokenWithBankAccount'
    )
    return StripeModule.createTokenWithBankAccount(params)
  },

  createSourceWithParams: (params = {}) => {
    checkInit(instance)
    checkArgs(
      types.createSourceWithParamsPropType,
      params,
      'params',
      'Stripe.createSourceWithParams'
    )
    return StripeModule.createSourceWithParams(params)
  },
})

export default deprecatedMethodsForInstance
