const express = require('express');
const router = express.Router();
const { register, login, profile } = require('../controllers/authController');

router.get('/profile', profile);
router.post('/register', register);
router.post('/login', login);


module.exports = router;