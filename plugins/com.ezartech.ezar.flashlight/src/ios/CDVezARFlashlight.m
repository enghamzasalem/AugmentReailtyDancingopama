/*
 * CDVezARSnapshot.m
 *
 * Copyright 2016, ezAR Technologies
 * http://ezartech.com
 *
 * By @wayne_parrott
 *
 * Licensed under a modified MIT license. 
 * Please see LICENSE or http://ezartech.com/ezarstartupkit-license for more information
 *
 */
 
#import "CDVezARFlashlight.h"


const int BACK_LIGHT = 0;
const int FRONT_LIGHT = 1;
const int LIGHT_OFF = 0;
const int LIGHT_ON = 1;

@implementation CDVezARFlashlight
{
    AVCaptureDevice* light;
    int lightState;
}

// INIT PLUGIN - does nothing atm
- (void) pluginInitialize
{
    [super pluginInitialize];
}

// SETUP EZAR 
// Create camera view and preview, make webview transparent.
// return camera, light features and display details
// 
- (void)init:(CDVInvokedUrlCommand*)command
{
    NSMutableDictionary* lightsInfo = [NSMutableDictionary dictionaryWithCapacity:4];
    [lightsInfo setObject: @NO forKey:@"back"];
    
    NSError *error;
    NSArray *devices = [AVCaptureDevice devicesWithMediaType:AVMediaTypeVideo];
    for (AVCaptureDevice *device in devices) {
        if (error) break;
        if (!([device isTorchAvailable] && [device isTorchModeSupported:AVCaptureTorchModeOn])) 
            continue;
        
        if ([device position] == AVCaptureDevicePositionBack) {
            light = device;
            [lightsInfo setObject: @YES forKey:@"back"];
        }
        
    }
    
   NSMutableDictionary* immutableLightsInfo =
    	[NSMutableDictionary dictionaryWithDictionary: lightsInfo];
    
    CDVPluginResult* pluginResult =
        [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary: immutableLightsInfo];
    
        
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}


//var OFF = 0, ON = 1;     //light states
- (void)updateLight:(CDVInvokedUrlCommand*)command
{
    NSNumber* newLightStateArg = [command.arguments objectAtIndex:0];
    int newLightState = (int)[newLightStateArg integerValue];
    AVCaptureTorchMode torchMode = newLightState == LIGHT_OFF ? AVCaptureTorchModeOff : AVCaptureTorchModeOn;
    
    if (!light) {
        //error, invalid light referenced
        CDVPluginResult* pluginResult =
            [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString: @"Unable to access light."];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        return;
    }
    
    
    BOOL success = [light lockForConfiguration:nil];
    if (success) {  
        [light setTorchMode:torchMode];
        [light unlockForConfiguration];
    } else {
        //error, 
        CDVPluginResult* pluginResult =
            [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString: @"Unable to lock light for update"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        return;
    }
    
    CDVPluginResult* pluginResult =
        [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}


@end
