// Main file that contains all the models
const Product = require('./Product');
const { User, roles } = require('./User');
const { Order, deliveryTypes, paymentTypes, statuses } = require('./Order');
const Store = require('./Store');
const { Address } = require('./Address');
const { Driver } = require('./Driver');

module.exports = {
    Product,
    User,
    Order,
    deliveryTypes,
    paymentTypes,
    Store,
    Address,
    roles,
    Driver
}