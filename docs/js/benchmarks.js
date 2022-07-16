import Page from "./page.js";

export default class Benchmarks extends Page {
  constructor(routes) {
    super('benchmarks', routes);
    let that = this;
    routes.push({ url: '/benchmarks', setup: benchmarksPage });
    function benchmarksPage() {
      const template = document.createElement('template');
      template.innerHTML = `<div>Benchmarks</div>`;
      that.setup('benchmarks', template.content);
    }
  }
}
