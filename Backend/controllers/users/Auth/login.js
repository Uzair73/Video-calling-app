const express = require("express");
const { find_user_by_email } = require("../../../Models/users/users");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
require("dotenv").config();

// login endpoint
const login = async (req, res) => {
  try {
    const { email, user_password } = req.body;
    const user = await find_user_by_email(email);
    if (!user) {
      return res.status(404).json({ success: false, message: "Not Found: User does't exists"});
    }
    const isValidPassword = await bcrypt.compare(user_password, user.user_password);
    if (!isValidPassword) {
      return res.status(400).json({ success: false, message: "Invalid email or password"});
    }
    const payload = {
      user_id: user.id,
    }
    const token = jwt.sign(payload,process.env.TOKEN_SECREAT,{expiresIn: "24h"});
    console.log("token", token);
    return res.status(200).json({success: true, message: "Successfully Login", token});
  } catch (error) {
    console.error("Error during user login", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message});
  }
};

module.exports = login;
