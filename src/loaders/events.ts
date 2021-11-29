import { LoadDictElement } from "di-why/build/src/DiContainer";
import { LoggerInterface } from "saylo/build/src/Logger";

const loadDictElement: LoadDictElement = {
  factory({ logger }: { logger: LoggerInterface }) {
    const events = {
      emit(...params: any[]) {
        logger.log(params);
      },
    };
    return events;
  },
  locateDeps: {
    logger: 'logger',
  },
};

export default loadDictElement;