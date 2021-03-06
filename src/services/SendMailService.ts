import fs from 'fs';
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

  async execute(
    to: string,
    subject: string,
    context: object,
    templateFilePath: string
  ) {
    const templateMailContent = fs
      .readFileSync(templateFilePath)
      .toString('utf8');

    const templateMailParsed = handlebars.compile(templateMailContent);

    const html = templateMailParsed(context);

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
