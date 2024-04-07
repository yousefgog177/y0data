let randomToken = require('random-token')
let ws = require('../ws/index.js')
let EventEmitter = require("events");

//console.log(manage.select([{must: true, love: true}, {must: true, love: false}], {love: 1}))
let collection = require('../data/collection.js')

 class Plugin extends EventEmitter {
constructor (dataBaseID) {
  super (dataBaseID)

this.dataBaseID = dataBaseID
this.project = new ws(`wss://y0data.glitch.me/?database_id=${this.dataBaseID}`)
  
process.plugin = this
  
}
   
 connect(){
   
  this.project.on('ready', ()=>{
    this.emit('connect')
  })
  
  this.project.on('disconnect', () =>{
    this.emit('disconnect')
        this.project.reconnectStatus = true
  })
  
  this.project.on('message', (msg) =>{
    
    let data = msg.json()
    
//    console.log(data)
    
    if(data.event === 'ready'){
    this.emit('ready')
      
    }
    if(data.event === 'watchData'){
      
      if(data.requestID) return;
      
      this.emit('watch', data.data)
            
    }
    if(data.event === 'error'){
      
      let errors = [{
        num: 401,
        message: "Failed Authorized with your database, please verify from id",
        reconnect: false
      }]
      
      let err = errors.find(x => x.num === data.data)
            
      if(!err?.reconnect){

        this.project.reconnectStatus = false
                
      }else{
        
        this.project.reconnectStatus = true
        
      }
      
      this.emit('error', (err?.message || data.data))
    }
    
  })
  
}
   
async waitResponse(requestID){
return await new Promise(async re => {

  let claimedMessage = (data)=>{
    let msg = data.json()
        
    if(msg.requestID === requestID){
      re(msg);
      this.project.removeListener('message', claimedMessage)
    }
    
  }
  
    this.project.on('message', (data)=>claimedMessage(data))
    
})
}
   
async waitChunk(requestID){
return await new Promise(async re => {

  let result = '';
    
  let claimedMessage = (data)=>{
    let msg = data.json()
        
    if(msg.requestID === requestID && msg.event === 'chunk'){
//      re(msg);
//      this.project.removeListener('message', claimedMessage)

      result += msg.data
      
    }
    
    if(msg.requestID === requestID && msg.event === 'finish'){
      
      result += msg.data
        
      re({event: "accepted", data: JSON.parse(result)})
      result = ''
      this.project.removeListener('message', claimedMessage)
      
    }
    
  }
  
  
    this.project.on('message', (data)=>claimedMessage(data))
    
})
}
   
setUpCollection(collectionName){
  //, withData, select
let requestID = randomToken(8)
  
//setTimeout(()=>{ this.project.createMessage({event: "findCollection", data:{name: collectionName, withData: withData, select: select}, requestID}) }, 100)
    
//var response = await this.waitResponse(requestID)

//let res = Array.isArray(response?.data) ? response?.data : [] || []

let res = []

res.add = async (options)=>{
  return await collection.push(this, collectionName, options)
}

res.find = (options)=>{
     
  let query = {}
  
  var useSelect = null
  let useLimit = null
  let useSkip = null

  query.select = (select)=>{    
    useSelect = select
    return query
  }
  
  query.limit = (num)=>{
    useLimit = num
    return query
  }
  
  query.skip = (num)=>{
    useSkip = num
    return query
  }
  
  query.exec = ()=>{
       return collection.find(this, collectionName, options, useSelect, useLimit, useSkip)  
  }
    
  return query
}

res.findOne = (options, select)=>{
     
  let query = {}
  
  var useSelect = null
  let useLimit = null
  let useSkip = null

  query.select = (select)=>{    
    useSelect = select
    return query
  }
  
  query.limit = (num)=>{
    useLimit = num
    return query
  }
  
  query.skip = (num)=>{
    useSkip = num
    return query
  }
  
  query.exec = ()=>{
       return collection.findOne(this, collectionName, options, useSelect, useSkip)  
  }
    
  return query

}

res.deleteOne = (options)=>{
  
  return collection.deleteOne(this, collectionName, options)

}

res.deleteMany = (options)=>{
  
  return collection.deleteMany(this, collectionName, options)

}

res.updateOne = (options, new_values)=>{
  
  return collection.updateOne(this, collectionName, options, new_values)

}

res.updateMany = (options, new_values)=>{
  
  return collection.updateMany(this, collectionName, options, new_values)

}

res.countDocuments = (options)=>{
  
  return collection.countDocuments(this, collectionName, options)

}

res.size = (options)=>{
  
  return collection.getSize(this, collectionName, options)

}

res.watch = ()=>{
  
  return collection.watch(this, collectionName)

}

  return res
  
}

 }
module.exports = Plugin;
