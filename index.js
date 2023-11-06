const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config(); 
const { connectionString } = require('./config/database/connection');
const { refreshAccessToken } = require('./lib/jwtHandler');
const authRouter = require('./components/auth/authRouter');
const orderRouter = require('./components/orders/orderRouter');
const productRouter = require('./components/products/productRouter');
const driverRouter = require('./components/driver/driverRouter');
const app = express();

console.log( `${__dirname}./environments/development.env`);
console.log('process env ', process.env.MONGO_DB)
console.log(connectionString, typeof connectionString);

// To extract cookies from request use a global middleware for it 
// set some options in cookie, still getting an error 
// Cookie  [Object: null prototype] {}
app.use(cors());
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());






app.use(async (req, res, next) => {

  // if trying to interact with protected route we use acc_token
  // if token is expired we use refresh token to generate a new acc_token
  try {
  
  const { originalUrl } = req;

  // unprotected routes 
  const paths = [
    /\/auth\/signup/,  
    /\/auth\/signIn/,  
    /\/products\/all/, 
    /\/products\/id\/\w+/, 
    /\/auth\/refresh-token$/, 
  ];
  
  const isWhiteListed = paths.some(e => e.test(originalUrl)); 
  console.log('Is whiteListed ', isWhiteListed);
  if (!isWhiteListed) {
    const token = req.headers.authorization.split(' ')[1];
    const verified = await jwt.verify(token, 'acc_secret');
    console.log('Access token ', verified);
    req.user = { _id: verified._id }
    next()
  } else {
    console.log('Not among protected routes');
    next(); // not among protected paths
  }
} catch (err) {
  // just return a response not authorized
  // on client will than hit an endpoint to refresh a token
  return res.status(401).json({message: 'Token needs to be refreshed', result: {}})
  
} 
})


// Application Routes

app.use('/auth', authRouter);
app.use('/orders', orderRouter);
app.use('/products', productRouter);
app.use('/drivers', driverRouter);


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

