/* jshint esnext: true */

"use strict";

var menubar  = require('menubar');
var Docker   = require('dockerode');
var docker   = require('./src/connect');
var iconPath = __dirname + "/images/icons/";

var mb = menubar({
  dir: __dirname + "/src",
  preloadWindow: true,
  icon: iconPath + "IconTemplate@2x.png",
  supportsTrayHighlightState: true
});

var lastConnectionStatus = null;

function down() {
  let NativeImage = require('electron').nativeImage;
  let image = NativeImage.createFromPath(iconPath + "IconOffTemplate@2x.png");
  mb.tray.setImage(image);
  lastConnectionStatus = null;
}

function up(){
  let NativeImage = require('electron').nativeImage;
  let image = NativeImage.createFromPath(iconPath + "IconTemplate@2x.png");
  mb.tray.setImage(image);
  lastConnectionStatus = 'OK';
}

function setIcon() {
  docker.ping((err, data) => {
    if (lastConnectionStatus === null && data === null) {
      down();
      mb.window.webContents.send('send', 'update');
    }

    if (lastConnectionStatus === null && data == 'OK') {
      up();
      mb.window.webContents.send('send', 'new-docker');
    }

    if (lastConnectionStatus === 'OK' && data === null) {
      down();
      mb.window.webContents.send('send', 'update');
    }
  });
}

mb.once('show', function () {
  // mb.window.openDevTools();
});

mb.on('ready', function ready () {
  setIcon();
  setInterval(setIcon, 5000);
});

mb.on('show', function () {
  //send events to the page
  if (lastConnectionStatus == 'OK') {
    mb.window.webContents.send('send', 'update');
  }
});

//sdg
