//
//  TPSStripeManager.m
//  TPSStripe
//
//  Created by Anton Petrov on 28.10.16.
//  Copyright © 2016 Tipsi. All rights reserved.
//

#import "TPSStripeManager.h"
#import <React/RCTUtils.h>
#import <React/RCTConvert.h>
#import <Stripe/Stripe.h>

#import "TPSError.h"
#import "TPSStripeManager+Constants.h"

// If you change these, make sure to also change:
//  android/src/main/java/com/gettipsi/stripe/StripeModule.java
// Relevant Docs:
// - https://stripe.dev/stripe-ios/docs/Classes/STPAppInfo.html https://stripe.dev/stripe-android/com/stripe/android/AppInfo.html
// - https://stripe.com/docs/building-plugins#setappinfo
NSString * const TPSAppInfoName = @"tipsi-stripe";
NSString * const TPSAppInfoPartnerId = @"tipsi-stripe";
NSString * const TPSAppInfoURL = @"https://github.com/tipsi/tipsi-stripe";
NSString * const TPSAppInfoVersion = @"8.x";

typedef NSString * TPSErrorKey NS_EXTENSIBLE_STRING_ENUM;
#define TPSErrorKeyDefine(Key, string) TPSErrorKey const kErrorKey ## Key = string
TPSErrorKeyDefine(Code, @"errorCode");
TPSErrorKeyDefine(Description, @"description");
TPSErrorKeyDefine(Busy, @"busy");
TPSErrorKeyDefine(Api, @"api");
TPSErrorKeyDefine(AuthenticationFailed, @"authenticationFailed");
TPSErrorKeyDefine(RedirectSpecific, @"redirectSpecific");
TPSErrorKeyDefine(Cancelled, @"cancelled");
TPSErrorKeyDefine(SourceStatusCanceled, @"sourceStatusCanceled");
TPSErrorKeyDefine(SourceStatusPending, @"sourceStatusPending");
TPSErrorKeyDefine(SourceStatusFailed, @"sourceStatusFailed");
TPSErrorKeyDefine(SourceStatusUnknown, @"sourceStatusUnknown");
TPSErrorKeyDefine(DeviceNotSupportsNativePay, @"deviceNotSupportsNativePay");
TPSErrorKeyDefine(NoPaymentRequest, @"noPaymentRequest");
TPSErrorKeyDefine(NoMerchantIdentifier, @"noMerchantIdentifier");
TPSErrorKeyDefine(NoAmount, @"noAmount");

@implementation RCTConvert (STPBankAccountHolderType)

RCT_ENUM_CONVERTER(STPBankAccountHolderType,
                   (@{
                      @"individual": @(STPBankAccountHolderTypeIndividual),
                      @"company": @(STPBankAccountHolderTypeCompany),
                      }),
                   STPBankAccountHolderTypeCompany,
                   integerValue)

+ (NSString *)STPBankAccountHolderTypeString:(STPBankAccountHolderType)type {
    NSString *string = nil;
    switch (type) {
        case STPBankAccountHolderTypeCompany: {
            string = @"company";
        }
            break;
        case STPBankAccountHolderTypeIndividual:
        default: {
            string = @"individual";
        }
            break;
    }
    return string;
}

@end

@implementation RCTConvert (STPBankAccountStatus)

RCT_ENUM_CONVERTER(STPBankAccountStatus,
                   (@{
                      @"new": @(STPBankAccountStatusNew),
                      @"validated": @(STPBankAccountStatusValidated),
                      @"verified": @(STPBankAccountStatusVerified),
                      @"errored": @(STPBankAccountStatusErrored),
                      }),
                   STPBankAccountStatusNew,
                   integerValue)

+ (NSString *)STPBankAccountStatusString:(STPBankAccountStatus)status {
    NSString *string = nil;
    switch (status) {
        case STPBankAccountStatusValidated: {
            string = @"validated";
        }
            break;
        case STPBankAccountStatusVerified: {
            string = @"verified";
        }
            break;
        case STPBankAccountStatusErrored: {
            string = @"errored";
        }
            break;
        case STPBankAccountStatusNew:
        default: {
            string = @"new";
        }
            break;
    }
    return string;
}

@end

@implementation RCTConvert (STPPaymentMethodType)

RCT_ENUM_CONVERTER(STPPaymentMethodType,
                   (@{
                      @"card": @(STPPaymentMethodTypeCard),
                      @"iDEAL": @(STPPaymentMethodTypeiDEAL),
                      @"card_present": @(STPPaymentMethodTypeCardPresent),
                      @"fpx": @(STPPaymentMethodTypeUnknown),
                      @"unknown": @(STPPaymentMethodTypeUnknown),
                      }),
                   STPPaymentMethodTypeUnknown,
                   integerValue)

+ (NSString *)STPPaymentMethodTypeString:(STPPaymentMethodType)type {
    switch (type) {
        case STPPaymentMethodTypeCard: return @"card";
        case STPPaymentMethodTypeiDEAL: return @"iDEAL";
        case STPPaymentMethodTypeCardPresent: return @"card_present";
        case STPPaymentMethodTypeFPX: // unsupported at this time (fall through)
        case STPPaymentMethodTypeUnknown:
        default: return @"unknown";
    }
}

@end

@implementation RCTConvert (STPIntentStatus)

#define TPSEntry(key, Enum) TPSStripeParam(PaymentIntentStatus, key): @(STPPaymentIntentStatus##Enum)
RCT_ENUM_CONVERTER(STPPaymentIntentStatus,
                   (@{
                      TPSEntry(unknown, Unknown),
                      TPSEntry(canceled, Canceled),
                      TPSEntry(processing, Processing),
                      TPSEntry(requires_action, RequiresAction),
                      TPSEntry(requires_capture, RequiresCapture),
                      TPSEntry(requires_payment_method, RequiresPaymentMethod),
                      TPSEntry(requires_confirmation, RequiresConfirmation),
                      TPSEntry(succeeded, Succeeded)
                      }),
                   STPPaymentIntentStatusUnknown,
                   integerValue)
#undef TPSEntry

+ (NSString *)STPPaymentIntentStatusString:(STPPaymentIntentStatus)status {
#define TPSEntry(key, Enum) case STPPaymentIntentStatus##Enum: return TPSStripeParam(PaymentIntentStatus, key);
    switch (status) {
            TPSEntry(unknown, Unknown)
            TPSEntry(canceled, Canceled)
            TPSEntry(processing, Processing)
            TPSEntry(requires_action, RequiresAction)
            TPSEntry(requires_capture, RequiresCapture)
            TPSEntry(requires_payment_method, RequiresPaymentMethod)
            TPSEntry(requires_confirmation, RequiresConfirmation)
            TPSEntry(succeeded, Succeeded)
            default: return TPSStripeParam(PaymentIntentStatus, unknown);
    }
#undef TPSEntry
}

#define TPSEntry(key, Enum) TPSStripeParam(SetupIntentStatus, key): @(STPSetupIntentStatus##Enum)
RCT_ENUM_CONVERTER(STPSetupIntentStatus,
                   (@{
                      TPSEntry(unknown, Unknown),
                      TPSEntry(canceled, Canceled),
                      TPSEntry(processing, Processing),
                      TPSEntry(requires_action, RequiresAction),
                      TPSEntry(requires_payment_method, RequiresPaymentMethod),
                      TPSEntry(requires_confirmation, RequiresConfirmation),
                      TPSEntry(succeeded, Succeeded)
                      }),
                   STPSetupIntentStatusUnknown,
                   integerValue)
#undef TPSEntry

+ (NSString *)STPSetupIntentStatusString:(STPSetupIntentStatus)status {
#define TPSEntry(key, Enum) case STPSetupIntentStatus##Enum: return TPSStripeParam(SetupIntentStatus, key);
    switch (status) {
            TPSEntry(unknown, Unknown)
            TPSEntry(canceled, Canceled)
            TPSEntry(processing, Processing)
            TPSEntry(requires_action, RequiresAction)
            TPSEntry(requires_payment_method, RequiresPaymentMethod)
            TPSEntry(requires_confirmation, RequiresConfirmation)
            TPSEntry(succeeded, Succeeded)
            default: return TPSStripeParam(SetupIntentStatus, unknown);
    }
#undef TPSEntry
}

@end

typedef NSString * TPSPaymentNetwork NS_EXTENSIBLE_STRING_ENUM;

// Add entries here when PKPaymentNetwork receives new keys!
#define TPSPaymentNetworkDefine(Key, string) TPSPaymentNetwork const TPSPaymentNetwork ## Key = string
TPSPaymentNetworkDefine(Amex, @"american_express");
TPSPaymentNetworkDefine(CartesBancaires, @"cartes_bancaires");
TPSPaymentNetworkDefine(ChinaUnionPay, @"china_union_pay");
TPSPaymentNetworkDefine(Discover, @"discover");
TPSPaymentNetworkDefine(Eftpos, @"eftpos");
TPSPaymentNetworkDefine(Electron, @"electron");
TPSPaymentNetworkDefine(Elo, @"elo");
TPSPaymentNetworkDefine(IDCredit, @"id_credit");
TPSPaymentNetworkDefine(Interac, @"interac");
TPSPaymentNetworkDefine(JCB, @"jcb");
TPSPaymentNetworkDefine(Mada, @"mada");
TPSPaymentNetworkDefine(Maestro, @"maestro");
TPSPaymentNetworkDefine(MasterCard, @"mastercard");
TPSPaymentNetworkDefine(PrivateLabel, @"private_label");
TPSPaymentNetworkDefine(QuicPay, @"quic_pay");
TPSPaymentNetworkDefine(Suica, @"suica");
TPSPaymentNetworkDefine(Visa, @"visa");
TPSPaymentNetworkDefine(VPay, @"vpay");
#undef TPSPaymentNetworkDefine

