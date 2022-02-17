const { User, joiSchemaUserVerif } = require("../../models/user");
const sendEmail = require("../../helpers/sendEmail");

const sendVerifLetter = async (req, res, next) => {
  try {
    const { error } = joiSchemaUserVerif.validate(req.body);
    if (error)
      return res.status(400).json({
        message: error.details[0].message,
      });

    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({
        message: "User not found",
      });

    const { verificationToken, verify } = user;
    if (verify)
      return res.status(400).json({
        message: "Verification has already been passed",
      });

    sendEmail(email, verificationToken);

    res.json({
      message: "Verification email have been sent",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = sendVerifLetter;
