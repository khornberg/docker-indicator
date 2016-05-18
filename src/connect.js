'use strict';
var fs       = require('fs');
var userHome = require('user-home');
var read     = require('read-yaml');
var Docker   = require('dockerode');
var fileExists = require('file-exists');

module.exports = (function () {
  var configFile = `${userHome}/.docker-indicator.yaml`;
  if (fileExists(configFile)) {
    var config = read.sync(configFile);
    return new Docker({
      protocol: config.docker.protocol,
      host: config.docker.ip,
      port: config.docker.port,
      ca: fs.readFileSync(config.docker.ca),
      cert: fs.readFileSync(config.docker.cert),
      key: fs.readFileSync(config.docker.key),
    });
  }
  return new Docker({socketPath: '/var/run/docker.sock'});
})();
