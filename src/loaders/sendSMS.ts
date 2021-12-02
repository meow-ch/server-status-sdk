
import { LoadDictElement } from 'di-why/build/src/DiContainer';
import Logger from 'saylo';
import sendSMS from '../utils/sendSMS';

type SendSMSFactoryProps = { apiKey?: string; apiSecret?: string; toCommaList?: string; logger: Logger; };

const loadDictElement: LoadDictElement<(from: string, text: string) => Promise<string[]>> = {
  factory: function ({ apiKey, apiSecret, toCommaList, logger}: SendSMSFactoryProps) {
    if (!toCommaList || toCommaList.length <= 3 || !apiKey || !apiSecret) {
      return async (_: string, __: string) => {
        const res = 'No phone number | apiKey | apiSecret provided, skipping SMS sending.';
        logger.log(res);
        return [res];
      };
    }
    return sendSMS(apiKey, apiSecret, toCommaList.split(','), logger);
  },
  deps: {
    toCommaList: process.env.SMS_TO,
    apiKey: process.env.SMS_NEXMO_API_KEY,
    apiSecret: process.env.SMS_NEXMO_API_SECRET,
  },
  locateDeps: {
    logger: 'logger',
  }
};

export default loadDictElement;