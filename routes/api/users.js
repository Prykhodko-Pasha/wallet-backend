const express = require("express");
const auth = require("../../middlewares");
const ctrl = require("../../controllers/users");
const router = express.Router();
const upload = require("../../middlewares/upload");
const updateAvatar = require("../../controllers/users/updateAvatar");



router.post("/signup", ctrl.signupUser);
router.post("/login", ctrl.loginUser);
router.get("/logout", auth, ctrl.logoutUser);
router.get("/verify/:verificationToken", ctrl.verifyUserEmail);
router.post("/verify", ctrl.sendVerifLetter);
router.get("/currentUser", auth, ctrl.getCurrent);

router.patch(
  "/avatars",
  auth,
  upload.single("avatar"),
  updateAvatar.updateUserAvatar
);

module.exports = router;
