const router = require('express').Router();
const { v4 : uuidV4 } = require('uuid');
const CallSchema = require('../models/calls');

router.post('/videoCall/:callerId/:targetId', async (req, res)=>{
    const userId = req.params.callerId;
    const recieverId = req.params.targetId;
    try{
        const user  = await CallSchema.findOne({ userId : userId });
        if(user){
            user.calls.push({
                callType : 'videoCall',
                callerId : userId,
                recieverId : recieverId,
                status : 'initiated'
            })
            await user.save();
            const id = uuidV4();
            console.log(id);
            const callId = user.calls[user.calls.length - 1]._id; 
            return res.status(200).json({ roomId : id, callId });
        }else{
            const newUser = new CallSchema({
                userId,
                calls : [{
                    callType : 'videoCall',
                    callerId : userId,
                    recieverId : recieverId,
                    status : 'initiated'
                }]
            })
            await newUser.save();
            const id = uuidV4();
            console.log(id);
            return res.status(200).json({ roomId : id, callId : newUser.calls[0]._id });
        }
    }catch(err){
        console.log(err);
        res.status(500).send(err);
    }
})


module.exports = router;