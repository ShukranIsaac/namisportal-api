

const jwt = require('jsonwebtoken')
const config = require('../config.json');

module.exports = (req, res, next) => {
    const token = req.query.token
    console.log(token)

    if(token){
      jwt.verify(token, config.secret, (err, decoded) => {
        if(err){
          const success = false;
          const message = 'Failed to authenticate token.';
  
          const response = { success, message }
          res.status(401).json(response);
        }
        else {
          req.decoded = decoded;
  
          return next();
  
        }
      })
    }
    else {
      let success = false;
      let message = 'No token provided.';
  
      let response = { success, message }
  
      return res.status(403).json(response);
    }
  }
  