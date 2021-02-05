const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const boxSchema = new Schema(
  {
   
    imageUrl: {
      type: String,
     
    },
    complaints: {
      type: String,       
    },
    suggestions: {
        type: String,       
      },
    requests: {
        type: String,       
    },
   
    creator: {
      
      type:Schema.Types.ObjectId,
      ref:'User',
      required:true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Box', boxSchema);
