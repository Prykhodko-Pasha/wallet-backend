// const sendEmail = require("../../helpers/sendEmail");
const { User, joiSchemaUserSignup } = require("../../models/user");

const signupUser = async (req, res, next) => {
  try {
    const { error } = joiSchemaUserSignup.validate(req.body);
    if (error)
      return res.status(400).json({
        message: error.details[0].message,
      });

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user)
      return res.status(409).json({
        message: "Email in use",
      });

    const newUser = new User(req.body);
    newUser.setPassword(password);
    newUser.generateAvatar(email);
    // newUser.generateVerifToken();
    // const result = await newUser.save();
    await newUser.save();

    // const { verificationToken } = result;
    // sendEmail(email, verificationToken);

    res.status(201).json({
      email,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = signupUser;
