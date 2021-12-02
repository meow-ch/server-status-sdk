import { LoadDictElement } from "di-why/build/src/DiContainer";

type LoggerInterface = {
  log: (...args: any[]) => void;
}

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