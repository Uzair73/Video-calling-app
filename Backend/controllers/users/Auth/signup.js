const express = require('express');
const { create_user } = require('../../../Models/users/users');
require('dotenv').config();

// register endpoint
const signUp = async (req, res) => {
    if(!req.body){
        return res.status(400).json("Bad Request");
    }
    const {username, email, user_password} = req.body;
    try {
        const user_create = await create_user({username, email, user_password});
        if(username === '' || email == '' || user_password == ''){
            return res.status(400).json("Please fill in all fields");
        }
        res.status(201).json(user_create);
        console.log("User was successfully registered", user_create);
    } catch (error) {
        console.log("Error occurred in the register endpoint", error);
        res.status(500).json({error: "Internal server error"});
    }
}
module.exports = signUp;