const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticate_token = (req, res, next) => {
  const auth_Header = req.headers['authorization'];
  const token = auth_Header && auth_Header.split(' ')[1];
  if (!token){
    return res.status(404).json({ message: 'Token Not Found', success: false});
  }

  jwt.verify(token, process.env.TOKEN_SECREAT, (err) => {
    if (err) return res.status(401).json({message: "Unathorized", success: false});
    next();
  });
};
module.exports = authenticate_token;
