import { LoadDictElement } from 'di-why/build/src/DiContainer';
import nodemailer, { Transporter } from 'nodemailer'

type CreateTransport = typeof nodemailer.createTransport;
const loadDictElement: LoadDictElement<Transporter> = {
  factory: function ({ createTransport, transporterConfig }: { createTransport: CreateTransport; transporterConfig: { host: string; port: number; user: string; pass: string; }}) {
    const { host, port, user, pass } = transporterConfig;
    return createTransport({
      host,
      port,
      secure: true,
      auth: {
        user,
        pass,
      }
    });
  },
  locateDeps: {
    transporterConfig: 'mailTransporterConfig',
  },
  deps: {
    createTransport: nodemailer.createTransport.bind(nodemailer),
  }
};

export default loadDictElement;