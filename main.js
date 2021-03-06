'use strict';

var app = require('app');
var BrowserWindow = require('browser-window');

var mainWindow = null;

var globalShortcut = require('global-shortcut');

app.on('ready', function() {

    mainWindow = new BrowserWindow({
        frame: false,
        height: 135,
        resizable: false,
        width: 520
    });

    mainWindow.loadUrl('file://' + __dirname + '/app/index.html');
    setGlobalShortcuts();
    mainWindow.webContents.send('set-current-show');
});

function setGlobalShortcuts() {
    globalShortcut.unregisterAll();

    globalShortcut.register('cmd+shift+space', function () {
        mainWindow.webContents.send('global-shortcut');
    });
}

var ipc = require('ipc');

ipc.on('close-main-window', function () {
    app.quit();
});