const { delete_user } = require('../../Models/users/users');

// Delete the user by id
const user_del = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("params id of the del user", id)
    if (!id) {
      return res.status(400).json({ success: false, message: 'Please provide the id' })
    }
    const result = await delete_user(id);
    console.log("Delete operation result", result)
    if (result.rowCount === 0){
      return res.status(404).json({ success: false, message: "User not found" })
    }else{
        return res.status(200).json({ success: true, message: "User was deleted successfully" })
    }
  } catch (error) {
    console.log("Error on the delete user operation", error)
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message })
  }
};

module.exports = user_del;
