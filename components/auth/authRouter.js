const express = require('express');
const router = express.Router();
const { login, register, handleRefreshToken, logout } = require('./authController');



router
.post('/signIn', login)
.post('/signup', register)
.get('/refresh-token', handleRefreshToken)
app.get('/logout', logout)


module.exports = router;