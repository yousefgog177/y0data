let EventEmitter = require("events");
const ws = require('ws')
let Message = require('../ws/Message.js')

 class index extends EventEmitter {
constructor (url, options) {
  super  ()
this.headers = {}
if(!options) options = {}
if(options.headers) this.headers = options.headers
  
this.eventSendMessage = options.sendMessage
  
if(options.sendMessage) {
if(options.sendMessage.on) this.eventSendMessage = options.sendMessage.on
}
  
this.options = options
this.url = url
this.pingStatus = false
this.project = null
this.autosendStatus = false
this.historyPing = []
this.historySend = []
this.autoSend = {time: 10, msg: {"event": "hello", data: {world: true}}}
this.pingOptions = {time: 35, msg: {"event": "ping", data: {}}}
this._messages = []
this.cache =  true

this.ready = false

  if(options.cache === false) this.cache = false
this.reconnectStatus = options.reconnect || false
  this._catchSystem()
this._connect(url, this.headers, options)

}

 _catchSystem(){
setInterval(async ()=>{
if(this.cache === true) return;
this._messages = []
for(const d of this.historyPing.filter(data => data.use === true)) this.historyPing.shift(d)
for(const d of this.historySend.filter(data => data.use === true)) this.historySend.shift(d)

}, 500)
}

 _ready(){
this.emit("ready")
}

async _close(a1, a2, a3){
  await this.disablePing()
this.emit('disconnect', a1, a2)
this.ready = false
if(this.reconnectStatus === true) this.reconnect()
}

 _error(a1, a2, a3){
//this.emit('error', a1, a2)
}

 _eventCreateMessage(a1){
this.emit('createMessage', a1)
}

 _eventReConnect(){
this.emit('reConnect')
}

 _ping(message){
this.emit('ping', message)
}


async createMessage(msg){

let data; try { data = JSON.parse(JSON.stringify(msg)) } catch(e) {this._messages.unshift({json: null, text: msg}); return new Message(msg) };
try { 
await this.project.send(JSON.stringify(msg))
this._messages.unshift({json: JSON.parse(JSON.stringify(msg)), text: msg})
  
this.emit(this.eventSendMessage, new Message(JSON.stringify(msg)))
  
return new Message(JSON.stringify(msg))
} catch(e) { 
return e.message
}
}

 _message(msg){
try { this._messages.unshift({json: JSON.parse(msg), text: msg})} catch { this._messages.unshift({json: null, text: msg}) };
this.emit('message', new Message(msg)) 
}

async disconnect(){
 await this.project.close()
return {url: this.url, headers: this.headers, options: this.options}
}

 systemAutoSend(id){
this.historySend.unshift({id: id, use: false, send: null})
let d = this.historySend.find(a => a.id === id)
setInterval(async ()=>{
if(d.use === true) return;
this.systemAutoSend(this.historySend.length + 1);
d.use = true
if(this.autosendStatus === false) return d.send = false;
this.event('autoSend', this.autoSend.msg)
this.createMessage(this.autoSend.msg)
d.send = true
}, this.autoSend.time * 1000)
return {status: this.autosendStatus, options: this.autoSend, dataConnect: d}
}
   
 systemPing(id){
this.historyPing.unshift({id: id, use: false, send: null})
let d = this.historyPing.find(a => a.id === id)
setInterval(async ()=>{
if(d.use === true) return;
this.systemPing(this.historyPing.length + 1);
d.use = true
if(this.pingStatus === false) return d.send = false;
this.event('ping', this.pingOptions.msg)
this.createMessage(this.pingOptions.msg)
d.send = true
}, this.pingOptions.time * 1000)
return {status: this.pingStatus, options: this.pingOptions, dataConnect: d}
}

   
 enableAutoSend(options){
if(options) this.autoSend = options
this.autosendStatus = true
this.systemAutoSend(this.historySend.length + 1)
return {status: this.autosendStatus, options: this.autoSend}
}

 disableAutoSend(){
this.autosendStatus = false
return {status: this.autosendStatus, options: this.autoSend}
}
 enablePing(options){
if(options) this.pingOptions = options
this.pingStatus = true
this.systemPing(this.historyPing.length + 1)
return {status: this.pingStatus, options: this.pingOptions}
}

 disablePing(){
this.pingStatus = false
return {status: this.pingStatus, options: this.pingOptions}
}

async reconnect(time){
    return await new Promise(re => {
if(!time){
if(this.options && this.options.reconnectTime) {time = this.options.reconnectTime}else{time = 2}
}
  
  setTimeout(()=>{
this.event('reconnect')
this._connect(this.url, this.headers, this.options)
re({url: this.url, headers: this.headers, options: this.options})
    }, time * 1000)
    })
}

 event(d1, d2, d3){
if(d1 === "open") this._ready()
if(d1 === "close") this._close(d2, d3)
if(d1 === "error") this._error(d2, d3)
if(d1 === "message") this._message(d2)
if(d1 === "createmessage") this._eventCreateMessage(d2)
if(d1 === "reconnect") this._eventReConnect()
if(d1 === "ping") this._ping(d1)

return {dataOne: d1, dataTwo: d2, dataThree: d3}

}

 _connect(url, headers, options){
this.project = new ws( url , options.protocol || options._protocol , { headers:this.headers })
this.ready=true
this.project.on('open', async (open) => {this.event('open')});
this.project.on('message', async (msg) => { this.event('message', msg) })
this.project.on('close', async (d1, d2) => {this.event('close', d1, d2)});
this.project.on('error', async (d1, d2) => {this.event('error', d1, d2);});
return {url: url, headers: headers, options: options}
}


 }
module.exports = index