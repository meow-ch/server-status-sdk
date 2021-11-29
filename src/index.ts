import di from './loaders';
import StatusCheckService from './services/StatusCheckService';

try {
  (async function () {
    try {

      await di.loadAll();

      const statusCheckService = await di.get<StatusCheckService>('statusCheckService');
      statusCheckService.run();

    } catch (err) {
      throw err;
    }
  })();
} catch (err) {
  throw err;
}
