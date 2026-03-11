const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api",{

scanSubdomains:(domain)=>ipcRenderer.invoke("scan-subdomains",domain),

scanPorts:(host)=>ipcRenderer.invoke("scan-ports",host),

findIP:(domain)=>ipcRenderer.invoke("find-ip",domain),

onHeaders:(callback)=>ipcRenderer.on("headers-data",(e,data)=>callback(data))

});
