const express = require('express')
const router = express.Router()
const authController = require('../../../controllers/auth')
const tryCatchWrapper = require('../../../helpers/try-catch-wrapper')
const guard = require('../../../helpers/guard')
const validateRefreshToken = require('../../../helpers/validate-refresh-token')
const { createAccountLimiter } = require('../../../helpers/rate-limit')
const validation = require('./validation')

router.post(
  '/register',
  createAccountLimiter,
  validation.Register,
  authController.register
)

router.post('/login', validation.Login, authController.login)
router.post('/logout', guard, authController.logout)

router.get('/google', tryCatchWrapper(authController.googleAuth))
router.get('/google-redirect', tryCatchWrapper(authController.googleRedirect))
router.get(
  '/refresh-token',
  tryCatchWrapper(validateRefreshToken),
  tryCatchWrapper(authController.refreshToken)
)

module.exports = router
