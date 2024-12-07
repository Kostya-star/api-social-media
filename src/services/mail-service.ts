import nodemailer from 'nodemailer';

export class MailService {
  transport = nodemailer.createTransport({
    service: 'Mail.ru',
    auth: {
      user: process.env.MAIL_SENDER_NAME,
      pass: process.env.MAIL_SENDER_PASSWORD,
    },
  });

  async sendMail(from: string, to: string, subject: string, message: string) {
    return await this.transport.sendMail({
      from,
      to,
      subject,
      html: message,
    });
  }
}
