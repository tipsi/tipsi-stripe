#import <Foundation/Foundation.h>

#define TPSStripeType(identifier) TPSStripe_##identifier##Key
#define TPSStripeParamTypeDefine(methodOrIdentifier) typedef NSString * TPSStripeType(methodOrIdentifier) NS_EXTENSIBLE_STRING_ENUM

#define TPSStripeMethodParamKeyDeclare(method, key) extern TPSStripeType(method) const TPSStripe_##method##Key_##key

TPSStripeParamTypeDefine(createPaymentMethod);
TPSStripeMethodParamKeyDeclare(createPaymentMethod, id);
TPSStripeMethodParamKeyDeclare(createPaymentMethod, billingDetails);
TPSStripeMethodParamKeyDeclare(createPaymentMethod, card);
//TPSStripeMethodParamKeyDeclare(createPaymentMethod, iDEAL);
TPSStripeMethodParamKeyDeclare(createPaymentMethod, metadata);
TPSStripeMethodParamKeyDeclare(createPaymentMethod, customerId);

TPSStripeParamTypeDefine(PaymentMethod);
TPSStripeMethodParamKeyDeclare(PaymentMethod, id);
TPSStripeMethodParamKeyDeclare(PaymentMethod, created);
TPSStripeMethodParamKeyDeclare(PaymentMethod, livemode);
TPSStripeMethodParamKeyDeclare(PaymentMethod, type);
TPSStripeMethodParamKeyDeclare(PaymentMethod, billingDetails);
TPSStripeMethodParamKeyDeclare(PaymentMethod, card);
TPSStripeMethodParamKeyDeclare(PaymentMethod, customerId);
TPSStripeMethodParamKeyDeclare(PaymentMethod, metadata);

TPSStripeParamTypeDefine(PaymentMethodCard);
TPSStripeMethodParamKeyDeclare(PaymentMethodCard, brand);
TPSStripeMethodParamKeyDeclare(PaymentMethodCard, country);
TPSStripeMethodParamKeyDeclare(PaymentMethodCard, expMonth);
TPSStripeMethodParamKeyDeclare(PaymentMethodCard, expYear);
TPSStripeMethodParamKeyDeclare(PaymentMethodCard, funding);
TPSStripeMethodParamKeyDeclare(PaymentMethodCard, last4);

TPSStripeParamTypeDefine(PaymentMethodBillingDetails);
TPSStripeMethodParamKeyDeclare(PaymentMethodBillingDetails, address);
TPSStripeMethodParamKeyDeclare(PaymentMethodBillingDetails, email);
TPSStripeMethodParamKeyDeclare(PaymentMethodBillingDetails, name);
TPSStripeMethodParamKeyDeclare(PaymentMethodBillingDetails, phone);

TPSStripeParamTypeDefine(PaymentMethodAddress);
TPSStripeMethodParamKeyDeclare(PaymentMethodAddress, city);
TPSStripeMethodParamKeyDeclare(PaymentMethodAddress, country);
TPSStripeMethodParamKeyDeclare(PaymentMethodAddress, line1);
TPSStripeMethodParamKeyDeclare(PaymentMethodAddress, line2);
TPSStripeMethodParamKeyDeclare(PaymentMethodAddress, postalCode);
TPSStripeMethodParamKeyDeclare(PaymentMethodAddress, state);

TPSStripeParamTypeDefine(CardParams);
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

TPSStripeParamTypeDefine(confirmPayment);
TPSStripeMethodParamKeyDeclare(confirmPayment, clientSecret);
TPSStripeMethodParamKeyDeclare(confirmPayment, paymentMethod);
TPSStripeMethodParamKeyDeclare(confirmPayment, paymentMethodId);
TPSStripeMethodParamKeyDeclare(confirmPayment, sourceId);
TPSStripeMethodParamKeyDeclare(confirmPayment, returnURL);
TPSStripeMethodParamKeyDeclare(confirmPayment, savePaymentMethod);

TPSStripeParamTypeDefine(authenticatePayment);
TPSStripeMethodParamKeyDeclare(authenticatePayment, clientSecret);

#undef TPSStripeMethodParamKeyDeclare
#undef TPSStripeParamTypeDefine

// Lookup helper
#define TPSStripeParam(methodOrIdentifier, key) (TPSStripe_##methodOrIdentifier##Key_##key)
