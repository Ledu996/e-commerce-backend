const express = require('express');
const router = express.Router();
const {
    permissionAccess, 
    roleBasedAccessControl
} = require('../../middleware/index')
const {
    createAddress, 
    getAddress, 
    getAllAddresses,
    deleteAddress,
    updateAddress
} = require('./addressController');

router
.get('/:id', getAddress)
.get('/all', getAllAddresses)
.post('/create', createAddress)
.patch('update', [permissionAccess, roleBasedAccessControl('Admin', 'Customer', 'Driver')], updateAddress)
.delete('/delete/:id', [permissionAccess, roleBasedAccessControl('Admin')], deleteAddress)




module.exports = router;