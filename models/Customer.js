const mongoose = require('mongoose')
const { Schema } = mongoose;
const { User, options, roles } = require('./User');
// For later

// User lvl.2

const badges = ['Bronze', 'Silver', 'Gold'];

const CustomerSchema = new Schema({
    numberOfPurchases: {type: Number, default: 0},
    badge: {type: String, enum: badges, default: 'Bronze'}, 
    favoriteItems: [{type: mongoose.Types.ObjectId, ref: 'products', default: []}], 
}, options);

console.log('Inside of a customer model User ',  User);

module.exports = User.discriminator('Customer', CustomerSchema); // roles[0]
