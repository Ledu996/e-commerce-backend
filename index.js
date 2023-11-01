const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config(); 
const { connectionString } = require('./config/database/connection');
const userRouter = require('./components/user/userRoutes');
const orderRouter = require('./components/orders/orderRouter');
const productRouter = require('./components/products/productRouter');
const driverRouter = require('./components/driver/driverRouter');
const app = express();

console.log( `${__dirname}./environments/development.env`);
console.log('process env ', process.env.MONGO_DB)
console.log(connectionString, typeof connectionString);

app.use(cors());
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ extended: false }));


// what confuses me is the flow, and also is driver a user of a system 
// or just and entity that admin controls 
// if driver is type user, that properties inside of that entity has to be the same as users
// only the role is different inside user
// maybe has to do something with that create user entity (parent class)
// but have customer, driver and admin (children classes)

// exclude a param from a middleware function not a query 
// here the first argument is the path
// create a dynamic route handler here 


app.use(async (req, res, next) => {
  try {
  // did not solve a problem because maybe id will be required in whiteListed route
  // find out how to get id param
  const { originalUrl } = req;
  // unprotected routes 
  
  const paths = [
    /\/users\/signup/,  // Regular expression to match the string "users/signup"
    /\/users\/signin/,  // Regular expression to match the string "users/signin"
    /\/products\/all/, // Regular expression to match the string "products/all"
    /\/products\/id\/\w+/  // Regular expression to match routes with "id" parameter
  ]
  
    const isWhiteListed = paths.some(e => e.test(originalUrl)); // returns true based on condition
    
    if (!isWhiteListed) {
      const token = req.headers.authorization.split(' ')[1];
      const verified = await jwt.verify(token, 'secret');
      if (!verified) return res.status(403).json({message: 'User is not authorized'});
      req.user = { _id: verified._id }
      console.log('Log request in user', req.user);
      next()
    } else {
      console.log('Not a protected route');
      next(); // not among protected paths
    }
} catch (err) {
  console.log(err);
  return res.status(403).json({message: 'User has to be authorized'});
} 
})


// Application Routes

app.use('/users', userRouter);
app.use('/orders', orderRouter);
app.use('/products', productRouter);
app.use('/drivers', driverRouter);
// notification 
// connect our app to aws, or firebase(file uploads, and notifications)

mongoose.connect('mongodb+srv://dusan_admin2:admin22@baza.avgt5.mongodb.net/product_order');
  
  mongoose.connection.on('connected', () => {
    console.log(`Mongoose default connection open to mongoDB.connectionString()`);
  });
  
  // CONNECTION EVENTS
  // If the connection throws an error
  mongoose.connection.on('error', (err) => {
    console.log(`Mongoose default connection error: ${err}`);
  });
  
  // When the connection is disconnected
  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose default connection disconnected');
  });
  
  // When the connection is open
  mongoose.connection.on('open', () => {
    console.log('Mongoose default connection is open');
  });
  
  // If the Node process ends, close the Mongoose connection
  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log('Mongoose default connection disconnected through app termination');
      process.exit(0);
    });
  });
      
    app.listen(5000, () => {console.log('Starting something new')})

