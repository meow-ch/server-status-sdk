import appConfig from '../config/appConfig';
import { LoadDictElement } from 'di-why/build/src/DiContainer';

export type AppConfig = typeof appConfig;

const loadDictElement: LoadDictElement<AppConfig> = {
  instance: appConfig
};

export default loadDictElement;
