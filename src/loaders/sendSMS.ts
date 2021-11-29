
import { LoadDictElement } from 'di-why/build/src/DiContainer';
import sendSMS from '../utils/sendSMS';

const loadDictElement: LoadDictElement<(from: string, text: string) => Promise<string[]>> = {
  factory: function ({ apiKey, apiSecret, toCommaList }: { apiKey: string; apiSecret: string; toCommaList: string; }) {
    return sendSMS(apiKey, apiSecret, toCommaList.split(','));
  },
  deps: {
    toCommaList: process.env.SMS_TO,
    apiKey: process.env.SMS_NEXMO_API_KEY,
    apiSecret: process.env.SMS_NEXMO_API_SECRET,
  },
};

export default loadDictElement;