NSDictionary<TPSPaymentNetwork, PKPaymentNetwork> * mapTPSPaymentNetworkToPKPaymentNetwork = nil;
__attribute__((constructor)) // This means this method will be called in file scope
void initializeTPSPaymentNetworksWithConditionalMappings() {
    NSMutableDictionary<TPSPaymentNetwork, PKPaymentNetwork> * tmp = NSMutableDictionary.dictionary;

    // Inserts a key-value mapping into this dictionary guarding it by which iOS version the constant was added in
#define TPSPaymentNetworkConditionalMapping(Key, iOSVersion) { if (@available(iOS iOSVersion, *)) { tmp[TPSPaymentNetwork##Key] = PKPaymentNetwork ## Key; }}
    TPSPaymentNetworkConditionalMapping(Amex, 8.0);
    TPSPaymentNetworkConditionalMapping(CartesBancaires, 11.2);
    TPSPaymentNetworkConditionalMapping(ChinaUnionPay, 9.2);
    TPSPaymentNetworkConditionalMapping(Discover, 9.0);
    TPSPaymentNetworkConditionalMapping(Eftpos, 12.0);
    TPSPaymentNetworkConditionalMapping(Electron, 12.0);
    TPSPaymentNetworkConditionalMapping(Elo, 12.1.1);
    TPSPaymentNetworkConditionalMapping(IDCredit, 10.3);
    TPSPaymentNetworkConditionalMapping(Interac, 9.2);
    TPSPaymentNetworkConditionalMapping(JCB, 10.1);
    TPSPaymentNetworkConditionalMapping(Mada, 12.1.1);
    TPSPaymentNetworkConditionalMapping(Maestro, 12.0);
    TPSPaymentNetworkConditionalMapping(MasterCard, 8.0);
    TPSPaymentNetworkConditionalMapping(PrivateLabel, 9.0);
    TPSPaymentNetworkConditionalMapping(QuicPay, 10.3);
    TPSPaymentNetworkConditionalMapping(Suica, 10.1);
    TPSPaymentNetworkConditionalMapping(Visa, 8.0);
    TPSPaymentNetworkConditionalMapping(VPay, 12.0);
#undef TPSPaymentNetworkConditionalMapping

    mapTPSPaymentNetworkToPKPaymentNetwork = tmp;
}

@interface StripeModule () <STPAuthenticationContext>
{
    NSString *publishableKey;
    NSString *merchantId;
    NSDictionary *errorCodes;
    NSString *stripeAccount;

    RCTPromiseResolveBlock promiseResolver;
    RCTPromiseRejectBlock promiseRejector;

    BOOL requestIsCompleted;

    void (^applePayCompletion)(PKPaymentAuthorizationStatus);
    NSError *applePayStripeError;
}
@end
@implementation StripeModule

- (instancetype)init {
    if ((self = [super init])) {
        requestIsCompleted = YES;
    }
    return self;
}


- (dispatch_queue_t)methodQueue {
    // This makes sure our code is thread safe by never simultaneously executing
    // Possibly useful, possibly undesirable for performance.
    return dispatch_get_main_queue();
}

- (NSDictionary *)constantsToExport
{
    return @{
             @"TPSErrorDomain": TPSErrorDomain,
             @"TPSErrorCodeApplePayNotConfigured": [@(TPSErrorCodeApplePayNotConfigured) stringValue],
             @"TPSErrorCodePreviousRequestNotCompleted": [@(TPSErrorCodePreviousRequestNotCompleted) stringValue],
             @"TPSErrorCodeUserCancel": [@(TPSErrorCodeUserCancel) stringValue],
             };
}

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(init:(NSDictionary *)options errorCodes:(NSDictionary *)errors) {
    publishableKey = options[@"publishableKey"];
    merchantId = options[@"merchantId"];
    errorCodes = errors;
    [Stripe setDefaultPublishableKey:publishableKey];
}

RCT_EXPORT_METHOD(setStripeAccount:(NSString *)_stripeAccount) {
    stripeAccount = _stripeAccount;
}

RCT_EXPORT_METHOD(deviceSupportsApplePay:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    resolve(@([PKPaymentAuthorizationViewController canMakePayments]));
}

RCT_EXPORT_METHOD(canMakeApplePayPayments:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    NSArray <NSString *> *paymentNetworksStrings =
    options[@"networks"] ?: [StripeModule applePaySupportedPaymentNetworksStrings];

    NSArray <PKPaymentNetwork> *networks = [self paymentNetworks:paymentNetworksStrings];
    resolve(@([PKPaymentAuthorizationViewController canMakePaymentsUsingNetworks:networks]));
}

RCT_EXPORT_METHOD(potentiallyAvailableNativePayNetworks:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    NSArray <NSString *> *paymentNetworksStrings = [StripeModule applePaySupportedPaymentNetworksStrings];

    NSArray <PKPaymentNetwork> *networks = [self paymentNetworks:paymentNetworksStrings];
    resolve([PKPaymentAuthorizationViewController canMakePaymentsUsingNetworks:networks] ? paymentNetworksStrings : nil);
}


RCT_EXPORT_METHOD(createPaymentMethod:(NSDictionary<NSString *, id> *)untypedParams
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    NSDictionary<TPSStripeType(createPaymentMethod), id> *params = untypedParams;

    STPPaymentMethodParams * parsed = [self extractCreatePaymentMethodParamsFromDictionary:params];
    NSParameterAssert(parsed);

    if(!requestIsCompleted) {
        NSDictionary *error = [errorCodes valueForKey:kErrorKeyBusy];
        reject(error[kErrorKeyCode], error[kErrorKeyDescription], nil);
        return;
    }
    requestIsCompleted = NO;
    promiseResolver = resolve;
    promiseRejector = reject;

    STPAPIClient *api = self.newAPIClient;
    [api createPaymentMethodWithParams:parsed
                            completion:^(STPPaymentMethod * __nullable paymentMethod, NSError * __nullable error){
                                self->requestIsCompleted = YES;

                                if (error) {
                                    NSDictionary *jsError = [self->errorCodes valueForKey:kErrorKeyApi];
                                    [self rejectPromiseWithCode:jsError[kErrorKeyCode] message:error.localizedDescription];
                                    return;
                                }
                                resolve([self convertPaymentMethod: paymentMethod]);
                            }];
}

RCT_EXPORT_METHOD(confirmPaymentIntent:(NSDictionary<NSString*, id>*)untypedParams
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    NSDictionary<TPSStripeType(confirmPaymentIntent), id> *params = untypedParams;

    STPPaymentIntentParams * parsed = [self extractConfirmPaymentIntentParamsFromDictionary:params];
    if(!requestIsCompleted) {
        NSDictionary *error = [errorCodes valueForKey:kErrorKeyBusy];
        reject(error[kErrorKeyCode], error[kErrorKeyDescription], nil);
        return;
    }
    requestIsCompleted = NO;
    promiseResolver = resolve;
    promiseRejector = reject;

    STPAPIClient *api = self.newAPIClient;
    [api confirmPaymentIntentWithParams:parsed
                             completion:^(STPPaymentIntent * __nullable intent, NSError * __nullable error){
                                 if (!intent && error) {
                                     self->requestIsCompleted = YES;
                                     NSDictionary *jsError = [self->errorCodes valueForKey:kErrorKeyAuthenticationFailed];
                                     [self rejectPromiseWithCode:jsError[kErrorKeyCode] message:error.localizedDescription error:error];
                                     return;
                                 }

                                 if (intent.status == STPPaymentIntentStatusSucceeded || intent.status == STPPaymentIntentStatusRequiresCapture) {
                                     self->requestIsCompleted = YES;
                                     [self resolvePromise: [self convertConfirmPaymentIntentResult: intent]];
                                 } else if (intent.status == STPPaymentIntentStatusRequiresAction) {
                                     // From example in step 3 of https://stripe.com/docs/payments/payment-intents/ios#manual-confirmation-ios
                                     [[STPPaymentHandler sharedHandler] handleNextActionForPayment:intent.clientSecret
                                                                         withAuthenticationContext:self
                                                                                         returnURL:parsed.returnURL
                                                                                        completion:^(STPPaymentHandlerActionStatus status, STPPaymentIntent * intent, NSError * error) {
                                                                                            self->requestIsCompleted = YES;

                                                                                            switch (status) {
                                                                                                case STPPaymentHandlerActionStatusSucceeded:
                                                                                                    // Succeeded should all be attached to the intent
                                                                                                    [self resolvePromise: [self convertConfirmPaymentIntentResult: intent]];
                                                                                                    return;
                                                                                                case STPPaymentHandlerActionStatusCanceled:
                                                                                                    [self rejectPromiseWithCode:[self->errorCodes valueForKey:kErrorKeyCancelled][kErrorKeyCode]
                                                                                                                        message:error.localizedDescription ?: [self->errorCodes valueForKey:kErrorKeyCancelled][kErrorKeyDescription]
                                                                                                                          error:error];
                                                                                                    return;
                                                                                                case STPPaymentHandlerActionStatusFailed:
                                                                                                    [self rejectPromiseWithCode:[self->errorCodes valueForKey:kErrorKeyAuthenticationFailed][kErrorKeyCode]
                                                                                                                        message:error.localizedDescription ?: [self->errorCodes valueForKey:kErrorKeyAuthenticationFailed][kErrorKeyDescription] ?: @"FAILED"
                                                                                                                          error:error];
                                                                                                    return;
                                                                                            }
                                                                                        }];
                                 } else {
                                     // We can't do anything else for the other intent status cases, so let's return control to the App
                                     self->requestIsCompleted = YES;
                                     if (intent.status == STPPaymentIntentStatusCanceled) {
                                         [self rejectPromiseWithCode:[self->errorCodes valueForKey:kErrorKeyCancelled][kErrorKeyCode]
                                                             message:error.localizedDescription ?: [self->errorCodes valueForKey:kErrorKeyCancelled][kErrorKeyDescription]
                                                               error:error];
                                     } else {
                                         [self rejectPromiseWithCode:[self->errorCodes valueForKey:kErrorKeyAuthenticationFailed][kErrorKeyCode]
                                                             message:error.localizedDescription ?: [self->errorCodes valueForKey:kErrorKeyAuthenticationFailed][kErrorKeyDescription] ?: @"FAILED"
                                                               error:error];

                                     }
                                 }
                             }];
}

