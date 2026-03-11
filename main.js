const { app, BrowserWindow, ipcMain, session } = require("electron");
const path = require("path");
const dns = require("dns");
const net = require("net");

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

/* CAPTURE RESPONSE HEADERS */

session.defaultSession.webRequest.onHeadersReceived(

{ urls:["<all_urls>"] },

(details, callback)=>{

if(win){

win.webContents.send("headers-data", details.responseHeaders);

}

callback({cancel:false});

}

);

}

app.whenReady().then(createWindow);

/* SUBDOMAIN SCAN */

ipcMain.handle("scan-subdomains", async(e,domain)=>{

const list=["www","api","mail","dev","test","admin","beta"];

let found=[];

for(let sub of list){

let host=sub+"."+domain;

try{

await dns.promises.resolve(host);

found.push(host);

}catch{}

}

return found;

});

/* PORT SCAN */

ipcMain.handle("scan-ports", async(e,host)=>{

const ports=[21,22,80,443,3000,8080];

let open=[];

for(let port of ports){

await new Promise(res=>{

const socket=new net.Socket();

socket.setTimeout(500);

socket.connect(port,host,()=>{

open.push(port);

socket.destroy();

res();

});

socket.on("error",()=>res());
socket.on("timeout",()=>res());

});

}

return open;

});

/* IP FINDER */

ipcMain.handle("find-ip", async(e,domain)=>{

try{

let result=await dns.promises.lookup(domain);

return result.address;

}catch{

return "IP not found";

}

});
