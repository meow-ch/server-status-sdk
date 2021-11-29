import fs from 'fs';

export default class TemplateHydratorService { //implements TemplateHydratorServiceConstructor {

  private mostachito: MostachitoInterface;

  constructor({ mostachito }: { mostachito: MostachitoInterface; }) {
    this.mostachito = mostachito;
    this.hydrateView = this.hydrateView.bind(this);
  }

  loadViewTemplate(viewData: ViewData, filepath: string): Promise<LoadViewTemplateResolveParam> {
    return new Promise<LoadViewTemplateResolveParam>(function(resolve, reject) {
      fs.readFile(filepath, 'utf-8', function(err, viewTemplate) {
        if (err) return reject(err);
        resolve({ viewTemplate, viewData });
      });
    });
  }

  hydrateView({ viewTemplate, viewData }: LoadViewTemplateResolveParam): string {
    return this.mostachito.hydrate(viewTemplate, viewData);
  }
}