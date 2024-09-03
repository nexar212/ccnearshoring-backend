const express = require('express');
const router = express.Router();
const { register, login, logout, profile } = require('../controllers/authController');

router.get('/profile', profile);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);


module.exports = router;