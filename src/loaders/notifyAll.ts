import { LoadDictElement } from 'di-why/build/src/DiContainer';
import { SentMessageInfo } from 'nodemailer';
import Logger from 'saylo';
import { SendMail } from "../utils/mailSend";

type SendSMS = (from: string, text: string) => Promise<string[]>;

type NotifyMessage = { subject: string; text: string; };
type NotifyAll = (conf: { sms: NotifyMessage, email: NotifyMessage; }) => Promise<[string[], SentMessageInfo]>;

type NotifyAllProps = { sendSMS: SendSMS; mailSend: SendMail; logger: Logger; };

const loadDictElement: LoadDictElement<NotifyAll> = {
  factory: function ({ sendSMS, mailSend, logger }: NotifyAllProps) {
    return async function ({ sms, email: mailOptions, }: { sms: NotifyMessage, email: NotifyMessage; }) {
      try {
        const mailSendPromise = mailSend(mailOptions);
        const sendSmsPromise = sendSMS(sms.subject, sms.text);
        return Promise.all([sendSmsPromise, mailSendPromise]);
      } catch (err) {
        logger.log('Mail or SMS were not sent');
        throw err;
      }
    }
  },
  locateDeps: {
    sendSMS: 'sendSMS',
    mailSend: 'mailSend',
    logger: 'logger'
  }
};

export default loadDictElement;