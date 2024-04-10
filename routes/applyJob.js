const router = require('express').Router();
const multer = require('multer');
const JobApply = require('../models/applyJob');
const jobApplication = require('../functions/jobApplication');
const Job = require('../models/job.js');
const fs = require('fs');

const uploads = multer({ dest : 'uploads/'});

router.post('/jobapply', uploads.single('resume'), async ( req, res)=>{
    console.log(req.body);
    console.log(req.file);

    const recruiterEmail = req.body.recruiterEmail;
    const subject = req.body.subject;
    const body = req.body.body;
    const resume = req.file.path;
    const portfolio = req.body.portFolioLink;
    const applicantEmail = req.body.applicantEmail;
    const applicantId = req.body.applicantId;

    const newApplication = new JobApply(req.body);
    const mail = await jobApplication(recruiterEmail, subject, body, resume, portfolio, applicantEmail);
    if(mail.includes('Email sent successfully!')){
    try{
        await Job.findOneAndUpdate({ _id : req.body.jobPostId }, { $push : { appliedCandidates : applicantId}});
        await newApplication.save();
        fs.unlink(req.file.path, (err)=>{
            if(err){
                console.log('error deleting the resume..', err);
                return;
            }
            console.log('resume deleted successfully!!!');
        })
        res.status(200).send('job applied successfully!!')
    }catch(err){
        console.log(err);
        res.status(500).send('error applying for job!!');
    }
}else{
    res.status(404).send('error sending email!!')
}
})

module.exports = router;