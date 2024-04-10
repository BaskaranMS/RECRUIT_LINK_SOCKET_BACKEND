const router = require('express').Router();
const jobResponse = require('../functions/jobResponse.js');
const respondApplication = require('../models/respondApplicant.js');

router.post('/sendmail', async (req, res)=>{

    const { applicantEmail, mailSubject, mailBody, email } = req.body;
    console.log(req.body);
    try{
        const response = await jobResponse(applicantEmail, mailSubject, mailBody, email);
        console.log(response);
        if(response.includes('Email sent successfully!')){
            const newResponse = new respondApplication(req.body);
            await newResponse.save();
            console.log(newResponse);
            res.status(200).send('email sent successfully!!');
        }else{
            res.status(404).send(response);
        }
    }catch(err){
        console.log(err);
        res.status(500).send('error sending mail!!');
    }
})

module.exports = router;