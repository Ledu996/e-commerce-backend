const mongoose = require('mongoose');
const { Product } = require('../models/index');


const MONGO_DB = 'mongodb+srv://dusan_admin2:admin22@baza.avgt5.mongodb.net/product_order';



// see the database string before it makes more problems to it, because I think that is a problem

// connect to database, to mongo

// working have to fix .env issue too

const insertManyProducts = async () => {
    try {
        const res = await fetch('https://30hills.com/api/products.json');
        const data = await res.json();
        const {products: {data: {items}}} = data; // destructure deep nested object
        
        // getting rid of id witch was in wrong format
        const itemsArray = items.map((item, index) => {
          const sold = Math.floor(Math.random() * 1000);
          const rating = Math.random() * 5;
          console.log(sold, rating.toFixed(2));
            const {id, ...rest} = item;
            console.log(rest);
            return {...rest, numberOfSales: sold, rating: rating.toFixed(2)};
        })
        await Product.insertMany(itemsArray);
        console.log('Successfully inserted items');
        process.exit()
        
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
    
};

insertManyProducts().finally(() => {process.exit()});


mongoose.connect(MONGO_DB);

  mongoose.connection.on('connected', () => {
    console.log(`Mongoose default connection open to ${MONGO_DB}`);
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
  process.on('SIGINT', async () => {
    await mongoose.connection.close()/*() => {
      console.log('Mongoose default connection disconnected through app termination');
      process.exit(0);
    })*/;
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });