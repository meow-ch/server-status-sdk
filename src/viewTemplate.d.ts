declare module 'mostachito';

interface HtmlTemplateConfInterface {
  viewsPath: string;
  viewData: { [k: string]: string; }
  missingRefValueReplacement: (ref: string) => string;
}

interface HydrateViewPropsInterface { viewTemplate: string; viewData: ViewData; }

interface HtmlTemplateInterface {
  loadViewTemplate(viewData: ViewData, filepath: string): Promise<unknown>;
  hydrateView: HydrateViewCallback;
}

type HydrateViewCallback = (props: HydrateViewPropsInterface) => string;

interface HtmlTemplateConstructor {
  new (config: HtmlTemplateConfInterface): HtmlTemplateInterface;
}

interface ViewData {
  [k: string]: string | ViewData | ViewData[];
}
interface HydrateViewProps { viewTemplate: string; viewData: ViewData; }
type LoadViewTemplateResolveParam = { viewTemplate: string; viewData: ViewData; };
type HydrateViewMethod = (param: LoadViewTemplateResolveParam) => string;
type MostachitoHydrateMethod = (viewTemplate: string, viewData: ViewData) => string;
interface MostachitoInterface {
  hydrate: MostachitoHydrateMethod;
}
interface TemplateHydratorServiceConstructor {
  new ({ mostachito }: { mostachito: MostachitoInterface; }): TemplateHydratorServiceInterface;
}
interface TemplateHydratorServiceInterface {
  loadViewTemplate: (viewData: ViewData, filePath: string) => Promise<LoadViewTemplateResolveParam>;
  hydrateView: HydrateViewMethod;
}