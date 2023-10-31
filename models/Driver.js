const mongoose = require('mongoose')
const { Schema } = mongoose;
const { User, options, roles } = require('./User');

// driver will not accept the rides
// manager will assign the rides, he will see drivers moving trough the map 

const status = ['free', 'busy', 'break']
// an array of orders
const DriverSchema = new Schema({
    name: String,
    status: { type : String, enum: status, default: 'free' },
    phone: { type: String, required: true },
    car: { type: String, default: 'will be an object_id' }, // we will have cars entity
    manager: { type: Schema.Types.ObjectId, ref: 'users' },
    numberOfSuccessfulDrives: { type: Number, default: 0 },
    orders: [{ type: Schema.Types.ObjectId, ref: 'orders'}]
}, options); 

// see the discriminator part does it change the whole application
// users are drivers, customers(users) and admin

module.exports = User.discriminator('Driver', DriverSchema); // roles[3]
