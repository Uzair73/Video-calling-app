const db = require('../../daos/db_connection/db_connect')

// create the participant model
const rooom_participant = async (user_id,room_id)=>{
    const res = await db.query('INSERT INTO room_participants (user_id,room_id) VALUES ($1, $2)', [user_id,room_id])
    return res.rows[0]
}


// remove the participant to the room
const remove_participant = async (room_id, user_id)=>{
    const res = db.query('DELETE FROM room_participants WHERE room_id = $1 AND user_id = $2', [room_id,user_id])
    return res
}
module.exports = {rooom_participant, remove_participant}