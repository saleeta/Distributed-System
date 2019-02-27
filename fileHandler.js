const readline = require('readline');
    
    var str=new Array();
    var arr; var a;var val=0;
    populate();
    getAllFiles();


function populate(){
    
const fs = require('fs');
 
const rl = readline.createInterface({
  input: fs.createReadStream('MyFiles/allFiles.txt'),
  crlfDelay: Infinity
});
 
rl.on('line', (line) => {
  a=line.toString();
  arr=a.split("~");
  str[val]={From:arr[2],ID:arr[1],Name:arr[3],Type:arr[0]};
  val++;
  if(val==4){
    console.log(str[3].ID);
    
}
});

// console.log(str[2].From.toString);
}
function getFileID (location,name,number){

}
function getAllFiles(){
    


}
function shutDown(){

}