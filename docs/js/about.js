import Page from "./page.js";

export default class About extends Page {
  constructor(routes) {
    super('about', routes);
    let that = this;
    routes.push({ url: '/about', setup: aboutPage });
    function aboutPage() {
      const template = document.createElement('template');
      template.innerHTML = `<div>About</div>`;
      that.setup('about', template.content);
    }
  }
}