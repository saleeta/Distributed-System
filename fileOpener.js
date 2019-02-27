
const opn = require('opn');
var args = process.argv.slice(2);
console.log(args[0]+":"+args[1]);
const fs = require('fs');
opn('clientFiles/'+args[0]+".txt",[true]);
