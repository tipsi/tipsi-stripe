import { NativeEventEmitter, NativeModules } from 'react-native'
import processTheme from './utils/processTheme'
import checkArgs from './utils/checkArgs'
import checkInit from './utils/checkInit'
import * as types from './utils/types'
import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter'

const { TPSStripeManager } = NativeModules
const stripeEventEmitter = new NativeEventEmitter(TPSStripeManager);

class Stripe extends EventEmitter {
  stripeInitialized = false

  constructor() {

    super()

    if (TPSStripeManager) {

      // Error domain
      this.TPSErrorDomain = TPSStripeManager.TPSErrorDomain

      // Error codes
      this.TPSErrorCodeApplePayNotConfigured = TPSStripeManager.TPSErrorCodeApplePayNotConfigured
      this.TPSErrorCodePreviousRequestNotCompleted = TPSStripeManager.TPSErrorCodePreviousRequestNotCompleted
      this.TPSErrorCodeUserCancel = TPSStripeManager.TPSErrorCodeUserCancel
    }
  }

  setOptions = (options = {}) => {
    checkArgs(
      types.setOptionsOptionsPropTypes,
      options, 'options', 'Stripe.setOptions'
    )
    this.stripeInitialized = true
    return TPSStripeManager.init(options)
  }

  deviceSupportsApplePay = () => (
    TPSStripeManager.deviceSupportsApplePay()
  )

  canMakeApplePayPayments = (options = {}) => {
    checkArgs(
      types.canMakeApplePayPaymentsOptionsPropTypes,
      options, 'options', 'Stripe.canMakeApplePayPayments'
    )
    return TPSStripeManager.canMakeApplePayPayments(options)
  }

  paymentRequestWithApplePay = (items = [], options = {}) => {
    checkInit(this)
    checkArgs(
      types.paymentRequestWithApplePayItemsPropTypes,
      { items }, 'items', 'Stripe.paymentRequestWithApplePay'
    )
    checkArgs(
      types.paymentRequestWithApplePayOptionsPropTypes,
      options, 'options', 'Stripe.paymentRequestWithApplePay'
    )
    let eventEmitter = this;
    this.clearEventListeners();

    this.onShippingMethodChanged = stripeEventEmitter.addListener(
      'onShippingMethodChanged',
      (method) => { eventEmitter.emit('onShippingMethodChanged', method) }
    )
    this.onShippingContactChanged = stripeEventEmitter.addListener(
      'onShippingContactChanged',
      (contact) => { eventEmitter.emit('onShippingContactChanged', contact) }
    )
    return TPSStripeManager.paymentRequestWithApplePay(items, options)
  }

  updateSummaryItemsAndShippingMethods = ( items = [], methods = [], errors = [], callback = () => {}) => {
    checkInit(this)
    checkArgs(
      types.updateSummaryItemsPropTypes,
      items, 'items', 'Stripe.updateSummaryItemsAndShippingMethods'
    )
    checkArgs(
      types.updateShippingMethodsPropTypes,
      methods, 'methods', 'Stripe.updateSummaryItemsAndShippingMethods'
    )
    return TPSStripeManager.updateSummaryItems(items, methods, errors, callback)
  }

  clearEventListeners = () => {
    if (this.onShippingContactChanged) {
      this.onShippingContactChanged.remove();
      this.onShippingContactChanged = null;
    }
    if (this.onShippingMethodChanged) {
      this.onShippingMethodChanged.remove();
      this.onShippingMethodChanged = null;
    }
  }

  completeApplePayRequest = () => {
    checkInit(this)
    this.clearEventListeners();
    return TPSStripeManager.completeApplePayRequest()
  }

  cancelApplePayRequest = () => {
    checkInit(this)
    this.clearEventListeners();
    return TPSStripeManager.cancelApplePayRequest()
  }

  openApplePaySetup = () => (
    TPSStripeManager.openApplePaySetup()
  )

  paymentRequestWithCardForm = (options = {}) => {
    checkInit(this)
    checkArgs(
      types.paymentRequestWithCardFormOptionsPropTypes,
      options, 'options', 'Stripe.paymentRequestWithCardForm'
    )
    return TPSStripeManager.paymentRequestWithCardForm({
      ...options,
      theme: processTheme(options.theme),
    })
  }

  createTokenWithCard = (params = {}) => {
    checkInit(this)
    checkArgs(
      types.createTokenWithCardParamsPropTypes,
      params, 'params', 'Stripe.createTokenWithCard'
    )
    return TPSStripeManager.createTokenWithCard(params)
  }

  createTokenWithBankAccount = (params = {}) => {
    checkInit(this)
    checkArgs(
      types.createTokenWithBankAccountParamsPropTypes,
      params, 'params', 'Stripe.createTokenWithBankAccount'
    )
    return TPSStripeManager.createTokenWithBankAccount(params)
  }

  createSourceWithParams = (params = {}) => {
    checkInit(this)
    checkArgs(
      types.createSourceWithParamsPropType,
      params, 'params', 'Stripe.createSourceWithParams'
    )
    return TPSStripeManager.createSourceWithParams(params)
  }
}

export default new Stripe()
