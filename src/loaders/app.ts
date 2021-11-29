import express from 'express';
import { LoadDictElement } from 'di-why/build/src/DiContainer';

const app = express();

export type Application = typeof app;

const loadDictElement: LoadDictElement<Application> = {
  instance: app,
  async after({ me, deps }) {
    const { appConfig, logger, templateHydratorService, statusCheckService } = deps;
    const { port, path, siteTitle } = appConfig;

    me.listen({ port }, () => {
      logger.log(' STATUS_CHECK = STATUS_CHECK = STATUS_CHECK = STATUS_CHECK = STATUS_CHECK = STATUS_CHECK');
      logger.log(` STATUS_CHECK = App: localhost:${port}${path} = STATUS_CHECK`); 
      logger.log(' STATUS_CHECK = STATUS_CHECK = STATUS_CHECK = STATUS_CHECK = STATUS_CHECK = STATUS_CHECK');
    });

    // status check path
    me.get(path, async function (req, res) {
      const viewData = {
        secondsBeforeAutoRefresh: statusCheckService.checkInterval,
        siteTitle,
        statusInfo: statusCheckService.getStatusStats()
      };
      const templatePath = `${__dirname}/../../src/views/status.html`;
      const templateData = await templateHydratorService.loadViewTemplate(viewData, templatePath);
      const body = templateHydratorService.hydrateView(templateData);
      res.send(body);
    });

    // serve static files
    const staticFilesDir = `${__dirname}/../../public`;
    me.use(express.static(staticFilesDir));
  },

  locateDeps: {
    logger: 'logger',
    appConfig: 'appConfig',
    templateHydratorService: 'templateHydratorService',
    statusCheckService: 'statusCheckService',
  },
};

export default loadDictElement;