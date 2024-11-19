const express = require("express");
const { find_user_by_email } = require("../../../Models/users/users");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
require("dotenv").config();

// login endpoint
const login = async (req, res) => {
  const { email, user_password } = req.body;
  const user = await find_user_by_email(email);
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password", success: false});
  }
  const isValidPassword = await bcrypt.compare(user_password, user.user_password);
  if (!isValidPassword) {
    return res.status(400).json({ message: "Invalid email or password" , success: false});
  }
  const token = jwt.sign({ userId: user.id }, process.env.TOKEN_SECREAT, {
    expiresIn: "1h",
  });
  console.log("token", token);
  res.json({ token , success: true});
};


module.exports = login;
