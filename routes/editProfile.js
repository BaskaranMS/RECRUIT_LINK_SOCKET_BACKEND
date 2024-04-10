const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Post = require('../models/post');
const multer = require('multer');
const fs = require('fs');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');

dotenv.config();
const upload = multer({ dest : 'uploads/'});

const s3 = new AWS.S3({
    accessKeyId : process.env.ACCESS_KEY,
    secretAccessKey : process.env.SECRET_KEY
});

const secret = process.env.SECRET_ONE;

router.post('/profile/edit', 
upload.fields([{name : 'profilePic', maxCount : 1}, 
{ name : 'coverPic', maxCount : 1}]),async (req, res)=>{

    let user = '';

    const token = req.headers.authorization.split(' ')[1];
    if(!token){
        return res.status(404).send('unAuthorized user!!');
    };

    jwt.verify(JSON.parse(token), secret, (err, decoded)=>{
        if(err){
            console.log(err);
            return res.status(404).send('unAuthorized user !!');
        }else{
            user = decoded;
            console.log(decoded);
        }
    })

    // console.log(verify)
    if(!req.files){
        return  res.status(400).json('no files uploaded!!');
     }

    const profilePic = req.files['profilePic'][0];
    const coverPic = req.files['coverPic'][0];

    // Read profile picture data from file system
    const profileBody = fs.readFileSync(profilePic.path);

    // Read cover picture data from file system
    const coverBody = fs.readFileSync(coverPic.path);

    const profileParams = {
        Bucket: "recruitlink-uploads",
        Key: `${uuidv4()}-${profilePic.originalname}`,
        Body: profileBody,
      };

      // Upload cover picture to S3
      const coverParams = {
        Bucket: "recruitlink-uploads",
        Key: `${uuidv4()}-${coverPic.originalname}`,
        Body: coverBody,
      };

      const [profileData, coverData] = await Promise.all([
        s3.upload(profileParams).promise(),
        s3.upload(coverParams).promise()
      ]);

      console.log('Profile picture uploaded to S3:', profileData.Location);
    console.log('Cover picture uploaded to S3:', coverData.Location);

    if(profileData.Location && coverData.Location){
        try{
            console.log('first', user, user.user._id)
        const users = await User.findByIdAndUpdate(user.user._id , {
            profilePicture : profileData.Location,
            coverPicture : coverData.Location
        }, { new : true });
        console.log(users);
        res.status(200).json({ msg : 'successfully updated!!', user : users });
        fs.unlinkSync(profilePic.path);
        fs.unlinkSync(coverPic.path);
    }catch(err){
        console.log(err);
        return res.status(404).send('No user found!!');
    }}
});

module.exports = router;