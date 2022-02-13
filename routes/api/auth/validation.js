const Joi = require('joi')
const { HttpCode } = require('../../../helpers/constants')

const schemaRegister = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'ua', 'ru'] },
    })
    .required(),
  password: Joi.string().required(),
})

const schemaLogin = Joi.object({
  _id: Joi.string().pattern(/^[a-f\d]{24}$/i),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .required(),
  subscription: Joi.string().optional(),
  password: Joi.string().required(),
  token: Joi.any().optional(),
})

const validate = (schema, obj, next) => {
  const { error } = schema.validate(obj)
  if (error) {
    const [{ message }] = error.details
    return next({
      status: HttpCode.BAD_REQUEST,
      message: `Field ${message.replace(/"/g, '')}`,
    })
  }
  next()
}

module.exports.Register = (req, res, next) => {
  return validate(schemaRegister, req.body, next)
}

module.exports.Login = (req, res, next) => {
  return validate(schemaLogin, req.body, next)
}
