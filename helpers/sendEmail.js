const sgMail = require("@sendgrid/mail");

const { SENDGRID_API_KEY, SENDGRID_FROM_EMAIL, PORT = 3001 } = process.env;
const BASE_URL = `http://localhost:${PORT}/api`;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (userEmail, verifToken) => {
  try {
    const email = {
      to: userEmail,
      from: `${SENDGRID_FROM_EMAIL}`,
      subject: "Verifying new email - WALLET",
      html: `<h1>Email Confirmation</h1>
             <p>Thank you for registration!</p>
             <p>Please confirm your email by clicking on the following link: </p>
             <a href="${BASE_URL}/users/verify/${verifToken}">Click here</a>`,
    };
    await sgMail.send(email);
    return true;
  } catch (error) {
    return error;
  }
};

module.exports = sendEmail;
