/* jshint esnext: true */

"use strict";

var menubar  = require('menubar');
var Docker   = require('dockerode');
var docker   = require('./src/connect');

var mb = menubar({
  dir: __dirname + "/src",
  preloadWindow: true,
  icon: __dirname + "/IconTemplate@2x.png"
});

var lastConnectionStatus = null;

function setIcon() {
  docker.ping((err, data) => {
    if (lastConnectionStatus === null && data == 'OK') {
      let NativeImage = require('native-image');
      let image = NativeImage.createFromPath(__dirname + "/IconTemplate@2x.png");
      mb.tray.setImage(image);
      lastConnectionStatus = 'OK';
    }

    if (lastConnectionStatus === 'OK' && data === null) {
      let NativeImage = require('native-image');
      let image = NativeImage.createFromPath(__dirname + "/IconOffTemplate@2x.png");
      mb.tray.setImage(image);
      lastConnectionStatus = null;
    }
  });
}

mb.once('show', function () {
  // mb.window.openDevTools();
});

mb.on('ready', function ready () {
  setInterval(setIcon, 5000);
});

mb.on('show', function () {
  //send events to the page
  if (lastConnectionStatus == 'OK') {
    mb.window.webContents.send('send', 'connected');
    mb.window.webContents.send('send', docker);
  }
});

//sdg
