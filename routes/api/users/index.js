const express = require('express')
const router = express.Router()
const guard = require('../../../helpers/guard')
const upload = require('../../../helpers/upload')
const usersController = require('../../../controllers/users')
const validation = require('./validation')

router.patch(
  '/avatars',
  guard,
  upload.single('avatar'),
  validation.UploadAvatar,
  usersController.avatars
)
router.get('/current', guard, usersController.getCurrent)
router.patch(
  '/current',
  guard,
  validation.UpdateUser,
  usersController.updateUserName
)

router.get('/verify/:verificationToken', usersController.verify)

module.exports = router
