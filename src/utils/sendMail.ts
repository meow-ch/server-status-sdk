import Mail from "nodemailer/lib/mailer";

export default (transport: Mail) => (toList: string[], from: string) => async function (subject: string, text: string) {
  return await Promise.all(toList.map(async to => {
    const mailOptions = {
      from,
      to,
      subject,
      text,
    };
    try {
      return await transport.sendMail(mailOptions);
    } catch (err) {
      console.log('Mail was not sent');
      throw err;
    }
  }));
}