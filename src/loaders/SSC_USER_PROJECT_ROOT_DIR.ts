import 'dotenv/config';
import { LoadDictElement } from 'di-why/build/src/DiContainer';
import path from 'path';

const loadDictElement: LoadDictElement<string> = {
  factory: function ({ SSC_ENV }) {
    const userProjectRootDir = SSC_ENV == 'clone'
      ? `${__dirname}/../..` // when git cloned, the root is two dirs appart from ./loaders
      : `${__dirname}/../../../..`; // when installed via npm i, it will be 5 dirs appart (within user_root/node_modules/server-status-check/build/loaders/)
    return path.resolve(userProjectRootDir);
  },
  locateDeps: {
    SSC_ENV: 'SSC_ENV',
  }
};

export default loadDictElement;