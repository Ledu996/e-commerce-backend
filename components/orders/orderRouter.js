const express = require('express');
const router = express.Router();
const { permissionAccess } = require('../../middleware/permissionAccess');
const { roleBasedAccessControl } = require('../../middleware/roleBasedAccess');
const { emailVerification } = require('../../middleware/emailVerification');

const { 
    createOrder, 
    getOrdersHistoryByUserId, 
    listPendingOrders,
    getAddressAndShopsForOrder,
    acceptAnOrder,
    changeStatusOfOrder,
} = require('./orderController');

// maybe in the route path specify the protected in the name
router
.get('/user_id', getOrdersHistoryByUserId) // user 
.get('/get-store-address/', getAddressAndShopsForOrder)
.get('/pending-list/:store_id', [permissionAccess, roleBasedAccessControl('Admin', 'SuperAdmin')], listPendingOrders) // multiple middlewares
.post('/create', [permissionAccess, emailVerification, roleBasedAccessControl('User')], createOrder, ) // user
.patch('/accept', [permissionAccess, roleBasedAccessControl('Admin')], acceptAnOrder) // admin
.patch('/change-status-order',[ permissionAccess, roleBasedAccessControl('Driver')], changeStatusOfOrder)


module.exports = router;