const router = require('express').Router();
const Conversation  = require('../models/conversation.js');
const user = require('../models/user.js');

//get all user conversation
router.get('/:id', async ( req, res )=>{
    let id = req.params.id;

    try{
        let response = await Conversation.find({
            members : { $in : [ id ]}
        });
        if(response.length < 1 ){
            res.status(404).send('No Conversation Found!!');
            return;
        };
        let data = [];
        await Promise.all(
            response.map(async (conversation)=>{
                let recipient = '' ;
                if( conversation.members[0] == id ){
                    recipient = await user.find({ _id : conversation.members[1] })
                }else{
                    recipient = await user.find({ _id : conversation.members[0]});
                };
                data.push( {...conversation, 
                    username : recipient[0].username,
                    profilePic : recipient[0].profilePicture,
                    userId : recipient[0]._id
            })
            })
        )
        res.status(200).send(data);
    }catch(err){
        console.log(err);
        res.status(500).send(err);
    }
})

//create conversation
router.post('/newConversation/:id/:userId', async (req, res)=>{

    const id = req.params.id;
    const userId = req.params.userId;
    console.log(userId, id);


    try{
        const convoCheck = await Conversation.find({ members : { $all : [userId, id ]}});
        console.log(convoCheck);
        if(convoCheck.length > 0 ){
            res.status(200).json( { msg : 'Conversation already Exist!!', data : convoCheck });
            return;
        }
        const response = await Conversation.create({
            members : [ userId, id ]
        });
        await response.save();
        console.log(response);
        res.status(200).json( { msg : 'Conversation Created!!', data : response });
    }catch(err){
        console.log(err);
        res.status(500).send(err);
    }
});

//create a message
router.post('/message/:conversationId', async ( req, res)=>{
    const id = req.params.conversationId;

    try{
        const conversation = await Conversation.findOneAndUpdate({ _id : id }, {
            $push : { messages : req.body }
        }, { new : true });
        res.status(200).send(conversation);
    }catch(err){
        console.log(err);
        res.status(500).send(err);
    }
})

module.exports = router;