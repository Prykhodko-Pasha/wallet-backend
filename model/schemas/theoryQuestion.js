const { Schema, model } = require('mongoose')

const theoryQuestionSchema = new Schema(
  {
    question: String,
    questionId: Number,
    answers: [String],
    rightAnswer: String,
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

const TheoryQuestion = model('theory-question', theoryQuestionSchema)

module.exports = TheoryQuestion
