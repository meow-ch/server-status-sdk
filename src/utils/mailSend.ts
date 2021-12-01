import { SentMessageInfo, Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

export type SendMailGenConfig = { defaultFromName: string, user: string, commaSeparatedToAddresses?: string; transporter: Transporter };

export const sendMailGen = ({ defaultFromName, user, commaSeparatedToAddresses, transporter }: SendMailGenConfig) => async function mailSend(mailOptions: Mail.Options): Promise<SentMessageInfo> {
  const finalMailOptions = {
    from: `"${defaultFromName}️" <${user}>`,
    to: commaSeparatedToAddresses || undefined,
    ...mailOptions,
  };
  try {
    return await new Promise((resolve: (value: unknown) => void, reject: (reason?: any) => void) => {
      transporter.sendMail(finalMailOptions, function (err, info) {
        if (err) reject(err);
        resolve(info);
      });
    });
  } catch (e) {
    throw e;
  }
}

export type SendMailGenerator = typeof sendMailGen;
export type SendMail = ReturnType<SendMailGenerator>;

export default sendMailGen;