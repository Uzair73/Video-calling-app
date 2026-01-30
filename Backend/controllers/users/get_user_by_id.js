const {fetch_user_by_id} = require('../../Models/users/users')

// fetch the user data by the id
const user_by_id = async (req,res)=>{
 try {
    const id = req.params.id
    if (!id) {
        return res.status(400).json({success: false, message: "Please provide the user id"})
    }
    const user = await fetch_user_by_id(id)
    if (!user) {
        return res.status(404).json({success: false, message: "User not found"})
    }
        console.log("id by the user", user);
        return res.status(200).json({success : true, user: user})
 } catch (error) {
    console.log("Error fetching user by id", error);
    res.status(500).json({success: false, message: "Internal Server Error", error: error.message});
 }
}

module.exports = user_by_id;