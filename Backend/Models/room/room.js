const db = require('../../daos/db_connection/db_connect')

// Creating the room model
const create_room = async ({room_name, created_by, room_type})=>{
    const res = await db.query('INSERT INTO rooms (room_name, created_by, room_type) VALUES ($1, $2, $3) RETURNING *', [room_name, created_by, room_type])
    return res.rows[0]
}

module.exports = { create_room }