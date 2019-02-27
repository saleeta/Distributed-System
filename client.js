/*
Implement replication
handle updates
handle folders
implement multiple servers
*/
var stdin = process.openStdin();
var http = require('http');
const io = require('socket.io-client');
var chalk = require('chalk');
var connectedQ = false;
var connectedd=false;
var connectedd2=false;
const ioc = require('socket.io-client');
var socket;
var tempsocket;
var verify = 0;
var dnsip='localhost';
var alreadydone = 0;
startup();
const {
  spawn
} = require('child_process');
fs = require('fs');

var alwaysPrint = "\n>";

function startup() {
  const tempio = require('socket.io-client');
  tempsocket = tempio.connect('http://'+dnsip+':1044');

  tempsocket.on('news', function (data) {
    
    
      console.log(data+"not comnnected yet");
      tempsocket.emit('random', "");
    
  });
  tempsocket.on('true', function (d,i) {
    socket.emit('disconnect', "");
    socketstuff(d,i);
    alreadydone = 0;
    
  });
  tempsocket.on('false', function (d) {

    console.log(chalk.red(d));
    connectedd=false;
    connectedQ=false;

  });
  tempsocket.on('error', function (d) {
    if (alreadydone == 0) {
      console.log(chalk.red(d));
      alreadydone = 1;
      connectedQ=false;
      connectedd=false;
    }
    console.log("2not comnnected yet");
    tempsocket.emit('random', "");
  });
  tempsocket.on('port', function (d,i) {
   if(connectedd==false){
     
    socketstuff(d,i);
    console.log(d);
    alreadydone = 0;
    
   }
    });
  tempsocket.on('refreshed', function (d) {
    //still need to write stuff
  });



}

function sendMessageToServer(message) {
  if (message == "disconnect") {
    socket.emit('disconnect', message);
  } else {
    socket.emit('message', message);
  }
};

function openFile( name, socket, ID) {


  const child = spawn('node', ['fileOpener.js',  name[0]]);

  child.on('close', function () {

    fs.readFile('clientFiles/' + name[0] + ".txt", 'utf8', function (err, data) {
      if (err) {
        return console.log("issa error:" + err);
      }
      console.log("issa data:" + data);
      socket.emit('update', {
        funct: '',
        ID: name[0],
        name: name[5],
        from: name[3],
        fromid: name[4],
        type: 'FIL',
        servernum: name[1],
        synced: name[2],
        data: data

      });
    });
  });

}

function getData(d) {
  // note:  d is an object, and when converted to a string it will
  // end with a linefeed.  so we (rather crudely) account for that  
  // with toString() and then trim() 
  var trimmed = d.toString().trim();
  if (trimmed == "disconnect") {
    connectedQ = false;
  }
  
  sendMessageToServer(trimmed);
  console.log("am i here?");
  if (d.toString().trim() == "end") {
    console.log("here");
    stdin.removeListener("data", getData);
  }
}


stdin.addListener("data", getData);




function socketstuff(port,ip) {
  
     socket = ioc.connect('http://'+ip+':' + port);

  socket.on('news', function (data) {
    connectedQ=true;
    console.log(data);
    
  
    checker();
      
  });
  socketStuffConnection(socket);
  
}

function checker() {

  connectedQ = true;
  console.log("Yas u connected");
  return;


}
//"\n"
function socketStuffConnection(socket) {
  // Add a connect listener
  socket.on('connect', function () {
    console.log('Client has connected to the server!');
    socket.emit('my other event', {
      message: 'dataClientSide', type:"client"
    });

    verify = 1;
  });
  socket.on('ls', function (data) {
    console.log(data);
  });
  socket.on('connectto', function (data) {
    tempsocket.emit('to', data);
  });
  // Add a connect listener
  socket.on('makeFileR', function (data, id) {
    console.log('Your in read mode\n' + data);
  });
  socket.on('SSyncG', function () {
    console.log('Your in ssyncg');
  });
  socket.on('makeFileW', function (data, id) {
    console.log('Your in write mode\n');
    fs.writeFileSync('clientFiles/' + id[0] + ".txt", data);
    openFile( id, socket, 2);
  });
  socket.on('changeFolder', function (data) {
    console.log(data);

  });
  // Add a disconnect listener
  socket.on('disconnect', function () {
    console.log('The client has disconnected!');
    socket.removeListener();
    connectedQ=false;
    connectedd=false;
    console.log("3not comnnected yet");
    tempsocket.emit('random', "");
  });
  socket.on('error', function (data) {

    console.log(chalk.red(data));

  });
}
// Sends a message to the server via sockets


console.log("Im free");