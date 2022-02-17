const { Schema, model } = require("mongoose");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const { nanoid } = require("nanoid");

// eslint-disable-next-line no-useless-escape
const emailRegexp = /^\w+([\.-]?\w+)+@\w+([\.:]?\w+)+(\.[a-zA-Z0-9]{2,3})+$/;

const userSchema = Schema({
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  //   avatarURL: {
  //     type: String,
  //     default: null,
  //   },
  token: {
    type: String,
    default: null,
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, "Verify token is required"],
  },
});

userSchema.methods.setPassword = function (password) {
  this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

// userSchema.methods.generateAvatar = function (email) {
//   this.avatarURL = gravatar.url(email, {
//     protocol: "https",
//     s: "250",
//     d: "wavatar",
//   });
// };

userSchema.methods.generateVerifToken = function () {
  this.verificationToken = nanoid();
};

const joiSchemaUserSignup = Joi.object({
  name: Joi.string().required(),
  password: Joi.string().min(6).required(),
  email: Joi.string().pattern(emailRegexp).required(),
});
const joiSchemaUserLogin = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().pattern(emailRegexp).required(),
});
const joiSchemaUserVerif = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
});

const User = model("user", userSchema);

module.exports = {
  User,
  joiSchemaUserSignup,
  joiSchemaUserLogin,
  joiSchemaUserVerif,
};
