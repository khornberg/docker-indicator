/* jshint esnext: true */

"use strict()";

var Docker = require('dockerode');
var DockerEvents = require('docker-events');
var docker = require('./connect');

var emitter = new DockerEvents({
  docker: docker,
});

emitter.start();

emitter.on("connect", (message) => {
  update();
});

emitter.on("start", (message) => {
  update();
});

emitter.on("stop", (message) => {
  update();
});

emitter.on("destroy", (message) => {
  update();
});

emitter.on("disconnect", (message) => {
  update();
});

function render_container(container) {
  var exited = container.Status.substr(0, 6) === 'Exited' ? true : false;
  var button_state = exited ? "negative" : "positive";
  var button_action = exited ? "play" : "stop";
  var name = container.Names[container.Names.length - 1].substr(1);
  var network = containers.Ports === undefined ? container.Ports[container.Ports.length - 1] : false;
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

function controlContainer(e) {
  var command = e.srcElement.className.substr(-4);
  command = command === 'play' ? 'start' : command;
  var container = docker.getContainer(e.srcElement.id);
  container[command](function(err, data) {
    console.log('error', err);
  });
}

function addEventHandlers() {
  var $containerButtons = document.querySelectorAll('.btn.icon');

  var x = $containerButtons.length - 1;
  for (x; x >= 0; x--) {
    $containerButtons[x].addEventListener('click', controlContainer);
  }
}

function update() {
  docker.listContainers({
    all: true
  }, function(err, containers) {
    var $containers = document.getElementById('containers');
    var containerList = '<ul class="table-view" style="margin-bottom: 3rem;">';

    if (!err) {
      var started = containers.filter((container) => {
        return container.Status.substr(0, 6) === 'Exited' ? false : true;
      });
      var stopped = containers.filter((container) => {
        return container.Status.substr(0, 6) === 'Exited' ? true : false;
      });

      started.forEach(function(container) {
        containerList = containerList + render_container(container);
      });

      stopped.forEach(function(container) {
        containerList = containerList + render_container(container);
      });
    }

    if (err) {
      containerList = containerList + `<li class="table-view-cell">${err}</li>`;
    }

    if (containerList === '<ul class="table-view">') {
      containerList = containerList + '<li class="table-view-cell">No containers to show</li>';
    }

    $containers.innerHTML = containerList + '</ul>';

    addEventHandlers();
  });
}

require('ipc').on('send', function(message) {
  if (message === 'update') {
    update();
  }
  if (message === 'new-docker') {
    docker = require('./connect');
    update();
  }
});

function quit() {
  var remote = require('remote');
  var app = remote.require('app');

  app.quit();
}

var $quit = document.getElementById('quit');
$quit.addEventListener("click", quit);

//sdg
