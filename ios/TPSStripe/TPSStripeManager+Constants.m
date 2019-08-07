#import "TPSStripeManager+Constants.h"

#define TPSStripeMethodParamKeyDeclare(method, key) TPSStripeType(method) const TPSStripe_##method##Key_##key = @"" #key

TPSStripeMethodParamKeyDeclare(createPaymentMethod, id);
TPSStripeMethodParamKeyDeclare(createPaymentMethod, billingDetails);
TPSStripeMethodParamKeyDeclare(createPaymentMethod, card);
TPSStripeMethodParamKeyDeclare(createPaymentMethod, iDEAL);
TPSStripeMethodParamKeyDeclare(createPaymentMethod, metadata);
TPSStripeMethodParamKeyDeclare(createPaymentMethod, customerId);

TPSStripeMethodParamKeyDeclare(PaymentMethod, id);
TPSStripeMethodParamKeyDeclare(PaymentMethod, created);
TPSStripeMethodParamKeyDeclare(PaymentMethod, livemode);
TPSStripeMethodParamKeyDeclare(PaymentMethod, type);
TPSStripeMethodParamKeyDeclare(PaymentMethod, billingDetails);
TPSStripeMethodParamKeyDeclare(PaymentMethod, card);
TPSStripeMethodParamKeyDeclare(PaymentMethod, customerId);
TPSStripeMethodParamKeyDeclare(PaymentMethod, metadata);

TPSStripeMethodParamKeyDeclare(PaymentMethodCard, brand);
TPSStripeMethodParamKeyDeclare(PaymentMethodCard, country);
TPSStripeMethodParamKeyDeclare(PaymentMethodCard, expMonth);
TPSStripeMethodParamKeyDeclare(PaymentMethodCard, expYear); 
TPSStripeMethodParamKeyDeclare(PaymentMethodCard, funding);
TPSStripeMethodParamKeyDeclare(PaymentMethodCard, last4);

TPSStripeMethodParamKeyDeclare(PaymentMethodBillingDetails, address);
TPSStripeMethodParamKeyDeclare(PaymentMethodBillingDetails, email);
TPSStripeMethodParamKeyDeclare(PaymentMethodBillingDetails, name);
TPSStripeMethodParamKeyDeclare(PaymentMethodBillingDetails, phone);

TPSStripeMethodParamKeyDeclare(PaymentMethodAddress, city);
TPSStripeMethodParamKeyDeclare(PaymentMethodAddress, country);
TPSStripeMethodParamKeyDeclare(PaymentMethodAddress, line1);
TPSStripeMethodParamKeyDeclare(PaymentMethodAddress, line2);
TPSStripeMethodParamKeyDeclare(PaymentMethodAddress, postalCode);
TPSStripeMethodParamKeyDeclare(PaymentMethodAddress, state);

TPSStripeMethodParamKeyDeclare(CardParams, number);
TPSStripeMethodParamKeyDeclare(CardParams, expMonth);
TPSStripeMethodParamKeyDeclare(CardParams, expYear);
TPSStripeMethodParamKeyDeclare(CardParams, cvc);
TPSStripeMethodParamKeyDeclare(CardParams, currency);
TPSStripeMethodParamKeyDeclare(CardParams, name);
TPSStripeMethodParamKeyDeclare(CardParams, addressLine1);
TPSStripeMethodParamKeyDeclare(CardParams, addressLine2);
TPSStripeMethodParamKeyDeclare(CardParams, addressCity);
TPSStripeMethodParamKeyDeclare(CardParams, addressState);
TPSStripeMethodParamKeyDeclare(CardParams, addressCountry);
TPSStripeMethodParamKeyDeclare(CardParams, addressZip);

TPSStripeMethodParamKeyDeclare(confirmPayment, clientSecret);
TPSStripeMethodParamKeyDeclare(confirmPayment, paymentMethod);
TPSStripeMethodParamKeyDeclare(confirmPayment, paymentMethodId);
TPSStripeMethodParamKeyDeclare(confirmPayment, sourceId);
TPSStripeMethodParamKeyDeclare(confirmPayment, returnURL);
TPSStripeMethodParamKeyDeclare(confirmPayment, savePaymentMethod);

TPSStripeMethodParamKeyDeclare(authenticatePayment, clientSecret);
