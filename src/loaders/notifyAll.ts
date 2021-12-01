import { LoadDictElement } from 'di-why/build/src/DiContainer';
import { SentMessageInfo } from 'nodemailer';
import { SendMail } from "../utils/mailSend";

type SendSMS = (from: string, text: string) => Promise<string[]>;

type NotifyMessage = { subject: string; text: string; };
type NotifyAll = (conf: { sms: NotifyMessage, email: NotifyMessage; }) => Promise<[string[], SentMessageInfo]>;

const loadDictElement: LoadDictElement<NotifyAll> = {
  factory: function ({ sendSMS, mailSend }: { sendSMS: SendSMS; mailSend: SendMail; }) {
    return async function ({ sms, email: mailOptions }: { sms: NotifyMessage, email: NotifyMessage; }) {
      try {
        const sendMailPromise = mailSend(mailOptions);
        const sendSmsPromise = sendSMS(sms.subject, sms.text);
        return Promise.all([sendSmsPromise, sendMailPromise]);
      } catch (err) {
        console.log('Mail or SMS were not sent');
        throw err;
      }
    }
  },
  locateDeps: {
    sendSMS: 'sendSMS',
    mailSend: 'mailSend',
  }
};

export default loadDictElement;