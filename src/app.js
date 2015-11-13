/* jshint esnext: true */

"use strict()";

var os = require('os');
var execSync = require('child_process').execSync;
var Docker       = require('dockerode');
var fs           = require('fs');
var DockerEvents = require('docker-events');
var docker       = connect();

var emitter = new DockerEvents({
  docker: docker,
});

emitter.start();

emitter.on("connect", (message) => {
  console.log('connect', message);
  update();
});

emitter.on("start", (message) => {
  console.log('start', message);
  update();
});

emitter.on("stop", (message) => {
  console.log('stop', message);
  update();
});

emitter.on("disconnect", (message) => console.log('disconnect', message));

// connect without relying on envvars
// when starting from app doesn't get envvars because docker machine has not added them
// nor when starting from a shell with out the docker command run already
function connect() {
  if (os.platform != 'Linux') {
    var output = execSync('docker-machine env default').toString();
    var lines = output.split('\n');
    var docker_machine = {};
    lines.forEach((line) => {
      x = line.split('=');
      if (x[0].indexOf('export') >= 0) {
        docker_machine[x[0].split(' ')[1]] = x[1].replace(/"/g, '');
      }
    });

    var ip = docker_machine['DOCKER_HOST'].match(/\w*:\/\/(.*):/)[1];
    var port = docker_machine['DOCKER_HOST'].match(/\w*:\/\/.*:(.*)/)[1];

    return new Docker({
      host: ip,
      port: port,
      ca: fs.readFileSync(`${docker_machine['DOCKER_CERT_PATH']}/ca.pem`),
      cert: fs.readFileSync(`${docker_machine['DOCKER_CERT_PATH']}/cert.pem`),
      key: fs.readFileSync(`${docker_machine['DOCKER_CERT_PATH']}/key.pem`),
    });
  }
  // assumes a local docker connection
  return new Docker();
}

function render_container(container) {
  var exited = container.Status.substr(0, 6) === 'Exited' ? true : false;
  var button_state = exited ? "negative" : "positive";
  var button_action = exited ? "play" : "stop";
  var name = container.Names[container.Names.length-1].substr(1);
  var network = containers.Ports === undefined ? container.Ports[container.Ports.length-1] : false;
  var network_display = network ? `${network.Type}://${network.IP}:${network.PublicPort}->${network.PrivatePort}` : '';

  return `
        <li class="table-view-cell media">
          <div class="media-body">${name}
            <p>${container.Status}<br/>
            ${network_display}</p>
          </div>
          <button class="btn btn-${button_state} icon icon-${button_action}" id="${container.Id}"></button>
        </li>`;
}

function controlContainer(e){
  var command = e.srcElement.className.substr(-4);
  command = command === 'play' ? 'start' : command;
  var container = docker.getContainer(e.srcElement.id);
  container[command](function (err, data) {
    console.log('error', err);
  });
}

function addEventHandlers(){
  var $containerButtons = document.querySelectorAll('.btn.icon');

  var x = $containerButtons.length - 1;
  for(x; x>=0; x--){
    $containerButtons[x].addEventListener('click', controlContainer);
  }
}

function update() {
  docker.listContainers({all: true}, function(err, containers) {
    var $containers  = document.getElementById('containers');
    var containerList = '<ul class="table-view" style="margin-bottom: 3rem;">';

    var started = containers.filter((container) => {
      return container.Status.substr(0, 6) === 'Exited' ? false : true;
    });
    var stopped = containers.filter((container) => {
      return container.Status.substr(0, 6) === 'Exited' ? true : false;
    });

    started.forEach(function(container){
      containerList = containerList + render_container(container);
    });

    stopped.forEach(function(container){
      containerList = containerList + render_container(container);
    });

    if (containerList === '<ul class="table-view">') {
      containerList = containerList + '<p>No containers to show</p>';
    }

    $containers.innerHTML = containerList + '</ul>';

    addEventHandlers();
  });
}

require('ipc').on('ping', function(message) {
  console.log(message);
  if (message === 'connected') {
    update();
  }
});

function quit(){
  var remote = require( 'remote' );
  var app = remote.require( 'app' );

  app.quit();
}

var $quit = document.getElementById('quit');
$quit.addEventListener("click", quit);

//sdg
