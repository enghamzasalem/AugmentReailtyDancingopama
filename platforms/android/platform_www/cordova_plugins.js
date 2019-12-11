cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "com.ezartech.ezar.flashlight.flashlight",
      "file": "plugins/com.ezartech.ezar.flashlight/www/flashlight.js",
      "pluginId": "com.ezartech.ezar.flashlight",
      "merges": [
        "ezar"
      ]
    },
    {
      "id": "com.ezartech.ezar.snapshot.snapshot",
      "file": "plugins/com.ezartech.ezar.snapshot/www/snapshot.js",
      "pluginId": "com.ezartech.ezar.snapshot",
      "merges": [
        "ezar"
      ]
    },
    {
      "id": "com.ezartech.ezar.videooverlay.videoOverlay",
      "file": "plugins/com.ezartech.ezar.videooverlay/www/videoOverlay.js",
      "pluginId": "com.ezartech.ezar.videooverlay",
      "merges": [
        "ezar"
      ]
    },
    {
      "id": "com.ezartech.ezar.videooverlay.camera",
      "file": "plugins/com.ezartech.ezar.videooverlay/www/camera.js",
      "pluginId": "com.ezartech.ezar.videooverlay",
      "clobbers": [
        "camera"
      ]
    },
    {
      "id": "cordova-plugin-device.device",
      "file": "plugins/cordova-plugin-device/www/device.js",
      "pluginId": "cordova-plugin-device",
      "clobbers": [
        "device"
      ]
    },
    {
      "id": "cordova-plugin-ionic-keyboard.keyboard",
      "file": "plugins/cordova-plugin-ionic-keyboard/www/android/keyboard.js",
      "pluginId": "cordova-plugin-ionic-keyboard",
      "clobbers": [
        "window.Keyboard"
      ]
    },
    {
      "id": "cordova-plugin-ionic-webview.IonicWebView",
      "file": "plugins/cordova-plugin-ionic-webview/src/www/util.js",
      "pluginId": "cordova-plugin-ionic-webview",
      "clobbers": [
        "Ionic.WebView"
      ]
    },
    {
      "id": "cordova-plugin-splashscreen.SplashScreen",
      "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
      "pluginId": "cordova-plugin-splashscreen",
      "clobbers": [
        "navigator.splashscreen"
      ]
    },
    {
      "id": "cordova-plugin-statusbar.statusbar",
      "file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
      "pluginId": "cordova-plugin-statusbar",
      "clobbers": [
        "window.StatusBar"
      ]
    },
    {
      "id": "ionic-plugin-keyboard.keyboard",
      "file": "plugins/ionic-plugin-keyboard/www/android/keyboard.js",
      "pluginId": "ionic-plugin-keyboard",
      "clobbers": [
        "cordova.plugins.Keyboard"
      ],
      "runs": true
    }
  ];
  module.exports.metadata = {
    "com.ezartech.ezar.flashlight": "0.2.1",
    "com.ezartech.ezar.snapshot": "0.2.3",
    "com.ezartech.ezar.videooverlay": "0.2.4",
    "cordova-plugin-compat": "1.0.0",
    "cordova-plugin-console": "1.0.3",
    "cordova-plugin-device": "1.1.2",
    "cordova-plugin-ionic-keyboard": "2.2.0",
    "cordova-plugin-ionic-webview": "4.1.3",
    "cordova-plugin-splashscreen": "3.2.2",
    "cordova-plugin-statusbar": "2.1.3",
    "cordova-plugin-whitelist": "1.2.2",
    "ionic-plugin-keyboard": "2.2.0"
  };
});