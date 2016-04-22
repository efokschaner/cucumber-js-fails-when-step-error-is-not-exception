var net = require('net');
var Cucumber = require('cucumber');
var cli = Cucumber.Cli(process.argv);

function runCuke(onFinished) {
  try {
    cli.run(onFinished);
  } catch (e) {
    console.log('Cucumber threw an exception');
    console.log(e.stack || e);
    onFinished(false);
  }
}

// Run cuke while running a server
var myServer = net.createServer();
myServer.listen({port: 0}, function() {
  runCuke(function(succeeded) {
    myServer.close();
    if(succeeded) {
      console.log('Cucumber run succeeded');
    } else {
      console.log('Cucumber run failed');
      process.exit(1);
    }
  });
})
