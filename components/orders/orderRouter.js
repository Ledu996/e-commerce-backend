const express = require('express');
const router = express.Router();
const { permissionAccess } = require('../../middleware/permissionAccess');
const { roleBasedAccessControl } = require('../../middleware/roleBasedAccess');
const { emailVerification } = require('../../middleware/emailVerification');

const { 
    createOrder, 
    getOrdersHistoryByUserId, 
    listPendingOrders,
    acceptAnOrder,
    changeStatusOfOrder,
    getOrdersForDriver,
} = require('./orderController');

// maybe in the route path specify the protected in the name
router
.get('/history',[permissionAccess, roleBasedAccessControl('Customer')], getOrdersHistoryByUserId) // user 
.get('/pending-list', [permissionAccess, roleBasedAccessControl('Admin')], listPendingOrders) // multiple middlewares
.get('/accepted-orders', [permissionAccess, roleBasedAccessControl('Driver')], getOrdersForDriver)
.post('/create', [permissionAccess, roleBasedAccessControl('Customer')], createOrder, ) // emailVerification
.patch('/accept', [permissionAccess, roleBasedAccessControl('Admin')], acceptAnOrder) // admin
.patch('/change-status-order',[ permissionAccess, roleBasedAccessControl('Driver')], changeStatusOfOrder)


module.exports = router;