const { fetch_messages } = require('../../Models/message/user_messages')

// function to get all messages from the database
const fetch_all_messages = async (req, res) => {
    const { room_id } = req.params;
    console.log({room_id: room_id});
    if(!room_id){
        return res.status(400).json({success: false, message: "Room ID is required"})
    }
    try {
        const messages = await fetch_messages(room_id);
        if(messages.length === 0){
            return res.status(404).json({success: false, message: "No room user found in this message box!"})
        }
        res.status(200).json({ success: true, message: "All messages fetched successfully", data: messages});
    } catch (error) {
        console.log("Error on the fetching the messages", error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
}

module.exports = fetch_all_messages