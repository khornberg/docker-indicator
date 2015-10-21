var Docker      = require('dockerode');
var fs          = require('fs');
var $containers = document.getElementById('containers');
var docker      = new Docker();


// docker.ping(function() {
//     console.log('connected');
// });


function update() {
  docker.listContainers({all: false}, function(err, containers) {
    // console.log(containers[0]);

    var header = '<h1>Containers</h1>';
    var containerList = null;

    containers.forEach(function(container){
      // console.log(container.Names[0].substr(1), container.Status);
      containerList = containerList  + `<p>${container.Names[0].substr(1)} - ${container.Status}</p>`;
    });

    if (containerList == null) {
      containerList = 'No containers running';
    }

    $containers.innerHTML = header + containerList;
  });
}


// client commo with server, client initiated
var ipc = require('ipc');

function sendipc(){
  console.log(ipc.sendSync('synchronous-message', 'ping')); // prints "pong"
}

// timeout
// window.setInterval(sendipc, 1000);

// ipc.on('asynchronous-reply', function(arg) {
//   console.log(arg); // prints "pong"
// });
// ipc.send('asynchronous-message', 'ping');

// server sent
require('ipc').on('ping', function(message) {
  console.log(message);  // Prints "whoooooooh!"
  if (message = 'connected') {
    update();
  }
});
