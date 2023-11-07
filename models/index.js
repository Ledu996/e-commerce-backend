// Main file that contains all the models
const Product = require('./Product');
const { User, roles } = require('./User');
const { Order, deliveryTypes, paymentTypes, statuses } = require('./Order');
const Store = require('./Store');
const { Address } = require('./Address');
const Driver = require('./Driver');
const Customer = require('./Customer');
const Admin = require('./Admin');

// Did not load a file had to use require for a customer

module.exports = {
    Product,
    User,
    Order,
    deliveryTypes,
    paymentTypes,
    Store,
    Address,
    roles,
    Driver,
    Customer,
    Admin,
}