const db = require('../../daos/db_connection/db_connect')

// Creating the room model
const create_room = async ({room_name, created_by, room_type})=>{
    const res = await db.query('INSERT INTO rooms (room_name, created_by, room_type) VALUES ($1, $2, $3) RETURNING *', [room_name, created_by, room_type])
    return res.rows[0]
}

// fetch the room details by the user id
const fetch_room = async (created_by)=>{
    const res = await db.query('SELECT * FROM rooms WHERE created_by = $1', [created_by])
    return res.rows[0]
}

// fetch the list of available room
const room_list = async ()=>{
    const res = await db.query('SELECT * FROM rooms')
    return res.rows
}
module.exports = { create_room , fetch_room, room_list }