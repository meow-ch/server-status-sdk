import { LoadDictElement } from 'di-why/build/src/DiContainer';

type MissingRefValueReplacementCallback = (ref: string) => string;
const loadDictElement: LoadDictElement<MissingRefValueReplacementCallback> = {
  factory: function ({ replaceWith, logger }) {
    return (ref: string): string => {
      logger.log(`Warning - Missing ref: ${ref}` );
      return `${replaceWith}`;
    };
  },
  locateDeps: {
    replaceWith: 'MISSING_REF_VALUE_REPLACEMENT',
    logger: 'logger',
  }
};

export default loadDictElement;
