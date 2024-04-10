const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderId : {
        type : String,
        required : true
    },
    recieverId : {
        type : String,
        required : true
    },
    text : {
        type : String,
        required : true
    }
}, { timestamps : true });

const conversationSchema = new mongoose.Schema({
    members : {
        type : Array,
        required : true
    },
    messages : {
        type : [messageSchema]
    }
},{ timestamps : true });

module.exports = mongoose.model('conversation', conversationSchema);