const express = require('express');
const router = express.Router();
const authenticate_token = require('../middleware/auth_middleware');

const create_room = require('../controllers/rooms/creating_room')


router.post('/user-room',authenticate_token, create_room);



module.exports = router;