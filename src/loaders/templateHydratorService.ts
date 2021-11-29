import TemplateHydratorService from './../services/TemplateHydratorService';
import { LoadDictElement } from 'di-why/build/src/DiContainer';

const loadDictElement: LoadDictElement<TemplateHydratorService> = {
  constructible: TemplateHydratorService,
  locateDeps: {
    mostachito: 'mostachito',
  }
};

export default loadDictElement;
