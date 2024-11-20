const express = require('express');
const { create_user, find_user_by_email } = require('../../../Models/users/users');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// register endpoint
const signUp = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ success: false , message: "Bad Request: No data in request body"});
    }
    const { username, email, user_password } = req.body;

    // validate the user input
    if (!username || !email || !user_password) {
        return res.status(400).json({ success: false , message: "Bad Request: All fields are required"});
    }

    try {
        const same_email_check = await find_user_by_email(email);
        if (same_email_check) {
            return res.status(409).json({ success: false , message: "Conflict: Email already exists"});
        }
        const user_create = await create_user({ username, email, user_password });
        const payload = {
            user: {
                id: user_create.id
            }
        };
        const token = jwt.sign(payload, process.env.TOKEN_SECREAT, { expiresIn: '24h' });
        return res.status(201).json({ success: true , message: "User was successfully registered", token});
    } catch (error) {
        console.log("Error occurred in the register endpoint", error);
        res.status(500).json({ success: false , message: "Internal server error", error:error.message});
    }
}
module.exports = signUp;