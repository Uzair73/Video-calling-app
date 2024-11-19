const express = require('express');
const router = express.Router();
const { fetch_all_users } = require('../../Models/users/users'); // Assuming you have this function

// Fetch all users endpoint
const user_detils =  async (req, res) => {
    try {
        const users = await fetch_all_users();
        return res.json({success: true , users});
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ success: false , message: "Internal server error"});
    }
};

module.exports = user_detils;