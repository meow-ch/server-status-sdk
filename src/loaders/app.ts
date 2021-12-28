import express from 'express';
import path from 'path';
import { LoadDictElement } from 'di-why/build/src/DiContainer';
// import Logger from 'saylo';
// import StatusCheckService from '../services/StatusCheckService';
// import TemplateHydratorService from '../services/TemplateHydratorService';
// import { AppConfig } from './appConfig';

export type Application = ReturnType<typeof express>;
// type ExpressInitDeps = {}
//   & { appConfig: AppConfig; }
//   & { logger: Logger; }
//   & { templateHydratorService: TemplateHydratorService; }
//   & { statusCheckService: StatusCheckService; }

// type AfterCallbackProps = { me: Application, deps: ExpressInitDeps };

const loadDictElement: LoadDictElement<Application> = {
  instance: express(),
  async after({ me, deps: { appConfig, logger, templateHydratorService, statusCheckService } }) {
    const { port, path: pathConf, siteTitle } = appConfig;

    me.listen({ port }, () => {
      logger.log(' ===========================================================================================');
      logger.log(' | STATUS_CHECK = STATUS_CHECK = STATUS_CHECK = STATUS_CHECK = STATUS_CHECK = STATUS_CHECK  |');
      logger.log(' | ---------------------------------------------------------------------------------------- |');
      logger.log(` | STATUS_CHECK =        App: http://localhost:${port}${pathConf}        = STATUS_CHECK |`);
      logger.log(' | ---------------------------------------------------------------------------------------- |');
      logger.log(' | STATUS_CHECK = STATUS_CHECK = STATUS_CHECK = STATUS_CHECK = STATUS_CHECK = STATUS_CHECK  |');
      logger.log(' ============================================================================================');
    });

    // status check path
    me.get(pathConf, async function (req, res) {
      const viewData = {
        secondsBeforeAutoRefresh: `${statusCheckService.checkInterval}`,
        siteTitle,
        statusInfo: statusCheckService.getStatusStats()
      };
      const templatePath = path.normalize(path.join(__dirname, `../../../src/views/status.html`));
      const { viewTemplate } = await templateHydratorService.loadViewTemplate(templatePath);
      const body = templateHydratorService.hydrateView({ viewTemplate, viewData });
      res.send(body);
    });

    // serve static files
    const normalizedPublicDirPath = path.normalize(path.join(__dirname, `../../../public`));
    me.use(express.static(normalizedPublicDirPath) as any);

    return me;
  },

  locateDeps: {
    logger: 'logger',
    appConfig: 'appConfig',
    templateHydratorService: 'templateHydratorService',
    statusCheckService: 'statusCheckService',
  },
};

export default loadDictElement;