RCT_EXPORT_METHOD(authenticatePaymentIntent:(NSDictionary<NSString*, id> *)untypedParams
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    NSDictionary<TPSStripeType(authenticatePaymentIntent), id> *params = untypedParams;

    NSString * clientSecret = params[TPSStripeParam(authenticatePaymentIntent, clientSecret)];
    NSString * returnURL = [RCTConvert NSString:TPSStripeParam(authenticatePaymentIntent, returnURL)];

    if(!requestIsCompleted) {
        NSDictionary *error = [errorCodes valueForKey:kErrorKeyBusy];
        reject(error[kErrorKeyCode], error[kErrorKeyDescription], nil);
        return;
    }
    requestIsCompleted = NO;
    promiseResolver = resolve;
    promiseRejector = reject;

    // From example in step 3 of https://stripe.com/docs/payments/payment-intents/ios#manual-confirmation-ios
    [[STPPaymentHandler sharedHandler] handleNextActionForPayment:clientSecret
                                        withAuthenticationContext:self
                                                        returnURL:returnURL
                                                       completion:^(STPPaymentHandlerActionStatus status, STPPaymentIntent * intent, NSError * error) {
                                                           self->requestIsCompleted = YES;

                                                           switch (status) {
                                                               case STPPaymentHandlerActionStatusSucceeded:
                                                                   // Succeeded should all be attached to the intent
                                                                   [self resolvePromise: [self convertAuthenticatePaymentIntentResult: intent]];
                                                                   return;
                                                               case STPPaymentHandlerActionStatusCanceled:
                                                                   [self rejectPromiseWithCode:[self->errorCodes valueForKey:kErrorKeyCancelled][kErrorKeyCode]
                                                                                       message:error.localizedDescription ?: [self->errorCodes valueForKey:kErrorKeyCancelled][kErrorKeyDescription]
                                                                                         error:error];
                                                                   return;
                                                               case STPPaymentHandlerActionStatusFailed:
                                                                   [self rejectPromiseWithCode:[self->errorCodes valueForKey:kErrorKeyAuthenticationFailed][kErrorKeyCode]
                                                                                       message:error.localizedDescription ?: [self->errorCodes valueForKey:kErrorKeyAuthenticationFailed][kErrorKeyDescription] ?: @"FAILED"
                                                                                         error:error];
                                                                   return;
                                                           }
                                                       }];
}

RCT_EXPORT_METHOD(confirmSetupIntent:(NSDictionary<NSString*, id> *)untypedParams
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    NSDictionary<TPSStripeType(confirmSetupIntent), id> *params = untypedParams;

    STPSetupIntentConfirmParams * parsed = [self extractConfirmSetupIntentParamsFromDictionary:params];
    if(!requestIsCompleted) {
        NSDictionary *error = [errorCodes valueForKey:kErrorKeyBusy];
        reject(error[kErrorKeyCode], error[kErrorKeyDescription], nil);
        return;
    }
    requestIsCompleted = NO;
    promiseResolver = resolve;
    promiseRejector = reject;

    STPAPIClient *api = self.newAPIClient;
    [api confirmSetupIntentWithParams:parsed
                           completion:^(STPSetupIntent * __nullable intent, NSError * __nullable error){
                               if (!intent && error) {
                                   self->requestIsCompleted = YES;
                                   NSDictionary *jsError = [self->errorCodes valueForKey:kErrorKeyAuthenticationFailed];
                                   [self rejectPromiseWithCode:jsError[kErrorKeyCode] message:error.localizedDescription error:error];
                                   return;
                               }

                               if (intent.status == STPSetupIntentStatusSucceeded) {
                                   self->requestIsCompleted = YES;
                                   [self resolvePromise: [self convertConfirmSetupIntentResult: intent]];
                               } else if (intent.status == STPSetupIntentStatusRequiresAction) {
                                   // From example in step 3 of https://stripe.com/docs/payments/payment-intents/ios#manual-confirmation-ios
                                   [[STPPaymentHandler sharedHandler] handleNextActionForSetupIntent:intent.clientSecret
                                                                           withAuthenticationContext:self
                                                                                           returnURL:parsed.returnURL
                                                                                          completion:^(STPPaymentHandlerActionStatus status, STPSetupIntent * intent, NSError * error) {
                                                                                              self->requestIsCompleted = YES;

                                                                                              switch (status) {
                                                                                                  case STPPaymentHandlerActionStatusSucceeded:
                                                                                                      [self resolvePromise: [self convertConfirmSetupIntentResult: intent]];
                                                                                                      return;
                                                                                                  case STPPaymentHandlerActionStatusCanceled:
                                                                                                      [self rejectPromiseWithCode:[self->errorCodes valueForKey:kErrorKeyCancelled][kErrorKeyCode]
                                                                                                                          message:error.localizedDescription ?: [self->errorCodes valueForKey:kErrorKeyCancelled][kErrorKeyDescription]
                                                                                                                            error:error];
                                                                                                      return;
                                                                                                  case STPPaymentHandlerActionStatusFailed:
                                                                                                      [self rejectPromiseWithCode:[self->errorCodes valueForKey:kErrorKeyAuthenticationFailed][kErrorKeyCode]
                                                                                                                          message:error.localizedDescription ?: [self->errorCodes valueForKey:kErrorKeyAuthenticationFailed][kErrorKeyDescription] ?: @"FAILED"
                                                                                                                            error:error];
                                                                                                      return;
                                                                                              }
                                                                                          }];
                               } else {
                                   // We can't do anything else for the other intent status cases, so let's return control to the App
                                   self->requestIsCompleted = YES;
                                   if (intent.status == STPSetupIntentStatusCanceled) {
                                       [self rejectPromiseWithCode:[self->errorCodes valueForKey:kErrorKeyCancelled][kErrorKeyCode]
                                                           message:error.localizedDescription ?: [self->errorCodes valueForKey:kErrorKeyCancelled][kErrorKeyDescription]
                                                             error:error];
                                   } else {
                                       [self rejectPromiseWithCode:[self->errorCodes valueForKey:kErrorKeyAuthenticationFailed][kErrorKeyCode]
                                                           message:error.localizedDescription ?: [self->errorCodes valueForKey:kErrorKeyAuthenticationFailed][kErrorKeyDescription] ?: @"FAILED"
                                                             error:error];
                                   }
                               }
                           }];
}

