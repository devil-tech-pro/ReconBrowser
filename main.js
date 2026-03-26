const { app, BrowserWindow, ipcMain, session } = require("electron");
const path = require("path");
const dns = require("dns");
const net = require("net");
const https = require("https");

let win;

function createWindow(){

win = new BrowserWindow({

width:1500,
height:900,

webPreferences:{
preload:path.join(__dirname,"preload.js"),
webviewTag:true
}

});

win.loadFile("index.html");

/* HTTP HEADERS */

session.defaultSession.webRequest.onHeadersReceived(

{urls:["<all_urls>"]},

(details,callback)=>{

win.webContents.send("headers",details.responseHeaders);

callback({cancel:false});

}

);

}

app.whenReady().then(createWindow);

/* AUTO RECON */

ipcMain.handle("scan-site",async(e,domain)=>{

let result={
ip:"",
subdomains:[],
ports:[],
directories:[]
};

/* IP */

try{

let ip=await dns.promises.lookup(domain);

result.ip=ip.address;

}catch{

result.ip="not found";

}

/* SUBDOMAINS */

const subs=["www","api","mail","dev","test","admin","beta"];

for(let s of subs){

let host=s+"."+domain;

try{

await dns.promises.resolve(host);

result.subdomains.push(host);

}catch{}

}

/* PORTS */

const ports=[21,22,80,443,3000,8080];

for(let port of ports){

await new Promise(res=>{

const socket=new net.Socket();

socket.setTimeout(500);

socket.connect(port,domain,()=>{

result.ports.push(port);

socket.destroy();

res();

});

socket.on("error",()=>res());
socket.on("timeout",()=>res());

});

}

/* DIRECTORIES */

const dirs=["admin","login","dashboard","api","uploads","images","assets"];

for(let d of dirs){

let url="https://"+domain+"/"+d;

await new Promise(res=>{

https.get(url,(resp)=>{

if(resp.statusCode<400){

result.directories.push(url);

}

res();

}).on("error",()=>res());

});

}

return result;

});
