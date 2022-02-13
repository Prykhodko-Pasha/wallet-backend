const Mailgen = require('mailgen')
const sgMail = require('@sendgrid/mail')
const config = require('../config/email.json')
require('dotenv').config()

class EmailService {
  #sender = sgMail
  #GenerateTemplate = Mailgen
  constructor(env) {
    switch (env) {
      case 'development':
        this.link = config.dev
        break
      case 'stage':
        this.link = config.stage
        break
      case 'production':
        this.link = config.prod
        break
      default:
        this.link = config.dev
        break
    }
  }

  #createTemplate(verificationToken, name = 'Guest') {
    const mailGenerator = new this.#GenerateTemplate({
      theme: 'cerberus',
      product: {
        name: 'Contacts',
        link: this.link,
      },
    })
    const template = {
      body: {
        name,
        intro: 'Need Verification for QA TEST WEB APP',
        action: {
          instructions: 'To finish verification click the button below:',
          button: {
            color: '#22BC66',
            text: 'Confirm your account',
            link: `${this.link}/users/verify/${verificationToken}`,
          },
        },
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    }
    return mailGenerator.generate(template)
  }

  async sendEmail(verificationToken, email) {
    const emailBody = this.#createTemplate(verificationToken)
    this.#sender.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
      to: email,
      from: 'freedom277f@gmail.com',
      subject: 'Verification profile on QA TEST WEBAPP',
      html: emailBody,
    }
    await this.#sender.send(msg)
  }
}

module.exports = EmailService
