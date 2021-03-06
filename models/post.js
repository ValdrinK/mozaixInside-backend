const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
   
    imageUrl: {
      type: String,
      
    },
    content: {
      type: String,
      required: true
    },  

    comments:[
      {
          type:Schema.Types.ObjectId,
          ref:'Comment'
      }
  ]     
    ,

    creator: {
      
      type:Schema.Types.ObjectId,
      ref:'User',
      required:true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
