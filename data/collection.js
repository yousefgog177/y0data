let randomToken = require('random-token')
let ws = require('../ws/index.js')
let EventEmitter = require("events");
  
let create = async function (thi, collectionName){
  
let requestID = randomToken(8)
  
setTimeout(()=>{ thi.project.createMessage({event: "createCollection", data:{name: collectionName}, requestID}) }, 100)

let res = (await thi.waitResponse(requestID))
  
if(res.event === 'rejected') return null
return true

}

let push = async function (thi, collectionName, options){
  
let requestID = randomToken(8)
  
setTimeout(()=>{ thi.project.createMessage({event: "create", data:{name: collectionName, options}, requestID}) }, 100)

let res = (await thi.waitResponse(requestID))
  
if(res.event === 'rejected') return null
return res.data

}

let find = async function (thi, collectionName, options, select, limit, skip){
  
let requestID = randomToken(8)
  
setTimeout(()=>{ thi.project.createMessage({event: "find", data:{name: collectionName, options, select, limit, skip}, requestID}) }, 100)

let res = (await thi.waitChunk(requestID))

if(res.event === 'rejected') return null  

return res.data

}

let findOne = async function (thi, collectionName, options, select, skip){
  
let requestID = randomToken(8)
  
setTimeout(()=>{ thi.project.createMessage({event: "findOne", data:{name: collectionName, options, select, skip}, requestID}) }, 100)

let res = (await thi.waitResponse(requestID))

if(res.event === 'rejected') return null  

return res.data

}

let deleteOne = async function (thi, collectionName, options){
  
let requestID = randomToken(8)
  
setTimeout(()=>{ thi.project.createMessage({event: "deleteOne", data:{name: collectionName, options}, requestID}) }, 100)

let res = (await thi.waitResponse(requestID))

if(res.event === 'rejected') return null  

return res.data

}

let deleteMany = async function (thi, collectionName, options){
  
let requestID = randomToken(8)
  
setTimeout(()=>{ thi.project.createMessage({event: "deleteMany", data:{name: collectionName, options}, requestID}) }, 100)

let res = (await thi.waitResponse(requestID))

if(res.event === 'rejected') return null  

return res.data

}

let updateOne = async function (thi, collectionName, options, new_values){
  
let requestID = randomToken(8)
  
setTimeout(()=>{ thi.project.createMessage({event: "updateOne", data:{name: collectionName, options, new_values}, requestID}) }, 100)

let res = (await thi.waitResponse(requestID))

if(res.event === 'rejected') return null  
return res.data

}

let updateMany = async function (thi, collectionName, options, new_values){
  
let requestID = randomToken(8)
  
setTimeout(()=>{ thi.project.createMessage({event: "updateMany", data:{name: collectionName, options, new_values}, requestID}) }, 100)

let res = (await thi.waitResponse(requestID))

if(res.event === 'rejected') return null  

return res.data

}

let countDocuments = async function (thi, collectionName, options){
  
let requestID = randomToken(8)
  
setTimeout(()=>{ thi.project.createMessage({event: "countDocuments", data:{name: collectionName, options}, requestID}) }, 100)

let res = (await thi.waitResponse(requestID))

if(res.event === 'rejected') return null  

return res.data || 0

}

let getSize = async function (thi, collectionName, options){
  
let requestID = randomToken(8)
  
setTimeout(()=>{ thi.project.createMessage({event: "getSize", data:{name: collectionName, options}, requestID}) }, 100)

let res = (await thi.waitResponse(requestID))

if(res.event === 'rejected') return null  
  
return res.data || 0

}

let watch = async function (thi, collectionName){
  
let requestID = randomToken(8)
  
setTimeout(()=>{ thi.project.createMessage({event: "watch", data:{name: collectionName}, requestID}) }, 100)

let res = (await thi.waitResponse(requestID))

if(res.event === 'rejected') return null  
  
return res.data || 0

}

module.exports = {create, push, find, findOne, deleteOne, deleteMany, updateOne, updateMany, countDocuments, getSize, watch};
