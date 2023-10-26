const mongoose = require('mongoose');
const { hash, genSalt, hashSync } = require('bcrypt')
const { User } = require('../models/index');
// better use fake data, because values are always different

const MONGO_DB = 'mongodb+srv://dusan_admin2:admin22@baza.avgt5.mongodb.net/product_order';

const users = [
    {
        username: 'Jovan14',
        email: 'jovan@gmail.com',
        password: 'Jovan1234',
        isActive: true,
        createdAt: new Date (),
        dateOfBirth: new Date(),
        role: 'Admin',
        address: {
            street: 'Address there',
            number: '4/a',
            municipality: 'San Francisco',
            city: 'San Francisco',
            apartmentNumber: 11
        },
    },
    {
        username: 'Matija12',
        email: 'matija@gmail.com',
        password: 'Matija123',
        isActive: false,
        createdAt: new Date (),
        dateOfBirth: new Date(),
        role: 'User',
        address: {
            street: 'Address there',
            number: '4/a',
            municipality: 'San Jose',
            city: 'San Francisco',
            apartmentNumber: 12
        }
    },
]

// see the database string before it makes more problems to it, because I think that is a problem

// connect to database, to mongo

// working have to fix .env issue too

const insertManyUsers = async () => {
    
    try {
        // map trough users, and hash their passwords
        const mappedUsers = users.map((user) => {
          const { password } = user;
          const hashedPassword = hashSync(password, 10);
          return {...user, password: hashedPassword};
        })
        console.log(mappedUsers);
        await User.insertMany(mappedUsers); 
        console.log('Successfully inserted users');
        process.exit()
        
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
    
};

insertManyUsers().finally(() => {process.exit()});


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