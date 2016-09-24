/**
 * Static HTTP Server for the notific8-closeall demo page
 */

// modules
var static = require('node-static'),
  port = 9000,
  http = require('http');

// config
var file = new static.Server('./', {
  cache: 3600,
  gzip: true
});

// let the user know the info about the server
console.log('Serving demo page at http://localhost:' + port);
console.log('Press Ctrl+C to stop');

// serve
http.createServer(function(request, response) {
  request.addListener('end', function() {
    file.serve(request, response);
  }).resume();
}).listen( port );
