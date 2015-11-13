'use strict';
var fs       = require('fs');
var userHome = require('user-home');
var read     = require('read-yaml');
var Docker   = require('dockerode');

module.exports = (function () {
  var config = read.sync(`${userHome}/.docker-indicator.yaml`);
  return new Docker({
    protocol: config.docker.protocol,
    host: config.docker.ip,
    port: config.docker.port,
    ca: fs.readFileSync(config.docker.ca),
    cert: fs.readFileSync(config.docker.cert),
    key: fs.readFileSync(config.docker.key),
  });
})()