RCT_EXPORT_METHOD(authenticateSetupIntent:(NSDictionary<NSString*, id>*)params
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {

    NSString * clientSecret = TPSStripeParam(authenticateSetupIntent, clientSecret);
    NSString * returnURL = [RCTConvert NSString:TPSStripeParam(authenticateSetupIntent, returnURL)];

    if(!requestIsCompleted) {
        NSDictionary *error = [errorCodes valueForKey:kErrorKeyBusy];
        reject(error[kErrorKeyCode], error[kErrorKeyDescription], nil);
        return;
    }
    requestIsCompleted = NO;
    promiseResolver = resolve;
    promiseRejector = reject;

    // From example in step 3 of https://stripe.com/docs/payments/payment-intents/ios#manual-confirmation-ios
    // Note: the above are the PaymentIntent docs, the handleNextActionForSetupIntent isn't documented on the website at time of writing this
    [[STPPaymentHandler sharedHandler] handleNextActionForSetupIntent:clientSecret
                                            withAuthenticationContext:self
                                                            returnURL:returnURL
                                                           completion:^(STPPaymentHandlerActionStatus status, STPSetupIntent * _Nullable intent, NSError * _Nullable error) {
                                                               self->requestIsCompleted = YES;

                                                               switch (status) {
                                                                   case STPPaymentHandlerActionStatusSucceeded:
                                                                       // Succeeded/canceled should all be attached to the intent
                                                                       [self resolvePromise: [self convertAuthenticateSetupIntentResult: intent]];
                                                                       return;
                                                                   case STPPaymentHandlerActionStatusCanceled:
                                                                       [self rejectPromiseWithCode:[self->errorCodes valueForKey:kErrorKeyCancelled][kErrorKeyCode]
                                                                                           message:error.localizedDescription ?: [self->errorCodes valueForKey:kErrorKeyCancelled][kErrorKeyDescription]
                                                                                             error:error];
                                                                       return;
                                                                   case STPPaymentHandlerActionStatusFailed:
                                                                       // This should not happen, as we should respond with an error -- what should we do?
                                                                       [self rejectPromiseWithCode:[self->errorCodes valueForKey:kErrorKeyApi][kErrorKeyCode] message:@"FAILED"];
                                                                       break;
                                                               }
                                                           }];
}


RCT_EXPORT_METHOD(completeApplePayRequest:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    if (applePayCompletion) {
        promiseResolver = resolve;
        [self resolveApplePayCompletion:PKPaymentAuthorizationStatusSuccess];
    } else {
        resolve(nil);
    }
}

RCT_EXPORT_METHOD(cancelApplePayRequest:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    if (applePayCompletion) {
        promiseResolver = resolve;
        [self resolveApplePayCompletion:PKPaymentAuthorizationStatusFailure];
    } else {
        resolve(nil);
    }
}

RCT_EXPORT_METHOD(createTokenWithCard:(NSDictionary *)params
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    if(!requestIsCompleted) {
        NSDictionary *error = [errorCodes valueForKey:kErrorKeyBusy];
        reject(error[kErrorKeyCode], error[kErrorKeyDescription], nil);
        return;
    }

    requestIsCompleted = NO;
    promiseResolver = resolve;
    promiseRejector = reject;

    STPCardParams *cardParams = [self extractCardParamsFromDictionary:params];

    STPAPIClient *stripeAPIClient = [self newAPIClient];

    [stripeAPIClient createTokenWithCard:cardParams completion:^(STPToken *token, NSError *error) {
        self->requestIsCompleted = YES;

        if (error) {
            NSDictionary *jsError = [self->errorCodes valueForKey:kErrorKeyApi];
            [self rejectPromiseWithCode:jsError[kErrorKeyCode] message:error.localizedDescription];
        } else {
            resolve([self convertTokenObject:token]);
        }
    }];
}

RCT_EXPORT_METHOD(createTokenWithBankAccount:(NSDictionary *)params
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    if(!requestIsCompleted) {
        NSDictionary *error = [errorCodes valueForKey:kErrorKeyBusy];
        reject(error[kErrorKeyCode], error[kErrorKeyDescription], nil);
        return;
    }
    requestIsCompleted = NO;
    promiseResolver = resolve;
    promiseRejector = reject;

    STPBankAccountParams *bankAccount = [[STPBankAccountParams alloc] init];

    [bankAccount setAccountNumber: params[@"accountNumber"]];
    [bankAccount setCountry: params[@"countryCode"]];
    [bankAccount setCurrency: params[@"currency"]];
    [bankAccount setRoutingNumber: params[@"routingNumber"]];
    [bankAccount setAccountHolderName: params[@"accountHolderName"]];
    STPBankAccountHolderType accountHolderType =
    [RCTConvert STPBankAccountHolderType:params[@"accountHolderType"]];
    [bankAccount setAccountHolderType: accountHolderType];

    STPAPIClient *stripeAPIClient = [self newAPIClient];

    [stripeAPIClient createTokenWithBankAccount:bankAccount completion:^(STPToken *token, NSError *error) {
        self->requestIsCompleted = YES;

        if (error) {
            NSDictionary *jsError = [self->errorCodes valueForKey:kErrorKeyApi];
            [self rejectPromiseWithCode:jsError[kErrorKeyCode] message:error.localizedDescription];
        } else {
            resolve([self convertTokenObject:token]);
        }
    }];
}

RCT_EXPORT_METHOD(createSourceWithParams:(NSDictionary *)params
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    if(!requestIsCompleted) {
        NSDictionary *error = [errorCodes valueForKey:kErrorKeyBusy];
        reject(error[kErrorKeyCode], error[kErrorKeyDescription], nil);
        return;
    }
    requestIsCompleted = NO;

    NSString *sourceType = params[@"type"];
    STPSourceParams *sourceParams;
    if ([sourceType isEqualToString:@"bancontact"]) {
        sourceParams = [STPSourceParams bancontactParamsWithAmount:[[params objectForKey:@"amount"] unsignedIntegerValue] name:params[@"name"] returnURL:params[@"returnURL"] statementDescriptor:params[@"statementDescriptor"]];
    }
    if ([sourceType isEqualToString:@"giropay"]) {
        sourceParams = [STPSourceParams giropayParamsWithAmount:[[params objectForKey:@"amount"] unsignedIntegerValue] name:params[@"name"] returnURL:params[@"returnURL"] statementDescriptor:params[@"statementDescriptor"]];
    }
    if ([sourceType isEqualToString:@"ideal"]) {
        sourceParams = [STPSourceParams idealParamsWithAmount:[[params objectForKey:@"amount"] unsignedIntegerValue] name:params[@"name"] returnURL:params[@"returnURL"] statementDescriptor:params[@"statementDescriptor"] bank:params[@"bank"]];
    }
    if ([sourceType isEqualToString:@"sepaDebit"]) {
        sourceParams = [STPSourceParams sepaDebitParamsWithName:params[@"name"] iban:params[@"iban"] addressLine1:params[@"addressLine1"] city:params[@"city"] postalCode:params[@"postalCode"] country:params[@"country"]];
    }
    if ([sourceType isEqualToString:@"sofort"]) {
        sourceParams = [STPSourceParams sofortParamsWithAmount:[[params objectForKey:@"amount"] unsignedIntegerValue] returnURL:params[@"returnURL"] country:params[@"country"] statementDescriptor:params[@"statementDescriptor"]];
    }
    if ([sourceType isEqualToString:@"threeDSecure"]) {
        sourceParams = [STPSourceParams threeDSecureParamsWithAmount:[[params objectForKey:@"amount"] unsignedIntegerValue] currency:params[@"currency"] returnURL:params[@"returnURL"] card:params[@"card"]];
    }
    if ([sourceType isEqualToString:@"alipay"]) {
        sourceParams = [STPSourceParams alipayParamsWithAmount:[[params objectForKey:@"amount"] unsignedIntegerValue] currency:params[@"currency"] returnURL:params[@"returnURL"]];
    }
    if ([sourceType isEqualToString:@"card"]) {
        sourceParams = [STPSourceParams cardParamsWithCard:[self extractCardParamsFromDictionary:params]];
    }

    STPAPIClient* stripeAPIClient = [self newAPIClient];

    [stripeAPIClient createSourceWithParams:sourceParams completion:^(STPSource *source, NSError *error) {
        self->requestIsCompleted = YES;

        if (error) {
            NSDictionary *jsError = [self->errorCodes valueForKey:kErrorKeyApi];
            reject(jsError[kErrorKeyCode], error.localizedDescription, nil);
        } else {
            if (source.redirect) {
                self.redirectContext = [[STPRedirectContext alloc] initWithSource:source completion:^(NSString *sourceID, NSString *clientSecret, NSError *error) {
                    if (error) {
                        NSDictionary *jsError = [self->errorCodes valueForKey:kErrorKeyRedirectSpecific];
                        reject(jsError[kErrorKeyCode], error.localizedDescription, nil);
                    } else {
                        [stripeAPIClient startPollingSourceWithId:sourceID clientSecret:clientSecret timeout:10 completion:^(STPSource *source, NSError *error) {
                            if (error) {
                                NSDictionary *jsError = [self->errorCodes valueForKey:kErrorKeyApi];
                                reject(jsError[kErrorKeyCode], error.localizedDescription, nil);
                            } else {
                                switch (source.status) {
                                    case STPSourceStatusChargeable:
                                    case STPSourceStatusConsumed:
                                        resolve([self convertSourceObject:source]);
                                        break;
                                    case STPSourceStatusCanceled: {
                                        NSDictionary *error = [self->errorCodes valueForKey:kErrorKeySourceStatusCanceled];
                                        reject(error[kErrorKeyCode], error[kErrorKeyDescription], nil);
                                    }
                                        break;
                                    case STPSourceStatusPending: {
                                        NSDictionary *error = [self->errorCodes valueForKey:kErrorKeySourceStatusPending];
                                        reject(error[kErrorKeyCode], error[kErrorKeyDescription], nil);
                                    }
                                        break;
                                    case STPSourceStatusFailed: {
                                        NSDictionary *error = [self->errorCodes valueForKey:kErrorKeySourceStatusFailed];
                                        reject(error[kErrorKeyCode], error[kErrorKeyDescription], nil);
                                    }
                                        break;
                                    case STPSourceStatusUnknown: {
                                        NSDictionary *error = [self->errorCodes valueForKey:kErrorKeySourceStatusUnknown];
                                        reject(error[kErrorKeyCode], error[kErrorKeyDescription], nil);
                                    }
                                        break;
                                }
                            }
                        }];
                    }
                }];
                [self.redirectContext startSafariAppRedirectFlow];
            } else {
                resolve([self convertSourceObject:source]);
            }
        }
    }];
}

RCT_EXPORT_METHOD(paymentRequestWithCardForm:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    if(!requestIsCompleted) {
        NSDictionary *error = [errorCodes valueForKey:kErrorKeyBusy];
        reject(error[kErrorKeyCode], error[kErrorKeyDescription], nil);
        return;
    }

    requestIsCompleted = NO;
    // Save promise handlers to use in `paymentAuthorizationViewController`
    promiseResolver = resolve;
    promiseRejector = reject;

    NSUInteger requiredBillingAddressFields = [self billingType:options[@"requiredBillingAddressFields"]];
    NSString *companyName = options[@"companyName"] ? options[@"companyName"] : @"";
    STPUserInformation *prefilledInformation = [self userInformation:options[@"prefilledInformation"]];
    NSString *nextPublishableKey = options[@"publishableKey"] ? options[@"publishableKey"] : publishableKey;
    UIModalPresentationStyle formPresentation = [self formPresentation:options[@"presentation"]];
    STPTheme *theme = [self formTheme:options[@"theme"]];

    STPPaymentConfiguration *configuration = [[STPPaymentConfiguration alloc] init];
    [configuration setRequiredBillingAddressFields:requiredBillingAddressFields];
    [configuration setCompanyName:companyName];
    [configuration setPublishableKey:nextPublishableKey];

    STPAddCardViewController *vc = [[STPAddCardViewController alloc] initWithConfiguration:configuration theme:theme];
    vc.delegate = self;
    vc.prefilledInformation = prefilledInformation;
    // STPAddCardViewController must be shown inside a UINavigationController.
    UINavigationController *navigationController = [[UINavigationController alloc] initWithRootViewController:vc];
    [navigationController setModalPresentationStyle:formPresentation];
    navigationController.navigationBar.stp_theme = theme;
    // move to the end of main queue
    // allow the execution of hiding modal
    // to be finished first
    dispatch_async(dispatch_get_main_queue(), ^{
        [RCTPresentedViewController() presentViewController:navigationController animated:YES completion:nil];
    });
}

RCT_EXPORT_METHOD(paymentRequestWithApplePay:(NSArray *)items
                  withOptions:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    if(!requestIsCompleted) {
        NSDictionary *error = [errorCodes valueForKey:kErrorKeyBusy];
        reject(error[kErrorKeyCode], error[kErrorKeyDescription], nil);
        return;
    }

    requestIsCompleted = NO;
    // Save promise handlers to use in `paymentAuthorizationViewController`
    promiseResolver = resolve;
    promiseRejector = reject;

    NSUInteger requiredShippingAddressFields = [self applePayAddressFields:options[@"requiredShippingAddressFields"]];
    NSUInteger requiredBillingAddressFields = [self applePayAddressFields:options[@"requiredBillingAddressFields"]];
    PKShippingType shippingType = [self applePayShippingType:options[@"shippingType"]];
    NSMutableArray *shippingMethodsItems = options[@"shippingMethods"] ? options[@"shippingMethods"] : [NSMutableArray array];
    NSString* currencyCode = options[@"currencyCode"] ? options[@"currencyCode"] : @"USD";
    NSString* countryCode = options[@"countryCode"] ? options[@"countryCode"] : @"US";

    NSMutableArray *shippingMethods = [NSMutableArray array];

    for (NSDictionary *item in shippingMethodsItems) {
        PKShippingMethod *shippingItem = [[PKShippingMethod alloc] init];
        shippingItem.label = item[@"label"];
        shippingItem.detail = item[@"detail"];
        shippingItem.amount = [NSDecimalNumber decimalNumberWithString:item[@"amount"]];
        shippingItem.identifier = item[@"id"];
        [shippingMethods addObject:shippingItem];
    }

    NSMutableArray *summaryItems = [NSMutableArray array];

    for (NSDictionary *item in items) {
        PKPaymentSummaryItem *summaryItem = [[PKPaymentSummaryItem alloc] init];
        summaryItem.label = item[@"label"];
        summaryItem.amount = [NSDecimalNumber decimalNumberWithString:item[@"amount"]];
        summaryItem.type = [@"pending" isEqualToString:item[@"type"]] ? PKPaymentSummaryItemTypePending : PKPaymentSummaryItemTypeFinal;
        [summaryItems addObject:summaryItem];
    }

    PKPaymentRequest *paymentRequest = [Stripe paymentRequestWithMerchantIdentifier:merchantId country:countryCode currency:currencyCode];

    [paymentRequest setRequiredShippingAddressFields:requiredShippingAddressFields];
    [paymentRequest setRequiredBillingAddressFields:requiredBillingAddressFields];
    [paymentRequest setPaymentSummaryItems:summaryItems];
    [paymentRequest setShippingMethods:shippingMethods];
    [paymentRequest setShippingType:shippingType];

    if ([self canSubmitPaymentRequest:paymentRequest rejecter:reject]) {
        PKPaymentAuthorizationViewController *paymentAuthorizationVC = [[PKPaymentAuthorizationViewController alloc] initWithPaymentRequest:paymentRequest];
        paymentAuthorizationVC.delegate = self;

        // move to the end of main queue
        // allow the execution of hiding modal
        // to be finished first
        dispatch_async(dispatch_get_main_queue(), ^{
            [RCTPresentedViewController() presentViewController:paymentAuthorizationVC animated:YES completion:nil];
        });
    } else {
        // There is a problem with your Apple Pay configuration.
        [self resetPromiseCallbacks];
        requestIsCompleted = YES;
    }
}

RCT_EXPORT_METHOD(openApplePaySetup) {
    PKPassLibrary *library = [[PKPassLibrary alloc] init];

    // Here we should check, if openPaymentSetup selector exist
    if ([library respondsToSelector:NSSelectorFromString(@"openPaymentSetup")]) {
        [library openPaymentSetup];
    }
}

#pragma mark - Private - Converters

- (STPCardParams *)extractCardParamsFromDictionary:(NSDictionary<TPSStripeType(CardParams), id> *)params {
    STPCardParams *result = [[STPCardParams alloc] init];
#define simpleUnpack(key) result.key = [RCTConvert NSString:params[TPSStripeParam(CardParams, key)]]

    simpleUnpack(number);
    result.expMonth = [params[TPSStripeParam(CardParams, expMonth)] integerValue];
    result.expYear = [params[TPSStripeParam(CardParams, expYear)] integerValue];
    simpleUnpack(cvc);

    simpleUnpack(currency);
    simpleUnpack(name);

#undef simpleUnpack

    // Make a new address object, and fill it in with data before assigning it
    // Editing the fields on the assigned address won't do anything according to Stripe's docs
    STPAddress * address = [[STPAddress alloc] init];
    address.line1 = params[TPSStripeParam(CardParams, addressLine1)];
    address.line2 = params[TPSStripeParam(CardParams, addressLine2)];
    address.city = params[TPSStripeParam(CardParams, addressCity)];
    address.state = params[TPSStripeParam(CardParams, addressState)];
    address.country = params[TPSStripeParam(CardParams, addressCountry)];
    address.postalCode = params[TPSStripeParam(CardParams, addressZip)];
    result.address = address; // Commit all the changes as a batch

    return result;
}

- (STPPaymentMethodCardParams*)extractPaymentMethodCardParamsFromDictionary:(NSDictionary<TPSStripeType(CardParams), id>*)params {
    if (!params || [NSNull null] == (id)params) {
        return nil;
    }

    STPPaymentMethodCardParams * card = nil;
    if ([params isKindOfClass:NSDictionary.class]) {
        NSString * token = [RCTConvert NSString:params[TPSStripeParam(CardParams, token)]];
        if (token) {
            // If we have a token, then that means there cannot be other details (and we don't look at them if they exist)
            card = [[STPPaymentMethodCardParams alloc] init];
            card.token = token;
        } else {
            card = [[STPPaymentMethodCardParams alloc] initWithCardSourceParams: [self extractCardParamsFromDictionary:params]];
        }
    } else {
        NSParameterAssert([params isKindOfClass:NSDictionary.class]);
        return nil;
    }
    return card;
}

- (STPPaymentMethodAddress *)extractPaymentMethodBillingDetailsAddressFromDictionary:(NSDictionary<TPSStripeType(PaymentMethodAddress), id>*)params {
    if (!params) {return nil;}

    STPPaymentMethodAddress * result = [[STPPaymentMethodAddress alloc] init];
#define simpleUnpack(key) result.key = [RCTConvert NSString:params[TPSStripeParam(PaymentMethodAddress, key)]]
    simpleUnpack(city);
    simpleUnpack(country);
    simpleUnpack(line1);
    simpleUnpack(line2);
    simpleUnpack(postalCode);
    simpleUnpack(state);
#undef simpleUnpack
    return result;
}

- (STPPaymentMethodBillingDetails *)extractPaymentMethodBillingDetailsFromDictionary:(NSDictionary<TPSStripeType(PaymentMethodBillingDetails), id>*)params {
    if (!params) {return nil;}

    STPPaymentMethodBillingDetails * result = [[STPPaymentMethodBillingDetails alloc] init];
    STPPaymentMethodAddress * address = [self extractPaymentMethodBillingDetailsAddressFromDictionary: params[TPSStripeParam(PaymentMethodBillingDetails, address)]];
#define simpleUnpack(key) result.key = [RCTConvert NSString:params[TPSStripeParam(PaymentMethodBillingDetails, key)]]
    result.address = address;
    simpleUnpack(email);
    simpleUnpack(name);
    simpleUnpack(phone);
#undef simpleUnpack
    return result;
}

- (STPPaymentMethodParams*)extractCreatePaymentMethodParamsFromDictionary:(NSDictionary<TPSStripeType(createPaymentMethod), id>*)params {
    NSDictionary<TPSStripeType(CardParams), id> * cardParamsInput = params[TPSStripeParam(createPaymentMethod, card)];
    if (!cardParamsInput && NSNull.null != (id)cardParamsInput) {return nil;}

    STPPaymentMethodCardParams * card = [self extractPaymentMethodCardParamsFromDictionary:cardParamsInput];
    STPPaymentMethodBillingDetails * details = [self extractPaymentMethodBillingDetailsFromDictionary: params[TPSStripeParam(createPaymentMethod, billingDetails)]];
    NSDictionary* metadata = params[TPSStripeParam(createPaymentMethod, metadata)];

    // TODO: decide if we want to support iDEAL bank accounts
    //    STPPaymentMethodiDEALParams * idealParams = [self extractIDEALParamsFromDictionary: params[TPSStripeParam(createPaymentMethod, iDEAL)]];
    //    stpParams.iDEAL = idealParams;

    return [STPPaymentMethodParams paramsWithCard:card billingDetails:details metadata:metadata];
}

- (STPPaymentIntentParams*)extractConfirmPaymentIntentParamsFromDictionary:(NSDictionary<TPSStripeType(confirmPaymentIntent), id> *)params {
#define simpleUnpack(key) result.key = [RCTConvert NSString:params[TPSStripeParam(confirmPaymentIntent, key)]]
    NSString* clientSecret = params[TPSStripeParam(confirmPaymentIntent, clientSecret)];
    NSParameterAssert(clientSecret);

    STPPaymentIntentParams * result = [[STPPaymentIntentParams alloc] initWithClientSecret:clientSecret];

    NSString * paymentMethodId = params[TPSStripeParam(confirmPaymentIntent, paymentMethodId)];
    STPPaymentMethodParams * methodParams = [self extractCreatePaymentMethodParamsFromDictionary:params[TPSStripeParam(confirmPaymentIntent, paymentMethod)]];
    // Don't assert, as it's allowed to omit a paymentMethodId/paymentMethodParams
    // for confirmPaymentIntent -- if the user had already attached the
    // paymentMethod on the backend.

    result.paymentMethodId = paymentMethodId;
    result.paymentMethodParams = methodParams;

    simpleUnpack(sourceId);
    simpleUnpack(returnURL);
    result.savePaymentMethod = @([RCTConvert BOOL:params[TPSStripeParam(confirmPaymentIntent, savePaymentMethod)]]);
    result.useStripeSDK = @YES;
#undef simpleUnpack
    return result;
}
- (STPSetupIntentConfirmParams*)extractConfirmSetupIntentParamsFromDictionary:(NSDictionary<TPSStripeType(confirmSetupIntent), id>*)params {
#define simpleUnpack(key) result.key = [RCTConvert NSString:params[TPSStripeParam(confirmSetupIntent, key)]]
    NSString* clientSecret = params[TPSStripeParam(confirmSetupIntent, clientSecret)];
    NSParameterAssert(clientSecret);

    STPSetupIntentConfirmParams * result = [[STPSetupIntentConfirmParams alloc] initWithClientSecret:clientSecret];

    NSString * paymentMethodId = params[TPSStripeParam(confirmSetupIntent, paymentMethodId)];
    STPPaymentMethodParams * methodParams = [self extractCreatePaymentMethodParamsFromDictionary:params[TPSStripeParam(confirmSetupIntent, paymentMethod)]];
    NSParameterAssert(paymentMethodId || methodParams);

    result.paymentMethodID = paymentMethodId;
    result.paymentMethodParams = methodParams;

    simpleUnpack(returnURL);
    result.useStripeSDK = @YES;
#undef simpleUnpack
    return result;
}

- (NSDictionary<TPSStripeType(ConfirmPaymentIntentResult), id>*)convertConfirmPaymentIntentResult:(STPPaymentIntent*)intent {
    if (!intent) {
        return @{ TPSStripeParam(ConfirmPaymentIntentResult, status): [RCTConvert STPPaymentIntentStatusString: STPPaymentIntentStatusUnknown] };
    }

    NSMutableDictionary * result
    = @{
        TPSStripeParam(ConfirmPaymentIntentResult, paymentIntentId): intent.stripeId,
        TPSStripeParam(ConfirmPaymentIntentResult, status): [RCTConvert STPPaymentIntentStatusString: intent.status],
        }.mutableCopy;

    // Optional parameters need to be serialized differently than non-nullable ones
    [result setValue:intent.paymentMethodId forKey:TPSStripeParam(ConfirmPaymentIntentResult, paymentMethodId)];

    return result;
}
- (NSDictionary<TPSStripeType(AuthenticatePaymentIntentResult), id>*)convertAuthenticatePaymentIntentResult:(STPPaymentIntent*)intent {
    if (!intent) {
        return @{ TPSStripeParam(AuthenticatePaymentIntentResult, status): [RCTConvert STPPaymentIntentStatusString: STPPaymentIntentStatusUnknown] };
    }

    NSMutableDictionary * result
    = @{
        TPSStripeParam(AuthenticatePaymentIntentResult, paymentIntentId): intent.stripeId,
        TPSStripeParam(AuthenticatePaymentIntentResult, status): [RCTConvert STPPaymentIntentStatusString: intent.status],
        }.mutableCopy;

    // Optional parameters need to be serialized differently than non-nullable ones
    [result setValue:intent.paymentMethodId forKey:TPSStripeParam(AuthenticatePaymentIntentResult, paymentMethodId)];

    return result;
}

- (NSDictionary<TPSStripeType(ConfirmSetupIntentResult), id>*)convertConfirmSetupIntentResult:(STPSetupIntent*)intent {
    if (!intent) {
        return @{ TPSStripeParam(ConfirmSetupIntentResult, status): [RCTConvert STPSetupIntentStatusString: STPSetupIntentStatusUnknown] };
    }

    NSMutableDictionary * result
    = @{
        TPSStripeParam(ConfirmSetupIntentResult, setupIntentId): intent.stripeID,
        TPSStripeParam(ConfirmSetupIntentResult, status): [RCTConvert STPSetupIntentStatusString: intent.status],
        }.mutableCopy;

    // Optional parameters need to be serialized differently than non-nullable ones
    [result setValue:intent.paymentMethodID forKey:TPSStripeParam(ConfirmSetupIntentResult, paymentMethodId)];

    return result;
}
- (NSDictionary<TPSStripeType(AuthenticateSetupIntentResult), id>*)convertAuthenticateSetupIntentResult:(STPSetupIntent*)intent {
    if (!intent) {
        return @{ TPSStripeParam(AuthenticateSetupIntentResult, status): [RCTConvert STPSetupIntentStatusString: STPSetupIntentStatusUnknown] };
    }

    NSMutableDictionary * result
    = @{
        TPSStripeParam(AuthenticateSetupIntentResult, setupIntentId): intent.stripeID,
        TPSStripeParam(AuthenticateSetupIntentResult, status): [RCTConvert STPSetupIntentStatusString: intent.status],
        }.mutableCopy;

    // Optional parameters need to be serialized differently than non-nullable ones
    [result setValue:intent.paymentMethodID forKey:TPSStripeParam(AuthenticateSetupIntentResult, paymentMethodId)];

    return result;
}

- (NSDictionary*)convertPaymentMethod:(STPPaymentMethod*)method {
    if (!method) {return nil;}
#define TPSEntry(key) TPSStripeParam(PaymentMethod, key): method.key ?: NSNull.null
    return @{
             TPSStripeParam(PaymentMethod, id): method.stripeId,
             TPSStripeParam(PaymentMethod, created): @(method.created.timeIntervalSince1970),
             TPSStripeParam(PaymentMethod, livemode): @(method.liveMode),
             TPSStripeParam(PaymentMethod, type): [RCTConvert STPPaymentMethodTypeString:method.type],
             TPSStripeParam(PaymentMethod, billingDetails): [self convertPaymentMethodBillingDetails: method.billingDetails] ?: NSNull.null,
             TPSStripeParam(PaymentMethod, card): [self convertPaymentMethodCard: method.card] ?: NSNull.null,
             TPSEntry(customerId),
             TPSEntry(metadata),
             };
#undef TPSEntry
}
- (NSDictionary*)convertPaymentMethodCard:(STPPaymentMethodCard*)card {
    if (!card) {return nil;}
#define TPSEntry(key) TPSStripeParam(PaymentMethodCard, key): card.key ?: NSNull.null
#define TPSEntryNum(key) TPSStripeParam(PaymentMethodCard, key): @(card.key)
    return @{
             TPSStripeParam(PaymentMethodCard, brand): [self cardBrandAsBrandSlug: card.brand] ?: NSNull.null,
             TPSEntry(country),
             TPSEntryNum(expMonth),
             TPSEntryNum(expYear),
             TPSEntry(funding),
             TPSEntry(last4),
             };
#undef TPSEntryNum
#undef TPSEntry
}
- (NSDictionary*)convertPaymentMethodBillingDetails:(STPPaymentMethodBillingDetails*)details {
    if (!details) {return nil;}
#define TPSEntry(key) TPSStripeParam(PaymentMethodBillingDetails, key): details.key ?: NSNull.null
    return @{
             TPSEntry(email),
             TPSEntry(name),
             TPSEntry(phone),
             TPSStripeParam(PaymentMethodBillingDetails, address): [self convertPaymentMethodAddress: details.address] ?: NSNull.null,
             };
#undef TPSEntry
}
- (NSDictionary<TPSStripeType(PaymentMethodAddress), id>*)convertPaymentMethodAddress:(STPPaymentMethodAddress*)address {
    if (!address) {return nil;}
#define TPSEntry(key) TPSStripeParam(PaymentMethodAddress, key): address.key ?: NSNull.null
    return @{
             TPSEntry(city),
             TPSEntry(country),
             TPSEntry(line1),
             TPSEntry(line2),
             TPSEntry(postalCode),
             TPSEntry(state),
             };
#undef TPSEntry
}
- (NSDictionary*)convertMetadata:(NSDictionary*)meta { return meta; }

#pragma mark - Lifecycles

- (void)resolvePromise:(id)result {
    if (promiseResolver) {
        promiseResolver(result);
    }
    [self resetPromiseCallbacks];
}

- (void)rejectPromiseWithCode:(NSString *)code message:(NSString *)message {
    [self rejectPromiseWithCode:code message:message error:nil];
}
- (void)rejectPromiseWithCode:(NSString *)code message:(NSString *)message error:(NSError*)error {
    if (promiseRejector) {
        promiseRejector(code, message, error);
    }
    [self resetPromiseCallbacks];
}

- (void)resetPromiseCallbacks {
    promiseResolver = nil;
    promiseRejector = nil;
}

- (void)resolveApplePayCompletion:(PKPaymentAuthorizationStatus)status {
    if (applePayCompletion) {
        applePayCompletion(status);
    }
    [self resetApplePayCallback];
}

- (void)resetApplePayCallback {
    applePayCompletion = nil;
}

- (BOOL)canSubmitPaymentRequest:(PKPaymentRequest *)paymentRequest rejecter:(RCTPromiseRejectBlock)reject {
    if (![Stripe deviceSupportsApplePay]) {
        NSDictionary *error = [errorCodes valueForKey:kErrorKeyDeviceNotSupportsNativePay];
        reject(error[kErrorKeyCode], error[kErrorKeyDescription], nil);
        return NO;
    }
    if (paymentRequest == nil) {
        NSDictionary *error = [errorCodes valueForKey:kErrorKeyNoPaymentRequest];
        reject(error[kErrorKeyCode], error[kErrorKeyDescription], nil);
        return NO;
    }
    if (paymentRequest.merchantIdentifier == nil) {
        NSDictionary *error = [errorCodes valueForKey:kErrorKeyNoMerchantIdentifier];
        reject(error[kErrorKeyCode], error[kErrorKeyDescription], nil);
        return NO;
    }
    if ([[[paymentRequest.paymentSummaryItems lastObject] amount] floatValue] < 0) {
        NSDictionary *error = [errorCodes valueForKey:kErrorKeyNoAmount];
        reject(error[kErrorKeyCode], error[kErrorKeyDescription], nil);
        return NO;
    }
    return YES;
}


#pragma mark - STPAddCardViewControllerDelegate

- (void)addCardViewController:(STPAddCardViewController *)addCardViewController
       didCreatePaymentMethod:(STPPaymentMethod *)paymentMethod
                   completion:(STPErrorBlock)completion {
    [RCTPresentedViewController() dismissViewControllerAnimated:YES completion:nil];

    requestIsCompleted = YES;
    completion(nil);
    [self resolvePromise:[self convertPaymentMethod:paymentMethod]];
}

- (void)addCardViewControllerDidCancel:(STPAddCardViewController *)addCardViewController {
    [RCTPresentedViewController() dismissViewControllerAnimated:YES completion:nil];

    if (!requestIsCompleted) {
        requestIsCompleted = YES;
        NSDictionary *error = [errorCodes valueForKey:kErrorKeyCancelled];
        [self rejectPromiseWithCode:error[kErrorKeyCode] message:error[kErrorKeyDescription]];
    }
}

#pragma mark PKPaymentAuthorizationViewControllerDelegate

- (void)paymentAuthorizationViewController:(PKPaymentAuthorizationViewController *)controller
                       didAuthorizePayment:(PKPayment *)payment
                                completion:(void (^)(PKPaymentAuthorizationStatus))completion {
    // Save for deffered call
    applePayCompletion = completion;

    STPAPIClient *stripeAPIClient = [self newAPIClient];

    [stripeAPIClient createTokenWithPayment:payment completion:^(STPToken * _Nullable token, NSError * _Nullable error) {
        self->requestIsCompleted = YES;

        if (error) {
            // Save for deffered use
            self->applePayStripeError = error;
            [self resolveApplePayCompletion:PKPaymentAuthorizationStatusFailure];
        } else {
            NSDictionary *result = [self convertTokenObject:token];
            NSDictionary *extra = @{
                                    @"billingContact": [self contactDetails:payment.billingContact] ?: [NSNull null],
                                    @"shippingContact": [self contactDetails:payment.shippingContact] ?: [NSNull null],
                                    @"shippingMethod": [self shippingDetails:payment.shippingMethod] ?: [NSNull null]
                                    };

            [result setValue:extra forKey:@"extra"];

            [self resolvePromise:result];
        }
    }];
}


- (void)paymentAuthorizationViewControllerDidFinish:(PKPaymentAuthorizationViewController *)controller {
    [self resetApplePayCallback];

    void(^completion)(void) = ^{
        if (!self->requestIsCompleted) {
            self->requestIsCompleted = YES;
            NSDictionary *error = [self->errorCodes valueForKey:kErrorKeyCancelled];
            [self rejectPromiseWithCode:error[kErrorKeyCode] message:error[kErrorKeyDescription]];
        } else {
            if (self->applePayStripeError) {
                NSDictionary *error = [self->errorCodes valueForKey:kErrorKeyApi];
                [self rejectPromiseWithCode:error[kErrorKeyCode]
                                    message:self->applePayStripeError.localizedDescription];
                self->applePayStripeError = nil;
            } else {
                [self resolvePromise:nil];
            }
        }
    };

    [RCTPresentedViewController() dismissViewControllerAnimated:YES completion:completion];
}

- (STPAPIClient *)newAPIClient {
    static STPAppInfo * info = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        info = [[STPAppInfo alloc] initWithName:TPSAppInfoName
                                      partnerId:TPSAppInfoPartnerId
                                        version:TPSAppInfoVersion
                                            url:TPSAppInfoURL];
    });

    STPAPIClient * client = [[STPAPIClient alloc] initWithPublishableKey:[Stripe defaultPublishableKey]];
    client.appInfo = info;
    client.stripeAccount = stripeAccount;

    // Singleton sharedHandler should have the matching API Client!
    STPPaymentHandler.sharedHandler.apiClient = client;
    return client;
}

