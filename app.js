
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const multer = require('multer');
const {graphqlHTTP} = require('express-graphql')

const graphqlSchema = require('./graphql/schema')
const graphqlResolver = require('./graphql/resolver')
const auth =require('./middleware/is-Auth');
const app = express();

app.use(bodyParser.json())


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if(req.method === 'OPTIONS') {
      return res.sendStatus(200)
    }
    next();
  });

  // when connect with frontend use this
  //app.use(auth)


  //when connect with frontend comment this 
  app.use((req,res,next)=>{

     req.userId="60085aaa0a913b296879784f"

     if(!req.userId) {

      const error = new Error('no user with that id')
      throw error
     }

     next()
    


  })





  app.use('/graphql', graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    formatError(err){
  
      if(!err.originalError) {
        return err
      }
  
      const data = err.originalError.data
      const message = err.originalError.message || 'an error occurred'
      const code = err.originalError.code || 500;
  
      return {
        message:message,status:code,data:data
      }
    }
  }));

  app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data
    res.status(status).json({ message: message,data:data });
  });
  



  mongoose
  .connect(
    'mongodb+srv://Valdrini1:Valdrini1@cluster0.znzbc.mongodb.net/mozaix-inside?retryWrites=true&w=majority'
  )
  .then(result => {

     app.listen(8080);          
  })
  .catch(err => console.log(err));