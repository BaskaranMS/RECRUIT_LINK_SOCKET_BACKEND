const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
    recruiterEmail : {
        type : String,
        required : true
    },
    recruiterUsername : {
        type : String,
        required : true
    },
    recruiterId : {
        type : String,
        required : true
    },
    applicantId : {
        type : String,
        required : true
    },
    jobPostId : {
        type : String,
        required : true
    },
    applicantEmail : {
        type : String,
        required : true
    },
    subject : {
        type : String,
        required : true
    },
    body : {
        type : String,
        required : true
    },
    portFolioLink : {
        type : String,
        required : true
    }
}, {timestamps : true });

module.exports = mongoose.model('jobApplication', jobApplicationSchema);