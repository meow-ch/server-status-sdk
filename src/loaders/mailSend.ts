import { LoadDictElement } from 'di-why/build/src/DiContainer';
import { Transporter } from 'nodemailer';
import mailSendGen, { SendMail, SendMailGenerator } from '../utils/mailSend';
import { MailConfig } from './mailConfig';
import { TransporterConfig } from './mailTransporterConfig';

type MailFactoryParams = { mailConfig: MailConfig }
  & { mailSendGen: SendMailGenerator; }
  & { transporter: Transporter; }
  & { transporterConfig: TransporterConfig; };

const loadDictElement: LoadDictElement<SendMail> = {

  factory: function ({
    transporter,
    mailConfig: { defaultFromName, commaSeparatedToAddresses },
    transporterConfig: { user }
  }: MailFactoryParams) {

    return mailSendGen({
      user: user,
      defaultFromName,
      commaSeparatedToAddresses,
      transporter,
    });

  },

  deps: {
    mailSendGen,
  },

  locateDeps: {
    mailConfig: 'mailConfig',
    transporter: 'mailTransporter',
    transporterConfig: 'mailTransporterConfig',
  },

};

export default loadDictElement;