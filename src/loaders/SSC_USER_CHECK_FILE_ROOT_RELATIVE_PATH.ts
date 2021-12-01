import 'dotenv/config';
import { LoadDictElement } from 'di-why/build/src/DiContainer';

const loadDictElement: LoadDictElement<string> = {
  instance: process.env.SSC_USER_CHECK_FILE_ROOT_RELATIVE_PATH || 'build', // the path relative to user project root, where the user has his check.js compiled
};
export default loadDictElement;