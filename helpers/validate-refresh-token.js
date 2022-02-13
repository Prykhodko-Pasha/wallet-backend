const jwt = require('jsonwebtoken')
require('dotenv').config()
const SECRET_KEY = process.env.JWT_SECRET_KEY
const { HttpCode } = require('./constants')
const { findUserByField, findSession } = require('../model/users')

const validateRefreshToken = async (req, res, next) => {
  const { refreshToken } = req.cookies
  // req.body.token || req.query.token || req.headers['x-access-token']
  if (refreshToken) {
    // verifies secret and checks exp
    await jwt.verify(refreshToken, SECRET_KEY, async function (err, decoded) {
      if (err) {
        return res
          .status(HttpCode.UNAUTHORIZED)
          .json({ error: true, message: 'Unauthorized access.' })
      }

      const { sid, uid } = decoded
      const session = await findSession(sid)

      if (!session) {
        return res.status(HttpCode.FORBIDDEN).json({
          status: 'error',
          code: HttpCode.FORBIDDEN,
          data: 'FORBIDDEN',
          message: 'Access is denied',
        })
      }

      const user = await findUserByField({ _id: uid })
      user.sid = sid
      req.user = user
      return next()
    })
  } else {
    return res.status(HttpCode.FORBIDDEN).send({
      error: true,
      message: 'No token provided.',
    })
  }
}

module.exports = validateRefreshToken
