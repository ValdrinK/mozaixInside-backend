const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deadlineSchema = new Schema(
    {
     
      taskName: {
        type: String,
        required:true
       
      },
    
     date: {
          type: String,       
      },   
     
      user: {
        
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
      }
    },
    { timestamps: true }
  );
  
  module.exports = mongoose.model('Deadline', deadlineSchema);
  