import Nexmo from 'nexmo';
import Logger from 'saylo';

type NexmoInstance = { message: { sendSms: (from: string, to: string, text: string, options: { type: string; }, cb: (err: Error, res: string) => void) => void }; };

export default (apiKey: string, apiSecret: string, toList: string[], logger: Logger) => async function (from: string, text: string) {
  const nexmo = new Nexmo({ apiKey, apiSecret }, { debug: true }) as unknown as NexmoInstance;
  return await Promise.all(toList.map(to => {
    logger.log('to', to);
    logger.log('from', from);
    logger.log('text', text);
    return new Promise(function (resolve: (res: string) => void, reject: (err: Error) => void) {
      nexmo.message.sendSms(from, to, text, { type: 'unicode' }, (err: Error, res: string) => {
        if (err) {
          reject(err);
          return;
        }
        logger.log(res);
        resolve(res);
      });
    });
  }));
}