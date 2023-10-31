const express = require('express');
const router = express.Router();
const { roleBasedAccessControl } = require('../../middleware/roleBasedAccess');
const { permissionAccess } = require('../../middleware/permissionAccess');

const { 
    createDriver, 
    getDriver,
    updateDriver,
    deleteDriver, 
    getFreeDrivers, 
    changeStatusToBusy,
    changeStatusToFree,
    changeStatusOfOrder
} = require('./driverController');

router
.post('/-create', [permissionAccess, roleBasedAccessControl('Admin')], createDriver)
// cannot hit the route right, do not know how to make id value dynamic
.get('/get-driver/:id', [permissionAccess, roleBasedAccessControl('Admin')], getDriver)
.get('-free', [ permissionAccess, roleBasedAccessControl('Admin')], getFreeDrivers)
.patch('/change-status-busy',[permissionAccess, roleBasedAccessControl('Driver')], changeStatusToBusy)
.patch('/change-status-free', [permissionAccess, roleBasedAccessControl('Driver')], changeStatusToFree)
.patch('/change-status-order', roleBasedAccessControl('Driver'), changeStatusOfOrder)
.patch('/update', [permissionAccess, roleBasedAccessControl('Admin')], updateDriver)
.delete('/delete', [permissionAccess, roleBasedAccessControl('Admin')], deleteDriver)

module.exports = router;
