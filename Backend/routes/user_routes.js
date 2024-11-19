const express = require('express');
const router = express.Router();
const authenticate_token = require('../middleware/auth_middleware');

const fetch_users = require('../controllers/users/get_users')
const fetch_user_by_id = require('../controllers/users/get_user_by_id')

router.get('/user-details',authenticate_token, fetch_users);
router.get('/user/:id',authenticate_token, fetch_user_by_id);


module.exports = router;