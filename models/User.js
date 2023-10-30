const mongoose = require('mongoose');
const { Schema } = mongoose;
const roles = ['Customer', 'Admin', 'SuperAdmin', 'Driver'];
const genders = ['M', 'F'];
const validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

// what is discriminator key in my case for users and it' roles
const options = {
    discriminatorKey: 'type', // type
    timeStamps: {createdAt: 'timestamp', updatedAt: 'false'}, 
}

// export the address schema to UserSchema
// address as a separate entity
const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { 
        type: String, 
        required: 'Please enter your email address', 
        unique: true, 
        lowerCase: true,
        trim: true,
        match: [ validEmail, 'Please enter a valid address' ] 
    },
    
    password: { type: String, required: true }, // was se to select false
    isActive: { type: Boolean, default: false },
    createdAt:  {type: Date, default: new Date() },
    dateOfBirth: Date,
    gender: { type: String, enum: genders, required: true },
    role: { type: String, enum: roles },
    address: {
        street: String,
        number: String,
        municipality: String,
        city: String,
        state: String,
        geoLocation: {
                latitude: String,
                longitude: String
            },
        apartmentNumber: Number,
    },
    preferredAddress: { type: Schema.Types.ObjectId, ref: 'address' },
    verificationToken: String,
    isVerified: { type: Boolean, default: false } 
}, options);

module.exports = {
    User: mongoose.model('User', UserSchema),
    roles,
    options,
};

