/*
 * flashlight.js
 * Copyright 2016, ezAR Technologies
 * Licensed under a modified MIT license, see LICENSE or http://ezartech.com/ezarstartupkit-license
 *
 * @file Implements the ezar flashlight api for controlling device lights, . 
 * @author @wayne_parrott
 * @version 0.1.0 
 */

var exec = require('cordova/exec'),
    utils = require('cordova/utils');

module.exports = (function() {
	 //--------------------------------------
	var UNDEFINED = -1, LIGHT_OFF = 0, LIGHT_ON = 1;     //light states
	
	var _flashlight       = {};
	var _isInitialized    = false;;
	var _lightState       = UNDEFINED;	    
	
	
    _flashlight.isLightInitialized = function() {
        return _isInitialized;
    }

	/**
	* Manages a mobile device lights
	* @class
	* 
	* Created by ezar flashlight during initialization. Do not use directly.
	* 
	* @param {ezAR} ezar  protected 
	* @param {string} id  unique camera id assigned by the device os
	* @param {string} position  side of the device the camera resides, BACK
	* 			faces away from the user, FRONT faces the user
	* @param {boolean} hasZoom  true if the camera's magnification can be changed
	* @param {float} zoom  current magnification level of the camera up 
	* 			to the maxZoom
	* @param {boolean} hasLight true when the device has a light on the
	* 			same side as the camera position; false otherwise
	* @param {integer} light  if the device has a light on the same side 
	* 			(position) as the camera then 1 turns on the device light, 
	* 			0 turns the light off
	*/  
    _flashlight.initializeLight = function(successCallback,errorCallback) {
        //execute successCallback immediately if already initialized
    	if (_flashlight.isLightInitialized()) {
           if (isFunction(successCallback)) successCallback();
           return;
        }
        
        var onInit = function(lightData) {
            console.log(lightData);
            _isInitialized = true;
			
			//todo init state here
			_lightState = lightData.back ? LIGHT_OFF : UNDEFINED;
			
			document.addEventListener("pause", onPause, false);
			document.addEventListener("resume", onResume, false);
			
            if (successCallback) {
                successCallback();
            }
        }
        
        exec(onInit,
             errorCallback,
            "flashlight",
            "init",
            []);
    }
	
	function onPause() {
		if (_lightState == LIGHT_ON) {
			_flashlight.setLightOff(
			    function(result) {
					_lightState = LIGHT_ON;
				});
		}
	}
	
	function onResume() {
		if (_lightState == LIGHT_ON) {
			_lightState = LIGHT_OFF;
			_flashlight.setLightOn();	
		}
		
	}
    	 
    /**
	 * 
	 */
	 _flashlight.hasLight = function() {
		 return _lightState != UNDEFINED;
	 }
	 

	 /**
	  * 
	  */
	 _flashlight.isLightOn = function() {
		 return _lightState == LIGHT_ON;
	 }
	 
	 /**
	  * 
	  */
     _flashlight.setLightOn = function(successCallback,errorCallback) {
		 updateLight(LIGHT_ON,successCallback,errorCallback);
	 }
     
     /**
	 * 
	 */
	_flashlight.setLightOff = function(successCallback,errorCallback) {
		
		updateLight(LIGHT_OFF,successCallback,errorCallback);
	}

 
	function updateLight(onOffState, successCallback,errorCallback) {
		
		if (!_flashlight.hasLight()) return;
		if (_lightState == onOffState) {
			if (isFunction(successCallback)) successCallback();
				return;	
		}
		
        //set default state
		_lightState = _lightState == UNDEFINED ? UNDEFINED : LIGHT_OFF;
		 
		var onSuccess = function() {
            //console.log(deviceData);
            _lightState = onOffState; 
			
			if (successCallback) {
                successCallback();
            }
        }
		
		exec(onSuccess,
             errorCallback,
            "flashlight",
            "updateLight",
            [onOffState]);
	 }        
      
       
	function isFunction(f) {
    	return typeof f == "function";
	}
  
    // function isAndroidPlatform() {
    //     return window.cordova.platformId == "android";
    // }
    
    
	return _flashlight;
}())



