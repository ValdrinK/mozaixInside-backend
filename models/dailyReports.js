const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dailyReportSchema = new Schema(
  {
   
   today:{

    type:String,
    required:true
   },
   problems:{

    type:String,
    
   },
   tomorrow:{

    type:String,
    required:true
   },
    creator: {
      
      type:Schema.Types.ObjectId,
      ref:'User',
      required:true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('DailyReport', dailyReportSchema);