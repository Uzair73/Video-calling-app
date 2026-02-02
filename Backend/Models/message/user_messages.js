const db = require('../../daos/db_connection/db_connect')

// query to insert the messages in table
const send_msg = async (room_id, sender_id, content) => {
 const res = await db.query('INSERT INTO message (room_id, sender_id, content) VALUES ($1, $2, $3) RETURNING *', [room_id, sender_id, content])
 return res.rows[0]
}

// fetch the messages by the room id
const fetch_messages= async (room_id) => {
    const res = await db.query('SELECT m.id, m.room_id, m.sender_id, u.username , m.content, m.send_at FROM message m JOIN users u ON m.sender_id = u.id WHERE m.room_id = $1 ORDER BY m.send_at', [room_id])
    return res.rows
}
module.exports = {send_msg, fetch_messages}