//
//  TPSStripeManager.h
//  TPSStripe
//
//  Created by Anton Petrov on 28.10.16.
//  Copyright © 2016 Tipsi. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <PassKit/PassKit.h>
#import <Stripe/Stripe.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTConvert.h>

API_AVAILABLE(ios(11.0))
@interface StripeModule : RCTEventEmitter <RCTBridgeModule, PKPaymentAuthorizationViewControllerDelegate, STPAddCardViewControllerDelegate>

@property (nonatomic) STPRedirectContext *redirectContext;

@end
