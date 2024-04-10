const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    userId : {
        type : String,
        required : true
    },
    username : {
        type : String,
        required : true
    },
    jobTitle : {
        type : String,
        required : true
    },
    company : {
        type : String,
        required : true
    },
    workPlaceType : {
        type : String,
        required : true
    },
    jobLocation : {
        type : String,
        required : true
    },
    jobType : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    requiredTechincalSkills : {
        type : Array,
        default : []
    },
    requiredNonTechnicalSkills : {
        type : Array,
        default : []
    },
    requiredCommunicationLanguage : {
        type : Array,
        default : []
    },
    workingHours : {
        type : String
    },
    salary : {
        type : String
    },
    workingExperience : {
        type : String
    },
    applicationCollection : {
        type : String,
        required : true
    },
    interested : {
        type : Array,
        default : []
    },
    appliedCandidates : {
        type : Array,
        default : []
    }
}, {timestamps : true});

module.exports = mongoose.model('job', jobSchema);