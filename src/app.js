/* jshint esnext: true */

"use strict()";

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
  // Object {status: "start", id: "46eb3fcf245c07a0bdc6ef4c4e5b6d3837d8cc2bfe6543bd6a561475187651e0", from: "redis", time: 1446487348}
  update();
});

emitter.on("_message", (message) => console.log('message', message));
emitter.on("disconnect", (message) => console.log('disconnect', message));


// docker.ping(function() {
//     console.log('connected');
// });

// connect without relying on envvars
// when starting from app doesn't get envvars because docker machine has not added them
// nor when starting from a shell with out the docker command run already
function connect() {
  return new Docker();
}

function render_container(container) {
  var exited = container.Status.substr(0, 6) === 'Exited' ? true : false;
  var button_state = exited ? "negative" : "positive";
  var button_action = exited ? "play" : "stop";
  var name = container.Names[container.Names.length-1].substr(1);
  var network = container.Ports[container.Ports.length-1]
  var network_display = `${network.Type}://${network.IP}:${network.PublicPort}->${network.PrivatePort}`
  return `
        <li class="table-view-cell media">
          <div class="media-body">${name}
            <p>${container.Status}<br/>
            ${network_display}</p>
          </div>
          <button class="btn btn-${button_state} icon icon-${button_action}"></button>
        </li>`
}

function update() {
  docker.listContainers({all: false}, function(err, containers) {
    var $containers  = document.getElementById('containers');
    var containerList = '<ul class="table-view">';

    // sort or map containers all is true?
    containers.forEach(function(container){
      console.log(container);
      containerList = containerList + render_container(container);
        // <li class="table-view-divider">Offline</li>
    });

    if (containerList === '<ul class="table-view">') {
      containerList = containerList + '<p>No containers running</p>';
    }

    $containers.innerHTML = containerList + "</ul>";
  });
}


// client commo with server, client initiated
// var ipc = require('ipc');

// function sendipc(){
  // console.log(ipc.sendSync('synchronous-message', 'ping')); // prints "pong"
// }

// timeout
// window.setInterval(sendipc, 1000);

// ipc.on('asynchronous-reply', function(arg) {
//   console.log(arg); // prints "pong"
// });
// ipc.send('asynchronous-message', 'ping');

// server sent
require('ipc').on('ping', function(message) {
  console.log(message);
  if (message === 'connected') {
    update();
  }
});


//Add quit
function quit(){
  var remote = require( 'remote' );
  var app = remote.require( 'app' );

  app.quit();
}

var $quit = document.getElementById('quit');
$quit.addEventListener("click", quit);

//sdg
