const url=document.getElementById("url");
const view=document.getElementById("view");
const logs=document.getElementById("logs");
const terminal=document.getElementById("terminal");
const results=document.getElementById("results");
const headersBox=document.getElementById("headers");
const cookiesBox=document.getElementById("cookies");

/* TERMINAL */

function terminalLog(text){

terminal.innerHTML+="<br>> "+text;

terminal.scrollTop=terminal.scrollHeight;

}

/* ENTER */

url.addEventListener("keydown",(e)=>{

if(e.key==="Enter"){

let address=url.value.trim();

if(!address.startsWith("http")){
address="https://"+address;
}

view.src=address;

terminalLog("Opening "+address);

}

});

/* NAVIGATION */

function back(){ if(view.canGoBack()) view.goBack(); }

function forward(){ if(view.canGoForward()) view.goForward(); }

function reload(){ view.reload(); }

function devtools(){ view.openDevTools(); }

/* PAGE NAVIGATION */

view.addEventListener("did-navigate",(e)=>{

url.value=e.url;

logs.innerHTML+="<div>"+e.url+"</div>";

terminalLog("Navigated → "+e.url);

});

/* SHOW COOKIES */

view.addEventListener("did-finish-load",async()=>{

let cookies=await view.getWebContents().session.cookies.get({});

cookiesBox.innerHTML="";

cookies.forEach(c=>{

let div=document.createElement("div");

div.textContent=c.name+"="+c.value;

cookiesBox.appendChild(div);

});

});

/* SUBDOMAIN SCAN */

async function scanSubs(){

let domain=document.getElementById("domain").value;

terminalLog("Scanning subdomains...");

let subs=await window.api.scanSubdomains(domain);

results.innerHTML=subs.join("<br>");

}

/* PORT SCAN */

async function scanPorts(){

let host=document.getElementById("domain").value;

terminalLog("Scanning ports...");

let ports=await window.api.scanPorts(host);

results.innerHTML="Open ports: "+ports.join(",");

}

/* IP FINDER */

async function findIP(){

let domain=document.getElementById("domain").value;

terminalLog("Resolving IP...");

let ip=await window.api.findIP(domain);

results.innerHTML="IP Address: "+ip;

}

/* NETWORK GRAPH */

const ctx=document.getElementById("graph");

let chart=new Chart(ctx,{
type:"line",
data:{
labels:[],
datasets:[{
label:"Traffic",
data:[],
borderColor:"#00ff00"
}]
}
});

setInterval(()=>{

let v=Math.random()*10;

chart.data.labels.push("");

chart.data.datasets[0].data.push(v);

if(chart.data.labels.length>20){

chart.data.labels.shift();
chart.data.datasets[0].data.shift();

}

chart.update();

},1000);
/* RECEIVE HEADERS */

window.api.onHeaders((headers)=>{

headersBox.innerHTML="";

for(let key in headers){

let div=document.createElement("div");

div.textContent=key+" : "+headers[key];

headersBox.appendChild(div);

}

});

/* FETCH COOKIES */

view.addEventListener("did-finish-load",async()=>{

try{

const cookies=await view.executeJavaScript("document.cookie");

cookiesBox.innerHTML=cookies || "No cookies found";

}catch{

cookiesBox.innerHTML="Unable to read cookies";

}

});
