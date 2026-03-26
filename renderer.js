const url=document.getElementById("url");
const view=document.getElementById("view");
const results=document.getElementById("results");
const terminal=document.getElementById("terminal");
const headersBox=document.getElementById("headers");
const cookiesBox=document.getElementById("cookies");

/* TERMINAL */

function log(text){

terminal.innerHTML+="<br>> "+text;

terminal.scrollTop=terminal.scrollHeight;

}

/* ENTER */

url.addEventListener("keydown",async(e)=>{

if(e.key==="Enter"){

let address=url.value.trim();

if(!address.startsWith("http")){
address="https://"+address;
}

view.src=address;

log("Scanning "+address);

let domain=new URL(address).hostname;

let data=await window.api.scanSite(domain);

results.innerHTML="";

/* IP */

results.innerHTML+="<h3>IP</h3>"+data.ip;

/* SUBDOMAINS */

results.innerHTML+="<h3>Subdomains</h3>";

data.subdomains.forEach(s=>{

results.innerHTML+=s+"<br>";

});

/* PORTS */

results.innerHTML+="<h3>Open Ports</h3>"+data.ports.join(", ");

/* DIRECTORIES */

results.innerHTML+="<h3>Directories</h3>";

data.directories.forEach(d=>{

results.innerHTML+='<a href="'+d+'" target="_blank">'+d+"</a><br>";

});

}

});

/* NAVIGATION */

function back(){ if(view.canGoBack()) view.goBack(); }

function forward(){ if(view.canGoForward()) view.goForward(); }

function reload(){ view.reload(); }

/* COOKIES */

view.addEventListener("did-finish-load",async()=>{

try{

let cookies=await view.executeJavaScript("document.cookie");

cookiesBox.innerHTML=cookies||"No cookies";

}catch{

cookiesBox.innerHTML="Cannot access cookies";

}

});

/* HEADERS */

window.api.onHeaders((headers)=>{

headersBox.innerHTML="";

for(let key in headers){

headersBox.innerHTML+=key+" : "+headers[key]+"<br>";

}

});
/* UPDATE URL BAR */

view.addEventListener("did-navigate",(e)=>{

url.value = e.url;

});

/* UPDATE FOR INTERNAL LINKS */

view.addEventListener("did-navigate-in-page",(e)=>{

url.value = e.url;

});
