import 'dotenv/config';
import { LoadDictElement } from 'di-why/build/src/DiContainer';
import { existsDir } from 'swiss-army-knifey';
import moduleOrClonedRepo from 'swiss-army-knifey/build/src/utils/moduleOrClonedRepo';

const loadDictElement: LoadDictElement<Promise<string>> = {
  factory: async function checkIfInstalledViaNpmI() {
    return await moduleOrClonedRepo.isWithinNodeModuleOrClonedRepo(__dirname, existsDir);
  },
};
export default loadDictElement;