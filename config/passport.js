const passport = require('passport')
const { Strategy, ExtractJwt } = require('passport-jwt')
require('dotenv').config()
const SECRET_KEY = process.env.JWT_SECRET_KEY
const { findUserByField, findSession } = require('../model/users')

const params = {
  secretOrKey: SECRET_KEY,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
}

passport.use(
  new Strategy(params, async (payload, done) => {
    try {
      const user = await findUserByField({ _id: payload.uid })
      const session = await findSession(payload.sid)

      if (!user) {
        return done(new Error('User not found'))
      }
      if (!session) {
        return done(null, false)
      }

      user.sid = payload.sid

      return done(null, user)
    } catch (err) {
      done(err)
    }
  })
)
