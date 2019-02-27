var http = require('http');
var fs = require('fs');
var path = require('path');
const readline = require('readline');
const ioc = require('socket.io-client');
var emitters=new Array();
var str = new Array();
var logs = new Array();
var arr;
var a;
var val = 0;
var num = 1;
var IPnPort;
var serverNo = 3;
var noOfFiles = 0;
var port;
var timeoutval = 200;
var filepath = 'MyFiles3/';
var io;
var connectionlist = [];
var logcount = 0;
var CLcount = 0;
var temporarySocket;
var currentfolder = "main";
var totalconnectionsever = 1;
var totalconnections = 0;
var allconnections = new Array();
PopulateDB();
setTimeout(getIP, 3000);




var currentLocation;
var currentLocationID;


// function startup() {

//     console.log("is it work?");
//     console.log("ssyng g jao");
//     for(var i=0;i<CLcount;i++){
//         if(connectionlist[i].connected==true){
//             connectionlist[i].Socket.emit("SSyncG",serverNo);

//         }
//     }
//         }
function randomopen(){
    var g=new Array();
    for(var i=0;i<connectionlist.length;i++){
        if(connectionlist[i].connectted){
g.push(i);
        }
    }
    var f=g[Math.floor(Math.random() * g.length)];
    return connectionlist[f].servernum;
}


function logging(to, what, who, idd) {
    var temp = -1;
    for (var i = 0; i < str.length; i++) {
        if (str[i].ID == idd) {
            temp = i;
        }
    }
    if (temp == -1) {
        console.log("Idont think it exsists");
    }
    logs[logcount] = {
        toserver: to,
        action: what,
        file: who,
        id: temp
    };
    logcount++;
    console.log("THis is the logged entry: toserver:" + to + " action :" + what + " file:" + who + " id:" + idd);
}
function searching(no){
for(var i=allconnections.length-1;i>=0;i--){
    p("THIS IS TYPE OF CONNECT:"+allconnections[i].type+"THIS IS NO OD CONNECT"+allconnections[i].no);
    if(allconnections[i].no==no){
        return i;
    }
}
return -1;
}
function serverCommunicate(data) {
    var c = howManyActive();

    if (data.funct == "Sfile") {
        p("m i here????????? 5");
        if (c.length > 0) {
            var a=searching( c[0].serverno);
            var pa=randomopen();
            data.funct = "add";
            data.servernum = pa;
            data.synced = serverNo;
           for(var i=0;i<allconnections.length;i++){
            if(allconnections[i].no==pa && allconnections[i].connected==1){
            allconnections[i].socket.emit("ssyncr", str,data);
        }
           }
            p("THIS IS A: "+a);
            data.servernum = serverNo;
            data.synced =pa;

            return pa;
        } else {
            return 0;
        }
    } else if (data.funct == "write") {
        var tt = ifActive(data.synced);
        p("m i here????????? 0");
        if (tt.val) {
            p("m i here????????? 1");
            var a=searching(data.synced);
            p("m i here????????? 1 var a: ("+a);
            for(var i=0;i<allconnections.length;i++){
                if(allconnections[i].no==data.synced && allconnections[i].connected==1){
                    allconnections[i].socket.emit("SUpdate", data,str); }
               }
           
            
        } else {
            p("m i here????????? 3");
            logging(data.synced, "updatedata", data.name, data.ID);
        }

        return -1;

    } else if (data.funct == "add") {
        p("m i here????????? 4");
        for (var i = 0; i < allconnections.length; i++) {
                allconnections[i].socket.emit("Sadd", data);

            
            }

    }

}

function findout(id) {
    for (var i = 0; i < str.length; i++) {
        if (str[i].ID == id) {
            return i;
        }
    }
}

function howManyActive() {
    var value = [];
    for (var i = 0; i < CLcount; i++) {
        if (connectionlist[i].connectted == true) {
            value.push({
                sock: connectionlist[i].Socket,
                serverno: connectionlist[i].servernum
            });
        }
    }
    return value;
}

