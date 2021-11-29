import fs from 'fs';
import { LoadDictElement } from 'di-why/build/src/DiContainer';
import { existsDir } from '../utils/promiseFs';
import { GetRequestor, Status } from '../requestor';

const loadDictElement: LoadDictElement<Promise<() => Promise<Status>>> = {
  factory: async function ({ getRequestor, SSC_USER_PROJECT_ROOT_DIR, SSC_ENV }: { getRequestor: GetRequestor; SSC_USER_PROJECT_ROOT_DIR: string; SSC_ENV: string; }) {
    const statusCheckScriptsDir = `${SSC_USER_PROJECT_ROOT_DIR}/build`;
    const filename = 'check.js'
    const filepath = `${statusCheckScriptsDir}/${filename}`;
    try {
      if (!await existsDir(statusCheckScriptsDir) || !fs.existsSync(filepath)) {
        throw new Error(`You must create a file in your project root under "${filepath}". SSC_USER_PROJECT_ROOT_DIR is: "${SSC_USER_PROJECT_ROOT_DIR}", SSC_ENV is: "${SSC_ENV}"`);
      }
      const checkFactory = await import(filepath);
      return checkFactory.default({ getRequestor });
    } catch(err) {
      console.log('ERROR: ', err);
      throw err;
    }
  },
  locateDeps: {
    getRequestor: 'getRequestor',
    SSC_USER_PROJECT_ROOT_DIR: 'SSC_USER_PROJECT_ROOT_DIR',
    SSC_ENV: 'SSC_ENV',
  }
};

export default loadDictElement;