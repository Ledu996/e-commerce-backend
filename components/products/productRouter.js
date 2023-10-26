const express = require('express');
const router = express.Router();
const { getAllProducts, getTopSoldProducts, calculateSeelingStatistics } = require('./productController')

// wrong information of how many documents we have check the connection string too
// now it is working properly

// here you will have a loot of functionality included 
router
.get('/all', getAllProducts)
.get('/top-sold', getTopSoldProducts) // not protected route anymore
.get('/stats', calculateSeelingStatistics) // for an admin panel


module.exports = router;