const passport = require('passport')
require('../config/passport')
const { HttpCode } = require('./constants')

const guard = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    const token = req.get('Authorization')?.split(' ')[1]
    // const token = req.headers.authorization?.split(' ')[1]
    // if (req.url === '/users/avatars' && !user) {
    //   return res.status(HttpCode.UNAUTHORIZED).json({
    //     status: '401 BAD',
    //     code: HttpCode.UNAUTHORIZED,
    //     message: 'Not authorized',
    //   })
    // }
    if (req.url !== '/logout') {
      delete user.sid
    }
    if (!user || err || !token) {
      if (!token) {
        return res.status(HttpCode.UNAUTHORIZED).json({
          status: 'invalid token',
          code: HttpCode.UNAUTHORIZED,
          message: 'Token is not valid',
        })
      }
      return res.status(HttpCode.FORBIDDEN).json({
        status: 'error',
        code: HttpCode.FORBIDDEN,
        data: 'FORBIDDEN',
        message: 'Access is denied',
      })
    }
    req.user = user
    return next()
  })(req, res, next)
}

module.exports = guard
