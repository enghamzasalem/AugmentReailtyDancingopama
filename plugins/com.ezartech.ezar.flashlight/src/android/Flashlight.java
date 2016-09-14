/**
 * Copyright 2015, ezAR Technologies
 * http://ezartech.com
 *
 * By @wayne_parrott, @vridosh, @kwparrott
 *
 * Licensed under a modified MIT license. 
 * Please see LICENSE or http://ezartech.com/ezarstartupkit-license for more information
 *
 */
package com.ezartech.ezar.flashlight;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.List;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CordovaWebViewImpl;
import org.apache.cordova.PluginManager;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.Manifest;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.graphics.SurfaceTexture;
import android.hardware.Camera;
import android.hardware.Camera.CameraInfo;
import android.hardware.Camera.Parameters;

import android.util.Log;
import android.view.TextureView;
import android.view.ViewGroup;
import android.webkit.WebView;


/**
 *
 */
public class Flashlight extends CordovaPlugin {
	private static final String TAG = "Flashlight";
    
    static final int UNDEFINED  = -1;
	static final int LIGHT_OFF  = 0;
	static final int LIGHT_ON   = 1;

    private int cameraId   = UNDEFINED;
    private int lightState 	= LIGHT_OFF;

	private CallbackContext callbackContext;

	private int activeLightCameraId = UNDEFINED;
	private Camera localPreviewCamera = null;
	private SurfaceTexture hiddenSurfaceTexture;

	private boolean isPaused = false;
	//------------ vo support ---------
	private int voCameraDir = UNDEFINED;	//updated by VO start/stop events
    private int voCameraId = UNDEFINED; 	//updated by VO start/stop events
	private Camera voCamera = null; 		//updated by VO start/stop events

	protected final static String[] permissions = { Manifest.permission.CAMERA };
	public final static int PERMISSION_DENIED_ERROR = 20;
	public final static int CAMERA_SEC = 0;


	@Override
	public void initialize(final CordovaInterface cordova, final CordovaWebView cvWebView) {
		super.initialize(cordova, cvWebView);
	}

	@Override
	public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
		Log.v(TAG, action + " " + args.length());

		if (action.equals("init")) {
			this.init(callbackContext);
		} else if (action.equals("updateLight")) {
            this.updateLight(args, callbackContext);
		} else {
			return false;
		}

