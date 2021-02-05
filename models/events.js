const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema(
  {
   
    eventName: {
      type: String,
      required:true
     
    },
   
   icon: {
        type: String,       
      },
   date: {
        type: String,       
    },
    invited:[
      {
      
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
      }
    ],
   
    creator: {
      
      type:Schema.Types.ObjectId,
      ref:'User',
      required:true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
