// something wrong with user Model, does not recognize
const { User } = require("../models/index");
const mongoose = require("mongoose");


const MONGO_DB = 'mongodb+srv://dusan_admin2:admin22@baza.avgt5.mongodb.net/product_order';


const addOrdersToOneUser = async () => {

    console.log('Vamos tentar');

    try {

        console.log(await User.count({}));
        await User.findByIdAndUpdate(
            {_id: '64fcae60b536f055774ee6a7'}, 
            {$push: {orders: {date: new Date (), deliveryType: 'pick-up'}}})
            
            console.log('Success');
            process.exit(0);
            
    } catch (err) {
        console.log(err.message);
        process.exit(1);
    }
}


addOrdersToOneUser().finally(() => {process.exit()});


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