		return true;
	}

	private void init(final CallbackContext callbackContext) {
		this.callbackContext = callbackContext;

		if (! PermissionHelper.hasPermission(this, permissions[0])) {
			PermissionHelper.requestPermission(this, CAMERA_SEC, Manifest.permission.CAMERA);
			return;
		}

		JSONObject jsonResult = new JSONObject();

		try {
			jsonResult.put("back",false);

			int mNumberOfCameras = Camera.getNumberOfCameras();

			Camera.CameraInfo cameraInfo = new Camera.CameraInfo();
			for (int id = 0; id < mNumberOfCameras; id++) {
				Camera.getCameraInfo(id, cameraInfo);

				if (cameraInfo.facing != CameraInfo.CAMERA_FACING_BACK) {
					continue;
				}

				Parameters parameters;
				Camera camera = null;
				Camera releasableCamera = null;
				try {

					try {
						if (id != voCameraId) {
							camera = Camera.open(id);
						} else {
							camera = voCamera;
						}

					} catch (RuntimeException re) {
						System.out.println("Failed to open CAMERA: " + id);
						continue;
					}

					parameters = camera.getParameters();

					List<String>torchModes = parameters.getSupportedFlashModes();
					boolean hasLight = torchModes != null && torchModes.contains(Parameters.FLASH_MODE_TORCH);

					if (hasLight) {
						String key="back";
						cameraId = id;
;
						jsonResult.put(key,true);
					}

					//determine if camera should be released
					if (id != voCameraId) {
						releasableCamera = camera;
					}

				} finally {
					if (releasableCamera != null) {
						releasableCamera.release();
					}
				}
			}
		} catch (Exception e) {
			Log.e(TAG, "Can't set exception", e);
            callbackContext.error("Unable to access Camera for light information.");
			return;
		}

		callbackContext.success(jsonResult);
	}

	private void updateLight(final JSONArray args, final CallbackContext callbackContext) {

		try {
			int newLightState = args.getInt(0);

			if (isVOInstalled()) {
				updateLightWithVO(newLightState, callbackContext);
			} else {
				updateLight(newLightState, callbackContext);
			}

		} catch (JSONException e1) {
			callbackContext.error("Invalid argument");
			return;
		}

	}

	//assumptions:
	//  voInstalled is true
	//  voCamera == null -> no camera running atm so defer setting light
	//
	private void updateLightWithVO(int newLightState, final CallbackContext callbackContext) {
		Camera releaseableCamera = null;

		if (voCameraId != UNDEFINED && voCameraId != cameraId) {
			//not allowed to set light to different side of device than running camera
			if (callbackContext != null) {
				callbackContext.error("Light and active camera must be on same side of device.");
			}
			//todo reset state
			return;
		}

		boolean isDeferred = (voCamera == null); //defer setting
		lightState = newLightState;

		if (isDeferred && newLightState == LIGHT_OFF) {
			//SPECIAL CASE: force the light off for devices that can run light without camera running
			updateLight(LIGHT_OFF, null);
			return;
		}

		if (!isDeferred) { //deferred start
			//update Light
			Parameters parameters;
			parameters = voCamera.getParameters();
			parameters.setFlashMode(newLightState == LIGHT_ON ?
					Parameters.FLASH_MODE_TORCH :
					Parameters.FLASH_MODE_OFF);
			voCamera.setParameters(parameters);
		}

		if (callbackContext != null) {
			callbackContext.success();
		}
	}

	private void updateLight(int newLightState, final CallbackContext callbackContext) {
		Camera releaseableCamera = null;

		try {
			lightState = newLightState;

			if (localPreviewCamera == null) {
				localPreviewCamera = Camera.open(cameraId);
			}
			Parameters parameters;
			parameters = localPreviewCamera.getParameters();
			parameters.setFlashMode(newLightState == LIGHT_ON ?
					Parameters.FLASH_MODE_TORCH :
					Parameters.FLASH_MODE_OFF);
			localPreviewCamera.setParameters(parameters);

			if (localPreviewCamera != null) {
				if (newLightState == LIGHT_ON) {
					try {
						localPreviewCamera.startPreview();
						if (hiddenSurfaceTexture == null) {
							hiddenSurfaceTexture = new SurfaceTexture(0);
						}
						localPreviewCamera.setPreviewTexture(hiddenSurfaceTexture);
					} catch(Exception ex) {
						callbackContext.error("Unable to start light.");
					}
				} else {
					localPreviewCamera.stopPreview();
					releaseableCamera = localPreviewCamera;
					localPreviewCamera = null;
				}
			}

		} finally {
			if (releaseableCamera != null) {
				releaseableCamera.release();
			}
		}

		if (callbackContext != null) {
			callbackContext.success();
		}
	}


	@Override
	public void onPause(boolean multitasking) {
		super.onPause((multitasking));

		/*
        isPaused = true;
		if (lightState == LIGHT_ON) {
			if (localPreviewCamera != null) {
				updateLight(LIGHT_OFF,null);
				lightState = LIGHT_ON;
			}
		}
		//todo: turn off light & release camera
        */
	}

	@Override
	public void onResume(boolean multitasking) {
		super.onResume(multitasking);

		/*
        if (isPaused) {
			if (lightState == LIGHT_ON) {
				if (isVOInstalled()) {
					updateLightWithVO(LIGHT_ON,null);
				} else {
					updateLight(LIGHT_ON,null);
				}
			}
		}
		isPaused = false;

		//todo: reacquire camera and setup light
        */
	}

	//copied from Apache Cordova plugin
	public void onRequestPermissionResult(int requestCode, String[] permissions,
										  int[] grantResults) throws JSONException {
		for(int r:grantResults) {
			if(r == PackageManager.PERMISSION_DENIED) {
				this.callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.ERROR, PERMISSION_DENIED_ERROR));
				return;
			}
		}
		switch(requestCode) {
			case CAMERA_SEC:
				init(this.callbackContext);
				break;
		}
	}

	//------------------------------------------------------------------
	//reflectively access VideoOverlay plugin to get camera in same direction as lightLoc

	private CordovaPlugin getVideoOverlayPlugin() {
		String pluginName = "videoOverlay";
		CordovaPlugin voPlugin = webView.getPluginManager().getPlugin(pluginName);
		return voPlugin;
	}

	private boolean isVOInstalled() {
		return getVideoOverlayPlugin() != null;
	}

	public void videoOverlayStarted(int voCameraDir, int voCameraId, Camera voCamera) {
		this.voCameraDir = voCameraDir;
		this.voCameraId = voCameraId;
		this.voCamera = voCamera;

		if (lightState == LIGHT_ON) {
			updateLightWithVO(LIGHT_ON, null);
		}

	}

	public void videoOverlayStopped(int voCameraDir, int voCameraId, Camera voCamera) {
		this.voCameraDir = UNDEFINED;
		this.voCameraId = UNDEFINED;
		this.voCamera = null;

		//apply rule that light can not be on unless camera is running
		//so turn active light off but reset the light back to its LIGHT_ON deferred state
		// and it will turn back on when camera is restarted. User must turn the light off explicitly.
		if (lightState == LIGHT_ON) {
			updateLightWithVO(LIGHT_OFF, null);
			lightState = LIGHT_ON; //set light back on until user turns it off
		}
	}

}