- (NSDictionary *)convertTokenObject:(STPToken*)token {
    NSMutableDictionary *result = [@{} mutableCopy];

    // Token
    [result setValue:token.tokenId forKey:@"tokenId"];
    [result setValue:@([token.created timeIntervalSince1970]) forKey:@"created"];
    [result setValue:@(token.livemode) forKey:@"livemode"];

    // Card
    if (token.card) {
        NSMutableDictionary *card = [@{} mutableCopy];
        [result setValue:card forKey:@"card"];

        [card setValue:token.card.stripeID forKey:@"cardId"];

        [card setValue:[self cardBrandAsPresentableBrandString:token.card.brand] forKey:@"brand"];
        [card setValue:[self cardFunding:token.card.funding] forKey:@"funding"];
        [card setValue:token.card.last4 forKey:@"last4"];
        [card setValue:token.card.dynamicLast4 forKey:@"dynamicLast4"];
        [card setValue:@(token.card.isApplePayCard) forKey:@"isApplePayCard"];
        [card setValue:@(token.card.expMonth) forKey:@"expMonth"];
        [card setValue:@(token.card.expYear) forKey:@"expYear"];
        [card setValue:token.card.country forKey:@"country"];
        [card setValue:token.card.currency forKey:@"currency"];

        [card setValue:token.card.name forKey:@"name"];
        [card setValue:token.card.address.line1 forKey:@"addressLine1"];
        [card setValue:token.card.address.line2 forKey:@"addressLine2"];
        [card setValue:token.card.address.city forKey:@"addressCity"];
        [card setValue:token.card.address.state forKey:@"addressState"];
        [card setValue:token.card.address.country forKey:@"addressCountry"];
        [card setValue:token.card.address.postalCode forKey:@"addressZip"];
    }

    // Bank Account
    if (token.bankAccount) {
        NSMutableDictionary *bankAccount = [@{} mutableCopy];
        [result setValue:bankAccount forKey:@"bankAccount"];

        NSString *bankAccountStatusString =
        [RCTConvert STPBankAccountStatusString:token.bankAccount.status];
        [bankAccount setValue:bankAccountStatusString forKey:@"status"];
        [bankAccount setValue:token.bankAccount.country forKey:@"countryCode"];
        [bankAccount setValue:token.bankAccount.currency forKey:@"currency"];
        [bankAccount setValue:token.bankAccount.stripeID forKey:@"bankAccountId"];
        [bankAccount setValue:token.bankAccount.bankName forKey:@"bankName"];
        [bankAccount setValue:token.bankAccount.last4 forKey:@"last4"];
        [bankAccount setValue:token.bankAccount.accountHolderName forKey:@"accountHolderName"];
        NSString *bankAccountHolderTypeString =
        [RCTConvert STPBankAccountHolderTypeString:token.bankAccount.accountHolderType];
        [bankAccount setValue:bankAccountHolderTypeString forKey:@"accountHolderType"];
    }

    return result;
}

