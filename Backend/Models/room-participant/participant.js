const db = require('../../daos/db_connection/db_connect')

// create the participant model
const rooom_participant = async (user_id,room_id)=>{
    const res = await db.query('INSERT INTO room_participants (user_id,room_id) VALUES ($1, $2)', [user_id,room_id])
    return res.rows[0]
}

module.exports = {rooom_participant}