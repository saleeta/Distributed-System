var http = require('http');
var fs = require('fs');
const readline = require('readline');
const ioc = require('socket.io-client');

var io;
var connectionlist = [];
var CLcount = 0;
var dnsip='localhost';

var c=getIP();
setTimeout(serverstuff,300);
var b=c;

function getIP() {
    const rl = readline.createInterface({
        input: fs.createReadStream('config.txt'),
        crlfDelay: Infinity
    });

    rl.on('line', (line) => {
        var a = line.toString();
        var res = a.split('~');
console.log(res[0]+res[1]);

        connectionlist[CLcount] = {
            IP: res[0],
            Port: res[1],
            connected: false,
            servernum: res[2]
        };
        connectto(res[1], CLcount,res[0]);
        CLcount++;

console.log(CLcount);


    });

    rl.close;
    return CLcount;

}

function refresh() {
    connectionlist = [];
    var check = getIP();
    if (check == -1) {

    } 
    else {
        return 'refreshed';
    }
}

function randomopen(){
    var g=new Array();
    for(var i=0;i<connectionlist.length;i++){
        if(connectionlist[i].connected){
g.push(i);
        }
    }
    return g[Math.floor(Math.random() * g.length)];
}

function connectto(port,id,ip) {
    var socket = ioc.connect('http://'+ip+':' + port);
    socket.on('connect', function (data) {
        connectionlist[id].connected = true;
        console.log("added to list");
    });
    socket.on('disconnect', function () {
        connectionlist[id].connected = false;
        console.log("removed from list");
    });
}

function serverstuff(){
var tempio = require('socket.io');
var tempserver = http.createServer();
tempserver.listen(1044, dnsip);
var socket = tempio.listen(tempserver);
 
socket.on('connection', function (socketal) {
    console.log("happily connected");

    
    socket.to(socketal.id).emit('news',"connected huhhhh?");
    socket.to(socketal.id).emit('my other event', {
        message: 'dataClientSide', type:"dns"
      });
    socketal.on('random', function (d) {
        console.log("happily asking for port");
        var i;var b=0;
        for (i = 0; i < CLcount; i++) {
            if (connectionlist[i].connected == true) {
                b++;
            } 
        }
        if(b==0){
            socket.to(socketal.id).emit("error", "Nobody is online");
     
        }
        else{

        var t=randomopen();
        socket.to(socketal.id).emit("port", connectionlist[t].Port,connectionlist[t].IP);
        
        }
                
    });
    socketal.on('to', function (d) {
        console.log("happily connecting to specific port");
        var i;
        for (i = 0; i < CLcount; i++) {
            if (connectionlist[i].servernum = d && connectionlist[i].connected == true) {
                socket.to(socketal.id).emit("true", connectionlist[i].port,connectionlist[i].IP);
                break;
            } else if (connectionlist[i].servernum = d && connectionlist[i].connected == false) {
                socket.to(socketal.id).emit("false", "The server is not available");
                break;
            }
        }
        // still need to write stuff here
    });
    socketal.on('refresh', function (d) {
        var c=refresh();
        if(c=='refreshed'){
            socket.to(socketal.id).emit("refreshed", "");
        }
    });
});
}