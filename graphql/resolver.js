const bcrypt = require('bcryptjs');
const User = require('../models/user');
const validator= require('validator')
const jwt = require('jsonwebtoken')
const Post = require('../models/post');
const DailyReport = require('../models/dailyReports');
const Box = require('../models/box');
const Comment = require('../models/comments')
const Event = require('../models/events')
const Deadline = require('../models/deadlines');


module.exports= {

    adminSignup:async function({signupInput} ,req) {



        const errors = []


        if(!validator.isEmail(signupInput.email)) {

            errors.push({message:'enter a valid email'})
        }

       if(validator.isEmpty(signupInput.password) || !validator.isLength(signupInput.password,{min:5})) {

        errors.push({message:'enter a valid password'})
       }


       if(errors.length > 0) {

        const error= new Error('Invalid input')

        error.data=errors
        error.code=422
        throw error

       }


        const existingUser = await User.findOne({email:signupInput.email})

        if(existingUser) {

            const error = new Error('This email is already registered')
            throw error
        }

        const hashedPw= await bcrypt.hash(signupInput.password,12)

        const user = new User({
           
                email:signupInput.email,               
                password:hashedPw,             
                profilePic:signupInput.profilePic,
                name:signupInput.name,
                surname:signupInput.surname, 
                day:signupInput.day,
                month:signupInput.month,
                year:signupInput.year,            
                city:signupInput.city,               
                street:signupInput.street,
                zipCode:signupInput.zipCode, 
                phoneNumber: signupInput.phoneNumber,
                instagram:signupInput.instagram
            
        })




        const signUpedUser= await user.save()

        return {

            ...signUpedUser._doc,_id:signUpedUser._id.toString()
        }



    },
    login:async function({email,password},req) {


        console.log(req.userId)
        const existingUser = await User.findOne({email:email})

        if(!existingUser) {

            const error = new Error("Not Valid email")
            error.statusCode=401
            throw error
        }

        const comparedPw = await bcrypt.compare(password,existingUser.password,)
        console.log(comparedPw)

        if(!comparedPw) {

            const error = new Error("wrong password")
            error.statusCode=401
            throw error

        }

        const token = jwt.sign({
   
            userId:existingUser._id.toString(),
            email:existingUser.email

        },'teperSekret',{expiresIn:'1h'})
     

        return {
            token:token,
            userId:existingUser._id.toString()
        }



    },
    user:async function({id},req) {
       
         
        if(!req.isAuth) {
            console.log('isAuth undefined')

            const error = new Error('not authenticated')
            error.code=401
            throw Error
        }

      

        const user = await User.findById(id).populate("posts")
        console.log(user)

        if(!user) {

            const error = new Error('post not found')
            error.code=404
            throw error
           }


        return {
            ...user._doc,_id:user._id.toString()
        }






    },
    userSettings: async function({signupInput},req) {

        if(!req.isAuth) {
            console.log('isAuth undefined')

            const error = new Error('not authenticated')
            error.code=401
            throw Error
        }


        
        const errors = []


        if(!validator.isEmail(signupInput.email)) {

            errors.push({message:'enter a valid email'})
        }

       if(validator.isEmpty(signupInput.password) || !validator.isLength(signupInput.password,{min:5})) {

        errors.push({message:'enter a valid password'})
       }


       if(errors.length > 0) {

        const error= new Error('Invalid input')

        error.data=errors
        error.code=422
        throw error

       }


       const user = await User.findById(req.userId)


       if(!user) {


        const error = new Error('User not found')
        error.status=404;
        throw error
       }

       const hashedPw= await bcrypt.hash(signupInput.password,12)


       user.email=signupInput.email;
       user.password=hashedPw;
       user.name=signupInput.name;
       user.surname=signupInput.surname;
       user.profilePic=signupInput.profilePic;
       user.day=signupInput.day;
       user.month=signupInput.month;
       user.year=signupInput.year;
       user.city=signupInput.city;
       user.street=signupInput.street;
       user.zipCode=signupInput.zipCode;
       user.phoneNumber=signupInput.phoneNumber;
       user.instagram=signupInput.instagram;

       const updatedUser= await user.save()

       return {

        ...updatedUser._doc,_id:updatedUser._id.toString()
    }

    },
    teamMozaix: async function(args,req) {

        if(!req.isAuth) {
            console.log('isAuth undefined')

            const error = new Error('not authenticated')
            error.code=401
            throw Error
        }



      const users = await User.find()
      console.log(users)

      if(!users) {

        const error = new Error('No users found')
        error.status=404;
        throw error
      }

      return users.map(user=>{

        return{

            ...user._doc,_id:user._id.toString()
        }
      })

   




    },

    newDailyReport:async function({dailyReportInput},req) {

        if(!req.isAuth) {
            console.log('isAuth undefined')

            const error = new Error('not authenticated')
            error.code=401
            throw Error
        }


        const errors = []


       
       if(validator.isEmpty(dailyReportInput.today) || !validator.isLength(dailyReportInput.today,{min:10})) {

        errors.push({message:'not a valid report for today'})
       }
      
       if(validator.isEmpty(dailyReportInput.tomorrow) || !validator.isLength(dailyReportInput.tomorrow,{min:10})) {

        errors.push({message:'not a valid report for tomorrow'})
       }


       if(errors.length > 0) {

        const error= new Error('Invalid input')

        error.data=errors
        error.code=422
        throw error

       }




       const dailyReport = new DailyReport({


        today:dailyReportInput.today,
        problems:dailyReportInput.problems,
        tomorrow:dailyReportInput.tomorrow,
        creator:req.userId
       })
      

       const newDailyReport = await dailyReport.save()

       return {

        ...newDailyReport._doc,_id:newDailyReport._id.toString()
       }


    },
    dailyReports:async function(args,req){

        if(!req.isAuth) {
            console.log('isAuth undefined')

            const error = new Error('not authenticated')
            error.code=401
            throw Error
        }



        
      const dailyReports = await DailyReport.find().populate('creator')
      console.log(dailyReports)

      if(!dailyReports) {

        const error = new Error('No dailyReports found')
        error.status=404;
        throw error
      }

      return dailyReports.map(dailyReport=>{

        return {

         ...dailyReport._doc,
         _id:dailyReport._id.toString()

        }

      })
        
       

    
},

newBoxPost:async function({boxPostInput},req) {


    if(!req.isAuth) {
        console.log('isAuth undefined')

        const error = new Error('not authenticated')
        error.code=401
        throw Error
    }

    const box = new Box({
    imageUrl:boxPostInput.imageUrl,
     complaints:boxPostInput.complaints,
     suggestions:boxPostInput.suggestions,
     requests:boxPostInput.requests,
     creator:req.userId

  

    })

    const postedBox = await box.save()

    return {

        ...postedBox._doc,_id:postedBox._id.toString()
    }


},
allBox:async function(args,req) {

    if(!req.isAuth) {
        console.log('isAuth undefined')

        const error = new Error('not authenticated')
        error.code=401
        throw Error
    }

    const boxes = await Box.find().populate('creator')
   

    if(!boxes) {

      const error = new Error('No boxes found')
      error.status=404;
      throw error
    }

    return boxes.map(box=>{

      return{

          ...box._doc,_id:box._id.toString()
      }
    })

},
boxComplaints:async function(args,req) {

    if(!req.isAuth) {
        console.log('isAuth undefined')

        const error = new Error('not authenticated')
        error.code=401
        throw Error
    }


 const allBox = await Box.find().populate('creator')

 



const boxComplaints= []


allBox.forEach(box=>{

    if(box.complaints) {

        boxComplaints.push(box)
    }
})

console.log(boxComplaints)


 return boxComplaints.map(box=>{

    return {

        ...box._doc,_id:box._id.toString()
    }
 })


},
boxSuggestions:async function(args,req) {

    if(!req.isAuth) {
        console.log('isAuth undefined')

        const error = new Error('not authenticated')
        error.code=401
        throw Error
    }


    const allBox = await Box.find().populate('creator')
   
    
   
   
   
   const boxSuggestions= []
   
   
   allBox.forEach(box=>{
   
       if(box.suggestions) {
   
        boxSuggestions.push(box)
       }
   })
   
  
   
   
    return boxSuggestions.map(box=>{
   
       return {
   
           ...box._doc,_id:box._id.toString()
       }
    })
   
   
},
boxRequests:async function(args,req) {

    if(!req.isAuth) {
        console.log('isAuth undefined')

        const error = new Error('not authenticated')
        error.code=401
        throw Error
    }


    const allBox = await Box.find().populate('creator')
   
    
   
   
   
   const boxRequests= []
   
   
   allBox.forEach(box=>{
   
       if(box.requests) {
   
        boxRequests.push(box)
       }
   })
   
  
   
   
    return boxRequests.map(box=>{
   
       return {
   
           ...box._doc,_id:box._id.toString()
       }
    })
   
   
},
createPost:async function({postInput},req) {


    if(!req.isAuth) {
        console.log('isAuth undefined')

        const error = new Error('not authenticated')
        error.code=401
        throw Error
    }

    const user = await User.findById(req.userId)
   
  
    const post = new Post({

     imageUrl:postInput.imageUrl,
     content:postInput.content,
     creator:req.userId

    })


    const postedPost = await post.save()
    console.log(postedPost)

 
 

    user.posts.push(postedPost)

   const savedUser= await user.save()
  

    return {

        ...postedPost._doc,_id:postedPost._id.toString()
    }









},

postComents:async function({comentsInput},req) {

    if(!req.isAuth) {
        console.log('isAuth undefined')

        const error = new Error('not authenticated')
        error.code=401
        throw Error
    }


  const post =await Post.findById(comentsInput.postId).populate('creator')

  if(!post) {

    const error= new Error('post not found')
    error.status=404
    throw error
  }

//   const coment = {

//     comment:comentsInput.coment,
//     creator:req.userId
//   }

 
const comment = new Comment({
    text:comentsInput.coment,
    creator:req.userId
})

const postedComment = await comment.save()


  post.comments.push(postedComment._id.toString())



  const savedPost = await post.save()


 const comentingUser=await User.findById(req.userId)
 const comentingUserData={

    ...comentingUser._doc,
    _id:comentingUser._id.toString()
 }


  return {

    ...savedPost._doc,_id:savedPost._id.toString(),comments:savedPost.comments.map(comment=>{

        return {
          ...comment._doc,_id:comment._id.toString(),creator:comentingUserData
        }
    })
  }




},
allPosts:async function(args,req) {


    if(!req.isAuth) {
        console.log('isAuth undefined')

        const error = new Error('not authenticated')
        error.code=401
        throw Error
    }



  const posts =  await Post.find().populate('comments').populate('creator')
   


console.log(posts)



 if(!posts) {

    const error= new Error('no posts found')
    error.status=404
    throw error
 }


 

 return posts.map(post=>{

    return {
        ...post._doc,_id:post._id.toString(),comments:post.comments.map(comment=>{


            return {

                ...comment._doc,_id:comment._id.toString(),
                creator:async function(){


                  const userComment= await User.findById(comment.creator._id)

                  return {

                    ...userComment._doc,_id:userComment._id.toString()
                  }


                }
            }
        }),
        
        
        }
  

        })
   
 },
 userPosts:async function({id},req) {


    if(!req.isAuth) {
        console.log('isAuth undefined')

        const error = new Error('not authenticated')
        error.code=401
        throw Error
    }
    

 
    const posts =  await Post.find().populate('comments').populate('creator')


    if(!posts) {


        const error = new Error('no posts found')

        error.status= 404
        throw error
    }


    const userPosts = []

    posts.map(post=>{

        if(post.creator._id.toString() === id) {


            userPosts.push(post)
        }

    })

    

    return userPosts.map(post=>{

        return {
            ...post._doc,_id:post._id.toString(),comments:post.comments.map(comment=>{
    
    
                return {
    
                    ...comment._doc,_id:comment._id.toString(),
                    creator:async function(){
    
    
                      const userComment= await User.findById(comment.creator._id)
    
                      return {
    
                        ...userComment._doc,_id:userComment._id.toString()
                      }
    
    
                    }
                }
            }),
                  
            }
      
    
            })





 },
 
 allNoImgPosts:async function(args,req){

    if(!req.isAuth) {
        console.log('isAuth undefined')

        const error = new Error('not authenticated')
        error.code=401
        throw Error
    }

  const posts =  await Post.find().populate('comments').populate('creator')



  if(!posts) {


    const error = new Error('no posts found')

    error.status= 404
    throw error
}

const noImgPosts = []

posts.forEach(post=>{
   
    if(post.imageUrl.toString() === 'undefined') {

      noImgPosts.push(post)

    }


})



return noImgPosts.map(post=>{

    return {
        ...post._doc,_id:post._id.toString(),comments:post.comments.map(comment=>{


            return {

                ...comment._doc,_id:comment._id.toString(),
                creator:async function(){


                  const userComment= await User.findById(comment.creator._id)

                  return {

                    ...userComment._doc,_id:userComment._id.toString()
                  }


                }
            }
        }),
        
        
        }
  

        })


 




 },
 pinnedPost:async function({id},req) {

    if(!req.isAuth) {
        console.log('isAuth undefined')

        const error = new Error('not authenticated')
        error.code=401
        throw Error
    }

const post = await Post.findById(id).populate('comments').populate('creator')

if(!post) {

    
    const error = new Error('no posts found')

    error.status= 404
    throw error


}

return {


    ...post._doc,_id:post._id.toString(),creator:{
        ...post.creator._doc,_id:post.creator._id.toString()
    },comments:post.comments.map(comment=>{
        return {
            ...comment._doc,_id:comment._id.toString(),
            creator:async function(){
              const userComment= await User.findById(comment.creator._id)
              return {
                ...userComment._doc,_id:userComment._id.toString()
              }
            }
        }
    })
}
  



 },
 createEvent:async function({createEventInput},req) {

    if(!req.isAuth) {
        console.log('isAuth undefined')

        const error = new Error('not authenticated')
        error.code=401
        throw Error
    }

   

    const event = new Event({

        eventName:createEventInput.eventName,
        icon:createEventInput.icon,
        date:createEventInput.date,
        invited: createEventInput.invited,
        creator:req.userId

    })

    

    const user = await User.findById(req.userId)

    const savedEvent = await event.save()
    

  


    const findEvent = await Event.findById(savedEvent._id).populate('invited')

    console.log(findEvent)

 

  
    
    return {

        ...savedEvent._doc,_id:savedEvent._id.toString(),
        createdAt:savedEvent.createdAt.toISOString(),
        creator:{
            ...user._doc,_id:user._id.toString()
            
        },    
            creators:findEvent.invited.map(invite=>{
                
                return {
                    ...invite._doc,_id:invite._id.toString()
                }
            })
           
        }
    },
    allEvents:async function(args,req){

        if(!req.isAuth) {
            console.log('isAuth undefined')

            const error = new Error('not authenticated')
            error.code=401
            throw Error
        }



        const events = await Event.find().populate('creator').populate('invited')

        console.log(events)



        if(!events) {

            const error = new Error('no events found')
            error.status=404
            throw error
        }



        return events.map(event=>{

            return {...event._doc,_id:event._id.toString(),creator:{
                ...event.creator._doc,_id:event.creator._id.toString()
            },invited:event.invited.map(invite=>{
                
                return {
                    ...invite._doc,_id:invite._id.toString()
                }
            })

            
        }
    }
        )
    },
    createDeadline: async function({createDeadline},req) {


        if(!req.isAuth) {
            console.log('isAuth undefined')

            const error = new Error('not authenticated')
            error.code=401
            throw Error
        }

        const deadline = new Deadline({

            taskName:createDeadline.taskName,
            date:createDeadline.date,
            user:req.userId
        })

        const newDeadline = await deadline.save()

        const createdDeadline= await Deadline.findById(newDeadline._id).populate('user')

        console.log(createdDeadline)

        return {
            ...createdDeadline._doc,_id:createdDeadline._id.toString(),createdAt:createdDeadline.createdAt.toISOString(),user:{

                ...createdDeadline.user._doc,_id:createdDeadline.user._id.toString()
            }
        }
    },

    allDeadlines:async function(args,req) {


        if(!req.isAuth) {
            console.log('isAuth undefined')

            const error = new Error('not authenticated')
            error.code=401
            throw Error
        }
        const deadlines = await Deadline.find().populate('user')

        if(!deadlines) {


            const error = new Error('no deadlines found')
            error.status=404
            throw error
        }

        console.log(deadlines)

        return deadlines.map(deadline=>{

            return {
                ...deadline._doc,_id:deadline._id.toString(),createdAt:deadline.createdAt.toISOString(),user:{
                    ...deadline.user._doc,_id:deadline.user._id.toString()
                }
            }
        })
    },
    deletePost:async function({id},req) {


        if(!req.isAuth) {
            console.log('isAuth undefined')

            const error = new Error('not authenticated')
            error.code=401
            throw Error
        }

       const post = await Post.findById(id).populate('creator')

       if(post.creator._id.toString() !== req.userId.toString()) {


        const error = new Error('not authorized to delete this post ')
        error.status=401
        throw error
       }

       console.log(post)

       await Post.findByIdAndDelete(id)

       const user= await User.findById(req.userId)

       user.posts.pull(id)

       await user.save()


       const posts =  await Post.find().populate('comments').populate('creator')


       return posts.map(post=>{

        return {
            ...post._doc,_id:post._id.toString(),comments:post.comments.map(comment=>{
    
    
                return {
    
                    ...comment._doc,_id:comment._id.toString(),
                    creator:async function(){
    
    
                      const userComment= await User.findById(comment.creator._id)
    
                      return {
    
                        ...userComment._doc,_id:userComment._id.toString()
                      }
    
    
                    }
                }
            }),
            
            
            }
      
    
            })
   





    },
    deleteComment:async function({commentId,postId},req) {

        if(!req.isAuth) {
            console.log('isAuth undefined')

            const error = new Error('not authenticated')
            error.code=401
            throw Error
        }

      
      const post = await Post.findById(postId).populate('comments').populate('creator')

      if(post.creator._id.toString() !== req.userId.toString()) {


        const error = new Error('not authorized to delete this post ')
        error.status=401
        throw error
       }

       post.comments.pull(commentId) 

       const savedpost= await post.save()

       return {

        ...savedpost._doc,_id:savedpost._id.toString(),creator:{
            ...savedpost.creator._doc,_id:savedpost.creator._id.toString()
        },comments:savedpost.comments.map(comment=>{
            return {
                ...comment._doc,_id:comment._id.toString(),
                creator:async function(){
                  const userComment= await User.findById(comment.creator._id)
                  return {
                    ...userComment._doc,_id:userComment._id.toString()
                  }
                }
            }
        })
       }




    }
 


 }











  