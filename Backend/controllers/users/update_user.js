const { update_user } = require('../../Models/users/users')

// update user details
const update_user_details = async (req, res) => {
    try {
        const { id, username} = req.body;
        if (!id || !username) {
            return res.status(400).json({ success: false, message: "Please provide id, username" });
        }
        const updatedUser = await update_user({ id, username });
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.status(200).json({ success: true, message: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.log("Error by the update user details", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
}

module.exports = update_user_details