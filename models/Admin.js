const mongoose = require('mongoose');
const { Schema } = mongoose;
const { User, options, roles } = require('./User');

// different ADMINS(Managers work inside of different stores)

// later other properties
const AdminSchema = new Schema({
    worksIn: { type: Schema.Types.ObjectId, ref: 'stores' }
});

module.exports = User.discriminator('Admin', AdminSchema)


