function ifActive(num) {
    var value = [];
    for (var i = 0; i < CLcount; i++) {
        if (connectionlist[i].connectted == true && connectionlist[i].servernum == num) {
            return {
                val: true,
                num: i
            };
        }
    }
    return {
        val: false,
        num: 0
    };
}

function sentUpdateTo(serverno, the) {

}

function getIP() {
    const rl = readline.createInterface({
        input: fs.createReadStream('config.txt'),
        crlfDelay: Infinity
    });

    rl.on('line', (line) => {
        a = line.toString();
        var res = a.split('~');

        if (num == serverNo) {
            port = res[1];
            IPnPort = res[0];
            rl.close();
            num++;
            callserverstuff(port, IPnPort);
        } else {
            connectionlist[CLcount] = {
                IP: res[0],
                Port: res[1],
                connectted: false,
                Socket: connectto(res[1], CLcount, res[0]),
                servernum: res[2]
            };
            othertempsstuff(connectionlist[CLcount].Socket, CLcount);
            CLcount++;
            num++;

        }
    });

    rl.close;

}

function searchme(id, vals) {
    if (id == 1) {
        return -1;
    } else {
        for (var i = 0; i < vals.length; i++) {
            if (vals[i].ID == id) {
                for (var j = 0; j < str.length; j++) {
                    p("name in str: " + str[j].name + " :from id from str:" + str[j].fromid)
                       
                    if (str[j].name == vals[i].name && str[j].type == "FOL") {
                        p("name in str: " + str[j].name + " :from id from str:" + str[j].fromid)
                        if (getEquivalence(vals[i].fromid, vals) == str[j].fromid) {
                            return j;
                        }
                    }
                }
            }
        }
    }
    return -2;
}

function getEquivalence(id, vals) {
    if (id == 1) {
        return 1;
    }
    for (var i = 0; i < vals.length; i++) {
        if (vals[i].ID == id) {
            for (var j = 0; j < str.length; j++) {
                if (str[j].name == vals[i].name && str[j].type == "FOL") {
                    return str[j].ID;
                }
            }
        }
    }
    return 0;

}

