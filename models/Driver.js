const mongoose = require('mongoose')
const { Schema } = mongoose;

// driver will not accept the rides
// manager will assign the rides, he will see drivers moving trough the map 

const status = ['free', 'busy', 'break']

const DriverSchema = new Schema({
    name: String,
    status: { type : String, enum: status },
    phone: { type: String, required: true },
    car: { type: String, default: 'will be an object_id' }, // we will have cars entity
    manager: { type: Schema.Types.ObjectId, ref: 'users' },
    numberOfSuccessfulDrives: { type: Number, default: 0 }
    // orders: [{ type: Schema.Types.ObjectId ref: 'orders'}]
    // still not what functionality will, driver have
})

module.exports = mongoose.model('Driver', DriverSchema);