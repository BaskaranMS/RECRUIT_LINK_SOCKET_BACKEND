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


const typeSchema = new mongoose.Schema({
    callType : {
        type : String,
        enum : ['voiceCall', 'videoCall'],
        required : true
    },
    callerId : {
        type : String,
        required : true
    },
    recieverId : {
        type : String,
        required : true
    },
    status : {
        type : String,
        enum : [ 'attended', 'rejected', 'missedCall', 'notReached', 'initiated' ],
        required : true
    },
    callDuration : {
        type : String
    },
    onCallMessages : [ messageSchema ]
}, { timestamps : true });
const callSchema = new mongoose.Schema({
    userId : {
        type : String,
        required : true
    },
    calls : [typeSchema]
},{timestamps : true });

module.exports = mongoose.model('call', callSchema);