function connectto(port, id, ip) {
    var socket = ioc.connect('http://' + ip + ':' + port);
    socket.on('connect', function (data) {
        socket.emit('my other event', {
            message: 'dataServersideSide',
            type: "server",
            no:serverNo
        });
        console.log("ssyng g jao");
        connectionlist[id].connectted = true;

    
    });


    socket.on("filedata", function (data, id) {
        console.log("okay now? in filedata");
        fs.writeFileSync(filepath + id + ".txt", data);


    });
    socket.on("news", function (data) {
        p("connected to server no:"+data);
        allconnections.push({
            ID: totalconnectionsever,
            socket: socket,
            location: 1,
            folder: "main",
            type: "server",
            connected: 1,
            sock: socket,
            no:data
        });
        totalconnectionsever++;
        totalconnections++;
        socket.emit("SSyncG", serverNo);

    });
    socket.on("SUpdate", function (data,alldata) {
        p("WHERE AM I EVEM??????????????");
        for(var i=0;i<str.length;i++){
           // p("IN SUPDATE FINALLLLIEEE  from("+str[i].from+")datas from("+data.from+")name("+str[i].name+")datas name("+data.name +")typpeeee("+ str.type)
            if(str[i].from==data.from && str[i].name==data.name && str[i].type=="FIL"){
                console.log("mi eveen here");
                filesyncing(str[i],data.data);
                console.log("updated here");
            }
        }
       
    });
    socket.on("ssyncr", function (alldata, data) {
        p("I AM IN SING");
        if(data.fromid==1){
            storeInDB(noOfFiles, data.name, 1, data.type, data.servernum, data.synced);
            noOfFiles++;
        }
        else{
        for(var i=0;i<str.length;i++){
if(str[i].name==data.from){
    storeInDB(noOfFiles, data.name, str[i].ID, data.type, data.servernum, data.synced);
                noOfFiles++;
                break;

}
        }
    }

    });

    socket.on("getdata", function (id, myid) {

        console.log('Your in getdata');
        fs.readFile(filepath + id + ".txt", 'UTF-8', function (err, contents) {
            if (err != null) {
                console.log("poot");
                if (err.code == "ENOENT") {
                    contents = "No such file Exsists";
                    console.log("poot1");
                } else {
                    contents = "TBH idk what went wrong";
                }
                Socket.to(socket.id).emit('error', contents);
            } else {
p("These are the contents: "+contents+" and thois the id: "+myid);
                Socket.to(socket.id).emit('filedata', contents, myid);
            }

        });
        console.log("updated here");


    });

    socket.on("SSyncR", function (data, l) {
       
       
       if(l=="norm"){
        for (var i = 0; i < data.length; i++) {
            var c = 0;
            for (var j = 0; j < str.length; j++) {
                if (data[i].name == str[j].name && typeof data[i].ID !== undefined) {
                  p("the datas server no("+data[i].servernum+") the sysytems serverno("+serverNo+") datats sync bit("+data[i].synced+")");
                    if (str[j].servernum == serverNo && str[j].synced!=0) {
                        var a=searching(str[j].synced);
                        p("m i here????????? 1 var a: ("+a+") cuz daata syncyed bit was "+data[i].synced);
                        socket.emit("getdata", data[i].ID, str[j].ID);
                     

                    }
                    c = 1;
                    break;

                }
            }
            if (c == 0) {
                var d = searchme(data[i].fromid, data);
                if(d==-1){
                    storeInDB(noOfFiles, data[i].name, 1, data[i].type, data[i].servernum, data[i].synced);
                    noOfFiles++;
                
                }
                else{
                storeInDB(noOfFiles, data[i].name, str[d].ID, data[i].type, data[i].servernum, data[i].synced);
                noOfFiles++;
            }
        }
            c = 0;
        }
    }

    else if(l=="sing"){
        p("I AM IN SING");
        var d = syncing(data.fromid, data);
        p("I AM D: "+d);
        if(d==-1){
            storeInDB(noOfFiles, data.name, 1, data.type, data.servernum, data.synced);
            noOfFiles++;
        
        }
        else{
        storeInDB(noOfFiles, data.name, str[d].ID, data.type, data.servernum, data.synced);
        noOfFiles++;
    }
    }
    });



    // socket.on("SSyncR", function (data, para) {
    //     console.log("are we in ssyncR22222222222222222222222");

    //     if (data.funct == "add") {
    //         console.log("are we in add in ssyncR");
    //         // if a file like that already exsisits then make sure to do somethiung
    //         var yell=vartoint(data.from);
    //        var ture= storeInDB(noOfFiles, data.name, yell, data.type, data.servernum, data.synced);
    //        if(ture){
    //        noOfFiles++;
    //     console.log("is  store in db true?")   
    //     }
    //     } else if (data.funct == "updatedata") {
    //         console.log("are we in updated data in ssyncR");
    //         if(data.type=="FIL"){
    //         filesyncing2(data, para);
    //     }
    // }
    // });

    return socket;
}

function syncing(alldata,data) {
for(var i=0;i<str.length;i++){
    if(str[i].name==data.name && str[i].type=="FIL"){
        var top=searchme(data.fromid,alldata);
        if(top==-1){
if(str[i].fromid==1){
    return i;
}
        }
        else{
            if(str[i].fromid==str[top].ID){
                return i;
            }
        }
    }
}

return -1
}

function filesyncing(data, act) {
    
        console.log("hellllllllllllooooooooooooo");
        fs.writeFileSync(filepath + data.ID + ".txt", act);
    
}

function filesyncing2(data, dataa) {
    var t = search(data.from, data.name);
    if (t == 0) {
        console.log("cannot find err whoops2");
    } else {
        console.log("hellllllllllllooooooooooooo");
        fs.writeFileSync(filepath + t + ".txt", dataa);
    }
}

