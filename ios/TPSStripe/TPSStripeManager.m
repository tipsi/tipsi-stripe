//
//  TPSStripeManager.m
//  TPSStripe
//
//  Created by Anton Petrov on 28.10.16.
//  Copyright © 2016 Tipsi. All rights reserved.
//

#import "TPSStripeManager.h"

@implementation TPSStripeManager
{
    NSString *publishableKey;
    NSString *merchantId;
    
    UIViewController *rootViewController;

    RCTPromiseResolveBlock promiseResolver;
    RCTPromiseRejectBlock promiseRejector;
    
    Boolean requestIsCompleted;
    
    void (^applePayCompletion)(PKPaymentAuthorizationStatus);
}

- (id)init {
    if ((self = [super init])) {
        requestIsCompleted = YES;
    }
    return self;
}

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(init:(NSDictionary *)options)
{
    publishableKey = options[@"publishableKey"];
    merchantId = options[@"merchantId"];
    
    rootViewController = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
    
    [Stripe setDefaultPublishableKey:publishableKey];
}

RCT_EXPORT_METHOD(deviceSupportsApplePay:(RCTPromiseResolveBlock)resolve
                                rejecter:(RCTPromiseRejectBlock)reject)
{
    resolve(@([Stripe deviceSupportsApplePay]));
}

RCT_EXPORT_METHOD(completeApplePayRequest:(RCTPromiseResolveBlock)resolve
                         rejecter:(RCTPromiseRejectBlock)reject)
{
    if (applePayCompletion) {
        applePayCompletion(PKPaymentAuthorizationStatusSuccess);
    }
    resolve(nil);
}

RCT_EXPORT_METHOD(cancelApplePayRequest:(RCTPromiseResolveBlock)resolve
                       rejecter:(RCTPromiseRejectBlock)reject)
{
    if (applePayCompletion) {
        applePayCompletion(PKPaymentAuthorizationStatusFailure);
    }
    resolve(nil);
}

RCT_EXPORT_METHOD(createTokenWithCard:(NSDictionary *)params
                  withOptions:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    if(!requestIsCompleted) {
        reject(
            [NSString stringWithFormat:@"%ld", (long)3],
            @"Previous request is not completed",
            [[NSError alloc] initWithDomain:@"StripeNative" code:3 userInfo:@{NSLocalizedDescriptionKey:@"Previous request is not completed"}]
        );
        return;
    }
    
    requestIsCompleted = NO;
    
    STPCardParams *cardParams = [[STPCardParams alloc] init];
    cardParams.number = params[@"number"];
    cardParams.expMonth = [params[@"expMonth"] integerValue];
    cardParams.expYear = [params[@"expYear"] integerValue];
    cardParams.cvc = params[@"cvc"];
    cardParams.name = params[@"name"];
    cardParams.currency = params[@"currency"];
    
    [[STPAPIClient sharedClient] createTokenWithCard:cardParams completion:^(STPToken *token, NSError *error) {
        requestIsCompleted = YES;

        if (error) {
            reject(nil, nil, error);
        } else {
            resolve(@{ @"token": token.tokenId });
        }
    }];
}


RCT_EXPORT_METHOD(paymentRequestWithCardForm:(NSString *)amount
                            withOptions:(NSDictionary *)options
                               resolver:(RCTPromiseResolveBlock)resolve
                               rejecter:(RCTPromiseRejectBlock)reject)
{
    if(!requestIsCompleted) {
        reject(
            [NSString stringWithFormat:@"%ld", (long)3],
            @"Previous request is not completed",
            [[NSError alloc] initWithDomain:@"StripeNative" code:3 userInfo:@{NSLocalizedDescriptionKey:@"Previous request is not completed"}]
        );
        return;
    }

    requestIsCompleted = NO;
    // Save promise handlers to use in `paymentAuthorizationViewController`
    promiseResolver = resolve;
    promiseRejector = reject;
    
    NSUInteger requiredBillingAddressFields = [self getBillingType:options[@"requiredBillingAddressFields"]];
    NSString *companyName = options[@"companyName"] ? options[@"companyName"] : @"";
    BOOL smsAutofillDisabled = [options[@"smsAutofillDisabled"] boolValue];
    NSString *nextPublishableKey = options[@"publishableKey"] ? options[@"publishableKey"] : publishableKey;
    UIModalPresentationStyle formPresentation = [self getFormPresentation:options[@"presentation"]];
    STPTheme *theme = [self getFormTheme:options[@"theme"]];
    
    STPPaymentConfiguration *configuration = [[STPPaymentConfiguration alloc] init];
    [configuration setRequiredBillingAddressFields:requiredBillingAddressFields];
    [configuration setCompanyName:companyName];
    [configuration setSmsAutofillDisabled:smsAutofillDisabled];
    [configuration setPublishableKey:nextPublishableKey];
    
    
    STPAddCardViewController *addCardViewController = [[STPAddCardViewController alloc] initWithConfiguration:configuration theme:theme];
    addCardViewController.delegate = self;
    // STPAddCardViewController must be shown inside a UINavigationController.
    UINavigationController *navigationController = [[UINavigationController alloc] initWithRootViewController:addCardViewController];
    [navigationController setModalPresentationStyle:formPresentation];
    [rootViewController presentViewController:navigationController animated:YES completion:nil];
}

