const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = async (req, res, next) => {
  try {
    let jwtToken = req.header('Authorization')

    if (jwtToken.startsWith('Bearer ')) {
      jwtToken = jwtToken.substring(7, jwtToken.length)
    }
    console.log(req.header('Authorization'), jwtToken)

    if (!jwtToken) {
      return res.status(403).json({ status: false, error: ['Not Authorised'] })
    }

    const payload = jwt.verify(jwtToken, process.env.JWT_SECRET)

    console.log(payload)
    const dateNow = new Date()

    if (payload.exp < dateNow.getTime() / 1000) {
      return res.status(403).json({ status: false, error: ['Not Authorised'] })
    }

    req._id = payload._id
    // console.log(req, 'request middleware')
    next()
  } catch (e) {
    
    return res.status(403).json({ status: false, error: ['Not Authorised'] })
  }
}
