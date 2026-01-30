const { send_msg } = require('../../Models/message/user_messages')

// function to send the messages to the user
const send_message = async (req, res) => {
    const { room_id } = req.params
    const { sender_id, message } = req.body
    console.log({room_id: room_id, sender_id: sender_id, content: message});
    
    if(!sender_id || !room_id || !message) {
      return res.status(400).json({success: false, message: 'Sender ID, Room ID, and message are required'})
    }
    try {
        const result = await send_msg(room_id, sender_id, message)
        return res.status(200).json({success: true, message: 'Message sent successfully', data: result})
    } catch (error) {
        return res.status(500).json({success: false, message: 'Failed to send message', error: error.message})
    }
}

module.exports = send_message