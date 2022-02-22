const getCurrent = async (req, res) => {
  const { id, email, name, avatarURL } = req.user;
  res.json({
    user: {
      id,
      email,
      name,
      avatarURL,
    },
  });
};
module.exports = getCurrent;
