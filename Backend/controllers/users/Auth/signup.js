const express = require('express');
const { create_user, find_user_by_email } = require('../../../Models/users/users');
require('dotenv').config();

// register endpoint
const signUp = async (req, res) => {
    if(!req.body){
        return res.status(400).json("Bad Request");
    }
    const {username, email, user_password} = req.body;

    // validate the user input
    if(!req.body.username || !req.body.email || !req.body.user_password){
        return res.status(400).json("Bad Request: All fields are required");
    }

    try {
        const same_email_check = await find_user_by_email(email);
        console.log("same email", same_email_check);
        
        if(same_email_check){
            return res.status(409).json("Email already exists");
        }
        const user_create = await create_user({username, email, user_password});
        res.status(201).json(user_create);
        console.log("User was successfully registered", user_create);
        } catch (error) {
        console.log("Error occurred in the register endpoint", error);
        res.status(500).json({error: "Internal server error"});
        }
}
module.exports = signUp;