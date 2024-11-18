const express = require('express');
const router = express.Router();

const signUp = require('../controllers/users/Auth/signup')

router.post('/register', signUp);


module.exports = router;