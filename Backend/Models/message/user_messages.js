const db = require('../../daos/db_connection/db_connect')

// query to insert the messages in table
const send_msg = async (room_id, sender_id, content) => {
 const res = await db.query('INSERT INTO message (room_id, sender_id, content) VALUES ($1, $2, $3) RETURNING *', [room_id, sender_id, content])
 return res.rows[0]
}
module.exports = {send_msg}