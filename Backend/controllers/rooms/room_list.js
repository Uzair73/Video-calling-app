const { room_list } = require('../../Models/room/room');

// function to the fetch the list of rooms
const get_rooms = async (req, res) => {
    try {
        const result = await room_list();
        return res.status(200).json({success: true , message: "List of rooms fetched successfully", data: result})
    } catch (error) {
      console.error("Error on the list of fetching rooms", error);
      res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
}

module.exports = get_rooms