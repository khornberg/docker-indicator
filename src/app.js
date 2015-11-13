/* jshint esnext: true */

"use strict()";

var Docker       = require('dockerode');
var DockerEvents = require('docker-events');
var docker       = require('./connect');

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
