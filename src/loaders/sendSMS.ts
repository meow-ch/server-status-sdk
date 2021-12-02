import { LoadDictElement } from 'di-why/build/src/DiContainer';
import Nexmo from 'nexmo';
import Logger from 'saylo';
import sendSMS, { NexmoInstance, NexmoInstanceGen } from 'swiss-army-knifey/build/src/utils/sendSMS';

type SendSMSFactoryProps = { apiKey?: string; apiSecret?: string; toCommaList?: string; logger: Logger; getNexmoInstance: NexmoInstanceGen };

const loadDictElement: LoadDictElement<(from: string, text: string) => Promise<string[]>> = {
  factory: function ({ apiKey, apiSecret, toCommaList, logger, getNexmoInstance }: SendSMSFactoryProps) {
    if (!toCommaList || toCommaList.length <= 3 || !apiKey || !apiSecret) {
      return async (_: string, __: string) => {
        const res = 'No phone number | apiKey | apiSecret provided, skipping SMS sending.';
        logger.log(res);
        return [res];
      };
    }
    return sendSMS(apiKey, apiSecret, toCommaList.split(','), logger, getNexmoInstance);
  },
  deps: {
    toCommaList: process.env.SMS_TO,
    apiKey: process.env.SMS_NEXMO_API_KEY,
    apiSecret: process.env.SMS_NEXMO_API_SECRET,
    getNexmoInstance: (a: { apiKey: string; apiSecret: string; }, b: { debug: boolean; }) =>  new Nexmo(a, b) as unknown as NexmoInstance
  },
  locateDeps: {
    logger: 'logger',
  }
};

export default loadDictElement;