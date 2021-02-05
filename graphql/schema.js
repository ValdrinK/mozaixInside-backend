const {buildSchema} =require('graphql')


module.exports = buildSchema(`



 type DailyReport {

    _id:ID!
    today:String!
    problems:String!
    tomorrow:String!
    creator:User!
 }


 type Comments {

    _id:ID!
    text:String
    creator:User!
 }


type Post {

    _id:ID!    
    content:String!
    imageUrl:String!
    comments:[Comments]
    creator:User!
    createdAt:String!
    updatedAt:String!

}

type User {
    _id:ID!    
  email:String!
  password:String!
  name:String!
  surname:String!
  profilePic:String!
  day:Int!
  month:Int!
  year:Int!
  city:String!
   street:String!
  zipCode:Int!
  phoneNumber:Int!
  instagram:String!    
   posts:[Post!]!    
   mozaixRole:String!

}

input postInputData {


    imageUrl:String
    content:String!  

   }

  input dailyReportInputData {

    today:String!
    problems:String
    tomorrow:String!

  }

input SignupInputData {

    email:String!
    name:String
    password:String!
    profilePic:String
    surname:String
    day:Int
    month:Int
    year:Int
    city:String
    street:String
    zipCode:Int
    phoneNumber:Int
    instagram:String
}

type BoxData {
    _id:ID!
    imageUrl:String
    complaints:String
    suggestions:String
    requests:String
    creator:User!


}

type BoxSuggestionsData {

    _id:ID!
    suggestions:String!
    creator:User!

}
type BoxRequestsData {

    _id:ID!
    requests:String!
    creator:User!


}

type BoxComplaintsData {

    _id:ID!
    complaints:String!
    creator:User!
}

type Event {

    _id:ID!
    eventName:String!
    icon:String!
    date:String!
    invited:[User!]!
    creator:User!
    createdAt:String!
}

type Deadline {

    _id:ID!
    taskName:String!
    date:String!
    user:User!
    createdAt:String!
}


input createDeadlineData {



    taskName:String!
    date:String!
    
}




input createEventInputData {

    eventName:String!
    icon:String!
    date:String!
    invited:[ID!]!


}

input BoxPostInputData {

    imageUrl:String
    complaints:String
    suggestions:String
    requests:String

}


input ComentsInputData {

    postId:ID!
    coment:String!
    

}




type AuthData {

    token:String!
    userId:String!
}

type RootQuery {

    
    login(email:String!,password:String!) : AuthData!
    dailyReports:[DailyReport!]! 
    user(id:ID!):User!
    teamMozaix:[User!]!
    allBox:[BoxData!]!
    boxComplaints:[BoxComplaintsData!]!
    boxSuggestions:[BoxSuggestionsData!]!
    boxRequests:[BoxRequestsData!]!
    allPosts:[Post!]!
    userPosts(id:ID!):[Post!]!
    allNoImgPosts:[Post!]!
    pinnedPost(id:ID!):Post!
    allEvents:[Event!]!
    allDeadlines:[Deadline!]!
   
}

type RootMutation {
    
    createPost(postInput:postInputData) : Post!
    adminSignup(signupInput: SignupInputData) : User!
    userSettings(signupInput: SignupInputData) : User!
    newDailyReport(dailyReportInput:dailyReportInputData) : DailyReport!
    newBoxPost(boxPostInput:BoxPostInputData):BoxData!
    postComents(comentsInput:ComentsInputData):Post!
    createEvent(createEventInput:createEventInputData):Event!
    createDeadline(createDeadline:createDeadlineData):Deadline!
    deletePost(id:ID!):[Post!]!
    deleteComment(commentId:ID!,postId:ID!):Post!
 
}

schema {
    query:RootQuery
    mutation:RootMutation
}

`)