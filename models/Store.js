const mongoose = require('mongoose');
const { Schema } = mongoose;
// Basic Crud for admin 
// Create a store, get a store, update a store, delete a store
// add an employee to the store, etc..

// define the time, when it is open and where it is closed

// every store has a stock, and number of items in it
const StoreSchema = new Schema({
    name: String,

    workingHours: {
        from: Date,
        to: Date
    },  
    rating: Number, // Decimal128 type
    address: { type: Schema.Types.ObjectId, ref: 'address' },
    managers: [ {type: Schema.Types.ObjectId, ref: 'users'} ], // user level 1(cto), user lvl.2(manager), etc...
});

module.exports = mongoose.model('Store', StoreSchema);