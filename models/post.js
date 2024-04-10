const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
   userId : {
      type : String,
      required : true
   },
   username : {
      type : String,
      required : true
   },
   profilePic : {
      type : String
   }
}, {timestamps : true})

const commentSchema = new mongoose.Schema({
   userId : {
      type : String,
      required : true
   },
   username : {
      type : String,
      required : true
   },
   profilePic : {
      type : String,
      required : true
   },
   text : {
      type : String,
      required : true
   },
   likes : {
      type : Number,
      default : 0
   },
   dislike : {
      type : Number,
      default : 0
   }
}, { timestamps : true })

const postSchema = new mongoose.Schema({
   userId : {
    type : String,
    required : true,
   },
   desc : {
    type : String,
    max : 500
   },
   img : {
    type : String,
   },
   likes : [likeSchema],
   comments : [commentSchema]
},
{timestamps : true}
);

module.exports = mongoose.model("Post", postSchema);