const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticate_token = (req, res, next) => {
  const auth_Header = req.headers['authorization'];
  const token = auth_Header && auth_Header.split(' ')[1];
  if (!token){
    return res.status(404).json({ success: false, message: 'Token Not Found'});
  }

  jwt.verify(token, process.env.TOKEN_SECREAT, (err) => {
    console.log("error in middleware", err);
    
    if (err) return res.status(401).json({success: false, message: "Unathorized", error: err.message});
    next();
  });
};
module.exports = authenticate_token;
