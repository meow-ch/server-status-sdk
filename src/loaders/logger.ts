import 'dotenv/config';
import Logger, { logger } from 'saylo'
import { LoadDictElement, GetInstanceType } from 'di-why/build/src/DiContainer';

export { logger };

const loadDictElement: LoadDictElement<GetInstanceType<typeof Logger>> = {
  constructible: Logger,
  deps: {
    log: (process.env.LOGGER_LOG && process.env.LOGGER_LOG == '1') ? true : false,
    debug: (process.env.LOGGER_DEBUG && process.env.LOGGER_DEBUG == '1') ? true : false,
  },
};

export default loadDictElement;
