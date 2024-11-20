const express = require('express');
const router = express.Router();
const authenticate_token = require('../middleware/auth_middleware');

const create_room = require('../controllers/rooms/creating_room')
const fetch_room = require('../controllers/rooms/fetch_rooms')


router.post('/user-room',authenticate_token, create_room);
router.get('/fetch-room/:id',authenticate_token, fetch_room);



module.exports = router;