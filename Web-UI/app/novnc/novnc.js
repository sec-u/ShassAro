/*jslint white: false */
/*global window, $, Util, RFB, */
"use strict";
// Load supporting scripts
Util.load_scripts(["webutil.js", "base64.js", "websock.js", "des.js",
    "keysymdef.js", "keyboard.js", "input.js", "display.js",
    "jsunzip.js", "rfb.js", "keysym.js"]);
var rfb;
var resizeTimeout;
function UIresize() {
    if (WebUtil.getQueryVar('resize', false)) {
        var innerW = window.innerWidth;
        var innerH = window.innerHeight;
        var controlbarH = $D('noVNC_status_bar').offsetHeight;
        var padding = 5;
        if (innerW !== undefined && innerH !== undefined)
            rfb.setDesktopSize(innerW, innerH - controlbarH - padding);
    }
}
function FBUComplete(rfb, fbu) {
    UIresize();
    rfb.set_onFBUComplete(function() { });
}
function passwordRequired(rfb) {
    return
}

function updateState(rfb, state, oldstate, msg) {
    return
}
window.onresize = function () {
    // When the window has been resized, wait until the size remains
    // the same for 0.5 seconds before sending the request for changing
    // the resolution of the session
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function(){
        UIresize();
    }, 500);
};
function xvpInit(ver) {
    return
}
window.onscriptsload = function () {
    var host, port, password, path, token;
    try {
        rfb = new RFB({'target':       $D('noVNC_canvas'),
            'encrypt':      false,
            'repeaterID':   '',
            'true_color':   true,
            'local_cursor': true,
            'shared':       true,
            'view_only':    false,
            'onUpdateState':  updateState,
            'onXvpInit':    xvpInit,
            'onPasswordRequired':  passwordRequired,
            'onFBUComplete': FBUComplete});
    } catch (exc) {
        UI.updateState(null, 'fatal', null, 'Unable to create RFB client -- ' + exc);
        return; // don't continue trying to connect
    }
    rfb.connect("10.0.0.7", "39830", "@801f01#", "");
};