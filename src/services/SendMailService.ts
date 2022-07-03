import fs from 'fs';
import { resolve } from 'path';
import nodemailer, { Transporter } from 'nodemailer';
import handlebars from 'handlebars';

class SendMailService {
  private client: Transporter;

  constructor() {
    nodemailer.createTestAccount().then((account) => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });

      this.client = transporter;
    });
  }

  async execute(to: string, subject: string, body: string) {
    const templateMailPath = resolve(
      __dirname,
      '..',
      'views',
      'emails',
      'npsMail.hbs'
    );

    const templateMailContent = fs
      .readFileSync(templateMailPath)
      .toString('utf8');

    const templateMailParsed = handlebars.compile(templateMailContent);

    const html = templateMailParsed({
      name: to,
      title: subject,
      description: body,
    });

    const message = await this.client.sendMail({
      to,
      subject,
      html,
      from: 'NPS <noreply@nps.com.br>',
    });

    console.log('Message sent: %s', message.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }
}

export default new SendMailService();
