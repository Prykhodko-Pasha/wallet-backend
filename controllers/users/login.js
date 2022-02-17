const jwt = require("jsonwebtoken");
const { User, joiSchemaUserLogin } = require("../../models/user");

const { JWT_SECRET_KEY } = process.env;

const loginUser = async (req, res, next) => {
  try {
    const { error } = joiSchemaUserLogin.validate(req.body);
    if (error)
      return res.status(400).json({
        message: error.details[0].message,
      });

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.comparePassword(password))
      return res.status(401).json({
        message: "Email or password is wrong",
      });
    if (!user.verify)
      return res.status(403).json({
        message: "Email is not verified",
      });

    const { _id, name } = user;
    const payload = { id: _id };
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "24h" });
    await User.findByIdAndUpdate(_id, { token });

    res.status(201).json({
      token,
      user: {
        id: _id,
        email,
        name,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = loginUser;