function search(folder, file) {
    var tempid = 0;
    console.log(folder + file);
    if (folder != "main") {
        for (i = 0; i < str.length; i++) {
            console.log(str[i].name + folder + file + str[i].id + str[i].ID);
            if (str[i].name == folder && str[i].type == "FOL") {
                console.log("Found folder id:" + str[i].id);
                tempid = str[i].id;
                console.log(tempid);
                break;
            }
        }
    } else {
        tempid = 1;
    }
    for (i = 0; i < str.length; i++) {
        console.log(str[i].name + file + str[i].ID + tempid + str[i].fromid);
        if (str[i].fromid == tempid && str[i].type == "FIL" && str[i].name == file) {
            return str[i].ID;
        }
    }
    return 0;
}

function othertempsstuff(socket, id) {

    socket.on('connect', function (data) {
        connectionlist[id].connectted = true;
        for(var i=allconnections.length-1;i>=0;i--){
            if(socket.id==allconnections[i].socket.id){
                allconnections[i].connected==1;
                
            }
        } });




    socket.on('disconnect', function () {

        // allconnections[comparision(socket.id) - 1].connected = 0;
        p("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
        connectionlist[id].connectted = false;
        for(var i=allconnections.length-1;i>=0;i--){
            if(socket.id==allconnections[i].socket.id){
                allconnections[i].connected==0;

            }
        }
        console.log("removed from list");
        p("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
    });
}

function callserverstuff(port, ip) {
    serverstuff(port, ip);
}

function PopulateDB() {
    const rl = readline.createInterface({
        input: fs.createReadStream(filepath + '/allFiles.txt'),
        crlfDelay: Infinity
    });

    rl.on('line', (line) => {
        a = line.toString();
        arr = a.split("~");
        str[val] = {
            funct: '',
            ID: arr[1],
            name: arr[3],
            from: inttovar(arr[2]),
            fromid: arr[2],
            type: arr[0],
            servernum: arr[4],
            synced: arr[5]


        };
        val++;
        noOfFiles++;

    });
    console.log("DB is now SYNCED");
    noOfFiles++;
    // startup();
}
//write function to store to db
function p(data) {
    console.log(data);
}
//lists all data in a folder 
function getFilesFromFolder(folderID) {
    var ListedData = "";
    var i = 0;
    var count = 1;
    var theID;
    for (i = 0; i < str.length; i++) {
        if (str[i].fromid == folderID) {
            ListedData += str[i].type + " " + str[i].name + '\n';
            console.log("I printed one");
        }
    }

    return ListedData;

}

function getstuff(folderID, name) {
    var ListedData = "";
    var i = 0;
    for (i = 0; i < str.length; i++) {
        if (str[i].fromid == folderID && str[i].name == name) {
            ListedData = str[i].ID;
            return ListedData;
        }
    }

    return ListedData;

}

function removefromDB(id) {
    var temp = [];
    for (var i = 0; i < str.length; i++) {
        if (str[i].ID == id && str[i].servernum == serverNo || str[i].fromid == id) {
            delete str[i];
            rollback(i, str);
        } else {
            temp.push(str[i]);
        }
    }
    fs.writeFileSync(filepath + 'allFiles.txt', str[0].type + "~" + str[0].ID + "~" + str[0].fromid + "~" + str[0].name + "~" + str[0].servernum + "~" + str[0].synced)
    for (var j = 1; j < str.length; j++) {
        fs.appendFileSync(filepath + 'allFiles.txt', '\r\n' + str[j].type + "~" + str[j].ID + "~" + str[j].fromid + "~" + str[j].name + "~" + str[j].servernum + "~" + str[j].synced);
    }
}

function rollback(i, arr) {
    var temp = arr.length;
    for (; i < arr.length - 1; i++) {
        arr[i] = arr[i + 1];
    }
    arr.length = temp - 1;

}

function checke(name, from){
    for(var i=0;i<str.length;i++){
        if(str[i].name==name && str[i].from==from){
            return true;
        }
    }
    return false;
}

function storeInDB(id, name, from, type, serv, syncer) {
    if(checke(name,inttovar(from))){
return -1;
    }
    p("storing:("+name+") in db kay");
    fs.appendFileSync(filepath + 'allFiles.txt', '\r\n' + type + "~" + id + "~" + from + "~" + name + "~" + serv + "~" + syncer);
    str.push({

        funct: '',
        ID: id,
        name: name,
        from: inttovar(from),
        fromid: from,
        type: type,
        servernum: serv,
        synced: syncer



    });
    if (type == 'FIL' && (syncer == serverNo || serv == serverNo)) {
     p("AND I CREAATTTTTTTTTTTTTEEEE MEEE cALLEEd: "+name + "with syncer:"+syncer+" and serv "+serv+"and server no"+serverNo);
        fs.writeFileSync(filepath + id + ".txt", "");
    }
    return true;
}

function inttovar(intval) {
    if (intval == 1) {
        return 'main';
    } else {
        for (i = 0; i < str.length; i++) {
            if (str[i].ID == intval && str[i].type == 'FOL') {
                return str[i].name;
            }
        }
    }
}

function vartoint(location) {
    if (location == 'main') {
        return 1;
    }
    for (i = 0; i < str.length; i++) {
        console.log("varto in name:" + str[i].name + " " + str[i].type);
        if (str[i].name == location && str[i].type == 'FOL') {
            console.log("********************************************************************************" + str[i].ID);
            return str[i].ID;
        }
    }
}
//gets numeric form of alphabetical file name
function getFileLoc(location, name) {
    var stuff = [];
    console.log("location" + location);
    var locale = vartoint(location);
    console.log("am i here?" + locale + name);
    for (i = 0; i < str.length; i++) {
        console.log("am i here? from:" + str[i].fromid + " " + locale + " TYPE:" + str[i].type + " NAME:" + str[i].name + " " + name);
        if (str[i].fromid == locale && str[i].type == "FIL" && str[i].name == name) {
            console.log("am i here?" + str[i].ID);
            stuff.push(str[i].ID);
            stuff.push(str[i].servernum);
            stuff.push(str[i].synced);
            stuff.push(str[i].from);
            stuff.push(str[i].fromid);
            stuff.push(str[i].name);
            return stuff;
        }
    }
    return "";


}

function onRequest(request, response) {
    console.log("ping");
    if (request.method == 'GET' && request.url == '/') {
        response.writeHead(200, {
            "Content-Type": "text/html"
        });
        //Open file as readable stream, pipe stream to response object
        fs.createReadStream("./index.html").pipe(response);
    } else {
        send404Response(response);
    }
}

function serverstuff(port, ip) {

    var io = require('socket.io');
    var server = http.createServer();
    server.listen(port, ip);
    var socket = io.listen(server);

    // console.log(port);
    // var server = http.createServer(onRequest).listen(port,127.0.0.1);
    // console.log("Server" + serverNo + " is now running on:" + port);

    // io = require('socket.io')(server);
    // var socket = io.listen(server);


    //    allconnections[totalconnectionsever-1].socket.emit('message', {
    //         msg: 'im on port:' + port
    //     });
    var currentdata = {
        io: io,
        socket: socket,
        currentLocationID: 1,
        currentfolder: 'main',
        sock: ""
    };
    everythingElse(currentdata, socket);
}

//implement file ids
function readFile(name, loc, ID, func) {
    var socket = allconnections[ID - 1].socket;
    var currentLocationID = allconnections[ID - 1].location;
    var sock = allconnections[ID - 1].sock;
    var data;
    if (func == 'L') {
        p("socket:" + socket + " :sock:" + sock + " :location:" + currentLocationID + " :ID:" + ID)
        socket.to(sock.id).emit('ls', getFilesFromFolder(currentLocationID));
        p("i sentt it");

    } else {

        var myid = getFileLoc(loc, name);
        if (myid != "") {
            console.log(myid[2] + myid[1] + myid[0]);
            if (myid[2] == serverNo || myid[1] == serverNo) {
                fs.readFile(filepath + myid[0] + ".txt", 'UTF-8', function (err, contents) {
                    if (err != null) {
                        console.log("poot");
                        if (err.code == "ENOENT") {
                            contents = "No such file Exsists";
                            console.log("poot1");
                        } else {
                            contents = "TBH idk what went wrong";
                        }
                        socket.to(sock.id).emit('error', contents);
                    } else {

                        socket.to(sock.id).emit('makeFile' + func, contents, myid);
                    }

                });
            } else {
                socket.to(sock.id).emit('connectto', myid[1]);

            }

        } else {
            socket.to(sock.id).emit('error', "its weird burh check your location:" + loc + " name:" + name);
        }
    }
}

function changeFolder(toLocation, id) {
    for (i = 0; i < str.length; i++) {
        if (str[i].fromid == allconnections[id - 1].location && str[i].type == "FOL" && str[i].name == toLocation) {
            currentLocation += toLocation + "/";
            allconnections[id - 1].location = str[i].ID;
            allconnections[id - 1].folder = str[i].name;
            return {id:str[i].ID,name:str[i].name, message:"Success you are in " + str[i].name};
       
        }
    }
    return 1;
}

function searchup(folderid) {
    for (var i = 0; i < str.length; i++) {
        if (str[i].ID = folderid) {
            return i;
        }
    }
    return -1;
}

function goBack(id) {
    var a = allconnections[id - 1].location;
    if (a == 1) {
        return {id:0,name:"", message:"Theres no going back"};
    } else {
        var b = searchup(a);
        if (str[b].fromid == 1) {
            allconnections[id - 1].location = 1;
            allconnections[id - 1].folder = "main";
            return {id:1,name:"main", message:"Success you are in MyFiles"};
        } else {
            var c = searchup(str[b].fromid);
            allconnections[id - 1].location = str[b].fromid;
            allconnections[id - 1].folder = str[c].name;
            return {id:str[b].fromid,name:str[c].name, message:"Success you are in " + str[c].name};
        }
    }

}

function controler(ID, message, description) {
    var socket = allconnections[ID - 1].socket;
    var currentLocationID = allconnections[ID - 1].location;
    var currentfolder=allconnections[ID - 1].folder;
    var sock = allconnections[ID - 1].sock;
    if (message == "message") {
        var res = description.split(" ");
        if (res[0] == "ls") {
            readFile("allFiles.txt", currentLocationID, ID, "L");

            console.log('after calling readFile');

        } else if (res[0] == "create") {
            var data;
            
            if (res.length == 3) {

                if (res[1] == "file") {
var name=checker(res[2],currentfolder,'FIL');
                    data = {
                        funct: 'add',
                        ID: noOfFiles,
                        name: name,
                        from: currentfolder,
                        fromid: currentLocationID,
                        type: 'FIL',
                        servernum: serverNo,
                        synced: 0
                    };
                    noOfFiles++;
                    storeInDB(data.ID, data.name, data.fromid, data.type, data.servernum, data.synced);
                    
                    serverCommunicate(data);


                } else if (res[1] == "folder") {
                    
var name=checker(res[2],currentfolder,'FOL');

                    data = {
                        funct: 'add',
                        ID: noOfFiles,
                        name: name,
                        from: currentfolder,
                        fromid: currentLocationID,
                        type: 'FOL',
                        servernum: serverNo,
                        synced: 0
                    };
                    noOfFiles++;
                    storeInDB(data.ID, data.name, data.fromid, data.type, data.servernum, data.synced);
                    
                    serverCommunicate(data);

                }
                socket.to(sock.id).emit('changeFolder', "Success have now created " + res[1] + " " + res[2]);
            } else {

                if (res[1] == "file" && res[2] == "sync") {
                
var name=checker(res[3],currentfolder,'FIL');
                    data = {
                        funct: 'Sfile',
                        ID: noOfFiles,
                        name: name,
                        from: currentfolder,
                        fromid: currentLocationID,
                        type: 'FIL',
                        servernum: serverNo,
                        synced: 1
                    };
                    noOfFiles++;
                    var ll = serverCommunicate(data);
                    console.log("this frustrates me " + ll + " AM I HHHHHHHHHHHHHHHEEEEEEERRRRRREEEEEEEEEEE");
                    if (ll != 0) {
                        data.synced = ll;
                       
                        storeInDB(data.ID, data.name, data.fromid, data.type, data.servernum, ll);
                       
                        socket.to(sock.id).emit('changeFolder', "Success have now created " + res[1] + " " + res[3]);
                    } else {
                        socket.to(sock.id).emit('error', "Unable to preform said action");
                    }
                }
            }

        } else if (res[0] == "read") {
            readFile(res[1], allconnections[ID - 1].folder, ID, 'R');
        } else if (res[0] == "remove") {
            var a = getstuff(allconnections[ID - 1].location, res[1]);
            if (a == "") {
                socket.to(sock.id).emit('error', "No such file or folder");
            } else {
                removefromDB(a);
                socket.to(sock.id).emit('changeFolder', "File/Folder has been removed");
            }
        } else if (res[0] == "edit") {
            readFile(res[1], allconnections[ID - 1].folder, ID, 'W');
        } else if (res[0] == "cd") {
            var temp = changeFolder(res[1], ID);
            if (temp.id == 0) {
                socket.to(sock.id).emit('error', "Folder " + res[1] + " dose not Exsist :)");
            
            
            } else {
                currentLocationID=temp.id;
                socket.to(sock.id).emit('changeFolder', "Success you are now in folder " + res[1]);
                currentfolder = res[1];
            }
        } else if (res[0] == "back") {
            var temp=goBack(ID);
            if (temp.id == 0) {
                socket.to(sock.id).emit('error', temp.message);
                currentfolder = "main";
                currentLocationID=1;

            } else {
                currentLocationID=temp.id;
                currentfolder=temp.name;
                socket.to(sock.id).emit('changeFolder', temp.message);

            }

        }
    }
}
function checker(name, from, type){
    
    var a=checke(name,from);
    var nam=name;
    var res=nam.split(".");
    if(res.length<2 && type=="FIL"){
        var count=0;
        while (a) {
            count++;
            var nam=name+"("+count+").txt";
            var a=checke(nam,from);
          }
          return nam;
    }else if(res.length>=2 && type=="FIL"){
        var count=0;
        while (a) {
            count++;
            var nam=res[0]+"("+count+").txt";
            var a=checke(nam,from);
          }
          return nam;
    }
    else{
        var count=0;
        while (a) {
            count++;
            var nam=res[0]+"("+count+")";
            var a=checke(nam,from);
          }
          return nam;
    }
   
}

function comparision(one) {
    for (var i = 0; i < allconnections.length; i++) {
        if (allconnections[i].sock.id == one) {
            p("Its true here" + allconnections[i].ID);
            return allconnections[i].ID;
        } else {
            p("Its false here" + allconnections[i].ID);
        }
    }
    return 0;
}

function everythingElse(currentdata, Socket) {
    var currentLocationID = currentdata.currentLocationID;

    var ID = 0;
    Socket.on('connection', function (socket) {
        allconnections.push({
            ID: totalconnectionsever,
            socket: Socket,
            location: 1,
            folder: "main",
            type: "",
            connected: 1,
            sock: socket,
            no:0
        });

        console.log("connected");
        currentLocation = "/";
        currentLocationID = 1;
        console.log(socket.id);
        currentdata.sock = socket;

        ID = totalconnectionsever;
        totalconnectionsever++;
        totalconnections++;

        Socket.to(socket.id).emit('news', serverNo);

        Socket.to(socket.id).emit('message', "hiya there im server" + serverNo + " " + socket.id);

        socket.on('my other event', function (data) {
            console.log(data.message);
            allconnections[comparision(socket.id) - 1].type = data.type;
            p("Thhis was just added to connections:"+data.type);
            if(data.type=="server"){
                allconnections[comparision(socket.id) - 1].no = data.no;
                p("sending serverno"+serverNo);
                // Socket.to(socket.id).emit('news', serverNo);
            }


        });
        socket.on("filedata", function (data, id) {
            console.log("okay now? in filedata");
            fs.writeFileSync(filepath + id + ".txt", data);
    
    
        });
        // socket.on("news", function (data) {
        //     p("connected to server no:"+data);
        // allconnections.push({
        //     ID: totalconnectionsever,
        //     socket: socket,
        //     location: 1,
        //     folder: "main",
        //     type: "server",
        //     connected: 1,
        //     sock: socket,
        //     no:data
        // });
        // totalconnectionsever++;
        // totalconnections++;
        // socket.emit("SSyncG", serverNo);
        // });
    
        socket.on("Sadd", function (data) {
            var count=0;
            for(var i=0;i<str.length;i++){
                if(str[i].name==data.name && str[i].from==data.from){
                    count++;
                }
            }

            if(count==0){
                var temp = vartoint(data.from);
                storeInDB(noOfFiles, data.name, temp, data.type, data.servernum, data.synced);
                noOfFiles++; 
            }
            
        });
        socket.on("SSyncG", function (servno) {
            var contents = new Array();

            for (var i = 0; i < str.length; i++) {
                console.log("this is put in contents" + str[i].name + " " + str[i].ID + " " + str[i].synced);
                contents.push({
                    name: str[i].name,
                    id: str[i].ID,
                    sync: str[i].synced,
                    servernum: serverNo
                });

            }
            console.log('Your in ssyncg');
            Socket.to(socket.id).emit("SSyncR", str, "norm");
            console.log("updated here");


        });
        socket.on("getdata", function (id, myid) {

            console.log('Your in getdata with id:' +id+"and my id:"+myid);
            fs.readFile(filepath + id + ".txt", 'UTF-8', function (err, contents) {
                if (err != null) {
                    console.log("poot");
                    if (err.code == "ENOENT") {
                        contents = "No such file Exsists";
                        console.log("poot1");
                    } else {
                        contents = "TBH idk what went wrong";
                    }
                    Socket.to(socket.id).emit('error', contents);
                } else {
p("in get data with the contents being: "+contents+" and the id being:"+myid);
                    Socket.to(socket.id).emit('filedata', contents, myid);
                }

            });
            console.log("updated here");


        });

        socket.on("SUpdate", function (data,alldata) {
            p("WHERE AM I EVEM??????????????");
            for(var i=0;i<str.length;i++){
                if(str[i].from==data.from && str[i].name==data.name && str.type=="FIL"){
                    console.log("mi eveen here");
                    filesyncing(str[i],data.data);
                    console.log("updated here");
                }
            }
           
        });


        // socket.on("SSyncG", function (servno) {

        //     console.log('Your in ssyncg');
        //     console.log("plissss explain");
        //     for (var i = 0; i < logs.length; i++) {
        //         if (logs[i].toserver == servno && logs[i].action == 'add') {
        //             str[logs[i].id].funct = logs[i].action;
        //             socket.to(socket.id).emit("SSyncR", str[logs[i].id], "");
        //         } else if (logs[i].toserver == servno && logs[i].action == "updatedata") {
        //             str[logs[i].id].funct = logs[i].action;
        //             fs.readFile(filepath + str[logs[i].id].ID + ".txt", 'utf8', function (err, data) {
        //                 socket.to(socket.id).emit("SSyncR", str[logs[i].id], data);
        //             });

        //         }
        //     }

        //     console.log("updated here");


        // });
        socket.on('message', function (data) {

            controler(comparision(socket.id), 'message', data);
        });
        socket.on('disconnect', function (data) {

            allconnections[comparision(socket.id) - 1].connected = 0;



        });


        socket.on('update', function (data) {
            //       console.log("h:" + data.types);
            //       if (data.types == "edit") {
            // NEEDS UPDATE THROUGHT ALL SERVERS OKAY BYEE
            if (data.synced != 0) {
                data.funct = "write";
                console.log("server gets dataID" + data.ID);
                var bool = serverCommunicate(data);
                if (bool == -1) {
                    fs.writeFileSync(filepath + data.ID + ".txt", data.data);

                } else {
                    Socket.to(socket.id).emit('error', "Unable to update");

                }
            } else {
                fs.writeFileSync(filepath + data.ID + ".txt", data.data);

            }
            console.log("huh");
            //       }
        });

        socket.on('connection', function (client) {
            console.log('Connection to client established');

            // Success!  Now listen to messages to be received
            client.on('message', function (event) {
                console.log('Received message from client!', event);
            });

            client.on('disconnect', function () {

                console.log('Server has disconnected');
            });
        });
    });

}
