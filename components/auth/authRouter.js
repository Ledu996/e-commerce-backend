const express = require('express');
const router = express.Router();
const { login, register } = require('./authController');


router.post('/signIn', login)
router.post('/signup', register)


module.exports = router;