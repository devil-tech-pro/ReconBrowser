const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api",{

scanSite:(domain)=>ipcRenderer.invoke("scan-site",domain),

onHeaders:(callback)=>ipcRenderer.on("headers",(e,data)=>callback(data))

});
