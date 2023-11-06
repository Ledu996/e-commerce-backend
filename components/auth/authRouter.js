const express = require('express');
const router = express.Router();
const { login, register, handleRefreshToken, logout } = require('./authController');



router
.post('/signIn', login)
.post('/signup', register)
.get('/logout', logout)
.get('/refresh-token', handleRefreshToken)


module.exports = router;