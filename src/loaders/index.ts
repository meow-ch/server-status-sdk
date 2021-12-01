import './env';

import DiContainer from 'di-why';

import app from './app';
import appConfig from './appConfig';
import determineStatus from './determineStatus'
import events from './events';
import getRequestor from './getRequestor';
import loggerDict, { logger } from './logger'
import MISSING_REF_VALUE_REPLACEMENT from './SSC_USER_CHECK_FILE_ROOT_RELATIVE_PATH';
import missingRefValueReplacementCallback from './missingRefValueReplacementCallback';
import mostachito from './mostachito';
import notifyAll from './notifyAll';
import sendSMS from './sendSMS';
import SSC_ENV from './SSC_ENV';
import SSC_USER_PROJECT_ROOT_DIR from './SSC_USER_PROJECT_ROOT_DIR';
import SSC_USER_CHECK_FILE_ROOT_RELATIVE_PATH from './SSC_USER_CHECK_FILE_ROOT_RELATIVE_PATH';
import statusCheckService from './statusCheckService';
import templateHydratorService from './templateHydratorService';
import mailConfig from './mailConfig';
import mailTransporterConfig from './mailTransporterConfig';
import mailTransporter from './mailTransporter';
import mailSend from './mailSend';

const injectionDict = {
  app,
  appConfig,
  determineStatus,
  events,
  getRequestor,
  logger: loggerDict,
  mailConfig,
  mailSend,
  mailTransporter,
  mailTransporterConfig,
  MISSING_REF_VALUE_REPLACEMENT,
  missingRefValueReplacementCallback,
  mostachito,
  notifyAll,
  sendSMS,
  SSC_ENV,
  SSC_USER_PROJECT_ROOT_DIR,
  SSC_USER_CHECK_FILE_ROOT_RELATIVE_PATH,
  statusCheckService,
  templateHydratorService,
};

const di = new DiContainer({ logger, load: injectionDict });

export default di;