RCT_EXPORT_METHOD(paymentRequestWithApplePay:(NSArray *)items
                                 withOptions:(NSDictionary *)options
                                    resolver:(RCTPromiseResolveBlock)resolve
                                    rejecter:(RCTPromiseRejectBlock)reject)
{
    if(!requestIsCompleted) {
        reject(
           [NSString stringWithFormat:@"%ld", (long)3],
           @"Previous request is not completed",
           [[NSError alloc] initWithDomain:@"StripeNative" code:3 userInfo:@{NSLocalizedDescriptionKey:@"Previous request is not completed"}]
        );
        return;
    }

    requestIsCompleted = NO;
    // Save promise handlers to use in `paymentAuthorizationViewController`
    promiseResolver = resolve;
    promiseRejector = reject;
    
    NSUInteger requiredShippingAddressFields = [self getApplePayAddressFields:options[@"requiredShippingAddressFields"]];
    NSUInteger requiredBillingAddressFields = [self getApplePayAddressFields:options[@"requiredBillingAddressFields"]];
    PKShippingType shippingType = [self getApplePayShippingType:options[@"shippingType"]];
    NSMutableArray *shippingMethodsItems = options[@"shippingMethods"] ? options[@"shippingMethods"] : [NSMutableArray array];
    NSString* currencyCode = options[@"currencyCode"] ? options[@"currencyCode"] : @"USD";
    
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
        [summaryItems addObject:summaryItem];
    }

    PKPaymentRequest *paymentRequest = [Stripe paymentRequestWithMerchantIdentifier:merchantId];

    [paymentRequest setRequiredShippingAddressFields:requiredShippingAddressFields];
    [paymentRequest setRequiredBillingAddressFields:requiredBillingAddressFields];
    [paymentRequest setPaymentSummaryItems:summaryItems];
    [paymentRequest setShippingMethods:shippingMethods];
    [paymentRequest setShippingType:shippingType];
    [paymentRequest setCurrencyCode:currencyCode];

    if ([Stripe canSubmitPaymentRequest:paymentRequest]) {
        PKPaymentAuthorizationViewController *paymentAuthorizationVC = [[PKPaymentAuthorizationViewController alloc] initWithPaymentRequest:paymentRequest];
        paymentAuthorizationVC.delegate = self;
        [rootViewController presentViewController:paymentAuthorizationVC animated:YES completion:nil];;
    } else {
        // There is a problem with your Apple Pay configuration.
        NSError *error = [NSError errorWithDomain:@"StipeNative" code:1 userInfo:@{NSLocalizedDescriptionKey:@"Apple Pay configuration error"}];
    }
}


#pragma mark STPAddCardViewControllerDelegate

- (void)addCardViewController:(STPAddCardViewController *)controller
               didCreateToken:(STPToken *)token
                   completion:(STPErrorBlock)completion
{
        [rootViewController dismissViewControllerAnimated:YES completion:nil];

        requestIsCompleted = YES;
        completion(nil);
        promiseResolver(@{ @"token": token.tokenId });
}

- (void)addCardViewControllerDidCancel:(STPAddCardViewController *)addCardViewController
{
    [rootViewController dismissViewControllerAnimated:YES completion:nil];
    
    if (!requestIsCompleted) {
        requestIsCompleted = YES;
        promiseRejector(
            [NSString stringWithFormat:@"%ld", (long)2],
            @"User canceled payment via card",
            [[NSError alloc] initWithDomain:@"StripeNative" code:2 userInfo:@{NSLocalizedDescriptionKey:@"User canceled payment via card"}]
        );
    }

}

#pragma mark PKPaymentAuthorizationViewControllerDelegate

- (void)paymentAuthorizationViewController:(PKPaymentAuthorizationViewController *)controller
                       didAuthorizePayment:(PKPayment *)payment
                                completion:(void (^)(PKPaymentAuthorizationStatus))completion
{
    // Save for deffered call
    applePayCompletion = completion;

    [[STPAPIClient sharedClient] createTokenWithPayment:payment completion:^(STPToken * _Nullable token, NSError * _Nullable error) {
        requestIsCompleted = YES;

        if (error) {
            completion(PKPaymentAuthorizationStatusFailure);
            promiseRejector(nil, nil, error);
        } else {
            promiseResolver(@{
                @"token": token.tokenId,
                @"billingContact": [self getContactDetails:payment.billingContact],
                @"shippingContact": [self getContactDetails:payment.shippingContact],
                @"shippingMethod": [self getShippingDetails:payment.shippingMethod]
            });
        }
    }];
}