- (NSDictionary *)convertSourceObject:(STPSource*)source {
    NSMutableDictionary *result = [@{} mutableCopy];

    // Source
    [result setValue:source.clientSecret forKey:@"clientSecret"];
    [result setValue:@([source.created timeIntervalSince1970]) forKey:@"created"];
    [result setValue:source.currency forKey:@"currency"];
    [result setValue:@(source.livemode) forKey:@"livemode"];
    [result setValue:source.amount forKey:@"amount"];
    [result setValue:source.stripeID forKey:@"sourceId"];

    // Flow
    [result setValue:[self sourceFlow:source.flow] forKey:@"flow"];

    // Metadata
    if (source.metadata) {
        [result setValue:source.metadata forKey:@"metadata"];
    }

    // Owner
    if (source.owner) {
        NSMutableDictionary *owner = [@{} mutableCopy];
        [result setValue:owner forKey:@"owner"];

        if (source.owner.address) {
            [owner setObject:source.owner.address forKey:@"address"];
        }
        [owner setValue:source.owner.email forKey:@"email"];
        [owner setValue:source.owner.name forKey:@"name"];
        [owner setValue:source.owner.phone forKey:@"phone"];

        if (source.owner.verifiedAddress) {
            [owner setObject:source.owner.verifiedAddress forKey:@"verifiedAddress"];
        }
        [owner setValue:source.owner.verifiedEmail forKey:@"verifiedEmail"];
        [owner setValue:source.owner.verifiedName forKey:@"verifiedName"];
        [owner setValue:source.owner.verifiedPhone forKey:@"verifiedPhone"];
    }

    // Details
    if (source.details) {
        [result setValue:source.details forKey:@"details"];
    }

    // Receiver
    if (source.receiver) {
        NSMutableDictionary *receiver = [@{} mutableCopy];
        [result setValue:receiver forKey:@"receiver"];

        [receiver setValue:source.receiver.address forKey:@"address"];
        [receiver setValue:source.receiver.amountCharged forKey:@"amountCharged"];
        [receiver setValue:source.receiver.amountReceived forKey:@"amountReceived"];
        [receiver setValue:source.receiver.amountReturned forKey:@"amountReturned"];
    }

    // Redirect
    if (source.redirect) {
        NSMutableDictionary *redirect = [@{} mutableCopy];
        [result setValue:redirect forKey:@"redirect"];
        NSString *returnURL = source.redirect.returnURL.absoluteString;
        [redirect setValue:returnURL forKey:@"returnURL"];
        NSString *url = source.redirect.url.absoluteString;
        [redirect setValue:url forKey:@"url"];
        [redirect setValue:[self sourceRedirectStatus:source.redirect.status] forKey:@"status"];
    }

    // Verification
    if (source.verification) {
        NSMutableDictionary *verification = [@{} mutableCopy];
        [result setValue:verification forKey:@"verification"];

        [verification setValue:source.verification.attemptsRemaining forKey:@"attemptsRemaining"];
        [verification setValue:[self sourceVerificationStatus:source.verification.status] forKey:@"status"];
    }

    // Status
    [result setValue:[self sourceStatus:source.status] forKey:@"status"];

    // Type
    [result setValue:[self sourceType:source.type] forKey:@"type"];

    // Usage
    [result setValue:[self sourceUsage:source.usage] forKey:@"usage"];

    // CardDetails
    if (source.cardDetails) {
        NSMutableDictionary *cardDetails = [@{} mutableCopy];
        [result setValue:cardDetails forKey:@"cardDetails"];

        [cardDetails setValue:source.cardDetails.last4 forKey:@"last4"];
        [cardDetails setValue:@(source.cardDetails.expMonth) forKey:@"expMonth"];
        [cardDetails setValue:@(source.cardDetails.expYear) forKey:@"expYear"];
        [cardDetails setValue:[self cardBrandAsPresentableBrandString:source.cardDetails.brand] forKey:@"brand"];
        [cardDetails setValue:[self cardFunding:source.cardDetails.funding] forKey:@"funding"];
        [cardDetails setValue:source.cardDetails.country forKey:@"country"];
        [cardDetails setValue:[self card3DSecureStatus:source.cardDetails.threeDSecure] forKey:@"threeDSecure"];
    }

    // SepaDebitDetails
    if (source.sepaDebitDetails) {
        NSMutableDictionary *sepaDebitDetails = [@{} mutableCopy];
        [result setValue:sepaDebitDetails forKey:@"sepaDebitDetails"];

        [sepaDebitDetails setValue:source.sepaDebitDetails.last4 forKey:@"last4"];
        [sepaDebitDetails setValue:source.sepaDebitDetails.bankCode forKey:@"bankCode"];
        [sepaDebitDetails setValue:source.sepaDebitDetails.country forKey:@"country"];
        [sepaDebitDetails setValue:source.sepaDebitDetails.fingerprint forKey:@"fingerprint"];
        [sepaDebitDetails setValue:source.sepaDebitDetails.mandateReference forKey:@"mandateReference"];
        NSString *mandateURL = source.sepaDebitDetails.mandateURL.absoluteString;
        [sepaDebitDetails setValue:mandateURL forKey:@"mandateURL"];
    }

    return result;
}

