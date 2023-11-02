const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config(); 
const { connectionString } = require('./config/database/connection');
const authRouter = require('./components/auth/authRouter');
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




app.use(async (req, res, next) => {
  try {
  
  const { originalUrl } = req;

  // unprotected routes 
  const paths = [
    /\/auth\/signup/,  
    /\/auth\/signin/,  
    /\/products\/all/, 
    /\/products\/id\/\w+/  
  ]
  
  const isWhiteListed = paths.some(e => e.test(originalUrl)); 
    
  if (!isWhiteListed) {
        
    const token = req.headers.authorization.split(' ')[1];
    const verified = await jwt.verify(token, 'secret');
        
    if (!verified) return res.status(403).json({message: 'User is not authorized'});
        req.user = { _id: verified._id }
        next()
      } else {
          next(); // not among protected paths
      }
} catch (err) {
  return res.status(403).json({message: 'User has to be authorized'});
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

