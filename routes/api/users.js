const express = require("express");
const { auth } = require("../../middlewares");
const ctrl = require("../../controllers/users");
const router = express.Router();

router.get("/currentUser", auth, ctrl.getCurrent);

const { validateAuth, validateUpdateSub } = require('../../service/validation');
const userController = require('../../controllers/users');
const guard = require('../../service/guard');

router.post('/auth/register', validateAuth, userController.register);
router.post('/auth/login', validateAuth, userController.login);
router.post('/auth/logout', guard, userController.logout);
router.get('/current', guard, userController.currentUser);
router.patch('/', guard, validateUpdateSub, userController.updateSub);

module.exports = router;