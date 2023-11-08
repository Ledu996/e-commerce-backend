const mongoose = require('mongoose')
const { Schema } = mongoose;
const { User, options, roles } = require('./User');

// driver will not accept the rides
// manager will assign the rides, he will see drivers moving trough the map 

const status = ['free', 'busy', 'break']
const DriverSchema = new Schema({
    status: { type : String, enum: status, default: 'free' },
    car: { type: String, default: 'will be an object_id' }, // we will have cars entity
    manager: { type: Schema.Types.ObjectId, ref: 'users' },
    numberOfSuccessfulDrives: { type: Number, default: 0 },
    store: {type: Schema.Types.ObjectId, ref: 'stores' },
}, options); 


module.exports = User.discriminator('Driver', DriverSchema); 
