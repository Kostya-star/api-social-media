import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  service: 'Mail.ru',
  auth: {
    user: process.env.MAIL_SENDER_NAME,
    pass: process.env.MAIL_SENDER_PASSWORD,
  },
});

const sendMail = async (from: string, to: string, subject: string, message: string) => {
  return await transport.sendMail({
    from,
    to,
    subject,
    html: message,
  });
};

export default {
  sendMail,
};
