import Nexmo from 'nexmo';

type NexmoInstance = { message: { sendSms: (from: string, to: string, text: string, options: { type: string; }, cb: (err: Error, res: string) => void) => void }; };

export default (apiKey: string, apiSecret: string, toList: string[]) => async function (from: string, text: string) {
  const nexmo = new Nexmo({ apiKey, apiSecret }, { debug: true }) as unknown as NexmoInstance;
  return await Promise.all(toList.map(to => {
    console.log('to', to);
    console.log('from', from);
    console.log('text', text);
    return new Promise(function (resolve: (res: string) => void, reject: (err: Error) => void) {
      nexmo.message.sendSms(from, to, text, { type: 'unicode' }, (err: Error, res: string) => {
        if (err) {
          reject(err);
          return;
        }
        console.log(res);
        resolve(res);
      });
    });
  }));
}