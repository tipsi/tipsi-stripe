//
//  TPSStripeManager.m
//  TPSStripe
//
//  Created by Anton Petrov on 28.10.16.
//  Copyright © 2016 Tipsi. All rights reserved.
//

#import "TPSStripeManager.h"
#import "RCTLog.h"

#import <Stripe.h>
#import <PassKit/PassKit.h>

@implementation TPSStripeManager
{
    NSString *publishableKey;
    NSString *merchantId;
    
    UIViewController *rootViewController;

    RCTPromiseResolveBlock promiseResolver;
    RCTPromiseRejectBlock promiseRejector;
    
    Boolean requestIsCompleted;
    
    void (^paymentCompletion)(PKPaymentAuthorizationStatus);
}

- (id)init {
    if ((self = [super init])) {
    }
    return self;
}

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(printMessage:(NSString *)mesage)
{
    RCTLogInfo(mesage);
}

RCT_EXPORT_METHOD(init:(NSDictionary *)options)
{
    publishableKey = options[@"publishableKey"];
    merchantId = options[@"merchantId"];
    
    rootViewController = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
    
    [Stripe setDefaultPublishableKey:@"pk_test_m3kEfDWERg2qNxwlikeKzeEI"];
}

RCT_EXPORT_METHOD(deviceSupportsApplePay:(RCTPromiseResolveBlock)resolve
                                rejecter:(RCTPromiseRejectBlock)reject)
{
    resolve(@([Stripe deviceSupportsApplePay]));
}

RCT_EXPORT_METHOD(completePayment:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    if (paymentCompletion) {
        paymentCompletion(PKPaymentAuthorizationStatusSuccess);
    }
    resolve(nil);
}

RCT_EXPORT_METHOD(cancelPayment:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    if (paymentCompletion) {
        paymentCompletion(PKPaymentAuthorizationStatusFailure);
    }
    resolve(nil);
}


RCT_EXPORT_METHOD(paymentRequestWithApplePay:(NSArray *)items
                                 withOptions:(NSDictionary *)options
                                    resolver:(RCTPromiseResolveBlock)resolve
                                    rejecter:(RCTPromiseRejectBlock)reject)
{
    requestIsCompleted = NO;
    // Save promise handlers to use in `paymentAuthorizationViewController`
    promiseResolver = resolve;
    promiseRejector = reject;
    
    NSUInteger shippingAddressFields = options[@"shippingAddressFields"] ? [options[@"shippingAddressFields"] integerValue] : 0;
    NSUInteger billingAddressFields = options[@"billingAddressFields"] ? [options[@"billingAddressFields"] integerValue] : 0;
    NSString* currencyCode = options[@"currencyCode"] ? options[@"currencyCode"] : @"USD";
    
    NSMutableArray *summaryItems = [NSMutableArray array];
    
    for (NSDictionary *item in items) {
        PKPaymentSummaryItem *summaryItem = [[PKPaymentSummaryItem alloc] init];
        summaryItem.label = item[@"label"];
        summaryItem.amount = [NSDecimalNumber decimalNumberWithString:item[@"amount"]];
        [summaryItems addObject:summaryItem];
    }

    PKPaymentRequest *paymentRequest = [Stripe paymentRequestWithMerchantIdentifier:merchantId];

    [paymentRequest setPaymentSummaryItems:summaryItems];
    [paymentRequest setRequiredShippingAddressFields:shippingAddressFields];
    [paymentRequest setRequiredBillingAddressFields:billingAddressFields];
    [paymentRequest setCurrencyCode:currencyCode];

    if ([Stripe canSubmitPaymentRequest:paymentRequest]) {
        PKPaymentAuthorizationViewController *paymentAuthorizationVC = [[PKPaymentAuthorizationViewController alloc] initWithPaymentRequest:paymentRequest];
        paymentAuthorizationVC.delegate = self;
        [rootViewController presentViewController:paymentAuthorizationVC animated:YES completion:nil];
        // resolve(@(TRUE));
    } else {
        // there is a problem with your Apple Pay configuration.
        NSError *error = [NSError errorWithDomain:@"StipeNative" code:1 userInfo:@{NSLocalizedDescriptionKey:@"Apple Pay configuration error"}];
        // reject(nil, nil, error);
    }
}

#pragma mark PKPaymentAuthorizationViewControllerDelegate

- (void)paymentAuthorizationViewController:(PKPaymentAuthorizationViewController *)controller
                       didAuthorizePayment:(PKPayment *)payment
                                completion:(void (^)(PKPaymentAuthorizationStatus))completion {\
    // Save for deffered call
    paymentCompletion = completion;

    [[STPAPIClient sharedClient] createTokenWithPayment:payment completion:^(STPToken * _Nullable token, NSError * _Nullable error) {
        requestIsCompleted = YES;

        if (error) {
            completion(PKPaymentAuthorizationStatusFailure);
            promiseRejector(nil, nil, error);
        } else {
            // completion(PKPaymentAuthorizationStatusSuccess);
            promiseResolver(token.tokenId);
        }
    }];
}

- (void)paymentAuthorizationViewControllerDidFinish:(PKPaymentAuthorizationViewController *)controller {
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

@end
