export function init(config: { publishableKey: string; merchantId?: string }): void;
export function paymentRequestWithCardForm(config: {
  smsAutofillDisabled?: boolean;
}): Promise<{ tokenId: string }>;
export function deviceSupportsApplePay(): Promise<boolean>;
export function canMakeApplePayPayments(): Promise<boolean>;
export interface Item {
  label: string;
  amount: string;
  type?: 'pending' | 'final';
}
export interface Options {}
export function paymentRequestWithApplePay(
  items: Item[],
  options?: Options,
): Promise<{ tokenId: string }>;
export function completeApplePayRequest(): Promise<void>;
export function cancelApplePayRequest(): Promise<void>;