const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema= new Schema({

   
        email:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
   

  
      profilePic:{

        type:String,
        default:'some url'
      },
      
      name:{  type:String,
            default:'enter your name'
      },
      surname:{
        type:String,
        default:'enter your surname'
      },      
    
      day:{
             type:Number,
             default:0
         },
     month:{
             type:Number,
             default:0
         },
         year:{
            type:Number,
            default:0
        },
    
  
 

    city:{
        type:String,
        default:'enter your city'
    },      
    street:{
        type:String,
        default:'enter your street'
    },
    zipCode:{
        type:Number,
        default:0
    },

  
      phoneNumber:{
          type:Number,
          default:0
      },
        instagram:{
          type:String,
          default:'enter your instagram'
      },
      mozaixRole:{
        type:String,
        default:'Admin should enter your role'
      },

  posts:[
      {
          type:Schema.Types.ObjectId,
          ref:'Post'
      }
  ],
  
},{ timestamps: true })


module.exports = mongoose.model('User', userSchema);
