const fs = require('fs').promises
const { promisify } = require('util')
const cloudinary = require('cloudinary').v2
require('dotenv').config()
const {
  updateAvatar,
  findUserByField,
  updateUserByField,
} = require('../model/users')
const { HttpCode } = require('../helpers/constants')

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadCloud = promisify(cloudinary.uploader.upload)

const updateUserName = async (req, res, next) => {
  try {
    const { name } = req.body
    const { id } = req.user
    const user = await updateUserByField({ _id: id }, { name })
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        user: {
          name: user.name,
          email: user.email,
        },
      },
    })
  } catch (e) {
    next(e)
  }
}

const getCurrent = async (req, res, next) => {
  try {
    // const token = req.get('Authorization')?.split(' ')[1]
    const user = req.user
    if (user) {
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        data: {
          user: {
            name: user.name !== null ? user.name : user.email,
            email: user.email,
            avatarURL: user.avatarURL,
          },
        },
      })
    } else {
      return next({
        status: HttpCode.UNAUTHORIZED,
        message: 'Invalid credentials',
      })
    }
  } catch (e) {
    next(e)
  }
}

const avatars = async (req, res, next) => {
  try {
    const id = req.user.id
    // const avatarURL = await saveAvatarToStatic(req)
    // await updateUserByField((_id: id}, {avatarURL})
    const { public_id: avatarIdCloud, secure_url: avatarUrl } =
      await saveAvatarToCloud(req)
    await updateAvatar(id, avatarUrl, avatarIdCloud)
    return res.json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        avatarUrl,
      },
    })
  } catch (e) {
    next(e)
  }
}

const verify = async (req, res, next) => {
  try {
    const { verificationToken } = req.params
    const user = await findUserByField({ verificationToken })
    if (user) {
      await updateUserByField({ _id: user.id }, { verificationToken: null })
      //  return res.json({
      //    status: 'success',
      //    code: HttpCode.OK,
      //    message: 'Verification successful!',
      //  })
      return res.redirect(
        process.env.NODE_ENV === 'development'
          ? process.env.BASE_URL
          : process.env.CLIENT_URL
      )
    }
    next(
      res.status(HttpCode.BAD_REQUEST).json({
        status: 'error',
        code: HttpCode.BAD_REQUEST,
        message: 'Your verification token is not valid',
      })
    )
  } catch (e) {
    next(e)
  }
}
// const saveAvatarToStatic = async (req) => {
//   const id = req.user.id
//   const IMG_DIR = path.join(
//     process.env.PUBLIC_DIR_NAME,
//     process.env.IMG_DIR_NAME
//   )
//   const pathFile = req.file.path
//   const newNameAvatar = `${Date.now()}-${req.file.originalname}`
//   const img = await Jimp.read(pathFile)
//   await img
//     .autocrop()
//     .cover(250, 250, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)
//     .writeAsync(pathFile)
//   await createFolderIsNotExist(path.join(IMG_DIR, id))
//   await fs.rename(pathFile, path.join(IMG_DIR, id, newNameAvatar))
//   const avatarUrl = path.normalize(path.join(id, newNameAvatar))
//   try {
//     await fs.unlink(req.user.avatarURL)
//   } catch (e) {
//     console.log(e.message)
//   }
//   return path.join('http:\\localhost:3000', process.env.IMG_DIR_NAME, avatarUrl)
// }

const saveAvatarToCloud = async (req) => {
  const pathFile = req.file.path
  const result = await uploadCloud(pathFile, {
    folder: 'Photo',
    transformation: { width: 250, height: 250, crop: 'fill' },
  })
  cloudinary.uploader.destroy(req.user.avatarIdCloud, (err, result) => {
    console.log(err, result)
  })
  try {
    await fs.unlink(pathFile)
  } catch (e) {
    console.log(e.message)
  }
  return result
}

module.exports = {
  updateUserName,
  getCurrent,
  avatars,
  verify,
}
