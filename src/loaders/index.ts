import './env';

import DiContainer from 'di-why';

import app from './app';
import appConfig from './appConfig';
import determineStatus from './determineStatus'
import events from './events';
import getRequestor from './getRequestor';
import loggerDict, { logger } from './logger'
import MISSING_REF_VALUE_REPLACEMENT from './MISSING_REF_VALUE_REPLACEMENT';
import missingRefValueReplacementCallback from './missingRefValueReplacementCallback';
import mostachito from './mostachito';
import notifyAll from './notifyAll';
import sendMail from './sendMail';
import sendSMS from './sendSMS';
import SSC_ENV from './SSC_ENV';
import SSC_USER_PROJECT_ROOT_DIR from './SSC_USER_PROJECT_ROOT_DIR';
import statusCheckService from './statusCheckService';
import templateHydratorService from './templateHydratorService';

const injectionDict = {
  app,
  appConfig,
  determineStatus,
  events,
  getRequestor,
  logger: loggerDict,
  MISSING_REF_VALUE_REPLACEMENT,
  missingRefValueReplacementCallback,
  mostachito,
  notifyAll,
  sendMail,
  sendSMS,
  SSC_ENV,
  SSC_USER_PROJECT_ROOT_DIR,
  statusCheckService,
  templateHydratorService,
};

const di = new DiContainer({ logger, load: injectionDict });

export default di;