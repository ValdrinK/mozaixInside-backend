const jwt = require('jsonwebtoken');



module.exports=(req,res,next)=>{
  

    const authHeader=req.get('Authorization')
   console.log(authHeader)
    
    if(!authHeader) {

        console.log('no auth ')

       req.isAuth=false
       return next()
        
    }

    let decodedToken;
    const token = authHeader.split(' ')[1]

    try {


        decodedToken = jwt.verify(token,'teperSekret')



    }catch(err) {


        req.isAuth=false
       return next()
        



    }


    if (!decodedToken) {

        req.isAuth=false
       return next()
        
    }

    req.isAuth=true 
        
    req.userId=decodedToken.userId

    next()




}