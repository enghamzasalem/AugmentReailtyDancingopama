/**
 * CDVezARSnapshot.h
 *
 * Copyright 2016, ezAR Technologies
 * http://ezartech.com
 *
 * By @wayne_parrott
 *
 * Licensed under a modified MIT license. 
 * Please see LICENSE or http://ezartech.com/ezarstartupkit-license for more information
 */

#import <AVFoundation/AVFoundation.h>

#import "Cordova/CDV.h"

/**
 * Implements the ezAR Cordova api. 
 */
@interface CDVezARFlashlight : CDVPlugin

- (void) init:(CDVInvokedUrlCommand*)command;

- (void) updateLight:(CDVInvokedUrlCommand*)command;

@end



