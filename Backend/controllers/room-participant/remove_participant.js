const { remove_participant } = require("../../Models/room-participant/participant")

// function to remove the participant from the room
const participant_remove = async(req,res)=>{
try {
    const room_id = req.params.roomId
    const user_id = req.params.userId
    console.log("remove participant ids",{room_id: room_id, user_id: user_id});
    if(!room_id || !user_id){
        res.status(400).json({success: false, message: "Please provide the room and user id to remove the participant"})
    }
    await remove_participant(room_id,user_id)
    return res.status(200).json({success: true, message: "The participant was removed from the room"})
}catch (error) {
    console.log("Error on the remove participant", error);
    res.status(500).json({success: false, message: "Internal Server Error", error: error.message})
}
}

module.exports = participant_remove