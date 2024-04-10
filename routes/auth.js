const router = require('express').Router();
const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')

dotenv.config();
const secret = process.env.SECRET_ONE;

function createToken(user){
    console.log('first');
    const token =  jwt.sign({ user }, secret, {
        expiresIn : '5d'
    });
    console.log(token)
    return token;
}
//register
router.post('/register', async (req,res)=>{
    console.log(req.body);
    const secret = process.env.SECRET_ONE;
    let email = ''

    try{
    const verfication = jwt.verify(req.body.token, secret, async (err, decoded)=>{
        if(err){
            console.log(err)
            res.status(500).json('time out!!');
        }else{
            email = decoded.email;
            console.log(decoded);
                //hashing password
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(req.body.password, salt);
        
                const newUser = User({
                    username : req.body.username,
                    email : email,
                    password : hashedPassword
                });
                console.log('hiiiiiiiiii');
                console.log(newUser)
                //save user and  send response
                const user = await newUser.save();
                console.log(user);
                res.status(200).send('user successfully registered!!');
        }
    })
}catch(err){
    res.status(500).json(err);
}
});

//login
router.post('/login', async (req, res)=>{
    console.log(req.body.email);
    try{
        const user = await User.findOne({ email : req.body.email });
        console.log(user);
        if(user){
            const valid  = await bcrypt.compare(req.body.password, user.password);
            console.log(valid);
            if(valid){
                console.log('creating token...')
                const token = createToken(user);
                console.log(token);
            res.status(200).json({ user : user, token : token });
        }else{
            res.status(400).send('wrong password!!')
        }
        }else{
            res.status(400).send("user not found!!")
        }
    }catch(err){
        res.status(500).json(err);
    }
})

module.exports = router;