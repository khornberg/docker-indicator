var Docker      = require('dockerode');
var fs          = require('fs');
var $containers = document.getElementById('containers');
var docker      = new Docker();


// docker.ping(function() {
//     console.log('connected');
// });

// docker.listContainers({all: false}, function(err, containers) {
//   console.log(containers[0]);
//
//   $containers.innerHTML = '<h1>Containers</h1>';
//
//   containers.forEach(function(container){
//     console.log(container.Names[0].substr(1), container.Status);
//     $containers.innerHTML = $containers.innerHTML + '<p>' + container.Names[0].substr(1) + '-' + container.Status + '</p>';
//   });
// });

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
});
