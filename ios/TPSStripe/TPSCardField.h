//
//  TPSCardField.h
//  TPSStripe
//
//  Created by Anton Petrov on 01.11.16.
//  Copyright © 2016 Tipsi. All rights reserved.
//

#import <Stripe/Stripe.h>
#import "UIView+React.h"

@interface TPSCardField : STPPaymentCardTextField

@property (nonatomic, copy) RCTBubblingEventBlock onChange;

@end
