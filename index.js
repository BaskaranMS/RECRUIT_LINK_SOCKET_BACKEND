const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const userRoute = require('./routes/users.js');
const authRoute = require('./routes/auth.js');
const postRoute = require('./routes/posts.js');
const otpRoute = require('./routes/otp.js');
const jobRoute = require('./routes/job.js');
const editProfileRoute = require('./routes/editProfile.js');
const jobApplyRoute = require('./routes/applyJob.js');
const applicationResponseRoute = require('./routes/applicationResponse.js');
const conversationRoute = require('./routes/message.js');
const multer = require('multer');
const fs = require('fs');
const Post = require('./models/post.js');
const app = express();

const cors = require('cors');

// const S3 = require('aws-sdk/clients/s3');
const AWS = require('aws-sdk');

dotenv.config();

// app.use(dotenv.config());

const upload = multer({ dest : 'uploads/'});

const s3 = new AWS.S3({
    accessKeyId : process.env.ACCESS_KEY,
    secretAccessKey : process.env.SECRET_KEY
});



mongoose.connect(process.env.MONGO_URL,  { useNewUrlParser: true, useUnifiedTopology: true } ).then(()=>{
    console.log('connected to mongodb!!');
}).catch((err)=>{
    console.log('Error connecting to mongodb!!', err);
})

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors());


app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);
app.use('/api/email', otpRoute);
app.use('/api/user', editProfileRoute);
app.use('/api/application', jobRoute);
app.use('/api/job', jobApplyRoute);
app.use('/api/application/appliedcandidate', applicationResponseRoute);
app.use('/api/conversation', conversationRoute);

app.post('/api/posts/upload', upload.single('file'), async (req, res)=>{
    if(!req.file){
       return  res.status(400).json('no files uploaded!!');
    }
    const file = req.file;
    const { userId, desc } = req.query;
    console.log(file, 'recieved');

    fs.readFile(file.path, (err, data)=>{
        if(err){
            console.log('error reading file', err);
            res.status(400).json('error reading file!!')
        }
        const params = {
            Bucket : "recruitlink-uploads",
            Key : file.originalname,
            Body : data,
         };
         console.log('going to send')
         s3.upload(params, async (err, data)=>{
            if(err){
                console.log(err);
                return res.status(400).json('error uploading file to storage')
            }
            console.log('uploaded');
            const img = data.Location;
                const postData = { userId, desc, img };

                const newPost = new Post(postData);

                try{
                    const savedPost = await newPost.save();
                    console.log(savedPost)
                    res.status(200).json(savedPost);
                }catch(err){
                    res.status(400).json({ err : err, msg : 'error saving the post to the db!!'})
                }
            // res.status(200).json({ imageUrl : data.Location });
            if(data.Location){
                fs.unlink(file.path, (err)=>{
                    if(err){
                        console.log('error deleting local file!', err);
                        return;
                    }
                    console.log('local file deleted successfully!!');
                });
            }
         })
    })
})

app.listen(8800, ()=>{
    console.log('server running at the port 8800')
});