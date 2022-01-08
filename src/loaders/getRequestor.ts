import https from 'https';
import http from 'http';
import { LoadDictElement } from 'di-why/build/src/DiContainer';


type GetRequestorResolveParam = { data: string; response: { rawHeaders: string[]; headers: { [k: string]: string | string[] | undefined; } } };
type GetRequestor = (uri: string, options?: https.RequestOptions) => Promise<GetRequestorResolveParam>;

const loadDictElement: LoadDictElement<GetRequestor> = {
  factory: ({ getHttps, getHttp }: { getHttps: typeof https.get, getHttp: typeof http.get }) => {
    return async function (uri: string, options?: https.RequestOptions) {
      return new Promise(function (resolve: (res: GetRequestorResolveParam) => void, reject: (err: Error) => void){
        const get = uri.match(/^https:\/\//g) !== null ? getHttps : getHttp;
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
    getHttps: https.get,
    getHttp: http.get,
  },
};

export default loadDictElement;