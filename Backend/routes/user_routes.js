const express = require('express');
const router = express.Router();

const signUp = require('../controllers/users/Auth/signup')
const login = require('../controllers/users/Auth/login')

router.post('/register', signUp);
router.post('/login', login);


module.exports = router;