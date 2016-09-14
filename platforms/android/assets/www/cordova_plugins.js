cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.ezartech.ezar.flashlight/www/flashlight.js",
        "id": "com.ezartech.ezar.flashlight.flashlight",
        "merges": [
            "ezar"
        ]
    },
    {
        "file": "plugins/com.ezartech.ezar.snapshot/www/snapshot.js",
        "id": "com.ezartech.ezar.snapshot.snapshot",
        "merges": [
            "ezar"
        ]
    },
    {
        "file": "plugins/com.ezartech.ezar.videooverlay/www/videoOverlay.js",
        "id": "com.ezartech.ezar.videooverlay.videoOverlay",
        "merges": [
            "ezar"
        ]
    },
    {
        "file": "plugins/com.ezartech.ezar.videooverlay/www/camera.js",
        "id": "com.ezartech.ezar.videooverlay.camera",
        "clobbers": [
            "camera"
        ]
    },
    {
        "file": "plugins/cordova-plugin-device/www/device.js",
        "id": "cordova-plugin-device.device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
        "id": "cordova-plugin-splashscreen.SplashScreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    },
    {
        "file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
        "id": "cordova-plugin-statusbar.statusbar",
        "clobbers": [
            "window.StatusBar"
        ]
    },
    {
        "file": "plugins/ionic-plugin-keyboard/www/android/keyboard.js",
        "id": "ionic-plugin-keyboard.keyboard",
        "clobbers": [
            "cordova.plugins.Keyboard"
        ],
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-geolocation/www/android/geolocation.js",
        "id": "cordova-plugin-geolocation.geolocation",
        "clobbers": [
            "navigator.geolocation"
        ]
    },
    {
        "file": "plugins/cordova-plugin-geolocation/www/PositionError.js",
        "id": "cordova-plugin-geolocation.PositionError",
        "runs": true
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.ezartech.ezar.flashlight": "0.2.1",
    "com.ezartech.ezar.snapshot": "0.2.3",
    "com.ezartech.ezar.videooverlay": "0.2.4",
    "cordova-plugin-console": "1.0.3",
    "cordova-plugin-device": "1.1.2",
    "cordova-plugin-splashscreen": "3.2.2",
    "cordova-plugin-statusbar": "2.1.3",
    "cordova-plugin-whitelist": "1.2.2",
    "ionic-plugin-keyboard": "2.2.0",
    "cordova-plugin-compat": "1.0.0",
    "cordova-plugin-geolocation": "2.2.0"
};
// BOTTOM OF METADATA
});