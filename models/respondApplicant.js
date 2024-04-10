const mongoose = require('mongoose');

const respondSchema = new mongoose.Schema({
    userId : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    applicantUserId : {
        type : String,
        required : true
    },
    applicantEmail : {
        type : String,
        required : true
    },
    mailSubject : {
        type : String,
        required : true
    },
    mailBody : {
        type : String,
        required : true
    }
},{ timestamps : true });

module.exports = mongoose.model('jobApplicationResponse', respondSchema);