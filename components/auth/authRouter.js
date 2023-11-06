const express = require('express');
const router = express.Router();
const { login, register, handleRefreshToken } = require('./authController');



router
.post('/signIn', login)
.post('/signup', register)
.get('/refresh-token', handleRefreshToken)


module.exports = router;