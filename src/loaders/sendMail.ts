import * as nodemailer from "nodemailer";
import sendMail from '../utils/sendMail';
import { LoadDictElement } from 'di-why/build/src/DiContainer';
import Mail from "nodemailer/lib/mailer";

type SendMail = (subject: string, text: string) => Promise<nodemailer.SentMessageInfo>;

const loadDictElement: LoadDictElement<SendMail> = {
  factory: function ({ nm, sendMail }: { nm: typeof nodemailer; sendMail: (transport: Mail) => (toList: string[], from: string) => SendMail; }) {
    const transport = nm.createTransport(
      `smtps://${process.env.MAIL_USERNAME}:${process.env.MAIL_PASSWORD}@smtp.gmail.com`,
    );

    const curriedSendMail = sendMail(transport)(process.env.MAIL_TO!.split(','), process.env.MAIL_FROM!);
    return curriedSendMail;
  },
  deps: {
    nm: nodemailer,
    sendMail,
  }
};

export default loadDictElement;