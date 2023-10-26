const mongoose = require('mongoose');
const { Schema } = mongoose;


const ProductSchema = new Schema ({
    name: String,
    description: String,
    price: Number,
    dateCreated: Date,
    features: String,
    keywords: String, // or an array of strings
    category: String,
    subcategory: String,
    inStock: {type: Boolean, default: false},
    images: [ String ],
    numberOfSales: Number,
    rating: Number,
})

module.exports = mongoose.model('Product', ProductSchema);

