const mongoose = require('mongoose');
const { Schema } = mongoose;

const statuses  = ['pending', 'accepted', 'delivered'];
const deliveryTypes = ['delivery', 'pick-up'];
const paymentTypes = ['cash', 'card'];

// address

// embed address inside orders
const OrderSchema = new Schema({
        date: Date, 
        products: [{product : {type: Schema.Types.ObjectId, ref: 'products'}, quantity: Number, _id: false }], 
        deliveryType: {type: String, enum: deliveryTypes},
        additionalInformation: String,
        status: { type: String, default: 'pending...' }, // enum: statuses
        approved: { type: Boolean, default: false },
        timeOfDelivery: Date, // user will enter 20 m string we will convert everything to date and add 20 minutes above
        totalAmount: Number,
        address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' }, 
        typeOfPayment: { type: String, enum: paymentTypes  },
        // saves the id of an address
        user: { type: Schema.Types.ObjectId, ref: 'users' },
        store: { type: Schema.Types.ObjectId, ref: 'stores', index: true },
        driver: { type: Schema.Types.ObjectId, ref: 'drivers' },
        // create a reference to the store and index this field to
});


module.exports = { 
       Order: mongoose.model('Order', OrderSchema),
       statuses,
       deliveryTypes,
       paymentTypes, 
};


// check here what happens ids are not correct
// change the schema here because the response is silly, it is just the id that ruins the structure  












