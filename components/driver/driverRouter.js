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
.post('-create', [roleBasedAccessControl('Admin')], createDriver)
.get(':id', roleBasedAccessControl('Admin'), getDriver)
.get('-free', roleBasedAccessControl('Admin'), getFreeDrivers)
.patch('/change-status-busy', roleBasedAccessControl('Driver'), changeStatusToBusy)
.patch('/change-status-free', roleBasedAccessControl('Driver'), changeStatusToFree)
.patch('/change-status-order', roleBasedAccessControl('Driver'), changeStatusOfOrder)
.patch('/update', roleBasedAccessControl('Admin'), updateDriver)
.delete('/delete', roleBasedAccessControl('Admin'), deleteDriver)

module.exports = router;
