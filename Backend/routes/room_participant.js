const express = require('express');
const router = express.Router();
const authenticate_token = require('../middleware/auth_middleware');

const add_participant = require('../controllers/room-participant/participant')
const remove_participant = require('../controllers/room-participant/remove_participant')

router.post('/rooms/:roomId/participants', authenticate_token, add_participant)
router.delete('/rooms/:roomId/participants/:userId', authenticate_token, remove_participant)


module.exports = router;