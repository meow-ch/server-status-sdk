import * as nodemailer from "nodemailer";
import { LoadDictElement } from 'di-why/build/src/DiContainer';

type SendMail = (subject: string, text: string) => Promise<nodemailer.SentMessageInfo>;
type SendSMS = (from: string, text: string) => Promise<string[]>;

type NotifyMessage = { subject: string; text: string; };
type NotifyAll = (conf: { sms: NotifyMessage, email: NotifyMessage; }) => Promise<[string[], nodemailer.SentMessageInfo]>;

const loadDictElement: LoadDictElement<NotifyAll> = {
  factory: function ({ sendSMS, sendMail }: { sendSMS: SendSMS; sendMail: SendMail; }) {
    return async function (conf: { sms: NotifyMessage, email: NotifyMessage; }) {
      try {
        return Promise.all([sendSMS(conf.sms.subject, conf.sms.text), sendMail(conf.email.subject, conf.email.text)]);
      } catch (err) {
        console.log('Mail or SMS were not sent');
        throw err;
      }
    }
  },
  locateDeps: {
    sendSMS: 'sendSMS',
    sendMail: 'sendMail',
  }
};

export default loadDictElement;