const router =  require('express').Router();
const Post = require('../models/post.js');
const User = require('../models/user.js');

//create a post
router.post('/', async (req, res)=>{
    const newPost = new Post(req.body);

    try{
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    }catch(err){
        res.status(500).json(err);
    }
});

//u[date a post
router.put('/:id', async (req, res)=>{
    try{
    let post = await Post.findById(req.params.id);
    console.log(post.userId)
    if(post.userId == req.body.userId){
        await post.updateOne({$set : req.body});
        res.status(200).json("post has been updated!!")
    }else{
        res.status(500).json("you can only update your post!!")
    }
}catch(err){
    res.status(500).json(err)
}
});

//delete a post
router.delete('/:id', async (req, res)=>{
    try{
    let post = await Post.findById(req.params.id);
    console.log(post.userId)
    if(post.userId == req.body.userId){
        await post.deleteOne();
        res.status(200).json("post has been deleted!!")
    }else{
        res.status(500).json("you can only delete your post!!")
    }
}catch(err){
    res.status(500).json(err)
}
});
//like a post / dislike a post
router.put('/:id/like', async (req, res)=>{
    console.log(req.body);
    try{
        const post = await Post.findById(req.params.id);
        if(!post.likes.some(like => like.userId === req.body.userId)){
            await post.updateOne({$push : { likes : {
                userId : req.body.userId,
                username : req.body.username,
                profilePic : req.body.profilePic
            }}});
            res.status(200).json('liked the post!!');
        }else{
            await post.updateOne({$pull : { likes : {userId : req.body.userId}}});
            res.status(200).json('disliked the post!!');
        }
    }catch(err){
        res.status(500).json(err);
    }
});
//get a post
router.get('/:id', async (req, res)=>{
    try{
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    }catch(err){
        res.status(500).json(err);
    }
});

//get timeline post
router.get('/timeline/:userId', async (req, res)=>{
    try{
        const currentUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({ userId : currentUser._id});
        const friendPosts = await Promise.all(
            currentUser.following.map(friendId=>{
                return Post.find({ userId : friendId })
            })
        );
        res.status(200).send(userPosts.concat(...friendPosts))
    }catch(err){
        res.status(500).json(err);
    }
})

//get usersall  post
router.get('/profile/:username', async (req, res)=>{
    try{
        const user = await User.findOne({ username : req.params.username})
        const posts = await Post.find({ userId : user._id });
        res.status(200).json(posts);
    }catch(err){
        res.status(500).json(err);
    }
})

//get post likes
router.get('/:id/getlikes', async (req, res)=>{
    try{
        const post = await Post.find({ _id : req.params.id });
        if(post){
            console.log(post);
            const likes = post[0].likes;
            console.log(post[0].likes);
            res.status(200).send(likes);
        }else{
            res.status(404).send("Can't able to find the requested post!!");
        }
    }catch(err){
        console.log(err);
        res.status(404).send('Error getting likes of the post!!');
    }
});

//add a comment
router.post('/:id/addcomment', async (req, res)=>{
    try{
        const post = await Post.findOneAndUpdate({ _id : req.params.id }, { $push : {
            comments : {
                userId : req.body.userId,
                profilePic : req.body.profilePic,
                text : req.body.comment,
                username : req.body.username
            }
        }});
            res.status(200).send('Comment Added Successfully!!');
    }catch(err){
        console.log(err);
        res.status(500).send('Internal Server Error!!');
    }
});

//get all comments
router.get('/:id/getallcomments', async ( req, res )=>{
    try{
        const post = await Post.find({ _id : req.params.id });
        console.log(post)
        if(post){
            const comments = post[0].comments;
            res.status(200).send(comments);
        }else{
            res.status(404).send('No post found in DB!!');
        }
    }catch(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
})
module.exports = router;