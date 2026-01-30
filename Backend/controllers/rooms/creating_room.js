const { create_room } = require('../../Models/room/room')

// function to create the room
const createRoom = async (req, res) => {
    try {
        const { room_name, created_by, room_type } = req.body;
        if (!room_name || !created_by || !room_type){
            return res.status(400).json({ success: false, message: "Please fill in all fields" });
        }
        const createdRoom = await create_room({room_name, created_by, room_type});
        return res.status(201).json({ success: true, message: "Room created successfully", room: createdRoom });
    } catch (error) {
        console.log("Error on creating room: ", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
}

module.exports = createRoom;