const { User } = require("../../models/user");

const verifyUserEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user)
      return res.status(404).json({
        message: "User token not found",
      });

    const { _id } = user;
    await User.findByIdAndUpdate(_id, {
      verify: true,
      verificationToken: null,
    });

    res.json({
      message: "Verification successful",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = verifyUserEmail;