/// API: https://stripe.com/docs/api/payment_methods/object#payment_method_object-card-brand
- (NSString *)cardBrandAsBrandSlug:(STPCardBrand)inputBrand {
    switch (inputBrand) {
        case STPCardBrandJCB:
            return @"jcb";
        case STPCardBrandAmex:
            return @"amex";
        case STPCardBrandVisa:
            return @"visa";
        case STPCardBrandDiscover:
            return @"discover";
        case STPCardBrandDinersClub:
            return @"diners";
        case STPCardBrandMasterCard:
            return @"mastercard";
        case STPCardBrandUnknown:
        default:
            return @"unknown";
    }
}

/// API: https://stripe.com/docs/api/cards/object#card_object-brand
- (NSString *)cardBrandAsPresentableBrandString:(STPCardBrand)inputBrand {
    return STPStringFromCardBrand(inputBrand);
}

- (NSString *)cardFunding:(STPCardFundingType)inputFunding {
    switch (inputFunding) {
        case STPCardFundingTypeDebit:
            return @"debit";
        case STPCardFundingTypeCredit:
            return @"credit";
        case STPCardFundingTypePrepaid:
            return @"prepaid";
        case STPCardFundingTypeOther:
        default:
            return @"unknown";
    }
}

- (NSString *)card3DSecureStatus:(STPSourceCard3DSecureStatus)inputStatus {
    switch (inputStatus) {
        case STPSourceCard3DSecureStatusRequired:
            return @"required";
        case STPSourceCard3DSecureStatusOptional:
            return @"optional";
        case STPSourceCard3DSecureStatusNotSupported:
            return @"notSupported";
        case STPSourceCard3DSecureStatusUnknown:
        default:
            return @"unknown";
    }
}

- (NSString *)sourceFlow:(STPSourceFlow)inputFlow {
    switch (inputFlow) {
        case STPSourceFlowNone:
            return @"none";
        case STPSourceFlowRedirect:
            return @"redirect";
        case STPSourceFlowCodeVerification:
            return @"codeVerification";
        case STPSourceFlowReceiver:
            return @"receiver";
        case STPSourceFlowUnknown:
        default:
            return @"unknown";
    }
}

- (NSString *)sourceRedirectStatus:(STPSourceRedirectStatus)inputStatus {
    switch (inputStatus) {
        case STPSourceRedirectStatusPending:
            return @"pending";
        case STPSourceRedirectStatusSucceeded:
            return @"succeeded";
        case STPSourceRedirectStatusFailed:
            return @"failed";
        case STPSourceRedirectStatusUnknown:
        default:
            return @"unknown";
    }
}

