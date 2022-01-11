import { LoadDictElement } from 'di-why/build/src/DiContainer';
import { getKeyOrThrow } from 'swiss-army-knifey';

export type MailConfig = {
  defaultFromName: string;
  commaSeparatedAdminAddresses: string;
  commaSeparatedToAddresses: string;
}

const loadDictElement: LoadDictElement<MailConfig> = {
  instance: {
    defaultFromName: getKeyOrThrow(process.env, 'MAIL_FROM_NAME', 'John Hoo'),
    commaSeparatedAdminAddresses: getKeyOrThrow(process.env, 'MAIL_ADMIN_TO_COMMA_LIST', 'Ex: "Some Name" <some@web.com>,"Othern Name" <other@web.com>'),
    commaSeparatedToAddresses: getKeyOrThrow(process.env, 'MAIL_TO_COMMA_LIST', 'Ex: "Some Name" <some@web.com>,"Othern Name" <other@web.com>'),
  },
};

export default loadDictElement;