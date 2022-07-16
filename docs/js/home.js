import Page from "./page.js";

export default class Home extends Page {
  constructor(routes) {
    super('home', routes);
    let that = this;
    routes.push({ url: '/home', setup: homePage });
    function homePage() {
      const template = document.createElement('template');
      template.innerHTML = `<div>Home</div>`;
      that.setup('home', template.content);
    }
  }
}
