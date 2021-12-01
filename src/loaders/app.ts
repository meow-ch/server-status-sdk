import express from 'express';
import path from 'path';
import { LoadDictElement } from 'di-why/build/src/DiContainer';

export type Application = ReturnType<typeof express>;

const loadDictElement: LoadDictElement<Application> = {
  instance: express(),
  async after({ me, deps }) {
    const { appConfig, logger, templateHydratorService, statusCheckService } = deps;
    const { port, path: pathConf, siteTitle } = appConfig;

    me.listen({ port }, () => {
      logger.log(' STATUS_CHECK = STATUS_CHECK = STATUS_CHECK = STATUS_CHECK = STATUS_CHECK = STATUS_CHECK');
      logger.log(` STATUS_CHECK = App: localhost:${port}${pathConf} = STATUS_CHECK`);
      logger.log(' STATUS_CHECK = STATUS_CHECK = STATUS_CHECK = STATUS_CHECK = STATUS_CHECK = STATUS_CHECK');
    });

    // status check path
    me.get(pathConf, async function (req, res) {
      const viewData = {
        secondsBeforeAutoRefresh: statusCheckService.checkInterval,
        siteTitle,
        statusInfo: statusCheckService.getStatusStats()
      };
      const templatePath = path.normalize(path.join(__dirname, `../../../src/views/status.html`));
      const templateData = await templateHydratorService.loadViewTemplate(viewData, templatePath);
      const body = templateHydratorService.hydrateView(templateData);
      res.send(body);
    });

    // serve static files
    const normalizedPublicDirPath = path.normalize(path.join(__dirname, `../../../public`));
    me.use(express.static(normalizedPublicDirPath) as any);
  },

  locateDeps: {
    logger: 'logger',
    appConfig: 'appConfig',
    templateHydratorService: 'templateHydratorService',
    statusCheckService: 'statusCheckService',
  },
};

export default loadDictElement;