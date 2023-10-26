const express = require('express');
const router = express.Router();
const { login, register, checkVerificationTokenExpire } = require('./userController')


router
.post('/signIn', login)
.post('/signup', register)
.get('/verification-token', checkVerificationTokenExpire )

module.exports = router;