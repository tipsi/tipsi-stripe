//
//  TPSCardField.m
//  TPSStripe
//
//  Created by Anton Petrov on 01.11.16.
//  Copyright © 2016 Tipsi. All rights reserved.
//

#import "TPSCardField.h"
#import "RCTLog.h"

@implementation TPSCardField
{
    BOOL _jsRequestingFirstResponder;
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if ((self = [super initWithFrame:frame])) {
        self.delegate = self;
    }
    return self;
}

- (void)reactWillMakeFirstResponder
{
    _jsRequestingFirstResponder = YES;
}

- (BOOL)canBecomeFirstResponder
{
    return _jsRequestingFirstResponder;
}

- (void)reactDidMakeFirstResponder
{
    _jsRequestingFirstResponder = NO;
}

- (void)didMoveToWindow
{
    if (_jsRequestingFirstResponder) {
        [self becomeFirstResponder];
        [self reactDidMakeFirstResponder];
    }
}

- (void)onChange {
    if (!_onChange)
        return;

    @try {
        _onChange(@{
            @"valid": @(self.isValid),
            @"params": @{
                @"number": self.cardParams.number,
                @"expMonth": @(self.cardParams.expMonth),
                @"expYear": @(self.cardParams.expYear),
                @"cvc": self.cardParams.cvc
            }
        });
    }
    @catch (NSException *exception) {
        _onChange(@{
            @"valid": @(self.isValid),
            @"params": @{
                @"number": self.cardParams.number,
                @"expMonth": @(self.cardParams.expMonth),
                @"expYear": @(self.cardParams.expYear),
                @"cvc": @""
            }
        });
    }
}

@end
