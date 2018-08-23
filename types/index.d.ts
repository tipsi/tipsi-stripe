// TypeScript Version: 2.1

export interface StripeConfig {
  publishableKey: string
  merchantId?: string
  androidPayMode?: string
}

export interface ApplePayItem {
  label: string
  amount: string
  type?: "pending" | "final"
}

declare class Stripe {
  constructor(config?: string)

  setOptions(options: StripeConfig): void

  paymentRequestWithCardForm(config: { smsAutofillDisabled?: boolean }): Promise<{ tokenId: string }>

  paymentRequestWithApplePay(items: ApplePayItem[], options?: any): Promise<{ tokenId: string }>

  deviceSupportsApplePay(): Promise<boolean>
  canMakeApplePayPayments(): Promise<boolean>

  completeApplePayRequest(): Promise<void>
  cancelApplePayRequest(): Promise<void>
}

declare const instanceOfStripe: Stripe
export default instanceOfStripe
