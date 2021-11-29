import https from 'https';
import { LoadDictElement } from 'di-why/build/src/DiContainer';


type GetRequestorResolveParam = { data: string; response: { rawHeaders: string[]; headers: { [k: string]: string | string[] | undefined; } } };
type GetRequestor = (uri: string, options?: https.RequestOptions) => Promise<GetRequestorResolveParam>;

const loadDictElement: LoadDictElement<GetRequestor> = {
  factory: ({ get }: { get: typeof https.get}) => {
    return async function (uri: string, options?: https.RequestOptions) {
      return new Promise(function (resolve: (res: GetRequestorResolveParam) => void, reject: (err: Error) => void){
        get(uri, options || {}, (resp) => {
          let data = '';
          // A chunk of data has been recieved.
          resp.on('data', (chunk) => {
            data += chunk;
          });
          // The whole response has been received. Print out the result.
          resp.on('end', () => {
            resolve({ data, response: resp });
          });
        }).on("error", (err) => {
          reject(err);
        });
      });
    }
  },
  deps: {
    get: https.get,
  },
};

export default loadDictElement;