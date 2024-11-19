const express = require('express');
const router = express.Router();
const authenticate_token = require('../middleware/auth_middleware');

const fetch_users = require('../controllers/users/get_users')

router.get('/user-details',authenticate_token, fetch_users);


module.exports = router;