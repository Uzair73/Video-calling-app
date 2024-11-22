const express = require('express');
const router = express.Router();
const authenticate_token = require('../middleware/auth_middleware');

const add_participant = require('../controllers/room-participant/participant')

router.post('/rooms/:roomId/participants', authenticate_token, add_participant)


module.exports = router;