const express = require('express');
const { create_user, find_user_by_email } = require('../../../Models/users/users');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// register endpoint
const signUp = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ message: "Bad Request", success: false });
    }
    const { username, email, user_password } = req.body;

    // validate the user input
    if (!username || !email || !user_password) {
        return res.status(400).json({ message: "Bad Request: All fields are required", success: false });
    }

    try {
        const same_email_check = await find_user_by_email(email);
        if (same_email_check) {
            return res.status(409).json({ message: "Email already exists", success: false });
        }
        const user_create = await create_user({ username, email, user_password });
        const payload = {
            user: {
                id: user_create.id
            }
        };
        const token = jwt.sign(payload, process.env.TOKEN_SECREAT, { expiresIn: '24h' });
        return res.status(201).json({ message: "User was successfully registered", token, success: true });
    } catch (error) {
        console.log("Error occurred in the register endpoint", error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
}
module.exports = signUp;