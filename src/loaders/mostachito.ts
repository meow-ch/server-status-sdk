
import { LoadDictElement, GetInstanceType } from 'di-why/build/src/DiContainer';
import Mostachito from 'mostachito';

const loadDictElement: LoadDictElement<GetInstanceType<typeof Mostachito>> = {
  factory: ({ missingRefValueReplacementCallback }) => {
    return new Mostachito(missingRefValueReplacementCallback);
  },
  locateDeps: {
    missingRefValueReplacementCallback: 'missingRefValueReplacementCallback',
  }
};

export default loadDictElement;
