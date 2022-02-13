const rateLimit = require('express-rate-limit')
const { HttpCode } = require('./constants')

const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 2,
  handler: (req, res, next) => {
    res.status(HttpCode.BAD_REQUEST).json({
      status: 'error',
      code: HttpCode.BAD_REQUEST,
      message: 'Limit from your IP for an hour is exceeded. Try later.',
    })
  },
})

module.exports = { createAccountLimiter }
