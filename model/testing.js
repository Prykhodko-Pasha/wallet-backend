const TechQuestion = require('./schemas/techQuestion')
const TheoryQuestion = require('./schemas/theoryQuestion')
const { questionsAmount } = require('./../helpers/constants')

const listTechQuestions = async () => {
  const questions = await TechQuestion.aggregate()
    .sample(questionsAmount)
    .project({
      rightAnswer: 0,
    })
  return questions
}

const listTheoryQuestions = async () => {
  const questions = await TheoryQuestion.aggregate()
    .sample(questionsAmount)
    .project({
      rightAnswer: 0,
    })
  return questions
}

const listAnswersTheoryQuestions = async () => {
  const questions = await TheoryQuestion.find()
  return questions
}
const listAnswersTechQuestions = async () => {
  const questions = await TechQuestion.find()
  return questions
}

module.exports = {
  listTechQuestions,
  listTheoryQuestions,
  listAnswersTechQuestions,
  listAnswersTheoryQuestions,
}
