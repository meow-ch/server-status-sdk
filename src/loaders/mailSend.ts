import { LoadDictElement } from 'di-why/build/src/DiContainer';
import { Transporter } from 'nodemailer';
import sendMailGen, { SendMail, SendMailGenerator } from '../utils/mailSend';
import { MailConfig } from './mailConfig';
import { TransporterConfig } from './mailTransporterConfig';

type MailFactoryParams = { mailConfig: MailConfig }
  & { sendMailGen: SendMailGenerator; }
  & { transporter: Transporter; }
  & { transporterConfig: TransporterConfig; };

const loadDictElement: LoadDictElement<SendMail> = {

  factory: function ({ transporter, mailConfig: { defaultFromName, commaSeparatedToAddresses }, transporterConfig: { user } }: MailFactoryParams) {
    return sendMailGen({
      user: user,
      defaultFromName,
      commaSeparatedToAddresses,
      transporter,
    });
  },
  deps: {
    sendMailGen,
  },
  locateDeps: {
    mailConfig: 'mailConfig',
    transporter: 'mailTransporter',
    transporterConfig: 'mailTransporterConfig',
  },

};

export default loadDictElement;