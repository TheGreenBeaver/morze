const nodemailer = require('nodemailer');
const { dummyResolve, getVar, isDev } = require('../util/misc');


function sendMail(content, email) {
  if (isDev()) {
    console.log({
      email,
      content
    });
    return dummyResolve();
  }

  const user = getVar('MAIL_USER');
  const pass = getVar('MAIL_PASS');
  const service = getVar('MAIL_SERVICE', 'gmail');
  const transporter = nodemailer.createTransport({ service, auth: { user, pass } });
  const message = {
    from: 'noreply@morze.com',
    to: email,
    ...content
  };

  return transporter.sendMail(message);
}

module.exports = {
  sendMail,
};