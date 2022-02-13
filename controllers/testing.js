const {
  listTechQuestions,
  listTheoryQuestions,
  listAnswersTechQuestions,
  listAnswersTheoryQuestions,
} = require('../model/testing.js')

const getTechQuestions = async (req, res, next) => {
  try {
    const data = await listTechQuestions()
    return res.json({ status: 'success', code: 200, data })
  } catch (e) {
    next(e)
  }
}

const getTheoryQuestions = async (req, res, next) => {
  try {
    const data = await listTheoryQuestions()
    return res.json({
      status: 'success',
      code: 200,
      data,
    })
  } catch (e) {
    next(e)
  }
}
const postResult = async (req, res, next) => {
  try {
    const result = {}
    const { nameTest, answers } = req.body
    let right = 0
    let wrong = 0
    let questions
    if (nameTest === 'tech-questions') {
      const data = await listAnswersTechQuestions()
      questions = data
    } else if (nameTest === 'theory-questions') {
      const data = await listAnswersTheoryQuestions()
      questions = data
    }

    questions.forEach(({ questionId: questionDbId, rightAnswer }) => {
      answers.forEach(({ questionId, answer }, i) => {
        if (questionDbId.toString() === questionId && rightAnswer === answer) {
          result[i + 1] = true
          right += 1
        } else if (
          questionDbId.toString() === questionId &&
          rightAnswer !== answer
        ) {
          result[i + 1] = false
          wrong += 1
        }
      })
    })

    const total = right + wrong
    return res.json({
      status: 'success',
      code: 200,
      data: {
        nameTest,
        result,
        right,
        wrong,
        total,
      },
    })
  } catch (e) {
    next(e)
  }
}

module.exports = {
  getTechQuestions,
  getTheoryQuestions,
  postResult,
}
