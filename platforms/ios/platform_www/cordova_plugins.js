cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "cordova-plugin-backbutton.Backbutton",
        "file": "plugins/cordova-plugin-backbutton/www/Backbutton.js",
        "pluginId": "cordova-plugin-backbutton",
        "clobbers": [
            "navigator.Backbutton"
        ]
    },
    {
        "id": "cordova-plugin-dialogs.notification",
        "file": "plugins/cordova-plugin-dialogs/www/notification.js",
        "pluginId": "cordova-plugin-dialogs",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "id": "cordova-plugin-inappbrowser.inappbrowser",
        "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
        "pluginId": "cordova-plugin-inappbrowser",
        "clobbers": [
            "cordova.InAppBrowser.open",
            "window.open"
        ]
    },
    {
        "id": "org.apache.cordova.home.home",
        "file": "plugins/org.apache.cordova.home/www/home.js",
        "pluginId": "org.apache.cordova.home",
        "merges": [
            "navigator.home"
        ]
    },
    {
        "id": "phonegap-plugin-barcodescanner.BarcodeScanner",
        "file": "plugins/phonegap-plugin-barcodescanner/www/barcodescanner.js",
        "pluginId": "phonegap-plugin-barcodescanner",
        "clobbers": [
            "cordova.plugins.barcodeScanner"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-backbutton": "0.3.0",
    "cordova-plugin-compat": "1.1.0",
    "cordova-plugin-dialogs": "1.3.0",
    "cordova-plugin-inappbrowser": "1.6.1",
    "cordova-plugin-whitelist": "1.3.0",
    "org.apache.cordova.home": "0.2.6",
    "phonegap-plugin-barcodescanner": "6.0.5"
};
// BOTTOM OF METADATA
});