const router = require('express').Router();
const User = require('../models/user.js');
const bcrypt = require('bcrypt');

//get all users
router.get('/', async (req, res)=>{
    try{
        const users = await User.find();
        res.status(200).send(users);
    }catch(err){
        console.log('error fetching all the users of app...', err);
        res.status(500).send(err);
    }
})


//update user
router.put('/:id', async (req, res)=>{
    if(req.body.userId == req.params.id || req.body.isAdmin){
        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }catch(err){
                return res.status(400).json(err);
            }
        }
        try{
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set : req.body,
            });
            res.status(200).json('Account has been updated')
        }catch(err){
            res.status(400).json(err);
        }
    }else{
        return res.status(401).json('you can update only your account')
    }
})
//delete use
router.delete('/:id', async (req, res)=>{
    console.log('hi')
    if(req.body.userId == req.params.id || req.body.isAdmin){
        try{
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json('Account has been deleted')
        }catch(err){
            res.status(400).json('error');
        }
    }else{
        return res.status(401).json('you can delete only your account')
    }
})
//get a user
router.get('/', async (req, res)=>{
    const userId = req.query.userId;
    const username = req.query.username;

    try{
        const user = userId ? await User.findById(userId) : await User.findOne({ username : username}) 
        if(user){
            const { password, updatedAt, ...other } = user._doc
            res.status(201).json(other);
        }else{
            res.status(400).send('no user found!!!')
        }
    }catch(err){
        res.status(400).json(err);
    }
});

//get user friends
router.get('/friends/:userId', async (req,res)=>{
    try{
        const user = await User.findById(req.params.userId);
        console.log('user', user );
        const friends = await Promise.all(
            user.following.map(followingId=>{
                return User.findById(followingId);
            })
        );
        console.log('friends', friends)
        let friendList = [];
        friends.map(friend=>{
            const { _id, username, profilePicture } = friend;
            friendList.push({ _id, username, profilePicture });
        });
        console.log('friendList', friendList);
        res.status(200).json(friendList);
    }catch(err){
        res.status(500).json(err);
    }
})
//follow a user
router.put('/:id/follow', async (req, res)=>{
    if(req.body.userId !== req.params.id ){
        try{
            const user = await User.findById(req.params.id);
            console.log(user);
            const currentUser = await User.findById(req.body.userId);
            console.log(currentUser);
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({ $push : { followers : req.body.userId}});
                const response = await currentUser.updateOne({$push : { following : req.params.id}});
                console.log(currentUser, response);
                res.status(200).send(currentUser);
            }else{
                res.status(401).json('you are already following!')
            }
        }catch(err){
            res.status(500).json(err)
        }
    }else{
        res.status(401).json('you cannot follow yourself!!')
    }
})

//unfollow a user
router.put('/:id/unfollow', async (req, res)=>{
    if(req.body.userId !== req.params.id ){
        console.log(req.body.userId);
        console.log(req.params.id)
        try{
            const user = await User.findById(req.params.id);
            console.log(user);
            const currentUser = await User.findById(req.body.userId);
            console.log(currentUser);
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({ $pull : { followers : req.body.userId}});
                await currentUser.updateOne({$pull : { following : req.params.id}});
                res.status(200).send(currentUser);
            }else{
                res.status(401).json('you are not following this account!')
            }
        }catch(err){
            res.status(500).json(err)
        }
    }else{
        res.status(401).json('you cannot unfollow yourself!!')
    }
});

router.get('/fetchUser/:userId', async ( req, res )=>{
    try{
        const user = await User.findOne({ _id : req.params.userId });
        if(user){
            const profilePicUrl = user.profilePicture ?  user.profilePicture : '/assets/person/avatar.png';
            const username = user.username;
            const details = {
                userId : req.params.userId,
                profilePic : profilePicUrl,
                username
            };
            console.log(details);
            return res.status(200).send(details);
        }
    }catch(err){
        res.status(500).send(err);
    }
})

module.exports = router;