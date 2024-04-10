const router = require('express').Router();
const Jobs = require('../models/job.js');
const ApplyJob = require('../models/applyJob.js');
const respondApplication = require('../models/respondApplicant.js');


router.post('/jobs/createnew', async ( req, res)=>{

    const newJob = new Jobs(req.body);

    try{
        console.log(newJob)
        const result = await newJob.save();
        res.status(200).send('job created successfully!!');
    }catch(err){
        console.log('Error creating new job..',err);
        res.status(500).send('Internal Server Error!!');
    }
});

router.get('/alljobs/:username', async ( req, res)=>{
    try{
        const username = req.params.username;
console.log(req.params)
        console.log(username);

        const response = await Jobs.find();
        console.log(response)
        const filteredJobs = response.filter(job => job.username !== username);
        console.log(filteredJobs);
        res.status(200).send(filteredJobs);
    }catch(err){
        console.log(err);
        res.status(404).send('Internal Server Error!!');
    }
});

router.get('/alljobs/dashboard', async ( req, res)=>{
    try{

        const response = await Jobs.find();
        console.log(response)
        res.status(200).send(response);
    }catch(err){
        console.log(err);
        res.status(404).send('Internal Server Error!!');
    }
});

router.get('/appliedcandidates/:jobId', async ( req, res )=>{
    const jobId = req.params.jobId;

    try{
        const job =  await Jobs.findOne({ _id : jobId });
        console.log(job)
        if(!job){
            return res.status(404).send('no job found!!')
        }
        const appliedCandidates = job.appliedCandidates;
        if(appliedCandidates.length < 0 ){
            return res.status(200).send('No Application Recieved Yet!!');
        }else{
            const appliedCandidatesPromises = appliedCandidates.map(async (candidate)=>{
                const userDetails =  await ApplyJob.findOne({ applicantId : candidate});
                return userDetails 
            });
            const userDetails = await Promise.all(appliedCandidatesPromises);
            res.status(200).send(userDetails);
        }
    }catch(err){
        console.log(err);
        res.status(500).send('Error fetching Details!!');
    }
} );

router.get('/appliedcandidates/sendedmails/:email', async ( req, res)=>{

    const email = req.params.email;

    try{

        const response = await respondApplication.find({ email : email });
        console.log(response);
        res.status(200).send(response);
    }catch(err){
        console.log(err);
        res.status(500).send('error fetching sended mails..');
    }
});

router.get('/appliedcandidates/recievedmails/:email', async ( req, res)=>{
    const email = req.params.email;

    try{

        const response = await respondApplication.find({ applicantEmail : email});
        console.log(response);
        res.status(200).send(response);
    }catch(err){
        res.status(500).send('error fetching recieved mails..');
    }
});

module.exports = router;