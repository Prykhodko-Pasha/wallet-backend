const User = require('./schemas/user')
const Session = require('./schemas/session')

const create = async ({ email, password, verificationToken }) => {
  const user = new User({
    email,
    password,
    verificationToken,
  })
  return await user.save()
}

const findUserByField = async (field) => {
  return await User.findOne(field)
}

const updateUserByField = async (field, updateData) => {
  return await User.findOneAndUpdate(field, updateData, { new: true })
}

const updateAvatar = async (id, avatarURL, avatarIdCloud) => {
  return await User.updateOne(
    { _id: id },
    { avatarURL, avatarIdCloud },
    { new: true }
  )
}

const createSession = async (uid) => {
  // const session = new Session(uid)
  // return await session.save()
  return await Session.create(uid)
}

const findSession = async (sid) => {
  return await Session.findById(sid)
}

const deleteSession = async (uid) => {
  return await Session.findByIdAndRemove(uid)
}

// const updateUserSubscription = async (id, name) => {
//   const result = await User.findOneAndUpdate(id, { name }, { new: true })
//   return result
// }

module.exports = {
  createSession,
  findSession,
  deleteSession,
  findUserByField,
  create,
  updateAvatar,
  updateUserByField,
}
