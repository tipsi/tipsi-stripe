declare module "tipsi-stripe" {
  interface StripeOptions {
    publishableKey: string;
    merchantId?: string;
    androidPayMode?: string;
  }

  type AccountHolderType = "company" | "individual";

  type ApplePayNetworks =
    | "american_express"
    | "discover"
    | "master_card"
    | "visa";

  type ApplePayAddressFields =
    | "all"
    | "name"
    | "email"
    | "phone"
    | "postal_address";

  type ApplePayShippingType =
    | "shipping"
    | "delivery"
    | "store_pickup"
    | "service_pickup";

  type StripeSourceType =
    | "bancontact"
    | "bitcoin"
    | "giropay"
    | "ideal"
    | "sepaDebit"
    | "sofort"
    | "threeDSecure"
    | "alipay";

  interface AppleNetworkOptions {
    networks: ApplePayNetworks;
  }

  interface ApplePaymentOptions {
    currencyCode: string;
    countryCode: string;
    requiredBillingAddressFields: ApplePayAddressFields[];
    requiredShippingAddressFields: ApplePayAddressFields[];
    shippingMethods: ApplePayShippingType[];
    shippingType: ApplePayShippingType;
  }

  interface AndroidPaymentOptions {
    total_price: string;
    currency_code: string;
    line_items: AndroidPaymentRequestItem[];
    shipping_address_required: boolean;
    billing_address_required: boolean;
  }

  export interface StripeCardDetails {
    cardId: string; //	The Stripe ID for the card
    brand:
      | "JCB"
      | "American Express"
      | "Visa"
      | "Discover"
      | "Diners Club"
      | "MasterCard"
      | "Unknown";
    funding?: "debit" | "credit" | "prepaid" | "unknown"; // iOS only
    last4: string;
    dynamicLast4: string; // For Apple Pay, this refers to the last 4 digits of the Device Account Number for the tokenized card
    isApplePayCard: boolean;
    expMonth: number; // The card’s expiration month. 1-indexed (i.e. 1 == January)
    expYear: number; //	The card’s expiration year
    country: string; // Two-letter ISO code representing the issuing country of the card
    currency?: string; // This is only applicable when tokenizing debit cards to issue payouts to managed accounts. The card can then be used as a transfer destination for funds in this currency
    name?: string; //	The cardholder’s name
    addressLine1?: string; //	The cardholder’s first address line
    addressLine2?: string; //	The cardholder’s second address line
    addressCity?: string; //	The cardholder’s city
    addressState?: string; //	The cardholder’s state
    addressCountry?: string; //	The cardholder’s country
    addressZip?: string; //	The cardholder’s zip code
  }

  interface StripeBankDetails {
    routingNumber: string; //	The routing number of this account
    accountNumber: string; //	The account number for this BankAccount.
    countryCode: string; //	The two-letter country code that this account was created in
    currency: string; //	The currency of this account
    accountHolderName: string; //	The account holder's name
    accountHolderType: AccountHolderType;
    fingerprint: string; //	The account fingerprint
    bankName: string; //	The name of bank
    last4: string; //	The last four digits of the account number
  }

  interface StripeToken {
    tokenId: string;
    created: number;
    livemode: boolean;
    card?: StripeCardDetails;
    bankAccount?: StripeBankDetails;
    extra?: object;
  }

  interface ApplePaymentRequestItem {
    label: string;
    amount: string;
    type: "final" | "pending";
  }

  interface AndroidPaymentRequestItem {
    currency_code: string;
    total_price: string;
    unit_price: string;
    quantity: string;
    description: string;
  }

  interface CardFormParams {
    requiredBillingAddressFields: "full" | "zip";
    managedAccountCurrency: string;
    smsAutofillDisabled: boolean;
    prefilledInformation: {
      email: string;
      phone: string;
      billingAddress: {
        name: string;
        line1: string;
        line2: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        phone: string;
        email: string;
      };
    };
    theme: {
      primaryBackgroundColor: string;
      secondaryBackgroundColor: string;
      primaryForegroundColor: string;
      secondaryForegroundColor: string;
      accentColor: string;
      errorColor: string;
    };
  }

  interface CardTokenParams {
    number: string;
    expMonth: number;
    expYear: number;
    cvc: string;
    name?: string;
    addressLine1?: string;
    addressLine2?: string;
    addressCity?: string;
    addressState?: string;
    addressZip?: string;
    addressCountry?: string;
    country?: string;
    currency?: string;

    // Android Only
    brand?: string;
    last4?: string;
    fingerprint?: string;
    funding?: string;
  }

  interface BankAccountParams {
    accountNumber: string;
    countryCode: string;
    currency: string;
    routingNumber: string;
    accountHolderName: string;
    accountHolderType: AccountHolderType;
  }

  interface SourceParams {
    type: StripeSourceType;
    amount: number;
    name: string;
    returnURL: string;
    statementDescriptor: string;
    currency: string;
    email: string;
    bank: string;
    iban: string;
    addressLine1: string;
    city: string;
    postalCode: string;
    country: string;
    card: string;
  }

  class Stripe {
    static setOptions(options: StripeOptions): void;

    static deviceSupportsNativePay(): boolean;
    static canMakeNativePayPayments(options?: AppleNetworkOptions): boolean;

    static paymentRequestWithNativePay(
      options: ApplePaymentOptions | AndroidPaymentOptions,
      items: ApplePaymentRequestItem[]
    ): Promise<string>;
    static completeNativePayRequest(): Promise<void>;
    static cancelNativePayRequest(): Promise<void>;
    static openNativePaySetup(): Promise<void>;

    static paymentRequestWithCardForm(
      params: CardFormParams
    ): Promise<StripeToken>;
    static createTokenWithCard(params: CardTokenParams): Promise<StripeToken>;
    static createTokenWithBankAccount(
      params: BankAccountParams
    ): Promise<StripeToken>;

    static createSourceWithParams(params: SourceParams): Promise<any>;
  }

  export default Stripe;
}
