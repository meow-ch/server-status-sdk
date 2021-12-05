import { expect } from 'chai';
import path from 'path';
import Mostachito from 'mostachito';
import TemplateHydratorService from '../../src/services/TemplateHydratorService';
import { mockViewDataWithEmptyErros, hydrationOutputGen } from '../expectedHydrationOutput';

const templatePath = path.normalize(path.join(__dirname, `../../../src/views/status.html`));
const te = new Mostachito();
const hydrator = new TemplateHydratorService({ mostachito: te });

describe(`loadViewTemplate(templatePath)`, function() {
  it('should have a "viewTemplate" property', async function () {
    const loadRes = await hydrator.loadViewTemplate(templatePath);
    expect(loadRes).to.haveOwnProperty('viewTemplate');
  });
  it('should have a "viewTemplate" string prop', async function () {
    const loadRes = await hydrator.loadViewTemplate(templatePath);
    expect(loadRes.viewTemplate).to.be.a('string');
  });
  it('should have a non empty "viewTemplate" string prop', async function () {
    const loadRes = await hydrator.loadViewTemplate(templatePath);
    expect(loadRes.viewTemplate.length).to.be.gt(0);
  });
});

describe(`hydrateView({ viewTemplate, viewData })`, function() {
  it('should have a "viewTemplate" property', async function () {
    const viewTemplate = await hydrator.loadViewTemplate(templatePath);
    const hydrationData = {
      ...viewTemplate,
      viewData: mockViewDataWithEmptyErros,
    }
    expect(hydrator.hydrateView(hydrationData)).to.be.equal(hydrationOutputGen(mockViewDataWithEmptyErros));
  });
});