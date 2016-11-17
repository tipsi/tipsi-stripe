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
    BOOL _isFirstResponder;
    NSUInteger _changeViaSetCardParamsCounter;
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if ((self = [super initWithFrame:frame])) {
        self.delegate = self;
        _isFirstResponder = NO;
        _changeViaSetCardParamsCounter = 0;
        [[NSNotificationCenter defaultCenter]
            addObserver:self
               selector:@selector(keyboardWillShow:)
                   name:UIKeyboardWillShowNotification
                 object:self.window];
    }
    return self;
}

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
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

- (void)keyboardWillShow:(NSNotification *)n
{
    if (!_jsRequestingFirstResponder && !_isFirstResponder) {
        [self resignFirstResponder];
    }
}

- (BOOL)becomeFirstResponder
{
    _isFirstResponder = YES;
    return [super becomeFirstResponder];
}

- (BOOL)resignFirstResponder
{
    _isFirstResponder = NO;
    return [super resignFirstResponder];
}

- (void)setCardParams:(STPCardParams *)cardParams
{
    _changeViaSetCardParamsCounter = 2;
    [super setCardParams:cardParams];
}

- (void)onChange {
    if (_changeViaSetCardParamsCounter > 0) {
        _changeViaSetCardParamsCounter--;
        return;
    }
    if (!_onChange) {
        return;
    }

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
