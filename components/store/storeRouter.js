const express = require('express');
const router = express.Router();
const { 
    permissionAccess, 
    roleBasedAccessControl 
} = require('../../middleware/index')

const {
    getStore,
    getAllStores,
    createStore,
    updateStore,
    deleteStore
} = require('./storeController');

router
.get('/id/:id', getStore)
.get('/all', getAllStores)
.post('/create', [permissionAccess, roleBasedAccessControl('Admin')], createStore)
.patch('/update', [permissionAccess, roleBasedAccessControl('Admin')], updateStore)
.delete('/delete/:id', [permissionAccess, roleBasedAccessControl('Admin')], deleteStore)


module.exports = router;