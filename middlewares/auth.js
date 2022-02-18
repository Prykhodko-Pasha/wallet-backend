const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const { JWT_SECRET_KEY } = process.env;

const auth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const [bearer, token] = authorization?.split(" ");
    const { id } = jwt.verify(token, JWT_SECRET_KEY);
    const user = await User.findOne({ _id: id });

    if (!authorization || bearer !== "Bearer" || !user) throw new Error();

    req.user = user;
    next();
  } catch (error) {
    error.status = 401;
    error.message = "Not authorized";
    next(error);
  }
};

module.exports = auth;
