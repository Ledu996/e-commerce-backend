const express = require('express');
const router = express.Router();
const { permissionAccess, roleBasedAccessControl } = require('../../middleware/index');
const { 
    getAllProducts, 
    getTopSoldProducts, 
    calculateSellingStatistics,
    getProductById,
    updateProductById,
    createProduct
} = require('./productController')

// wrong information of how many documents we have check the connection string too
// now it is working properly

// here you will have a loot of functionality included 
router
.get('/all', getAllProducts)
.get('/id/:id', getProductById)
.get('/top-sold', getTopSoldProducts) // not protected route anymore
.get('/stats', [permissionAccess, roleBasedAccessControl('Admin')], calculateSellingStatistics) // for an admin panel
.patch('/product/update', [permissionAccess, roleBasedAccessControl('Admin')], updateProductById)
.post('/create', [permissionAccess, roleBasedAccessControl('Admin')], createProduct );
module.exports = router;