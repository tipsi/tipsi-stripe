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

/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect {
    // Drawing code
}
*/

- (instancetype)initWithFrame:(CGRect)frame
{
    if ((self = [super initWithFrame:frame])) {
        self.delegate = self;
    }
    return self;
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