- (void)paymentAuthorizationViewControllerDidFinish:(PKPaymentAuthorizationViewController *)controller
{
    [rootViewController dismissViewControllerAnimated:YES completion:nil];
    
    if (!requestIsCompleted) {
        requestIsCompleted = YES;
        promiseRejector(
            [NSString stringWithFormat:@"%ld", (long)2],
            @"User canceled Apple Pay",
            [[NSError alloc] initWithDomain:@"StripeNative" code:2 userInfo:@{NSLocalizedDescriptionKey:@"User canceled Apple Pay"}]
        );
    }
}


- (NSDictionary *)getContactDetails:(PKContact*)inputContact
{
    NSMutableDictionary *contactDetails = [[NSMutableDictionary alloc] init];

    if (inputContact.name)
        [contactDetails setValue:[NSPersonNameComponentsFormatter localizedStringFromPersonNameComponents:inputContact.name style:NSPersonNameComponentsFormatterStyleDefault options:0] forKey:@"name"];
    if (inputContact.phoneNumber)
        [contactDetails setValue:[inputContact.phoneNumber stringValue] forKey:@"phoneNumber"];
    if (inputContact.emailAddress)
        [contactDetails setValue:inputContact.emailAddress forKey:@"emailAddress"];
    if (inputContact.supplementarySubLocality)
        [contactDetails setValue:inputContact.supplementarySubLocality forKey:@"supplementarySubLocality"];
    for (NSString *elem in @[@"street", @"city", @"state", @"country", @"ISOCountryCode", @"postalCode"]) {
        if ([inputContact.postalAddress respondsToSelector:NSSelectorFromString(elem)])
            [contactDetails setValue:[inputContact.postalAddress valueForKey:elem] forKey:elem];
    }
    if ([contactDetails count] == 0)
        return [NSNull null];

    return contactDetails;
}

- (NSDictionary *)getShippingDetails:(PKShippingMethod*)inputShipping
{
    NSMutableDictionary *shippingDetails = [[NSMutableDictionary alloc] init];

    if (inputShipping.label)
        [shippingDetails setValue:inputShipping.label forKey:@"label"];
    if (inputShipping.amount)
        [shippingDetails setValue:[inputShipping.amount stringValue] forKey:@"amount"];
    if (inputShipping.detail)
        [shippingDetails setValue:inputShipping.detail forKey:@"detail"];
    if (inputShipping.identifier)
        [shippingDetails setValue:inputShipping.identifier forKey:@"id"];
    if ([shippingDetails count] == 0)
        return [NSNull null];

    return shippingDetails;
}

- (PKAddressField *)getApplePayAddressFields:(NSString*)inputType
{
    if ([inputType isEqualToString:@"postal_address"])
        return PKAddressFieldPostalAddress;
    if ([inputType isEqualToString:@"phone"])
        return PKAddressFieldPhone;
    if ([inputType isEqualToString:@"email"])
        return PKAddressFieldEmail;
    if ([inputType isEqualToString:@"name"])
        return PKAddressFieldName;
    if ([inputType isEqualToString:@"all"])
        return PKAddressFieldAll;
    
    return PKAddressFieldNone;
}

- (PKShippingType *)getApplePayShippingType:(NSString*)inputType
{
    if ([inputType isEqualToString:@"delivery"])
        return PKShippingTypeDelivery;
    if ([inputType isEqualToString:@"store_pickup"])
        return PKShippingTypeStorePickup;
    if ([inputType isEqualToString:@"service_pickup"])
        return PKShippingTypeServicePickup;

    return PKShippingTypeShipping;
}

- (STPBillingAddressFields *)getBillingType:(NSString*)inputType {
    if ([inputType isEqualToString:@"zip"])
        return STPBillingAddressFieldsZip;
    if ([inputType isEqualToString:@"full"])
        return STPBillingAddressFieldsFull;
    
    return STPBillingAddressFieldsNone;
}

- (STPTheme *)getFormTheme:(NSDictionary*)options
{
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

- (UIModalPresentationStyle *)getFormPresentation:(NSString*)inputType {
    if ([inputType isEqualToString:@"pageSheet"])
        return UIModalPresentationPageSheet;
    if ([inputType isEqualToString:@"formSheet"])
        return UIModalPresentationFormSheet;
    
    return UIModalPresentationFullScreen;
}

@end
