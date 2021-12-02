import fs from 'fs';
import { LoadDictElement } from 'di-why/build/src/DiContainer';
import { existsDir } from 'swiss-army-knifey/build/src/utils/promiseFs';
import { Env, GetRequestor, Status } from '../requestor';
import Logger from 'saylo';

type DetermnineStatusFactoryProps = { getRequestor: GetRequestor; SSC_USER_PROJECT_ROOT_DIR: string ;SSC_USER_CHECK_FILE_ROOT_RELATIVE_PATH: string, SSC_ENV: string; logger: Logger; env: Env};

const loadDictElement: LoadDictElement<Promise<() => Promise<Status>>> = {
  factory: async function ({
    getRequestor,
    SSC_USER_PROJECT_ROOT_DIR,
    SSC_ENV,
    SSC_USER_CHECK_FILE_ROOT_RELATIVE_PATH,
    logger,
    env,
  }: DetermnineStatusFactoryProps) {
    const statusCheckScriptsDir = `${SSC_USER_PROJECT_ROOT_DIR}/${SSC_USER_CHECK_FILE_ROOT_RELATIVE_PATH}`;
    const filename = 'check.js'
    const filepath = `${statusCheckScriptsDir}/${filename}`;
    try {
      if (!await existsDir(statusCheckScriptsDir) || !fs.existsSync(filepath)) {
        throw new Error(`You must create a file in your project root under "${filepath}". SSC_USER_PROJECT_ROOT_DIR is: "${SSC_USER_PROJECT_ROOT_DIR}", SSC_ENV is: "${SSC_ENV}"`);
      }
      const checkFactory = await import(filepath);
      return checkFactory.default({ getRequestor, logger, env });
    } catch(err) {
      logger.log('ERROR: ', err);
      throw err;
    }
  },
  locateDeps: {
    getRequestor: 'getRequestor',
    SSC_USER_PROJECT_ROOT_DIR: 'SSC_USER_PROJECT_ROOT_DIR',
    SSC_USER_CHECK_FILE_ROOT_RELATIVE_PATH: 'SSC_USER_CHECK_FILE_ROOT_RELATIVE_PATH',
    SSC_ENV: 'SSC_ENV',
    logger: 'logger',
    env: 'env',
  }
};

export default loadDictElement;