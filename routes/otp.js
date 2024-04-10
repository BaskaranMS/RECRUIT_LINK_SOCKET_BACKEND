const router = require('express').Router();
const sendOtp = require('../functions/sendOtp.js');
const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const dotenv = require('dotenv');

dotenv.config();
const secret = process.env.SECRET_ONE;

const createToken = (email, otp, val)=>{
    return jwt.sign({email, otp}, secret, {
        expiresIn : val || '5m'
    })
}

router.post('/sendotp/:email', async (req, res) => {
    console.log('ji')
    console.log(req.params)
    const email = req.params.email;
    console.log(email);

    const otp = otpGenerator.generate(6, {
        digits: true,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false
    });
    console.log(otp);

    try{
        const user = await User.findOne({ email : email });
        if(!user){
        const response = await sendOtp(email, otp);
        if(response.includes('email is sent!!!')){
            const token = createToken(email, otp, '5m');
            console.log(token)
            res.status(200).json( {token} );
        }else{
            res.status(500).json('error sending otp!!')
        }}else{
            return res.status(404).send('user is already registered!!');
        }
    }catch(err){
        console.log(err);
        res.status(500).json('server error!!')
    }
});

router.post('/verifyotp', async (req, res)=>{
    console.log(req.body);

    if(req.body.token){
        try{
            const verfication = jwt.verify(req.body.token, secret, (err, decoded)=>{
                if(err){
                    res.status(500).json({msg : 'error otp!!'})
                }else{
                    if(req.body.value == decoded.otp){
                        res.status(200).json('valid otp!!')
                    }else{
                        res.status(400).json('invalid otp!!')
                    }
                }
            })
        }catch(err){
            res.status(500).json(err);
        }
    }else{
        res.status(500).json('otp expired!!');
    }
})

module.exports = router