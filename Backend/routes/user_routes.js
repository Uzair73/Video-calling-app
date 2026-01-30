const express = require('express');
const router = express.Router();
const authenticate_token = require('../middleware/auth_middleware');

const fetch_users = require('../controllers/users/get_users')
const fetch_user_by_id = require('../controllers/users/get_user_by_id')
const update_user = require('../controllers/users/update_user')
const del_user = require('../controllers/users/del_user')

const user_messages = require('../controllers/messages/send_messages')
const fetch_messages = require('../controllers/messages/fetch_messages')
router.get('/user-details',authenticate_token, fetch_users);
router.get('/user/:id',authenticate_token, fetch_user_by_id);
router.put('/update-user',authenticate_token, update_user);
router.delete('/del-user/:id',authenticate_token, del_user);

// messages
router.post('/messages/:room_id', authenticate_token, user_messages)
router.get('/get-messages/:room_id', authenticate_token, fetch_messages)


module.exports = router;