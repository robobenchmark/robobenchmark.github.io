export default class About {
  constructor(routes, project) {
    routes.push({ url: '/about', setup: aboutPage });

    function aboutPage() {
      const template = document.createElement('template');
      template.innerHTML =
        `<section class="section">
          <div class="container content">
            About
          </div>
        </section>`
      project.setup('about', [], template.content);
    }
  }
}
