const mongoose = require('mongoose');
const { Schema } = mongoose;

const AddressSchema = new Schema({
    street: String,
    number: String,
    municipality: String,
    city: String,
    geoLocation: {
        latitude: String,
        longitude: String
    },
    apartmentNumber: Number,
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
})

module.exports = {
    Address: mongoose.model('Address', AddressSchema),
    AddressSchema,
};