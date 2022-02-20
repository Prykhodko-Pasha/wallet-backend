const fs = require("fs/promises");
const jimp = require("jimp");
const path = require("path");
const { User } = require("../../models/user");
const avatarsDir = path.join(__dirname, "../", "public/avatars");


const updateAvatar = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { path: tempUpload, filename } = req.file;

    await jimp.read(tempUpload).then((resizeAvatar) => {
      return resizeAvatar.resize(250, 250).write(tempUpload);
    });

    const extension = filename.split(".").pop();
    const newFilename = `avatar-${Date.now()}.${extension}`;
    const fileUpload = path.join( avatarsDir, newFilename);
    await fs.rename(tempUpload, fileUpload);
    const avatarURL = path.join("avatars", newFilename);
    await User.findByIdAndUpdate(_id, { avatarURL });
    res.json({ avatarURL });
  } catch (err) {
    next(err);
  }
};

module.exports =  updateAvatar;