class Message extends Object {
    constructor (message) {
      super  ()
    this.body = message
    }
    
    json(){
    try { return JSON.parse(this.body) } catch(e) { return e.message };
    }
    
    text(){
    if(this.body.includes('Buffer')) return Buffer.from(this.body).toString("utf8")
    return this.body
    }
    
}
module.exports = Message
    