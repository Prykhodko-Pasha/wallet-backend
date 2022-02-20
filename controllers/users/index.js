const getCurrent = require("./getCurrent");
const signupUser = require("./signup");
const loginUser = require("./login");
const logoutUser = require("./logout");
const verifyUserEmail = require("./verifyEmail");
const sendVerifLetter = require("./sendVerifLetter");


module.exports = {
  getCurrent,
  signupUser,
  loginUser,
  logoutUser,
  verifyUserEmail,
  sendVerifLetter,
};
