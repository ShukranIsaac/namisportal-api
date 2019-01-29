

const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRETE;

module.exports = (req, res, next) => {
    const token = req.query.token

    if(token){
      jwt.verify(token, secret, (err, decoded) => {
        if(err){
          const success = false;
          const message = 'Failed to authenticate token.'
  
          const response = { success, message }
          res.status(401).json(response)
        }
        else {
          req.decoded = decoded
  
          return next()
  
        }
      })
    }
    else {
      const success = false,
       message = 'No token provided.',
       response = { success, message }
  
      return res.status(403).json(response)
    }
  }
  