- (NSString *)sourceVerificationStatus:(STPSourceVerificationStatus)inputStatus {
    switch (inputStatus) {
        case STPSourceVerificationStatusPending:
            return @"pending";
        case STPSourceVerificationStatusSucceeded:
            return @"succeeded";
        case STPSourceVerificationStatusFailed:
            return @"failed";
        case STPSourceVerificationStatusUnknown:
        default:
            return @"unknown";
    }
}

- (NSString *)sourceStatus:(STPSourceStatus)inputStatus {
    switch (inputStatus) {
        case STPSourceStatusPending:
            return @"pending";
        case STPSourceStatusChargeable:
            return @"chargable";
        case STPSourceStatusConsumed:
            return @"consumed";
        case STPSourceStatusCanceled:
            return @"canceled";
        case STPSourceStatusFailed:
            return @"failed";
        case STPSourceStatusUnknown:
        default:
            return @"unknown";
    }
}

- (NSString *)sourceType:(STPSourceType)inputType {
    switch (inputType) {
        case STPSourceTypeBancontact:
            return @"bancontact";
        case STPSourceTypeGiropay:
            return @"giropay";
        case STPSourceTypeIDEAL:
            return @"ideal";
        case STPSourceTypeSEPADebit:
            return @"sepaDebit";
        case STPSourceTypeSofort:
            return @"sofort";
        case STPSourceTypeThreeDSecure:
            return @"threeDSecure";
        case STPSourceTypeAlipay:
            return @"alipay";
        case STPSourceTypeUnknown:
        default:
            return @"unknown";
    }
}

- (NSString *)sourceUsage:(STPSourceUsage)inputUsage {
    switch (inputUsage) {
        case STPSourceUsageReusable:
            return @"reusable";
        case STPSourceUsageSingleUse:
            return @"singleUse";
        case STPSourceUsageUnknown:
        default:
            return @"unknown";
    }
}

- (NSDictionary *)contactDetails:(PKContact*)inputContact {
    NSMutableDictionary *contactDetails = [[NSMutableDictionary alloc] init];

    if (inputContact.name) {
        [contactDetails setValue:[NSPersonNameComponentsFormatter localizedStringFromPersonNameComponents:inputContact.name style:NSPersonNameComponentsFormatterStyleDefault options:0] forKey:@"name"];
    }

    if (inputContact.phoneNumber) {
        [contactDetails setValue:[inputContact.phoneNumber stringValue] forKey:@"phoneNumber"];
    }

    if (inputContact.emailAddress) {
        [contactDetails setValue:inputContact.emailAddress forKey:@"emailAddress"];
    }

    if (inputContact.supplementarySubLocality) {
        [contactDetails setValue:inputContact.supplementarySubLocality forKey:@"supplementarySubLocality"];
    }

    for (NSString *elem in @[@"street", @"city", @"state", @"country", @"ISOCountryCode", @"postalCode"]) {
        if ([inputContact.postalAddress respondsToSelector:NSSelectorFromString(elem)]) {
            [contactDetails setValue:[inputContact.postalAddress valueForKey:elem] forKey:elem];
        }
    }
    if ([contactDetails count] == 0) {
        return nil;
    }

    return contactDetails;
}

- (NSDictionary *)shippingDetails:(PKShippingMethod*)inputShipping {
    NSMutableDictionary *shippingDetails = [[NSMutableDictionary alloc] init];

    if (inputShipping.label) {
        [shippingDetails setValue:inputShipping.label forKey:@"label"];
    }

    if (inputShipping.amount) {
        [shippingDetails setValue:[[self numberFormatter] stringFromNumber: inputShipping.amount] forKey:@"amount"];
    }

    if (inputShipping.detail) {
        [shippingDetails setValue:inputShipping.detail forKey:@"detail"];
    }

    if (inputShipping.identifier) {
        [shippingDetails setValue:inputShipping.identifier forKey:@"id"];
    }

    if ([shippingDetails count] == 0) {
        return nil;
    }

    return shippingDetails;
}

- (PKAddressField)applePayAddressFields:(NSArray <NSString *> *)addressFieldStrings {
    PKAddressField addressField = PKAddressFieldNone;

    for (NSString *addressFieldString in addressFieldStrings) {
        addressField |= [self applePayAddressField:addressFieldString];
    }

    return addressField;
}

- (PKAddressField)applePayAddressField:(NSString *)addressFieldString {
    PKAddressField addressField = PKAddressFieldNone;
    if ([addressFieldString isEqualToString:@"postal_address"]) {
        addressField = PKAddressFieldPostalAddress;
    }
    if ([addressFieldString isEqualToString:@"phone"]) {
        addressField = PKAddressFieldPhone;
    }
    if ([addressFieldString isEqualToString:@"email"]) {
        addressField = PKAddressFieldEmail;
    }
    if ([addressFieldString isEqualToString:@"name"]) {
        addressField = PKAddressFieldName;
    }
    if ([addressFieldString isEqualToString:@"all"]) {
        addressField = PKAddressFieldAll;
    }
    return addressField;
}

- (PKShippingType)applePayShippingType:(NSString*)inputType {
    PKShippingType shippingType = PKShippingTypeShipping;
    if ([inputType isEqualToString:@"delivery"]) {
        shippingType = PKShippingTypeDelivery;
    }
    if ([inputType isEqualToString:@"store_pickup"]) {
        shippingType = PKShippingTypeStorePickup;
    }
    if ([inputType isEqualToString:@"service_pickup"]) {
        shippingType = PKShippingTypeServicePickup;
    }

    return shippingType;
}

- (STPBillingAddressFields)billingType:(NSString*)inputType {
    if ([inputType isEqualToString:@"zip"]) {
        return STPBillingAddressFieldsZip;
    }
    if ([inputType isEqualToString:@"name"]) {
        return STPBillingAddressFieldsName;
    }
    if ([inputType isEqualToString:@"full"]) {
        return STPBillingAddressFieldsFull;
    }
    return STPBillingAddressFieldsNone;
}

- (STPUserInformation *)userInformation:(NSDictionary*)inputInformation {
    STPUserInformation *userInformation = [[STPUserInformation alloc] init];

    [userInformation setBillingAddress: [self address:inputInformation[@"billingAddress"]]];
    [userInformation setShippingAddress: [self address:inputInformation[@"shippingAddress"]]];

    return userInformation;
}

- (STPAddress *)address:(NSDictionary*)inputAddress {
    STPAddress *address = [[STPAddress alloc] init];

    [address setName:inputAddress[@"name"]];
    [address setLine1:inputAddress[@"line1"]];
    [address setLine2:inputAddress[@"line2"]];
    [address setCity:inputAddress[@"city"]];
    [address setState:inputAddress[@"state"]];
    [address setPostalCode:inputAddress[@"postalCode"]];
    [address setCountry:inputAddress[@"country"]];
    [address setPhone:inputAddress[@"phone"]];
    [address setEmail:inputAddress[@"email"]];

    return address;
}

- (STPTheme *)formTheme:(NSDictionary*)options {
    STPTheme *theme = [[STPTheme alloc] init];

    [theme setPrimaryBackgroundColor:[RCTConvert UIColor:options[@"primaryBackgroundColor"]]];
    [theme setSecondaryBackgroundColor:[RCTConvert UIColor:options[@"secondaryBackgroundColor"]]];
    [theme setPrimaryForegroundColor:[RCTConvert UIColor:options[@"primaryForegroundColor"]]];
    [theme setSecondaryForegroundColor:[RCTConvert UIColor:options[@"secondaryForegroundColor"]]];
    [theme setAccentColor:[RCTConvert UIColor:options[@"accentColor"]]];
    [theme setErrorColor:[RCTConvert UIColor:options[@"errorColor"]]];
    [theme setErrorColor:[RCTConvert UIColor:options[@"errorColor"]]];
    // TODO: process font vars

    return theme;
}

- (UIModalPresentationStyle)formPresentation:(NSString*)inputType {
    if ([inputType isEqualToString:@"pageSheet"])
        return UIModalPresentationPageSheet;
    if ([inputType isEqualToString:@"formSheet"])
        return UIModalPresentationFormSheet;

    return UIModalPresentationFullScreen;
}

+ (NSArray <NSString *> *)applePaySupportedPaymentNetworksStrings {
    static NSArray<NSString*> * tmp = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        tmp = [mapTPSPaymentNetworkToPKPaymentNetwork.allKeys sortedArrayUsingSelector:@selector(compare:)];
    });
    return tmp;
}

- (NSArray <PKPaymentNetwork> *)paymentNetworks:(NSArray <NSString *> *)paymentNetworkStrings {
    NSMutableArray <PKPaymentNetwork> *results = [@[] mutableCopy];

    for (NSString *paymentNetworkString in paymentNetworkStrings) {
        PKPaymentNetwork paymentNetwork = [self paymentNetwork:paymentNetworkString];
        if (paymentNetwork) {
            [results addObject:paymentNetwork];
        }
    }

    return [results copy];
}

- (PKPaymentNetwork)paymentNetwork:(NSString *)paymentNetworkString {
    static NSDictionary *paymentNetworksMap;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        NSMutableDictionary *mutableMap = [@{} mutableCopy];

        if ((&PKPaymentNetworkAmex) != NULL) {
            mutableMap[TPSPaymentNetworkAmex] = PKPaymentNetworkAmex;
        }

        if ((&PKPaymentNetworkDiscover) != NULL) {
            mutableMap[TPSPaymentNetworkDiscover] = PKPaymentNetworkDiscover;
        }

        if ((&PKPaymentNetworkMasterCard) != NULL) {
            mutableMap[TPSPaymentNetworkMasterCard] = PKPaymentNetworkMasterCard;
        }

        if ((&PKPaymentNetworkVisa) != NULL) {
            mutableMap[TPSPaymentNetworkVisa] = PKPaymentNetworkVisa;
        }

        paymentNetworksMap = [mutableMap copy];
    });

    return paymentNetworksMap[paymentNetworkString];
}

- (NSNumberFormatter *)numberFormatter {
    static NSNumberFormatter *kSharedFormatter;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        kSharedFormatter = [[NSNumberFormatter alloc] init];
        [kSharedFormatter setPositiveFormat:@"$0.00"];
    });
    return kSharedFormatter;
}

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

- (nonnull UIViewController *)authenticationPresentingViewController {
    // React-Native should only have 1 active view controller
    return RCTPresentedViewController();
}

@end
