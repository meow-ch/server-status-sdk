import { LoadDictElement } from 'di-why/build/src/DiContainer';
import { getKeyOrThrow } from 'swiss-army-knifey';

export type TransporterConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
}

const loadDictElement: LoadDictElement<TransporterConfig> = {
  instance: {
    host: getKeyOrThrow(process.env, 'MAIL_SMTP_HOST', 'Ex: mail.infomaniak.com'),
    port: parseInt(getKeyOrThrow(process.env, 'MAIL_SMTP_PORT', 'Ex: 465')),
    user: getKeyOrThrow(process.env, 'MAIL_USER', 'Ex: my@mail.com'),
    pass: getKeyOrThrow(process.env, 'MAIL_PASSWORD', 'Ex: password123'),
  },
};

export default loadDictElement;