import 'dotenv/config';
import { LoadDictElement } from 'di-why/build/src/DiContainer';

const loadDictElement: LoadDictElement<string> = {
  instance: process.env.MISSING_REF_VALUE_REPLACEMENT || '<strong style="color: red;">THIS_IS_A_DUMMY_VAL_FOR_A_MISSING_REF</strong>',
};
export default loadDictElement;