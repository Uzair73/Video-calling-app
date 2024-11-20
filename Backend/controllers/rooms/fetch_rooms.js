const { fetch_room } = require('../../Models/room/room')

// fetch the user room function
const fetch_room_by_id = async (req,res)=>{
    try {
    const id = req.params.id // Corrected the way to access id from params
    console.log("id of the room is", id);
    if(!id){
        return res.status(400).json({success: false, message: "Not provide the Id"})
    }
    const room = await fetch_room(id)
    if(!room){
        return res.status(404).json({success: false, message: "Room not found"})
    }
    return res.status(200).json({success: true, message: "Room was successfully Retrieved", data: room})
    } catch (error) {
        console.log("Error on the fetch room", error);
        return res.status(500).json({success: false, message: "Internal Server Error", error: error.message}) 
    }
}

module.exports = fetch_room_by_id;