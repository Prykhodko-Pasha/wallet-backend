const { Schema, model, SchemaTypes } = require('mongoose')

const sessionSchema = new Schema(
  {
    uid: {
      type: SchemaTypes.ObjectId,
      // ref: 'user',
    },
  }
  // {
  //   versionKey: false,
  //   timestamps: true,
  // }
)

const Session = model('session', sessionSchema)

module.exports = Session
