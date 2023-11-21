const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const schema = new Schema({
    content : {type : String, required : true},
    senderId : {type : String, required : true},
    senderName : {type : String, required : true},
    recipientId : {type : String, required : true},
    recipientName : {type : String, required : true},
    status : {type : String, enum: ['sent', 'delivered', 'read'], default : 'sent'},
    timestamp : {type: Date, default: Date.now}
})

schema.set("toJSON", {virtuals : true}),
module.exports = mongoose.model("chat", schema)