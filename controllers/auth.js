const jwt = require('jsonwebtoken')
const { nanoid } = require('nanoid')
const queryString = require('query-string')
const axios = require('axios')
require('dotenv').config()
const {
  create,
  findUserByField,
  // updateUserByField,
  createSession,
  deleteSession,
} = require('../model/users')
const {
  HttpCode,
  JWT_ACCESS_EXPIRE_TIME,
  JWT_REFRESH_EXPIRE_TIME,
  REFRESH_TOKEN_COOKIE_MAX_AGE,
} = require('../helpers/constants')
const EmailService = require('../services/email')
const SECRET_KEY = process.env.JWT_SECRET_KEY

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await findUserByField({ email })
    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: 'error',
        code: HttpCode.CONFLICT,
        data: 'Conflict',
        message: 'Email in use',
      })
    }
    const verificationToken = nanoid()
    const emailService = new EmailService(process.env.NODE_ENV)
    await emailService.sendEmail(verificationToken, email)
    const newUser = await create({
      email,
      password,
      verificationToken,
    })
    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: {
        email: newUser.email,
        avatar: newUser.avatarURL,
      },
    })
  } catch (e) {
    next(e)
  }
}

async function createSessionTokens(userId) {
  const newSession = await createSession(userId)
  const payload = { uid: userId, sid: newSession._id }
  const accessToken = jwt.sign(payload, SECRET_KEY, {
    expiresIn: JWT_ACCESS_EXPIRE_TIME,
  })
  const refreshToken = jwt.sign(payload, SECRET_KEY, {
    expiresIn: JWT_REFRESH_EXPIRE_TIME,
  })
  return { accessToken, refreshToken }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await findUserByField({ email })
    const isPasswordValid = await user?.validPassword(password)
    if (!user || !isPasswordValid || user.verificationToken) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        data: 'UNAUTHORIZED',
        message: user?.verificationToken
          ? 'Please verify your email'
          : 'Email or password is wrong',
      })
    }
    const { accessToken, refreshToken } = await createSessionTokens(user._id)
    res.cookie('refreshToken', refreshToken, {
      maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE,
      httpOnly: true,
    })
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        accessToken,
        user: {
          name: user.name !== null ? user.name : user.email,
          email: user.email,
          avatarURL: user.avatarURL,
        },
      },
    })
  } catch (e) {
    next(e)
  }
}

const logout = async (req, res, next) => {
  try {
    await deleteSession(req.user.sid)
    res.clearCookie('refreshToken')
    return res.status(HttpCode.NO_CONTENT).json({})
  } catch (e) {
    next(e)
  }
}

// let originUrl = null
const googleAuth = async (_req, res) => {
  // originUrl = req.headers.origin
  const stringifiedParams = queryString.stringify({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: `${
      process.env.NODE_ENV === 'development'
        ? process.env.BASE_URL
        : process.env.CLIENT_URL
    }/auth/google-redirect`,
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ].join(' '),
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
  })
  return res.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`
  )
}

const googleRedirect = async (req, res) => {
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`
  const urlObj = new URL(fullUrl)
  const urlParams = queryString.parse(urlObj.search)
  const code = urlParams.code
  const tokenData = await axios({
    url: `https://oauth2.googleapis.com/token`,
    method: 'post',
    data: {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${
        process.env.NODE_ENV === 'development'
          ? process.env.BASE_URL
          : process.env.CLIENT_URL
      }/auth/google-redirect`,
      grant_type: 'authorization_code',
      code,
    },
  })

  const userData = await axios({
    url: 'https://www.googleapis.com/oauth2/v2/userinfo',
    method: 'get',
    headers: {
      Authorization: `Bearer ${tokenData.data.access_token}`,
    },
  })
  const { email, name, picture, id } = userData.data
  const user = await findUserByField({ email })

  const newUser = !user
    ? await create({
        email,
        verificationToken: null,
        password: id,
      })
    : null

  const { accessToken, refreshToken } = await createSessionTokens(
    newUser?._id || user._id
  )
  res.cookie('refreshToken', refreshToken, {
    maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE,
    httpOnly: true,
  })
  const userPicture = user?.avatarURL || picture
  return res.redirect(
    `${
      process.env.NODE_ENV === 'development'
        ? process.env.BASE_URL
        : process.env.CLIENT_URL
    }/google-auth?token=${accessToken}&email=${email}&name=${name}&picture=${userPicture}`
  )
}

const refreshToken = async (req, res) => {
  await deleteSession(req.user.sid)
  const user = req.user

  const { accessToken, refreshToken } = await createSessionTokens(user._id)
  // res.clearCookie('refreshToken')
  res.cookie('refreshToken', refreshToken, {
    maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE,
    httpOnly: true,
  })

  return res.status(HttpCode.OK).json({
    status: 'success',
    code: HttpCode.OK,
    data: {
      accessToken,
      user: {
        name: user.name !== null ? user.name : user.email,
        email: user.email,
        avatarURL: user.avatarURL,
      },
    },
  })
}

module.exports = {
  register,
  login,
  logout,
  googleRedirect,
  googleAuth,
  refreshToken,
}
