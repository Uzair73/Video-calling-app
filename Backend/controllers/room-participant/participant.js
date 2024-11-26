const { rooom_participant } = require('../../Models/room-participant/participant')

// function to add the participant to the room
const add_participant = async (req, res) => {
    try {
        const { user_id } = req.body;
        const  room_id  = req.params.roomId;
        console.log({user_id: user_id, room_id: room_id});
        
        if(!user_id || !room_id) {
            return res.status(400).json({success: false, message: "User ID and Room ID are required."})
        }
        await rooom_participant(user_id, room_id ); 
        return res.status(200).json({success: true, message: "Participant added successfully"})
    } catch (error) {
        console.log("Error on the add participant to the room", error);
        res.status(500).json({success: false, message: "Internal Server Error", error: error.message}) 
    }
}

module.exports =  add_participant;